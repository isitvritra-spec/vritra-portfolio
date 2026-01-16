---
title: "How I Reduced My Blazor App’s Load Time by 80% with These Simple Tricks"
excerpt: "As a senior .NET developer, I’ve always been excited about Blazor’s potential to revolutionize web development. However, like many of you…"
publishedDate: "2024-08-01"
category: ".NET"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/800/1*b5D8glrb1JJFabnSa44oIg.jpeg"
---

As a senior .NET developer, I’ve always been excited about Blazor’s potential to revolutionize web development. However, like many of you, I’ve also grappled with its performance challenges, particularly when it comes to initial load times. In this article, I’ll share the journey of how I optimized a complex Blazor WebAssembly application, reducing its load time from a sluggish 10 seconds to a snappy 2 seconds. Let’s dive into the tricks that made this possible.

> TL;DR:

> By optimizing the WebAssembly payload, implementing efficient lazy loading, using virtualization, refining state management, and optimizing network requests, we reduced our Blazor app’s load time from 10 seconds to 2 seconds — an 80% improvement.

## The Initial Problem

Our application was a data-heavy dashboard for a financial services company. It included real-time data visualization, complex calculations, and a rich user interface. The initial load time was painfully slow:

- **First Contentful Paint (FCP): 3.5 seconds**
- **Time to Interactive (TTI): 10.2 seconds**
- **Total Blazor WebAssembly payload: 8.2 MB**

```sql
Initial Performance Metrics
|
|                                 ■ (10.2s)
|                                 |
|                                 |
|                     ■ (8.2MB)   |
|                     |           |
|         ■ (3.5s)    |           |
|         |           |           |
+---------+-----------+-----------+----------
        FCP         Payload      TTI
```

These metrics were unacceptable for our users who needed quick access to critical financial data. Here’s how we turned things around.

## Tricks:

- [Trick 1: Optimize Your Blazor WebAssembly Payload](#trick-1)
- [Trick 2: Implement Efficient Lazy Loading](#trick-2)
- [Trick 3: Optimize Rendering with Virtualization](#trick-3)
- [Trick 4: Implement Efficient State Management](#trick-4)
- [Trick 5: Optimize Network Requests](#trick-5)

## **Trick 1: Optimize Your Blazor WebAssembly Payload**

The first step was to reduce the size of our Blazor WebAssembly payload. We used the `publish` command with trimming and compression:

```
dotnet publish -c Release -r browser-wasm --self-contained true
```

This reduced our payload size by 30%. But we didn’t stop there. We also:

- Removed unused assemblies and packages
- Used `[UnconditionalSuppressMessage("Trimming", "IL2026")]` judiciously to prevent trimming errors
- Implemented lazy loading for rarely used features

> Optimizing the WebAssembly payload alone reduced our total size by 30%, from 8.2 MB to 5.7 MB.

### 💡 **Pro Tip:** Regularly audit your project dependencies and remove any that are no longer necessary. Every byte counts when it comes to WebAssembly payload size!

## Trick 2: Implement Efficient Lazy Loading

We used Blazor’s built-in lazy loading capabilities to defer loading of non-critical components:

```typescript
@page "/dashboard"
@using Microsoft.AspNetCore.Components.Web

Dashboard

@if (showDetails)
{
    
        
            
        
        

            Loading details...
        
    
}

@code {
    private bool showDetails = false;
}
```
We also created a custom `LazyLoader` component for more granular control:

```csharp
public class LazyLoader : ComponentBase where TComponent : IComponent
{
    [Parameter] public RenderFragment ChildContent { get; set; }
    [Parameter] public RenderFragment ContentFactory { get; set; }
    
    private RenderFragment _content;
    
    protected override void OnInitialized()
    {
        _content = builder =>
        {
            builder.OpenComponent(0);
            builder.CloseComponent();
        };
    }
}
```

**Result: Initial load time reduced by 25%**

## **Trick 3: Optimize Rendering with Virtualization**

For long lists and tables, we implemented virtualization to render only the visible items:

```csharp

    
        
    
    

        Loading...

    

```

> Virtualization reduced rendering time for large datasets by a whopping 60%!

## **Trick 4: Implement Efficient State Management**

We moved from a centralized state management approach to a more granular one using Fluxor. This allowed for more efficient updates and reduced unnecessary re-renders:

```csharp
public class CounterState
{
    public int CurrentCount { get; }

    public CounterState(int currentCount)
    {
        CurrentCount = currentCount;
    }
}

public class IncrementCounterAction { }

public static class CounterReducers
{
    [ReducerMethod]
    public static CounterState ReduceIncrementCounterAction(CounterState state, IncrementCounterAction action) =>
        new CounterState(state.CurrentCount + 1);
}

@inherits FluxorComponent

Counter

Current count: @CounterState.Value.CurrentCount

Click me

@code {
    [Inject] private IState CounterState { get; set; }
    [Inject] private IDispatcher Dispatcher { get; set; }

    private void IncrementCount() =>
        Dispatcher.Dispatch(new IncrementCounterAction());
}
```

**Result:** UI responsiveness improved by 40%

💡 **Pro Tip:** When using state management libraries like Fluxor, always consider the granularity of your state. Over-centralization can lead to unnecessary re-renders and performance bottlenecks.

## Trick 5: Optimize Network Requests

We implemented a combination of caching strategies and GraphQL to reduce the number and size of network requests:

- Used `@implements IDisposable` to properly dispose of subscriptions and prevent memory leaks.
- Implemented a custom `HttpClientInterceptor` to cache API responses:

```csharp
public class CachingHttpClientHandler : DelegatingHandler
{
    private readonly IMemoryCache _cache;

    public CachingHttpClientHandler(IMemoryCache cache)
    {
        _cache = cache;
    }

    protected override async Task SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var cacheKey = request.RequestUri.ToString();

        if (_cache.TryGetValue(cacheKey, out HttpResponseMessage cachedResponse))
        {
            return cachedResponse;
        }

        var response = await base.SendAsync(request, cancellationToken);

        if (response.IsSuccessStatusCode)
        {
            _cache.Set(cacheKey, response, TimeSpan.FromMinutes(10));
        }

        return response;
    }
}
```

3. Utilized GraphQL to fetch only the required data:

```csharp
public class GraphQLClient
{
    private readonly HttpClient _httpClient;

    public GraphQLClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task QueryAsync(string query, object variables = null)
    {
        var request = new
        {
            query,
            variables
        };

        var response = await _httpClient.PostAsJsonAsync("graphql", request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync>();
        return result.Data;
    }
}

// Usage
var result = await _graphQLClient.QueryAsync(@"
    query GetDashboardData($userId: ID!) {
        user(id: $userId) {
            name
            accountBalance
            recentTransactions {
                id
                amount
                date
            }
        }
    }
", new { userId = currentUserId });
```

**Result:** Data loading time reduced by 50%

## The Final Outcome

After implementing these optimizations, our Blazor WebAssembly app’s performance metrics improved dramatically:

- First Contentful Paint (FCP): 1.2 seconds (66% improvement)
- Time to Interactive (TTI): 2.1 seconds (79% improvement)
- Total Blazor WebAssembly payload: 5.7 MB (30% reduction)

```lua
Performance Improvements
|
| Before   ■■■■■■■■■■■■■■■■■■ (3.5s)
| After    ■■■■ (1.2s)
|-------------------------------------- FCP
|
| Before   ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ (8.2MB)
| After    ■■■■■■■■■■■■■■■■■■■■ (5.7MB)
|-------------------------------------- Payload
|
| Before   ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ (10.2s)
| After    ■■■■■■■■ (2.1s)
|-------------------------------------- TTI
+---------------------------------------------------------------
     0%        20%        40%        60%        80%       100%
```

> *We achieved an 80% reduction in load time for our Blazor application.*

## Conclusion

By applying these five main tricks — optimizing the WebAssembly payload, implementing efficient lazy loading, using virtualization, refining state management, and optimizing network requests — we achieved an 80% reduction in load time for our Blazor application.

Remember, performance optimization is an ongoing process. Continuously profile your application, identify bottlenecks, and apply these techniques where they make the most sense for your specific use case.

These optimizations not only improved our application’s performance but also enhanced user satisfaction and engagement. The techniques we’ve discussed here are not just theoretical — they’re battle-tested solutions that can make a real difference in your Blazor applications.

What performance challenges have you faced with your Blazor apps? Have you tried any of these techniques, or do you have others to share? Let’s continue this discussion and push the boundaries of what’s possible with Blazor!

---

**About the Author:**

Hey! Vritra is a senior .NET developer. Specializing in Blazor and performance optimization, Vritra is passionate about creating fast, efficient web applications that provide excellent user experiences.

---

💡 **Did you find this article helpful? If so, consider following me for more Blazor tips and tricks. Stay tuned for the next part in this series on advanced Blazor optimization techniques!**
