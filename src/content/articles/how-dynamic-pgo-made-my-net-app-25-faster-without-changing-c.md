---
title: "How Dynamic PGO Made My .NET App 25% Faster Without Changing Code"
excerpt: "Your .NET App Has Been Learning Your Code Patterns"
publishedDate: "2025-08-14"
category: ".NET"
readTime: "5"
image: "https://cdn-images-1.medium.com/max/2560/1*5pxv9FcW7DtU3Nh_dLZ-Ow.png"
---

### Your .NET App Has Been Learning Your Code Patterns

I noticed something unusual happening to my fintech application.

> The same portfolio calculation that took 120ms was suddenly running in 95ms (I didn’t change anything).

> Same code, same server, same data. I hadn’t changed anything.

Then I got the fuckin reason → ***Dynamic Profile-Guided Optimization (PGO) in .NET 9***

Let me explain you in simple words —

*“Your .NET application has a silent observer watching every method call, every loop, every decision your code makes. After collecting enough data about how your code actually runs in production, it starts rewriting your compiled code behind the scenes to make it faster.”*

uhmm… let me make it simpler (*probably help someone*) —

*“Imagine you have a portfolio management system that calculates risk scores for 10,000 stocks every morning. Dynamic PGO notices that 80% of your stocks fall into the “low-risk” category, so it reorganizes your if-else conditions to check low-risk scenarios first. Your application gets faster without you writing a single line of code”*

**(Here is the Proof)**—
[**Performance Improvements in .NET 9 - .NET Blog**
*Take an in-depth tour through hundreds of performance improvements in .NET 9.*devblogs.microsoft.com](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-9/#pgo)[](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-9/#pgo)

---

## Why Your Application Suddenly Gets Faster Over Time?

> Dynamic PGO doesn’t just optimize once and forget. It keeps learning.

**In my fintech app**, I have a method that processes different types of financial instruments — stocks, bonds, options, futures. When the application first starts, .NET compiles this method in a generic way that works for all scenarios equally.

But Dynamic PGO is watching. It notices that **70% of my trades are stocks, 20% are bonds, and only 10% are complex derivatives**. After collecting this data, it recompiles the method to handle stocks super efficiently, making the common case lightning fast.

And you already know the result — My portfolio processing went from 2.3 seconds to 1.8 seconds for the same dataset.

> That’s a 22% improvement with zero code changes.

### So how did this thing happen?

- **Collection phase**: Y*our app runs normally while .NET gathers data*
- **Analysis phase**: .*NET identifies the hot paths and common patterns*
- **Optimization phase**: *Code gets recompiled based on actual usage patterns*

> *🖤*The beauty is it adapts to YOUR specific application patterns, not some generic optimization that works for everyone.

---

## 🔺Developers Don’t Know About Dynamic PGO

Dynamic PGO has been quietly working in .NET applications since .NET 6, but .NET 9 made it significantly more aggressive and effective and that’s why most developers are still not aware and not want to update to .NET9

> Most performance articles talk about optimizing your code. But Dynamic PGO flips this completely — it optimizes the compiled version of your code based on how it actually runs.

*let’s have an example —*

```csharp
public decimal CalculateRisk(Portfolio portfolio)
{
    if (portfolio.Type == PortfolioType.Conservative)
    {
        return CalculateConservativeRisk(portfolio);
    }
    else if (portfolio.Type == PortfolioType.Balanced)
    {
        return CalculateBalancedRisk(portfolio);
    }
    else if (portfolio.Type == PortfolioType.Aggressive)
    {
        return CalculateAggressiveRisk(portfolio);
    }
    
    return CalculateCustomRisk(portfolio);
}
```

My production data has 60% of portfolios are Conservative, 30% Balanced, 8% Aggressive, and only 2% Custom.

Dynamic PGO noticed this pattern and reordered the compiled assembly code to check Conservative first (which it already was), but it also inlined the `CalculateConservativeRisk` method directly into the main method for the most common case.

fascinating enough when code is remain the same piece —

> It did this without changing my source code. The optimization exists only in the compiled, running version.

---

## Your CALL — Benefiting From Dynamic PGO Today

If you’re running .NET 9, Dynamic PGO is already working for you. But there are ways to make it work even better —

### Step 1: Enable it explicitly (recommended)

```xml

    false
    false
    true
    true
    false

```

### Step 2: Give it real production patterns
Dynamic PGO needs actual usage data to work effectively. Running it on your development machine with test data won’t show the real benefits.

### Step 3: Be patient with cold starts

first few minutes of your application startup won’t see PGO benefits. It needs time to collect data before it can optimize.

For long-running applications (web APIs, background services), this is perfect. For short-lived console apps, the benefits are minimal.

---

## 🔺When Dynamic PGO Works Brilliantly

**Perfect scenarios for Dynamic PGO —**

- Web APIs with consistent traffic patterns
- Background services process similar data
- Applications with clear “hot paths” (like my portfolio calculations)
- Long-running applications that stay alive for hours or days

**Where it won’t help much —**

- Short-lived console applications
- Applications with completely random usage patterns
- Code that executes only once per application lifetime
- Already heavily optimized tight loops

*Clearly speaking —*

*the portfolio risk calculation sees huge benefits because it follows predictable patterns. But the daily report generation (which runs once per day with different logic each time) shows minimal improvement.*

---

## 💡End Note

PGO focuses on the methods that matter. Thank you 🖤

> *In future we will definately see smarter code that learns and adapts. Dynamic PGO is just the beginning of this journey.*
