---
title: "Entire Caching Strategy will be replaced by this .NET 9 Feature"
excerpt: "Hybrid cache in production"
publishedDate: "2025-09-06"
category: ".NET"
readTime: "3"
image: "https://cdn-images-1.medium.com/max/1200/0*-r1sGMIsMhDJnHRW"
---

### Hybrid cache in production

You knew that I worked with the Portfolio investment project, right? So, every time a user opens their dashboard, our app hits the database to fetch stock prices, calculate portfolio values, and display transaction history.

With 10,000 users checking their portfolios multiple times a day, your database is in cry-mode like babies, and your cloud bill LOL...

And that’s why we do **Caching! **And I know everybody uses that in a project. uhmm… We keep frequently used files on our desk instead of walking to the filing cabinet every time!? *right*

*We kept that after a req and all other 99 reqs. will hit the Cache, not the database*

But there is a glitch! Traditional caching meant workaround with Redis servers, managing complex configurations, and writing a lot of code lines just to store and retrieve data. But thats where the .NET 9 comes into the act..

## Performance Score

We were working on something that need us to recheck our Cache implementation and that time we found something, something very interesting and we ended up with our API performance by **18x times** — from 1,370 requests per second to 25,798 RPS.

> Same code, same server, just one change.

The change was switching to the **.Net9’s **new caching approach LOL,

## Meet HybridCache

idk but Microsoft introduce this quitly… something called **HybridCache** that makes Redis setup look like using a flip phone in 2024.

This is how traditional Cache works basically —

- Set up a Redis server
- Write 20+ lines of configuration
- Handle serialization/deserialization
- Manage cache invalidation
- Debug connection issues (on loop)

And **HybridCache **is like this — *Literally one line*

```csharp
var portfolioValue = await _cache.GetOrCreateAsync($"portfolio_{userId}", GetPortfolioValue);
```

That’s it!

## How This Actually Works :)

Think of **HybridCache **as having two layers of memory —

- **Fast memory** (in your app) — like your desk drawer
- **Shared memory** (across servers) — like a shared filing cabinet

When your user opens their portfolio:

- **First check:** Is it in the desk drawer? Grab it instantly, ZAP! (0.001ms)
- **Second check**: Is it in the shared cabinet? Get it quickly.. (5ms)
- **Last resort**: Calculate from database (200ms)

> But why it’s one liner — because it handles everything automatically.. c’mon it’s **2025!**

*now, ****last but not least***

## What This Means for You?

I would say in my application it is, **Perfect for:**

- User dashboards and profiles
- Stock prices and market data
- Portfolio calculations
- API responses that change hourly/daily
- Financial reports and analytics

And, **Not ideal for:**

- Real-time trading data (changes every second)
- Live chat messages
- Payment processing (never cache sensitive operations)
- Data that must be 100% fresh always

and this is a one-liner for you —

> *“If your users won’t mind seeing 5-minute-old data, cache it. If they’re making million-dollar trades, don’t cache it”*

Here’s how to add this —

### Program.cs

```scss
builder.Services.AddHybridCache();
```

**Controller**

```csharp
public class PortfolioController : ControllerBase
{
    private readonly HybridCache _cache;
    
    public PortfolioController(HybridCache cache)
    {
        _cache = cache;
    }
    
    [HttpGet]
    public async Task
 GetPortfolio(int userId)
    {
        return await _cache.GetOrCreateAsync(
            $"portfolio_{userId}",
            async _ => await CalculatePortfolioValue(userId),
            TimeSpan.FromMinutes(10)
        );
    }
}
```
*That’s literally it…*🖤
