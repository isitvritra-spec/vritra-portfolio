---
title: "CQRS in .NET: The Most Overengineered Solution for Simple Problems"
excerpt: "What is CQRS and Why Do People Choose It?"
publishedDate: "2024-12-30"
category: ".NET"
readTime: "12"
image: "https://cdn-images-1.medium.com/max/800/1*Ni_tQ9UnBudt3wgs_4WGYw.jpeg"
---

### What is CQRS and Why Do People Choose It?

As software systems grow in complexity, we often reach for architectural patterns that promise to solve our problems. **Command Query Responsibility Segregation** (CQRS) is one such pattern that’s gained significant popularity in the .NET ecosystem.

However, before we dive into why it might be overengineered for many scenarios, let’s understand what it actually is and how it’s typically implemented.

## **What is CQRS and Why Do People Choose It?**

At its core, CQRS separates an application’s ***read*** and ***write*** operations into different models. The principle comes from Bertrand Meyer’s Command-Query Separation (CQS) principle, which states that *every method should either be a command that performs an action, or a query that returns data, but not both.*

Let’s look at a basic implementation that most tutorials will show you:

- **Traditional Approach [ Everything in one place ]**

```csharp
// Traditional approach - Everything in one place
public class ProductService
{
    private readonly ApplicationDbContext _context;
    
    public async Task
 GetProduct(int id)
    {
        return await _context.Products.FindAsync(id);
    }
    
    public async Task UpdateProduct(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }
}
```

- **CQRS Basic Implementation**

— Command Side

```csharp
public class UpdateProductCommand : ICommand
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

public class UpdateProductCommandHandler : ICommandHandler
{
    private readonly ApplicationDbContext _context;
    
    public async Task Handle(UpdateProductCommand command)
    {
        var product = await _context.Products.FindAsync(command.Id);
        product.Name = command.Name;
        product.Price = command.Price;
        await _context.SaveChangesAsync();
    }
}
```

— Query Side

```csharp
public class GetProductQuery : IQuery

{
    public int Id { get; set; }
}

public class GetProductQueryHandler : IQueryHandler
{
    private readonly ApplicationDbContext _context;
    
    public async Task Handle(GetProductQuery query)
    {
        var product = await _context.Products.FindAsync(query.Id);
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price
        };
    }
}
```
but the problem is

## Simple Goes Complex

Now, let’s see what happens when we build a real application using this pattern. Consider a basic **Product Management Module **with just these operations:

- Get product
- Create product
- Update product
- Delete product
- List products
- Search products
- Get product inventory
- Update inventory

— Traditional approach might look like this..

```csharp
public class ProductService
{
    private readonly ApplicationDbContext _context;
    
    public async Task
 GetProduct(int id) => /* implementation */;
    public async Task CreateProduct(Product product) => /* implementation */;
    public async Task UpdateProduct(Product product) => /* implementation */;
    public async Task DeleteProduct(int id) => /* implementation */;
    public async Task- > ListProducts() => /* implementation */;
    public async Task> SearchProducts(string term) => /* implementation */;
    public async Task GetInventory(int productId) => /* implementation */;
    public async Task UpdateInventory(int productId, int quantity) => /* implementation */;
}
```
but with CQRS this explodes into multiple files:

```markdown
Commands/
  - CreateProductCommand.cs
  - CreateProductCommandHandler.cs
  - UpdateProductCommand.cs
  - UpdateProductCommandHandler.cs
  - DeleteProductCommand.cs
  - DeleteProductCommandHandler.cs
  - UpdateInventoryCommand.cs
  - UpdateInventoryCommandHandler.cs
Queries/
  - GetProductQuery.cs
  - GetProductQueryHandler.cs
  - ListProductsQuery.cs
  - ListProductsQueryHandler.cs
  - SearchProductsQuery.cs
  - SearchProductsQueryHandler.cs
  - GetInventoryQuery.cs
  - GetInventoryQueryHandler.cs
DTOs/
  - ProductDto.cs
  - CreateProductDto.cs
  - UpdateProductDto.cs
  - ProductListDto.cs
  - InventoryDto.cs
```

but lets see..

## Better Approach

Instead of going full CQRS or staying completely traditional, here’s a practical mid approach that maintains code organization without Fcukin with the complexity…

```csharp
public class ProductManagement
{
    private readonly ApplicationDbContext _context;
    
    // Simple CRUD operations stay simple
    public class ProductOperations
    {
        private readonly ApplicationDbContext _context;
        
        public async Task
 GetProduct(int id) => /* implementation */;
        public async Task CreateProduct(Product product) => /* implementation */;
        public async Task UpdateProduct(Product product) => /* implementation */;
        public async Task DeleteProduct(int id) => /* implementation */;
    }
    
    // Complex queries get their own space
    public class ProductQueries
    {
        private readonly ApplicationDbContext _context;
        
        public async Task> SearchProducts(
            string term, 
            string category, 
            decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();
            
            if (!string.IsNullOrEmpty(term))
                query = query.Where(p => p.Name.Contains(term));
                
            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category == category);
                
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price  new ProductDto(p))
                .ToListAsync();
        }
    }
    
    // Business operations that need special handling
    public class InventoryOperations
    {
        private readonly ApplicationDbContext _context;
        private readonly IEventBus _eventBus;
        
        public async Task UpdateInventory(int productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            var oldQuantity = product.InventoryCount;
            product.InventoryCount = quantity;
            
            await _context.SaveChangesAsync();
            
            if (quantity In reality

## When CQRS Makes Sense

— Complex Reporting Systems:

```typescript
public class SalesReportQueries
{
    private readonly ReadOnlyDbContext _readDb;
    
    public async Task GenerateComplexReport(ReportCriteria criteria)
    {
        return await _readDb.Sales
            .AsNoTracking()
            .Include(s => s.Products)
            .Include(s => s.Customer)
            .Where(s => s.Date >= criteria.StartDate && s.Date  new { s.Region, s.ProductCategory })
            .Select(g => new SalesReportDto
            {
                Region = g.Key.Region,
                Category = g.Key.ProductCategory,
                TotalSales = g.Sum(s => s.Amount),
                AverageOrderValue = g.Average(s => s.Amount),
                TopProducts = g.SelectMany(s => s.Products)
                    .GroupBy(p => p.Id)
                    .OrderByDescending(p => p.Count())
                    .Take(5)
                    .Select(p => new TopProductDto
                    {
                        ProductId = p.Key,
                        SalesCount = p.Count()
                    })
                    .ToList()
            })
            .ToListAsync();
    }
}
```

— High-Scale Systems with Different Read/Write Patterns:

```csharp
public class OrderProcessor
{
    private readonly WriteDbContext _writeDb;
    private readonly IEventBus _eventBus;
    
    public async Task ProcessOrder(Order order)
    {
        // Write to main database
        _writeDb.Orders.Add(order);
        await _writeDb.SaveChangesAsync();
        
        // Publish event for read-side processing
        await _eventBus.PublishAsync(new OrderCreatedEvent(order));
    }
}

public class OrderReadModel
{
    private readonly ReadDbContext _readDb;
    
    public async Task GetOrderSummary(int orderId)
    {
        // Read from optimized read model
        return await _readDb.OrderSummaries
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.OrderId == orderId);
    }
}
```

---

**CQRS** isn’t inherently bad — it’s just frequently misapplied..

Start Simple: Begin with a traditional n-tier architecture.
- Identify Pain Points: Look for specific areas where read/write separation would provide real benefits.
- Apply Selectively: Use CQRS only for those components that truly need it.
- Keep it Pragmatic: Don’t feel obligated to apply the pattern uniformly across your entire application.

> Remember! the goal of architecture isn’t to showcase design patterns — it’s to create maintainable, scalable systems that solve business problems. Sometimes, that means choosing the simpler path and saying no to unnecessary complexity.

## Performance Costs of Async/Await in .NET: What Senior Developers Need to Know

As senior .NET developers, we’ve all used ***async/await ***as the go-to pattern for handling asynchronous operations. It’s Clean, Intuitive, and makes our code more Maintainable. However, beneath this great syntax lies a complex machinery that can drastically impact application performance when misused.

this article going to uncover the hidden costs and explore optimization strategies that every seasoned developer should know.

## Table of Contents

- Understanding the Foundations
- Making Your Code Faster: ValueTask
- Performance Tips ✓
- Practical Advice for Different Situations
- Conclusion

### BEFORE WE GO :

> ***Friendly Link for my brothers:*** [https://medium.com/@isitvritra101/performance-costs-of-async-await-in-net-what-senior-developers-need-to-know-185ab74c7acb?sk=6bdd986c86fa9ffa4550f0262d106cbd](https://medium.com/@isitvritra101/performance-costs-of-async-await-in-net-what-senior-developers-need-to-know-185ab74c7acb?sk=6bdd986c86fa9ffa4550f0262d106cbd)

## Understanding the Foundations

The async/await pattern in .NET fundamentally transforms how we write asynchronous code. Before we learn about advanced patterns, let’s understand what happens under the hood when we write async code.

### What Actually Happens Behind the Scenes?

When you mark a method as `async`, .NET does something interesting. It takes your code and transforms it into a special structure called a "**state machine**."

Think of it like breaking your code into smaller pieces that can be paused and resumed.

Yes, What you write is

```csharp
public async Task ProcessOrderAsync()
{
    var data = await GetDataAsync();       // Step 1
    var result = await ProcessDataAsync(data); // Step 2
    return result;
}
```

But, What it becomes (*simplified*)

```csharp
public Task ProcessOrderAsync()
{
    // Creates a structure to keep track of where we are
    var stateMachine = new AsyncStateMachine();
    
    // Stores any local variables
    stateMachine.data = null;
    stateMachine.result = 0;
    
    // Starts the process
    Start(stateMachine);
    
    // Returns a Task that will eventually have the result
    return stateMachine.Task;
}
```

### Why This Matters ( Performance Impact )

This transformation has some costs:

- **Memory Usage**: Every async method needs extra memory to:

- Store the state machine
- Keep track of local variables
- Create Task objects

**2. Speed**: There’s some extra work happening:

- Setting up the state machine
- Switching between different parts of your code
- Managing all these pieces

look at this..

```csharp
//Simple but might be wasteful
public async Task GetValueAsync()
{
    return await Task.FromResult(42);
}
```

```
//More efficient for simple cases
public Task GetValueBetter()
{
    return Task.FromResult(42);
}
```

In the first version, we’re creating a state machine we don’t really need. The second version is more efficient because it just returns the result directly!!

see! async/await is the root right? but remember its important but not necessary to use everywhere! we can optimize…

## Making Your Code Faster: ValueTask

Now, let’s talk about `ValueTask`. Think of it as a more efficient version of `Task` for specific situations. Here's when you might want to use it:

YES,

```csharp
// Before: Using regular Task
public async Task GetDataAsync(string key)
{
    var value = await _database.GetValueAsync(key);
    return value;
}
```

BUT,

```csharp
// After: Using ValueTask efficiently
public ValueTask GetDataAsync(string key)
{
    // If we have it in cache, return immediately
    if (_cache.TryGetValue(key, out var value))
    {
        return new ValueTask(value);
    }
    
    // If not in cache, fall back to async operation
    return new ValueTask(_database.GetValueAsync(key));
}
```

When should you use **ValueTask**?

- When your method often returns immediately without waiting
- When you’re dealing with lots of small, fast operations
- When you’re building high-performance systems

> *📍*Don’t use ValueTask just because it sounds better. It’s actually worse for performance if used incorrectly!

Times up!

## — Performance Tips ✓

### 0️⃣Don’t Use Async When You Don’t Need It

```csharp
// Don't do this
public async Task AddNumbers(int a, int b)
{
    return await Task.FromResult(a + b); // Why async?
}
```

```
// Do this instead
public int AddNumbers(int a, int b)
{
    return a + b; // Simple and fast!
}
```

### 1️⃣Handle Multiple Operations Smartly

```csharp
// Less efficient: doing things one at a time
public async Task ProcessItems(List items)
{
    foreach (var item in items)
    {
        await ProcessItemAsync(item); // One at a time
    }
}
```

```
// More efficient: processing things together
public async Task ProcessItems(List items)
{
    var tasks = items.Select(item => ProcessItemAsync(item));
    await Task.WhenAll(tasks); // All at once!
}
```

### 2️⃣Use Caching When Possible

```csharp
private readonly Dictionary> _cache = new();
```

```
public async Task GetExpensiveData(string key)
{
    if (!_cache.TryGetValue(key, out var task))
    {
        task = CalculateExpensiveDataAsync(key);
        _cache[key] = task;
    }
    return await task;
}
```

### 3️⃣Thread Pool and Why It Matters

The thread pool is like a team of workers ready to handle your async operations. Sometimes you need to help it work better:

```csharp
public void ConfigureThreadPool()
{
    // Get current settings
    ThreadPool.GetMinThreads(out int workerThreads, out int completionPortThreads);
    
    // Increase minimum threads if you need more workers
    ThreadPool.SetMinThreads(
        workerThreads * 2,
        completionPortThreads
    );
}
```

but remember When should you adjust thread pool settings?

- When your application handles lots of requests
- When you see operations waiting too long to start
- When you have many concurrent async operations

### 4️⃣Common Mistakes to Avoid

- Async Void

```csharp
// Bad: Can't handle errors properly
public async void ProcessData() // 🚫
{
    await Task.Delay(100);
}
```

```
// Good: Returns Task so errors can be handled
public async Task ProcessData() // ✅
{
    await Task.Delay(100);
}
```

- Unnecessary Async

```csharp
// Bad: Wasteful async overhead
public async Task GetNumber() // 🚫
{
    return await Task.FromResult(42);
}
```

```
// Good: Direct return when no real async work
public int GetNumber() // ✅
{
    return 42;
}
```

Remember these points:

- Start with clear, simple async code
- Measure performance in your real application
- Optimize only when you have a real problem
- Test your optimizations with real data

## Practical Advice for Different Situations

**For Web APIs**:

```csharp
public async Task GetUserData(int userId)
{
    // Try cache first (fast path)
    if (_cache.TryGetValue(userId, out var userData))
    {
        return Ok(userData);
    }
    
    // If not in cache, get from database
    userData = await _database.GetUserAsync(userId);
    
    // Save in cache for next time
    _cache.Set(userId, userData, TimeSpan.FromMinutes(10));
    
    return Ok(userData);
}
```

**For Background Processing**:

```csharp
public async Task ProcessQueue()
{
    while (!_cancellationToken.IsCancellationRequested)
    {
        // Process items in batches for better performance
        var items = await _queue.GetItemsBatchAsync(maxItems: 100);
        
        // Process batch together
        await Task.WhenAll(items.Select(ProcessItemAsync));
        
        // Short delay to prevent tight loop
        await Task.Delay(100);
    }
}
```

### For UI: SynchronizationContext

Understanding SynchronizationContext is crucial for application performance, especially in UI applications:

```csharp
public class SynchronizationContextExample
{
    public async Task UIOperation()
    {
        // Captures UI context
        var currentContext = SynchronizationContext.Current;
        
        await Task.Run(() =>
        {
            // Heavy work on background thread
        }).ConfigureAwait(false); // Avoids context switch back to UI
        
        // Manual context restoration if needed
        if (currentContext != null)
        {
            await currentContext.PostAsync(() =>
            {
                // UI update
            });
        }
    }
}
```

- Use ConfigureAwait(false) in library code
- Be cautious with context switches in performance-critical paths
- Understand the cost of context capture and restoration

## Conclusion

The best way to learn is to:

- Write the simplest code that works
- Measure its performance
- Ask for help when you find specific problems
- Learn from real examples in your codebase

> premature optimization is still the root of all evil. Profile your application under real-world conditions, identify issues, and apply these optimizations where they matter most!

## Those who wanna say Thanks | Buy me a Coffee🖤

---

Author Signature:

A Senior Software Engineer with years of experience in .NET and enterprise architecture, focusing on practical solutions rather than architectural purity….
