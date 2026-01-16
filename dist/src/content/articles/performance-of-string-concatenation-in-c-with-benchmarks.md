---
title: "Performance Of String Concatenation In C# — with Benchmarks"
excerpt: "String concatenation might seem like a simple task in .NET, but beneath its surface lies a web of performance implications that can trip…"
publishedDate: "2025-03-25"
category: ".NET"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/1200/1*O33n0LC6TneX7DDxNZRdvQ.png"
---

String concatenation might seem like a simple task in .NET, but beneath its surface lies a web of performance implications that can trip up. Whether you’re stitching together a quick log message or building complex strings in a high-traffic web application, your choice of method can affect **speed, memory usage, **and** scalability**. And we are going to explore into the four main approaches —** + operator**, **String.Format**, **string interpolation ($”…”)**, and **FormattableString** — using real benchmark data to reveal their strengths, weaknesses, and ideal use cases.

## 🔹Benchmarking the Basics

[full code available at [this gist](https://gist.github.com/meziantou/b120126088457f5f87ad200f4f7bf6b0)]. It tests concatenation methods with argument counts from 1 to 100, measuring execution time (in nanoseconds), memory allocation (in bytes), and garbage collection pressure (Gen 0). Here’s a snapshot of the results:

> The **+ operator** starts strong but scales poorly. **String.Format and interpolation** perform similarly, while **FormattableString **carries extra overhead. Let’s break down each method and see where they fit in your toolbox.

---

## 🔹How They Work

## — The + Operator

**The + operator** is the go-to for quick concatenations, like

> *“test” + 0 + “test0”*

It’s straightforward and readable, but since strings are immutable in .NET, each **+ creates a new string object**. For one or two concatenations, this is trivial — 82.39 ns and 104 bytes allocated. But as the count climbs (10,464 bytes at 100 arguments), memory allocation and garbage collection pile up, making it a liability in larger operations.

## — String.Format

**String.Format** uses placeholders, as in

> *string.Format(“test{0}{1}”, 0, “test0”)*

building the string in a single pass. It’s slower for small cases (176.44 ns for 1 argument) but holds up better as arguments increase, allocating 13,888 bytes at 100 arguments — still high, but more controlled than +. Its syntax is less intuitive, but it’s a staple for complex formatting.

## — String Interpolation

Introduced in C# 6.0, **string interpolation**

> ($”test{0}{“test0”}”)

is syntactic sugar over String.Format. It compiles to nearly identical code, reflected in its performance: 177.31 ns for 1 argument, 12,924.46 ns for 100. It’s more readable and matches String.Format in allocation (13,888 bytes at 100 arguments), making it a popular choice for clarity without sacrificing efficiency.

## — FormattableString

**FormattableString** emerges from interpolation when explicitly invoked, like Format

> ($”test{0}{“test0”}”)

It’s designed for advanced scenarios — think passing format strings to loggers or localization systems. It lags in speed (229.26 ns for 1 argument) and memory (13,920 bytes at 100 arguments), making it less practical for everyday use.

---

## 🔹EDGE CASES

### Small Concatenations (1–5 Arguments) — + operator

For a quick ***“hello” + “world”* **the + operator is **unbeatable **— 82.39 ns and minimal fuss. No need for heavier tools here. But even at 5 arguments (453.13 ns, 600 bytes), its allocation starts to creep up, hinting at trouble ahead.

> *◾*+ operator is **unbeatable**

### Loops and Repetition — **StringBuilder** comes in

Here’s where **StringBuilder** comes in. Absent from the benchmark but critical to this discussion, it’s built for iterative concatenation:

```csharp
var sb = new StringBuilder(); 
for (int i = 0; i  *◾*StringBuilder reuses a buffer

### Long Strings — StringBuilder stays efficient

The benchmark uses short strings like “test0”, but what about 1 KB strings? Allocation scales with length — + could hit 100 KB for 100 long strings, triggering frequent garbage collection. StringBuilder stays efficient, while String.Format and interpolation manage but still allocate heavily (e.g., 13,888 bytes for 100 short arguments balloons with size).

> *◾*String.Format and interpolation manage but still allocate heavily

### ***Mixed Data Types***

Concatenating int, double, or objects? All methods handle it.

+ calls ToString() inline, while String.Format and interpolation do the same behind the scenes.

> *◾*Performance stays consistent with the argument count, not the type.

### High-Load Scenarios (e.g., Web Apps)

In an ASP.NET app under heavy traffic, memory matters. The + operator’s 10,464 bytes at 100 arguments means more garbage collection, slowing response times. String.Format and interpolation (13,888 bytes) aren’t much better, but StringBuilder keeps allocation low, making it ideal for server-side scale.

> *◾*StringBuilder keeps allocation low. ideal for server-side scale

---

## Developer Mindset

### What Are Developers Doing?

- **Juniors:** Using + into every corner — it’s in every beginner list. Some flirt with interpolation for its modern vibe.
- **Seniors:** struggling with String.Format for formatted output, + for one-offs, and StringBuilder for loops. FormattableString? Mostly ignored unless a framework demands it.

### What’s on Your Mind?

- **“Is + secretly terrible?”** Not for small tasks — it’s the fastest at 82.39 ns for 1 argument. But in loops or big batches, it’s a memory hog.
- **“Should I rewrite everything with interpolation?”** No performance gain — it’s String.Format in disguise. Do it for team consistency, not speed.
- **“Why no StringBuilder in the benchmark?”** It’s optimized for loops, not static concatenation like the test. Separate beast, proven elsewhere.

### What Should You Do?

- **1–5 Arguments, No Loops:** Stick with +. Fast, simple, 82.39 ns at 1 argument — done.

> Stick with +

- **5–20 Arguments, One-Shot:** Use interpolation ($”…”). At 692.05 ns for 5 arguments, it’s readable and scales better than + (600 bytes vs. 480 bytes).

> Use interpolation ($”…”)

- **Loops or 20+ Arguments:** Deploy StringBuilder. The benchmark’s 4,394.86 ns and 5,264 bytes for + at 50 arguments scream inefficiency — StringBuilder fixes that.

> Deploy StringBuilder

- **Complex Formatting:** Opt for String.Format or interpolation. They’re nearly identical (2,642.51 ns vs. 2,625.90 ns at 20 arguments) — pick your style.

> Opt for String.Format or interpolation

- **Framework Needs:** Reserve FormattableString for specific frameworks. Its 10,941.37 ns at 100 arguments isn’t worth it otherwise.

> Reserve FormattableString for specific frameworks

## The End

String concatenation in .NET can help you in a good way if its a big project. The + operator is your quick-draw for small jobs, but it stumbles as complexity grows. String.Format and interpolation offer a balanced middle ground, mxing readability with decent scaling. StringBuilder works well for loops and repetition, while FormattableString is for specialized tasks.

Test your use case — small app or enterprise system, short strings or long, one-off or looped. The benchmark data (e.g., 9,011.67 ns for + at 100 arguments) is a warning. Optimize where it counts, keep it simple where it doesn’t, and let performance enhance your code, not habit…

we sure covering more good topic…. clapp!

---

valuable you valuable us! [**click here**](http://buymeacoffee.com/IsItVritra)

Thank you.
