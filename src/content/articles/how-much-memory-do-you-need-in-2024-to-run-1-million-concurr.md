---
title: "How Much Memory Do You Need in 2024 to Run 1 Million Concurrent Tasks?"
excerpt: "Words by Piotr Kołaczkowski"
publishedDate: "2025-02-03"
category: ".NET"
readTime: "7"
image: "https://cdn-images-1.medium.com/max/800/1*_WcqbA-Xy6kmjf7LEh4PIQ.jpeg"
---

### Words by [Piotr Kołaczkowski](https://pkolaczk.github.io/)

In this blog post, I delve into the comparison of memory consumption between asynchronous and multi-threaded programming across popular languages like Rust, Go, Java, C#, Python, Node.js and Elixir.

Some time ago Piotr had to compare performance of a few computer programs designed to handle a large number of network connections. he saw huge differences in memory consumption of those programs, even exceeding 20x. Some programs consumed little over 100 MB, but the others reached almost 3 GB at 10k connections. Unfortunately those programs were quite complex and differed also in features, so it would be hard to compare them directly and draw some meaningful conclusions, as that wouldn’t be an apple-to-apple comparison. This led him to an idea of creating a synthetic benchmark instead.

> With a little help of ChatGPT he wrote such program in a few minutes, even in programming languages that even I don’t use every day. For your convenience, all benchmark code is [available on his GitHub](https://github.com/pkolaczk/async-runtimes-benchmarks).

## Compared on 2023

At 1 million tasks, Elixir gave up with `** (SystemLimitError) a system limit has been reached`.

Some commenters pointed out I could increase the process limit. After adding `--erl '+P 1000000'` parameter to `elixir` invocation, it ran fine.

> This comparison focused solely on memory consumption, while other factors such as task launch time and communication speed are equally important. Notably, at 1 million tasks, I observed that the overhead of launching tasks became evident, and most programs required more than 12 seconds to complete. Stay tuned for upcoming benchmarks, where I will explore additional aspects in depth.

---

Now at the start of 2025, I wonder how things changed in the span of one year, with the latest version of languages.

Let’s do the benchmark again and see the results!

## Benchmark

The program to benchmark is the same with the one in the last year:

> *Let’s launch N concurrent tasks, where each task waits for 10 seconds and then the program exists after all tasks finish. The number of tasks is controlled by the command line argument.*

This time, let’s focus on coroutine instead of multiple threads.

All benchmark code can be accessed at [**async-runtimes-benchmarks-2024**](https://github.com/hez2010/async-runtimes-benchmarks-2024)**.**

**What is a coroutine?**

> *Coroutines are computer program components that allow execution to be suspended and resumed, generalizing subroutines for cooperative multitasking. Coroutines are well-suited for implementing familiar program components such as cooperative tasks, exceptions, event loops, iterators, infinite lists and pipes.*

## Rust

I created 3 programs in Rust. One uses `tokio`:

One uses `async_std`:

And one uses `tokio` but uses `futures::future::join_all` to track all tasks instead of `spawn` each task separately:

Both `tokio` and `async_std` are popular async runtime commonly used in Rust.

## C#

C#, similar to Rust, has first-class support for async/await:

.NET also offers NativeAOT compilation since .NET 7, which compiles the code to the final binary directly so that it no longer needs a VM to run managed code. So we added the benchmark for NativeAOT as well.

## NodeJS

So does NodeJS:

## Python

And Python, too:

## Go

In Go, goroutines are the building block for concurrency. We don’t await them separately, but we use a `WaitGroup` instead:

## Java

Java offers virtual threads since JDK 21, which are a similar concept to goroutines:

While there’s a new variant of JVM called GraalVM. GraalVM also offers native image, which is a similar concept to NativeAOT in .NET. So we added the benchmark for GraalVM as well.

## Test Environment

All programs were launched using the release mode if available, and support for internationalization and globalization was disabled as we didn’t have *libicu *in our test environment.

## Results

### Minimum Footprint

Let’s start from something small, because some runtimes require some memory for themselves, let’s first launch only one task.

**Note: You can click the legend label on the top to hide a specific legend.**

We can see that Rust, C# (NativeAOT), and Go achieved similar results, as they were compiled statically to native binaries and needed very little memory. Java (GraalVM native-image) also did a great job but cost a bit more than the other statically compiled ones. The other programs running on managed platforms or through interpreters consume more memory.

Rust (futures) seems to have the smallest footprint in this case. While Go and C# (NativeAOT) seem to have the similar minimal footprint.

Python, which is running on an interpreter, also shows great result.

Java with GraalVM is a bit surprising, as it cost far more memory than Java with OpenJDK, but I guess this can be tuned with some settings.

### 10K Tasks

A few surprises here! The three Rust benchmarks, C# (NativeAOT) achieved very promising results: they both used very little memory (less than 10MB), which didn’t grow too much compared to minimal footprint results, even though there were 10K tasks running behind the scenes! C# (NativeAOT) followed closely behind, using only ~10MB of memory. We need more tasks to put more pressure on them!

The memory consumption grew dramatically in Go. Goroutines are supposed to be very lightweight, but they actually consumed far more RAM than Rust required. In this case, virtual threads in Java (GraalVM native image) seem to be more lightweight than Goroutines in Go. To my surprise, both Go and Java (GraalVM native image), which were compiled to native binaries statically, cost similar RAM with the C# one running on a VM!

### 100K Tasks

After we increased the number of tasks to 100K, the memory consumption of all the languages started to grow significantly.

> *Both Rust and C# did a really good job in this case. Rust continues to lead the benchmark, and C# follows closely. Really impressive!*

At this point, the Go program has been beaten not only by Rust but also by Java (except the one running on GraalVM), C#, and NodeJS. But worth to note that Java costs significantly more CPU to complete the benchmark.

## 1 Million Tasks

Let’s go extreme now.

Finally, Rust (futures) and C# show very promising result; either is very competitive and has really become a monster.

> And it’s worth to note that Rust consistently cost the least CPU for running all the tasks.

NodeJS, which runs on a VM, also shows great result in this case: although it costs more RAM than C#, it requires less CPU to complete the benchmark, which is even less than some of the Rust benchmarks.

*While both Java and Python start to be not able to complete the benchmark in 10 seconds, and Java costs significant more CPU than other languages.*

## Final Word

As we have observed, a high number of concurrent tasks can consume a significant amount of memory, even if they do not perform complex operations. Different language runtimes have varying trade-offs, with some being lightweight and efficient for a small number of tasks but scaling poorly with hundreds of thousands of tasks.

Many things have changed since last year. With the benchmark results on the latest compilers and runtimes, we see a huge improvement in .NET, and .NET with NativeAOT is really competitive.

- Rust continues to be memory saving as expected, and achieved similar result with C# (NativeAOT).
- NodeJS shows impressive result in term of CPU usage.
- Python faced performance issue and was not able to complete the benchmark in time in the 1M case.

Both Java Virtual Thread and Goroutine take similar approach on concurrency, while others are using async/await, so let’s exclude other languages and only focus on these two: the native image of Java built with GraalVM did a great job in terms of memory efficiency, but it failed to finished the benchmark in 10 seconds in the 1M case; while Goroutine is able to complete all the tasks in time, but it costs much more RAM than Java in the 1M case.

## Those who wanna say Thanks | Buy me a Coffee🖤
