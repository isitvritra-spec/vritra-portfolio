---
title: "Hybrid Cache in .NET 9: Another Performance 10xer"
excerpt: "Simplifying High-Performance Caching"
publishedDate: "2025-01-10"
category: ".NET"
readTime: "5"
image: "https://cdn-images-1.medium.com/max/800/1*Z05Lpbcc1DpbNcypVEcAfQ.png"
---

### **Simplifying High-Performance Caching | 1 Minute Read**

Caching has always been a cornerstone of building fast and scalable applications. With .NET 9, Microsoft introduces **Hybrid Cache**, a game-changing feature that seamlessly combines in-memory and distributed caching. This powerful abstraction simplifies multi-level caching, offering developers the speed of local memory with the reliability of distributed systems. In this article, we’ll break down Hybrid Cache in simple terms, discuss its advantages, and show how you can use it to supercharge your applications.

## What is a Hybrid Cache?

Think of Hybrid Cache as a **two-layer caching system**:

- **In-Memory Cache**: Fast, local storage for frequently accessed data.
- **Distributed Cache**: Shared storage across multiple servers for consistency and scalability.

.NET 9 introduces the `HybridCache` abstraction, with a default implementation called `DefaultHybridCache`. This abstraction lets developers integrate different caching layers without writing complex glue code.

### — Great Features

- **Multi-Level Caching**: Combines the speed of memory with the reliability of distributed storage.
- **Eviction by Tags**: Allows precise removal of cached items.
- **Serialization Options**: Supports custom serializers for cache keys and values.
- **Async-First**: Built for modern, asynchronous workflows.

---

## Why Use Hybrid Cache?

Here’s why Hybrid Cache can be a next thing for your application:

### — Performance Optimization

Avoid database roundtrips by caching hot data locally. For less-used items, fall back to the distributed cache.

### — Cost Efficiency

Save on cloud storage and compute costs by intelligently managing your caching layers.

### — Developer Productivity

With a unified API, you write less boilerplate code and focus on building features.

### — Flexibility

Supports granular caching strategies, like tiered eviction and customizable serializer.

---

## Real-World Use Cases

### E-Commerce Platforms

For online stores, quick access to data like product details and user sessions is critical. Hybrid Cache ensures fast responses for active sessions via in-memory caching while keeping distributed cache consistent across servers.

### Content Delivery Networks (CDNs)

Cache static assets locally for lightning-fast delivery and use distributed cache for dynamic, personalized content.

### Financial Applications

Speed and reliability are essential for fintech. Cache sensitive data like account balances with in-memory speed and distributed fault tolerance.

### Microservices Architectures

For microservices, Hybrid Cache enables local caching for service-specific data and shared caching for cross-service communication.

---

## Setting Up Hybrid Cache

### Prerequisites

- .NET 9 SDK installed.
- A project requiring caching (e.g., an ASP.NET Core app).
- Redis for distributed caching.

### Step 1: Install Required NuGet Packages

Run these commands to add caching dependencies:

```csharp
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
dotnet add package Microsoft.Extensions.Caching.Memory
```

### Step 2: Register Hybrid Cache in `Program.cs`

Here’s how to set up a Hybrid Cache in your project:

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Caching.Hybrid;

var builder = WebApplication.CreateBuilder(args);

// Add memory cache
builder.Services.AddMemoryCache();

// Add Redis distributed cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379"; // Replace with your Redis connection string
});

// Add Hybrid Cache
builder.Services.AddHybridCache(options =>
{
    options.DefaultCacheDuration = TimeSpan.FromMinutes(5); // Set default cache duration
});
```

### Step 3: Configure Hybrid Cache Options

Customize the caching behavior to suit your needs:

```javascript
builder.Services.Configure(options =>
{
    options.DefaultCacheDuration = TimeSpan.FromMinutes(10); // Custom cache duration
    options.Serializer = new JsonHybridCacheSerializer(); // JSON serialization
    options.EvictionPolicy = HybridCacheEvictionPolicy.FirstLevel | HybridCacheEvictionPolicy.SecondLevel;
});
```

---

## Using Hybrid Cache

Inject the `IHybridCache` service into your code to start caching data.

### Example: Storing and Retrieving Data

```csharp
using Microsoft.Extensions.Caching.Hybrid;

public class ProductService
{
    private readonly IHybridCache _hybridCache;

    public ProductService(IHybridCache hybridCache)
    {
        _hybridCache = hybridCache;
    }

    public async Task
 GetProductAsync(int productId)
    {
        // Cache key
        string cacheKey = $"Product_{productId}";

        // Try to get the product from cache
        var product = await _hybridCache.GetAsync(cacheKey);

        if (product == null)
        {
            // Simulate retrieving data from database
            product = new Product
            {
                Id = productId,
                Name = "Sample Product",
                Price = 99.99
            };

            // Store the product in cache
            await _hybridCache.SetAsync(cacheKey, product, TimeSpan.FromMinutes(5));
        }

        return product;
    }
}
```

---

## Pros and Cons of Hybrid Cache

### Pros

- **Speed**: Combines ultra-fast memory access with durable distributed caching.
- **Scalability**: Handles both local and distributed scenarios seamlessly.
- **Customization**: Offers flexible options for serializers, eviction policies, and cache durations.
- **Unified API**: Simplifies multi-level caching in complex applications.

### Cons

- **Complexity**: Requires careful configuration to balance in-memory and distributed layers.
- **Overhead**: Slightly higher overhead compared to single-layer caching.
- **Dependency on Distributed Cache**: Relies on tools like Redis, which need separate maintenance.

---

## Final Thoughts
Hybrid Cache in .NET 9 is a powerful tool for building performant and scalable applications. By bridging the gap between in-memory and distributed caching, it provides the speed and reliability required for modern scenarios. Whether you’re building an e-commerce site, a CDN, or a fintech app, Hybrid Cache equips you with the flexibility and power to optimize your application’s performance. Give it a try and unlock the full potential of .NET 9!

---

> **What do you think of Hybrid Cache? Have you tried it yet? Let us know in the comments!**

#HybridCache #DotNet9 #CachingSolutions #InMemoryCache #DistributedCache #HighPerformanceApps
