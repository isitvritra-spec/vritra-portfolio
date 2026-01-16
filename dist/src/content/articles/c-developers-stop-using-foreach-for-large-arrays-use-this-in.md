---
title: "C# Developers: Stop Using foreach for Large Arrays (Use This Instead)"
excerpt: "Span&lt;T&gt; — the memory-efficient loop alternative that cuts processing time by 70% with zero garbage collection overhead"
publishedDate: "2025-06-15"
category: ".NET"
readTime: "3"
image: "https://cdn-images-1.medium.com/max/800/1*Cb1aKxmlTCtqECfStJMHAg.png"
---

### Span<T> — the memory-efficient loop alternative that cuts processing time by 70% with zero garbage collection overhead

Most C# developers write loops the same way they learned years ago. They reach for `foreach` without considering the performance implications, especially when processing large datasets or performance-critical applications. Modern C# offers significantly faster alternatives that can reduce execution time by up to **90%** in memory-intensive operations.

> [Read Free](https://isitvritra101.medium.com/c-developers-stop-using-foreach-for-large-arrays-use-this-instead-a00f01009f63?sk=5c3b1588a09fad895b9d0641291e9083)

## First, foreach Loops

Traditional `foreach` Loops are good, but they actually carry some costs that are compounded by scale. When iterating over collections, each iteration involves method calls, interface dispatching, and potential memory allocations. For collections containing millions of elements, these microscopic costs become measurable issues.

Consider this common pattern for processing numerical data:

```csharp
// has some performance costs
var numbers = new int[1000000];
var sum = 0;

foreach (var number in numbers)
{
    sum += number;
}
```

This code appears straightforward, but the `foreach` loop generates additional overhead through the `IEnumerable<T>` interface. The compiler creates an enumerator object, calls `MoveNext()` repeatedly, and accesses `Current` property for each iteration.

## Need To Explore Span<T>

After C# 7.2, we saw how `Span<T>`, a type designed specifically for high-performance memory operations, giving us a highly optimized result. Using Span<T> leads to performance increases because they are always allocated on the stack, eliminating garbage collection pressure and providing direct memory access.

Here’s the same operation using `Span<T>`:

```csharp
// this approach has Direct memory access
var numbers = new int[1000000];
var span = numbers.AsSpan();
var sum = 0;

for (int i = 0; i  To demonstrate the actual performance difference, here’s a complete benchmark using **BenchmarkDotNet**

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using System;

[MemoryDiagnoser]
public class LoopPerformanceBenchmark
{
    private int[] _data;
    
    [GlobalSetup]
    public void Setup()
    {
        _data = new int[1_000_000];
        var random = new Random(42);
        for (int i = 0; i  input, Span ranges)
{
    var rangeIndex = 0;
    var start = 0;
    
    for (int i = 0; i  The `Span<T>` version avoids creating intermediate string objects, reducing memory pressure and improving performance by up to 85% for large CSV files.

---

## Memory Allocation Impact

Traditional loops often trigger unnecessary garbage collection cycles. Using stack allows very fast allocation and deallocation although it should be used only for allocating small portions since stack size is pretty small. Also, using stack allows reducing pressure on GC.

Consider this memory allocation comparison:

```csharp
// High allocation version
public string ProcessStrings(string[] inputs)
{
    var results = new List();
    foreach (var input in inputs)
    {
        results.Add(input.Substring(0, 5)); // Creates new string objects
    }
    return string.Join(",", results);
}

// Zero allocation version using Span
public string ProcessStringsSpan(string[] inputs)
{
    var buffer = new char[inputs.Length * 6]; // Pre-allocated buffer
    var span = buffer.AsSpan();
    var position = 0;
    
    foreach (var input in inputs)
    {
        var slice = input.AsSpan(0, Math.Min(5, input.Length));
        slice.CopyTo(span.Slice(position));
        position += slice.Length;
        
        if (position  Understanding these alternatives transforms how you approach iteration in C#, enabling you to write code that scales efficiently with your application’s growth.
