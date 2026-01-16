---
title: "Span&lt;T&gt; and Memory&lt;T&gt; in C# 12 : Performance Booster for Senior Developers"
excerpt: "As ASP.NET developers, we’re always looking for ways to make our web applications faster and more efficient. Two powerful tools that can…"
publishedDate: "2024-11-21"
category: ".NET"
readTime: "5"
image: "https://cdn-images-1.medium.com/max/800/1*o6J6V29RnddCUvepuNmhQg.png"
---

As ASP.NET developers, we’re always looking for ways to make our web applications faster and more efficient. Two powerful tools that can help us do this are `Span<T>` and `Memory<T>`. Introduced a few years ago, these types have become essential for writing high-performance C# code

lets explore how to use `Span<T>` and `Memory<T>` effectively in ASP.NET applications, with practical examples and tips for C# 12 in 2024

## What Are Span<T> and Memory<T>?

Let’s start with the basics:

- `Span<T>` is a type that represents a continuous block of memory. It works with arrays, strings, or unmanaged memory without creating copies.
- `Memory<T>` is similar to `Span<T>` but can be used in async methods and stored in fields.

Think of `Span<T>` as a view into memory that you can work with directly, while `Memory<T>` is a reference to that memory that you can pass around more freely.

Let’s look at some common ASP.NET scenarios where `Span<T>` and `Memory<T>` can make a big difference:

## Span<T>

### 1. Parsing Request Data

Imagine you’re building an API that receives a lot of JSON data. Instead of allocating new strings for each piece of data, you can use `Span<T>` to parse it more efficiently:

```csharp
[HttpPost]
public IActionResult ProcessOrder([FromBody] string orderJson)
{
    ReadOnlySpan jsonSpan = orderJson.AsSpan();
    
    // Find the "totalAmount" field without allocating new strings
    int startIndex = jsonSpan.IndexOf("\"totalAmount\":") + "\"totalAmount\":".Length;
    int endIndex = jsonSpan.Slice(startIndex).IndexOf(',');
    
    if (decimal.TryParse(jsonSpan.Slice(startIndex, endIndex), out decimal totalAmount))
    {
        // Process the order...
        return Ok($"Order processed with total amount: {totalAmount}");
    }
    
    return BadRequest("Invalid order data");
}
```

This approach reduces memory allocations and improves performance, especially for large payloads

### 2. Efficient Response Writing

When sending responses, especially large ones, `Span<T>` can help optimize memory usage:

```csharp
[HttpGet]
public IActionResult GetLargeData()
{
    const int bufferSize = 1024 * 1024; // 1 MB buffer
    byte[] buffer = ArrayPool.Shared.Rent(bufferSize);
    
    try
    {
        int dataSize = GenerateLargeData(buffer.AsSpan());
        return File(buffer.AsMemory(0, dataSize).ToArray(), "application/octet-stream", "large-data.bin");
    }
    finally
    {
        ArrayPool.Shared.Return(buffer);
    }
}

private int GenerateLargeData(Span buffer)
{
    // Fill the buffer with data...
    return /* actual size of data */;
}
```

This example uses `ArrayPool<T>` with `Span<T>` and `Memory<T>` to efficiently handle large data without excessive allocations.

### 3. URL Parsing in Middleware

Custom middleware often needs to inspect URLs. Here’s how you can do it efficiently:

```csharp
public class CustomUrlMiddleware
{
    private readonly RequestDelegate _next;

    public CustomUrlMiddleware(RequestDelegate next) => _next = next;

    public Task InvokeAsync(HttpContext context)
    {
        ReadOnlySpan path = context.Request.Path.Value.AsSpan();
        
        if (path.StartsWith("/api/".AsSpan()))
        {
            // Handle API requests
            context.Items["IsApiRequest"] = true;
        }
        
        return _next(context);
    }
}
```

This middleware checks the URL without allocating new strings, which is great for high-traffic applications.

---

## Memory<T>

Use `Memory<T>` when you need to:

- Work with memory across asynchronous boundaries
- Store a reference to a memory segment as a field in a class
- Pass memory references to methods that expect `Memory<T>`

### 1. Asynchronous File Upload Processing

```csharp
[HttpPost("upload")]
public async Task UploadFile(IFormFile file)
{
    if (file.Length > 10_000_000) // 10 MB limit
        return BadRequest("File too large");

    var memory = new Memory(new byte[file.Length]);
    
    using (var stream = file.OpenReadStream())
    {
        await stream.ReadAsync(memory);
    }

    await ProcessUploadedFileAsync(memory);
    
    return Ok("File processed successfully");
}

private async Task ProcessUploadedFileAsync(Memory fileData)
{
    // Simulate some async processing
    await Task.Delay(100); // Placeholder for actual processing
    
    // Example: Count non-zero bytes
    int nonZeroBytes = 0;
    foreach (byte b in fileData.Span)
    {
        if (b != 0) nonZeroBytes++;
    }
    
    Console.WriteLine($"Processed file with {nonZeroBytes} non-zero bytes");
}
```

This example shows how `Memory<T>` can be used to handle file data across async methods without unnecessary copying.

### 2. Caching Large Objects

When caching large objects in an ASP.NET application, `Memory<T>` can be useful:

```csharp
public class LargeObjectCache
{
    private Memory cachedData;

    public async Task> GetOrCreateAsync(Func> createFunc)
    {
        if (cachedData.IsEmpty)
        {
            byte[] newData = await createFunc();
            cachedData = new Memory(newData);
        }
        return cachedData;
    }
}

// Usage in a controller
[HttpGet("large-data")]
public async Task GetLargeData([FromServices] LargeObjectCache cache)
{
    var data = await cache.GetOrCreateAsync(async () =>
    {
        // Simulate fetching large data
        await Task.Delay(1000);
        return new byte[1_000_000]; // 1 MB of data
    });

    return File(data.ToArray(), "application/octet-stream");
}
```

### 3. Efficient String Building in Background Tasks

For background tasks that build large strings, `Memory<T>` can be more efficient than `StringBuilder`:

```csharp
public class ReportGenerator : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await GenerateReportAsync();
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }

    private async Task GenerateReportAsync()
    {
        var writer = new ArrayBufferWriter(initialCapacity: 1024 * 1024); // Start with 1 MB

        await WriteReportHeaderAsync(writer);
        await WriteReportBodyAsync(writer);
        await WriteReportFooterAsync(writer);

        string report = new string(writer.WrittenMemory.Span);
        await SaveReportAsync(report);
    }

    private async Task WriteReportHeaderAsync(IBufferWriter writer)
    {
        var memory = writer.GetMemory(1024);
        int written = System.Text.Encoding.UTF8.GetBytes("Report Header\n", memory.Span);
        writer.Advance(written);
        await Task.Delay(100); // Simulate some async work
    }

    // Similar methods for WriteReportBodyAsync and WriteReportFooterAsync

    private async Task SaveReportAsync(string report)
    {
        // Save the report to a database or file
        await File.WriteAllTextAsync("report.txt", report);
    }
}  
```

This example shows how `Memory<T>` can be used with `IBufferWriter<T>` for efficient string building in a background task, which is common in ASP.NET applications for tasks like report generation or data processing.

## Conclusion

`Span<T>` and `Memory<T>` are powerful tools for ASP.NET developers looking to optimize their applications. By using these types, you can write more efficient code that uses less memory and runs faster. As you build your web applications in 2024 and beyond, keep these techniques in mind to ensure your ASP.NET projects are as performant as possible.
