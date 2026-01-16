---
title: "From 8 Second to 200ms API Responses: Rearchitecting Our .NET Caching Layer"
excerpt: "When our team noticed API response times climbing from milliseconds to seconds, we knew we had a problem. What we didn’t expect was how our…"
publishedDate: "2025-02-21"
category: ".NET"
readTime: "7"
image: "https://cdn-images-1.medium.com/max/800/1*Tx3DwtO5xZXJC2mXvT6oqg.jpeg"
---

When our team noticed API response times climbing from milliseconds to seconds, we knew we had a problem. What we didn’t expect was how our caching strategy — meant to improve performance — was actually the real issue. lets you and me discover, debugg, and ultimately solving complex caching issues in our .NET microservices architecture.

## 🔹The Initial Architecture

Our system processed financial transactions for a global payment platform [***as I mentioned in previous article too***…], handling roughly 50,000 requests per minute during peak hours.

The architecture consisted of:

▪️6 microservices handling different aspects of payment processing
▪️A mix of Redis and in-memory caching
▪️Postgres as the primary database
▪️Azure Service Bus for inter-service communication

The caching layer was originally designed to reduce database load and improve response times. Each service maintained its own cache, with a combination of:

```csharp
// Initial caching implementation
public class CacheService
{
   private readonly IDistributedCache _distributedCache;
   private readonly IMemoryCache _memoryCache;
   
   public async Task GetOrSetAsync(string key, Func> factory, TimeSpan? expiration = null)
   {
     // First check memory cache
     if (_memoryCache.TryGetValue(key, out T value))
     return value;
    
     // Then check distributed cache
     var cached = await _distributedCache.GetAsync(key);
     
     if (cached != null)
     {
       value = JsonSerializer.Deserialize(cached);

       // Set in memory cache
       _memoryCache.Set(key, value, expiration ?? TimeSpan.FromMinutes(5));
       return value;
      }

    // If not found, generate value
     value = await factory();
     
     // Store in both caches
     await _distributedCache.SetAsync(
       key, 
       JsonSerializer.SerializeToUtf8Bytes(value),
       new DistributedCacheEntryOptions 
       { 
         AbsoluteExpirationRelativeToNow = expiration 
       }
     );
     
     _memoryCache.Set(key, value, expiration ?? TimeSpan.FromMinutes(5));
     
     return value;
 }
}
```

## ◾Issues Around….

### 1. Cache Stampede

Our first major issue emerged during peak hours. When a cached item expired, multiple concurrent requests would trigger the same expensive database query. This “*cache stampede*” effect cascaded across services:

```typescript
public async Task
 GetPaymentDetails(string paymentId)
{
   return await _cacheService.GetOrSetAsync(
           $"payment:{paymentId}",
           async () => await _dbContext.Payments
                             .Include(p => p.Customer)
                             .Include(p => p.TransactionHistory)
                             .FirstOrDefaultAsync(p => p.Id == paymentId),
           TimeSpan.FromMinutes(15));
}
```
When this cache entry expired, hundreds of concurrent requests would hit the database simultaneously, causing CPU spikes and increased response times.

### 2. Memory Leaks

Our memory usage showed a concerning pattern → it kept growing over time, even with cache expiration configured. The Real Villain? We were storing large objects in memory without proper size limitations:

```csharp
// Memory leak in original implementation
public class PaymentDetails
{
   public string Id { get; set; }
   public Customer Customer { get; set; }
   public List TransactionHistory { get; set; } // Unbounded list
   public byte[] Receipt { get; set; } // Large binary data
}
```

### 3. Inconsistent Cache Invalidation

With multiple services managing their own caches, we faced data consistency issues. When a payment was updated in one service, related caches in other services weren’t always invalidated properly:

```csharp
// Inconsistent cache invalidation
public async Task UpdatePayment(Payment payment)
{
   await _dbContext.Payments.UpdateAsync(payment);
   await _cacheService.RemoveAsync($"payment:{payment.Id}");
   // Other services' caches still had old data
}
```

## ◾ We Solved using Multi-Layered Caching Strategy

### 1. Sliding Window Cache Lock

To prevent cache stampede, we implemented a sliding window lock pattern:

```csharp
public class SlidingWindowCache
{
   private readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);
   private readonly IDistributedCache _cache;
   private const int StaleBufferSeconds = 30;

   public async Task GetOrSetAsync(string key, Func> factory, TimeSpan expiration)
   {
     var value = await TryGetValue(key);
     if (value != null) return value;
     
      try
     {
       await _lock.WaitAsync();
 
       // Double-check after acquiring lock
       value = await TryGetValue(key);

       if (value != null) return value;

        // Generate new value
        value = await factory();

        // Store with stale buffer
         await _cache.SetAsync(
             key,
             JsonSerializer.SerializeToUtf8Bytes(new CacheEntry
             {
               Value = value,
               ExpiresAt = DateTime.UtcNow.Add(expiration),
               IsStale = false
             }),
             new DistributedCacheEntryOptions
             {
               AbsoluteExpirationRelativeToNow = expiration.Add(TimeSpan.FromSeconds(StaleBufferSeconds))
             });

        return value;
     }
     finally
     {
       _lock.Release();
     }
 }
```

```csharp
private class CacheEntry
{
   public TValue Value { get; set; }
   public DateTime ExpiresAt { get; set; }
   public bool IsStale { get; set; }
}

```

### 2. Memory Management

We implemented a size-aware cache with proper eviction policies:

```csharp
public class SizeAwareCache
{
   private readonly MemoryCache _cache;
   private long _currentSize;
   private readonly long _sizeLimit;

   public SizeAwareCache(long sizeLimit)
   {
     _sizeLimit = sizeLimit;
     _cache = new MemoryCache(new MemoryCacheOptions
     {
     SizeLimit = sizeLimit,
     ExpirationScanFrequency = TimeSpan.FromMinutes(5)
     });
    }

    public void Set(string key, T value, TimeSpan expiration)
   {
     var size = CalculateSize(value);
     var entryOptions = new MemoryCacheEntryOptions
     {
     Size = size,
     AbsoluteExpirationRelativeToNow = expiration,
     Priority = CacheItemPriority.Normal
     };
    _cache.Set(key, value, entryOptions);
   }

  private long CalculateSize(T value)
  {
   // Implement size calculation based on object type
   // For strings: return UTF8 bytes
   // For objects: use serialization size
   // Add overhead for cache entry metadata
   }
}
```

### 3. Distributed Cache Invalidation

We implemented a pub/sub system using Azure Service Bus for coordinated cache invalidation:

```csharp
public class DistributedCacheInvalidator
{
   private readonly IServiceBusClient _serviceBus;
   private readonly IDistributedCache _cache;
   private readonly string _topicName = "cache-invalidation";

  public async Task InvalidateAsync(string key, string reason)
  {
     var message = new InvalidationMessage
     {
       Key = key,
       Timestamp = DateTime.UtcNow,
       Reason = reason
      };
      
      await _serviceBus.SendMessageAsync(_topicName, message);
   }

  public async Task HandleInvalidationMessage(InvalidationMessage message)
  {
     await _cache.RemoveAsync(message.Key);
     // Log invalidation with reason and timestamp
   }
}
```

## ◾Production Monitoring Patterns

### 1. Cache Hit Rate Monitoring

We implemented detailed metrics collection:

```csharp
public class CacheMetrics
{
   private readonly IMetricClient _metrics;
    
   public async Task TrackCacheOperation(string cacheType, string operation, string key, long duration)
   {
     _metrics.TrackMetric(new MetricTelemetry
     {
       Name = $"Cache.{cacheType}.{operation}",
       Value = duration,
       Properties = new Dictionary
                   {
                     ["Key"] = key,
                     ["Success"] = "true"
                    }
       });
     }
}
```

### 2. Cache Size Monitoring

We added memory monitoring with alerts:

```csharp
public class CacheHealthCheck : IHealthCheck
{
   private readonly SizeAwareCache _cache;
   private readonly ILogger _logger;

   public async Task CheckHealthAsync(HealthCheckContext context)
   {
     var metrics = _cache.GetMetrics();
 
     if (metrics.CurrentSize > metrics.SizeLimit * 0.9)
     {
         _logger.LogWarning("Cache size approaching limit: {CurrentSize}/{SizeLimit}", 
         metrics.CurrentSize, metrics.SizeLimit);
 
         return HealthCheckResult.Degraded();
       }

      return HealthCheckResult.Healthy();
     }
}
```

### 🔹This is What we learned

After implementing these changes, we saw dramatic improvements:

1. Response times dropped from 8 seconds to **200ms** (95th percentile)
2. CPU usage decreased by **60%**
3. Memory usage stabilized and became predictable
4. Cache hit rates improved from **65% to 92%**

## Best Practices

**1. Cache Entry Sizing**
 — Always implement size limits for in-memory caches
 — Use compression for large objects
 — Monitor memory usage patterns

**2. Expiration Strategies**
 — Use sliding expiration for frequently accessed items
 — Implement stale-while-revalidate pattern
 — Consider business requirements when setting TTL

3. **Invalidation Patterns**
 — Use pub/sub for distributed invalidation
 — Implement versioning for cache keys
 — Log all cache invalidations with reasons

**4. Monitoring**
 — Track cache hit/miss rates
 — Monitor memory usage and eviction rates
 — Set up alerts for abnormal patterns

**5. Error Handling**
 — Implement circuit breakers for cache operations
 — Have fallback strategies for cache failures
 — Log all cache-related errors with context

## **⚡When to Use Different Caching Strategies**

### In-Memory Cache

- Best for: Frequently accessed, small data sets
- **Pros**: Fastest access times, no network latency
- **Cons**: Limited by available memory, not shared across instances
- **Use when**: Data can be eventually consistent and memory is available

### Distributed Cache (Redis)

- **Best for**: Larger datasets, shared across services
- **Pros**: Consistent across instances, larger capacity
- **Cons**: Network latency, additional infrastructure needed
- **Use when**: Data must be consistent across services

**Hybrid Approach**
- **Best for**: Complex systems with varying requirements
- **Pros**: Combines benefits of both approaches
- **Cons**: More complex to implement and maintain
- **Use when**: Performance requirements justify the complexity

## Conclusion

Caching is a powerful tool for improving application performance, but it requires careful consideration of implementation details, monitoring, and maintenance. Our journey from slow response times to a highly performant system taught us valuable lessons about the importance of:

- Understanding the full impact of caching decisions
- Implementing proper monitoring from day one
- Having clear invalidation strategies
- Managing memory carefully
- Testing cache behavior under load

Remember that caching is not a “***set it and forget it***” solution. It requires ongoing monitoring, maintenance, and occasional rearchitecting as your system grows and requirements change.

---

**About the Author**

> Vritra here….

**Keywords**
*.NET, Caching, Redis, Performance Optimization, Distributed Systems, Microservices, Memory Management, Production Monitoring, Azure, Service Bus*

---

*If you found this article helpful, follow me for more in-depth technical content about .NET, distributed systems, and performance optimization.*
