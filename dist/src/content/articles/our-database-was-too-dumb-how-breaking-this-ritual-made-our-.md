---
title: "Our Database Was Too ‘Dumb’: How Breaking This Ritual Made Our Payment API 3x Faster"
excerpt: "Moving Business Logic to SQL Improved Our API Response Time by 300%"
publishedDate: "2025-02-10"
category: ".NET"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/800/1*4kMAMBCbK2FnRCxL1yX63w.jpeg"
---

### Moving Business Logic to SQL Improved Our API Response Time by 300%

**See**: Your payment processing platform is handling end-of-month payroll transfers for multinational companies. Thousands of international transfers are being processed, employees are waiting for their salaries, and your API response times are creeping up. *This was us last year…. *watching our carefully created N**-Tier** architecture struggle under load. Reason? A seemingly innocent decision we’d made years ago:

*` keeping all business logic in our application layer `*

For years, we’ve been told to keep our databases dumb. **“The database is just for storing data,”** they said. But at scale, this conventional wisdom was costing us precious milliseconds we couldn’t afford. This isn’t just another performance optimization thing actually — it’s about challenging established practices when reality demands it (Think!)

## Our Payment Processing Challenge

What we were facing in our payment platform is that every international transfer needs to calculate its final amount, accounting for exchange rates, transfer fees, intermediary bank charges, and compliance requirements.

### **◾Initial Handling**

```csharp
public class TransferService
{
    private readonly ITransferRepository _transferRepository;
    private readonly IExchangeRateService _exchangeRateService;
    private readonly IFeesCalculator _feesCalculator;
    private readonly IComplianceService _complianceService;
    
    public async Task CalculateTransferAmount(int transferId)
    {
        // Multiple database calls
        var transfer = await _transferRepository.GetTransfer(transferId);
        var exchangeRates = await _exchangeRateService.GetLatestRates(transfer.FromCurrency, transfer.ToCurrency);
        var fees = await _feesCalculator.GetApplicableFees(transfer.FromCountry, transfer.ToCountry);
        var complianceLevel = await _complianceService.GetRequirements(transferId);
        
        // Business logic in application
        decimal finalAmount = transfer.Amount;
        finalAmount = ApplyExchangeRate(finalAmount, exchangeRates);
        finalAmount = ApplyFees(finalAmount, fees, complianceLevel);
        
        return finalAmount;
    }
}
```

**YES**, This code looks clean, follows SOLID principles, and should work perfectly. But UNDER LOAD, it revealed several problems. Each transfer calculation required at least four database round trips, and during peak times, our application servers were drowning in memory allocations from processing large result sets of exchange rates and compliance rules

**BUT, **During month-end payroll processing, our monitoring alerts started firing. Response times jumped from ***100ms*** to over ***500ms***. CPU usage spiked across our application servers, but surprisingly, our database servers were relatively idle.

This disparity led us to our first realization:

` *we were making our application servers do work that our database could handle more efficiently* `

---

### ✨Rethinking our Approach

Consider what happens when calculating a transfer amount:

- We fetch transfer details (network round trip)
- We fetch current exchange rates (another round trip)
- We fetch applicable fees (yet another round trip)
- We check compliance requirements (fourth round trip)
- We process everything in memory
- Finally, we return the result

Each step adds latency, consumes memory and uses CPU cycles. But what if we could do all this in one go?

```sql
CREATE PROCEDURE CalculateTransferAmount
    @TransferId INT
AS
BEGIN
    WITH TransferCalculation AS (
        SELECT 
            t.Amount,
            er.Rate as ExchangeRate,
            ISNULL(f.BaseFee, 0) as BaseFee,
            ISNULL(f.PercentageFee, 0) as PercentageFee,
            c.RiskLevel as ComplianceLevel
        FROM Transfers t
        JOIN ExchangeRates er ON er.FromCurrency = t.FromCurrency 
            AND er.ToCurrency = t.ToCurrency
        JOIN Fees f ON f.FromCountry = t.FromCountry 
            AND f.ToCountry = t.ToCountry
        JOIN ComplianceChecks c ON c.TransferId = t.TransferId
        WHERE t.TransferId = @TransferId
    )
    SELECT 
        (Amount * ExchangeRate) - 
        (BaseFee + (Amount * (PercentageFee / 100))) -
        (CASE 
            WHEN ComplianceLevel = 'High' THEN Amount * 0.001 -- Additional compliance fee
            ELSE 0 
        END)
    FROM TransferCalculation;
END
```

This change had immediate effects:

- Response time dropped from 500ms →**150ms**
- Memory allocations decreased by → **70%**
- CPU usage on application servers normalized
- Network traffic was reduced significantly

---

## ⚡NERD’s CORNER

*actual benchmarks from our production environment*

```csharp
[MemoryDiagnoser]
public class OrderProcessingBenchmarks
{
    [Benchmark(Baseline = true)]
    public async Task OriginalApproach()
    {
        // Previous implementation with multiple calls
    }
    
    [Benchmark]
    public async Task SqlBasedApproach()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.ExecuteScalarAsync(
            "EXEC CalculateOrderTotal @OrderId", 
            new { OrderId = 1 }
        );
    }
}
```

> But numbers only tell part of the story. Our customer satisfaction scores improved because payments processed faster. Our infrastructure costs decreased because we needed fewer application servers. Most importantly, our development team could focus on building features instead of performance fires.

---

## 🔸When to Make This Move

***Moving business logic to SQL isn’t always the right choice***… Through our experience, we’ve developed a simple framework for making this decision:

### Consider SQL-based business logic when…

🔸Operations involve multiple related data sets

🔸Calculations need to process large amounts of data

🔸Network round trips are becoming an issue

🔸**The logic is relatively stable and well-defined…**

### Keep logic in the application when…

🔸It involves external service calls

🔸Rules change frequently

🔸You need complex error-handling

🔸The operation involves file system or network operations

## 🐦‍⬛Implementation Strategy

If you’re convinced this approach might help your system, here’s how we recommend proceeding:

▪️Start with a Pilot Choose ` *non-critical but frequently used operation*` We started with payment total calculations because they were frequent enough to matter but not so critical that a problem would bring down our system.

▪️Measure Everything Before making any changes, establish your baseline metrics. We tracked:

- Response times (average and 95th percentile)
- Memory usage
- CPU utilization
- Network I/O
- Database load

▪️Implement Gradually We used feature flags to route a small percentage of traffic through the new implementation while maintaining the old one as a fallback.

### **💌Good Code Runs on Coffee, and So Do I — Support Me!**

---

## **END NOTE**

Our case of moving selective business logic to SQL has transformed how we think about application architecture. It’s not like blind fold dates or rejecting best practices — it’s about understanding the trade-offs and making informed decisions based on requirements/character.

The “**database as a dumb data store**” principle isn’t wrong — it’s just incomplete. Modern databases are powerful tools capable of handling complex business logic efficiently. The trick is knowing when to leverage this power and when to stick with traditional application-layer logic.

> **Again**: Performance optimization isn’t about following trends or blindly applying patterns. It’s about understanding your specific challenges and being willing to challenge conventional wisdom when the situation demands it.

Have you faced similar challenges in your applications? How did you handle them? I’d love to hear your experiences in the comments below.
