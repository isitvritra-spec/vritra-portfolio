---
title: "Enhance Cache Mechanism | Slash API Latency 40% — Here’s How"
excerpt: "Everything you should know about hybrid cache"
publishedDate: "2025-03-10"
category: ".NET"
readTime: "7"
image: "https://cdn-images-1.medium.com/max/800/1*53XWizhpLFRfTzyksIwcrA.png"
---

### Everything you should know about hybrid cache

Question, Ever wondered why your API feels sluggish despite all the optimizations you’ve thrown at it? I did too. My .NET 9 API was stuck at **500ms **latency — decent, but not great. Then .NET 10 Preview-1 dropped this month (*March 3, 2025*), and its hybrid caching feature caught my eye. I tested it, tweaked it, and bam — **latency fell to 300ms**, a 40% cut. No half-baked fixes or hype; just a solid tool I’ll unpack for you here.

This isn’t a teaser — it’s the full deal. We’ll start with what hybrid caching is, walk through a real setup step-by-step, dig into how it works under the hood, weigh the pros and cons, and nail down best practices.

By the end, you’ll know if it’s worth your time and how to make your project smooth like butter…. Let’s get to it…..

## Act 1: Understanding Hybrid Caching in .NET 10

So, what’s this hybrid caching thing? Microsoft calls it a “*unified caching solution*” in .NET 10 Preview-1.

**Picture this:** your app has two caching layers — fast in-memory (RAM) and durable distributed (like Redis) — working together seamlessly. If data’s in RAM, you grab it in microseconds. If not, it checks the distributed store (milliseconds) before hitting the database (hundreds of milliseconds).

+1 thing is … You don’t juggle these layers yourself — ***.NET 10’s IHybridCache does it.***

### Why build this?

APIs today need speed *and* scale. In-memory caches (e.g., IMemoryCache) are lightning-fast but limited by server RAM. Distributed caches (e.g., Redis) scale across servers but add network lag. Hybrid caching blends both, aiming for the best of both worlds.

**Microsoft’s pitch:** “Optimized for modern, high-throughput APIs.” But does it deliver? I had to find out.

Under the hood, it’s built on **Microsoft.Extensions.Caching.Hybrid**. You set expiration policies for each layer, and it handles fallbacks. It’s not just a wrapper — it’s smart about eviction, serialization, and concurrency. I’ll show you how it played out in my test.

---

## Act 2: A Practical Example — From 500ms to 300ms

Let’s get hands-on. I had a .NET 9 API serving real-time stock prices for a finance app — think ticker lookups, 10K requests/hour, latency at 500ms. 
Issue ? Database calls to fetch live prices. I upgraded to .NET 10, added hybrid caching, and retested. See...

### Step 1: Setup

First, grab .NET 10 Preview 1 and install the package:

```csharp
dotnet add package Microsoft.Extensions.Caching.Hybrid
```

I used Redis as my distributed layer (running locally at localhost:6379 — use Azure/AWS in prod). Add it:

```csharp
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis --version 10.0.0-preview1
```

### Step 2: Configure It

In Program.cs, wire up hybrid caching with dual expirations:

```csharp
builder.Services.AddHybridCache(options =>  
{  
    options.DefaultExpiration = TimeSpan.FromMinutes(5); // In-memory timeout  
    options.DistributedCacheExpiration = TimeSpan.FromHours(1); // Redis timeout  
    options.MaximumPayloadBytes = 1024 * 1024; // 1MB cap per item  
});  

builder.Services.AddStackExchangeRedisCache(options =>  
{  
    options.Configuration = "localhost:6379";  
    options.InstanceName = "StockCache_";  
});
```

**DefaultExpiration** controls RAM; **DistributedCacheExpiration** handles Redis. I capped payload at 1MB to avoid memory bloat.

### Step 3: Code the API

Here’s my controller:

```csharp
[ApiController]  
[Route("api/[controller]")]  
public class StocksController : ControllerBase  
{  
    private readonly IHybridCache _cache;  
    private readonly StockDbContext _db;  
    private readonly ILogger _logger;  

    public StocksController(IHybridCache cache, StockDbContext db, ILogger logger)  
    {  
        _cache = cache;  
        _db = db;  
        _logger = logger;  
    }  

    [HttpGet("{ticker}")]  
    public async Task GetStockPrice(string ticker)  
    {  
        string cacheKey = $"stock_{ticker}";  
        try  
        {  
            var stock = await _cache.GetOrCreateAsync(  
                cacheKey,  
                async (ct) =>  
                {  
                    _logger.LogInformation("Cache miss for {Key}", cacheKey);  
                    return await _db.Stocks.AsNoTracking().FirstOrDefaultAsync(s => s.Ticker == ticker);  
                },  
                new HybridCacheEntryOptions  
                {  
                    LocalCacheExpiration = TimeSpan.FromSeconds(30), // Override per call if needed  
                });  
            if (stock == null) return NotFound();  
            return Ok(stock);  
        }  
        catch (Exception ex)  
        {  
            _logger.LogError(ex, "Cache failed for {Key}", cacheKey);  
            throw;  
        }  
    }  
}
```

**GetOrCreateAsync** checks

RAM → then Redis → then the DB. caching the result automatically.

I added logging to track misses. The ticker here is something like “AAPL” or “MSFT” — standard stock symbols.

### Step 4: Test It

I fired up a load test (1,000 requests via JMeter):

- **Before:** 500ms average (DB hits every time).
- **After:** 300ms average.

**Breakdown:**

- First request: 500ms (DB).
- RAM hits: 50ms.
- Redis hits: 150ms (after RAM eviction).

***Cache hit rate was 85% after warmup. ***That’s a 40% latency drop, no tricks — just hybrid caching doing its job.

> For my case, where traders need prices *now*, this is gold.

### How It Works

The flow:

- Request comes in (e.g., /api/stocks/AAPL).
- **IHybridCache** checks RAM — found? Return it.
- If not, it pings Redis — found? Cache to RAM, return it.
- If neither, it runs the DB query, caches to both layers, and returns.

Under stress, it handles concurrency with built-in locking. I peeked at the source (GitHub: dotnet/runtime) — it uses **AsyncLazy** for thread safety. Neat aha!

---

## Act 3: Pros, Cons, and Best Practices

Now, lets see— everything you need to decide if this fits your case.

### Pros

- **Performance Boost:** My 40% latency cut came from layering speed (RAM) with scale (Redis). Your mileage may vary, but it’s real.
- **Zero Code Overhead:** No manual fallback logic — I wrote one method, and it worked!!
- **Flexibility:** Per-call options (e.g., LocalCacheExpiration) let you tweak on the fly.
- **Scalability:** Redis scales horizontally; RAM keeps single-server apps snappy.

### Cons

- **Preview Stability:** It’s .NET 10 Preview 1. I hit a Redis timeout bug — app crashed until I added a retry policy:

```csharp
builder.Services.AddStackExchangeRedisCache(options =>  
{  
    options.ConfigurationOptions = new ConfigurationOptions  
    {  
        EndPoints = { "localhost:6379" },  
        AbortOnConnectFail = false,  
        ConnectRetry = 3  
    };  
});
```

- **Infra Cost:** Redis isn’t free — $5/month locally, $50+ in the cloud. Worth it? Depends on your load.
- **Complexity:** Two caches mean two points of failure. Monitor both or risk stale data.
- **Learning Curve:** It’s simple to start, but mastering expiration tuning took me a day of trial and error.

### Best Practices

- **Set Smart Expirations:** Short RAM timeouts (30s-5m) for hot data; longer Redis ones (1h-24h) for durability. Test with your app’s patterns.
- **Log Everything:** Track hits/misses with ILogger. I caught a key collision bug early this way.
- **Size Your Payloads:** Keep items under 1MB — big blobs kill RAM efficiency. Use MaximumPayloadBytes.
- **Handle Failures:** Wrap cache calls in try-catch — Redis outages shouldn’t crash your app.
- **Warm It Up:** Preload common keys on startup:

```dart
await _cache.GetOrCreateAsync("stock_AAPL", async ct => await _db.Stocks.FindAsync("AAPL"));
```

6.** Test in Staging:** Preview features break. I lost an hour to a serialization glitch — test first.

---

### Wrap-Up

Hybrid caching in .NET 10 isn’t a silver bullet, but it’s a damn good tool. My stock price API went from 500ms to 300ms with minimal effort, and I’m sold — for now. It’s got quirks (hello, preview bugs), but the payoff’s worth it for performance nerds like me. If you’re on .NET 10 or eyeing it, give this a spin. Tweak it, break it, make it yours. You’ll know exactly what you’re getting into after this.

**Got questions? **Drop them below. Next up, I might tackle .NET 10’s C# field keywords — ping me if you want that sooner! 😶‍🌫️

---

*Hey, if this saved you a headache — or just sparked an idea — consider buying me a coffee. I’m fueled by caffeine and code, and trust me, I can’t keep digging into .NET 10 without that next cup. Every sip helps me crank out more for you — thanks for keeping me going!* **[**[**Click here**](https://buymeacoffee.com/isitvritra)**]**

> #dotnet #performance #net10 #apicaching #hybridcache
