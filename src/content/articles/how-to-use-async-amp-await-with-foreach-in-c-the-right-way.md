---
title: "How to use Async &amp; Await with ForEach in C# — The Right Way"
excerpt: "Mastering Asynchronous Loops in C#"
publishedDate: "2025-01-24"
category: ".NET"
readTime: "3"
image: "https://cdn-images-1.medium.com/max/800/1*Gyc6zTz-sqkWgo0jQVxLRA.png"
---

### Mastering Asynchronous Loops in C#

As senior .NET developers, we’ve all used **async/await** for handling asynchronous operations. It’s clean, intuitive, and improves code maintainability. However, when it comes to looping asynchronously, many developers affect performance without realizing it.

Why not let's break down the most efficient way to perform asynchronous iteration in C# !!

> covering best practices, performance tips, and real-world scenarios

## 📝 Table of Contents

- Understanding Asynchronous Iteration
- Why Traditional Foreach Falls Short
- Optimal Approaches for Async Loops
- Returning Void
- Returning Values
- C# 8 Asynchronous Streams
- Helpful Extensions
- Conclusion

---

## 👀Understanding Asynchronous Iteration

When dealing with asynchronous operations inside a loop, the default instinct is to use an `await` within a `foreach`. However, this approach can lead to suboptimal performance as each iteration waits for the previous one to complete, leading to a sequential execution instead of focusing on concurrency.

Let’s examine a common mistake:

```csharp
foreach (var item in items)
{
    await ProcessItemAsync(item);
}
```

**Why is this inefficient?**

- Each iteration waits for the previous one to complete, leading to sequential execution.
- Wastes available concurrency and can lead
- to slow performance.

If tasks are independent of each other, this method is not ideal.

---

## ✨Optimal Approaches for Async Loops

There are two primary considerations when iterating asynchronously:

- **Are you returning a value?**
- **Is your method void (fire and forget)?**

### Returning Void

If you don’t need a result back, it’s best to collect all tasks and execute them concurrently using `Task.WhenAll`. Here's the improved approach:

```csharp
public async Task ProcessItemsAsync(IEnumerable items)
{
    var tasks = items.Select(item => ProcessItemAsync(item));
    await Task.WhenAll(tasks);
}
```

**Benefits:**

- All items are processed in parallel.
- It avoids blocking the loop.
- Efficient use of resources.

### Returning Values

If you need to return results from async operations, `Task<T>` is your best friend. Example:

```swift
public async Task- > ProcessItemsAsync(IEnumerable items)
{
    var tasks = items.Select(item => ProcessItemWithResultAsync(item));
    return (await Task.WhenAll(tasks)).ToList();
}
```

**Key Considerations:**

Use `Task<T>` to collect results.
- `Task.WhenAll` returns an array of results.
- Efficient and easy to handle.

---

## ☀️ C# 8 Asynchronous Streams

C#8 introduced asynchronous streams, allowing `await foreach` to handle async iterations efficiently without manually handling task collections.

Example:

```csharp
public async IAsyncEnumerable GenerateNumbersAsync()
{
    for (int i = 0; i (this IEnumerable source, Func func)
    {
        var tasks = source.Select(func);
        await Task.WhenAll(tasks);
    }
}
```

Usage:

```dart
await items.ForEachAsync(async item => await ProcessItemAsync(item));
```

**Advantages:**

- Clean and reusable.
- Simplifies code structure.

---

## ✓ Conclusion

Handling asynchronous loops correctly is crucial for application performance and maintainability. Here’s what to remember:

- **Avoid sequential awaits inside loops.**
- **Use **`**Task.WhenAll**`** for concurrent execution.**
- **Consider asynchronous streams for better efficiency in C# 8+.**
- **Implement helper extensions to simplify async operations.**

By applying these best practices, you can write efficient and maintainable asynchronous code that scales well.

---

## Those who wanna say Thanks | Buy me a Coffee🖤

**Tags:** #dotnet #csharp #async #performance #bestpractices

> **Follow for more tips on writing high-performance C# code!**
