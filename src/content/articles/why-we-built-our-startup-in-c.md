---
title: "Why we built our startup in C#"
excerpt: "by Co-Founder &amp; CTO of Tracebit"
publishedDate: "2025-05-16"
category: ".NET"
readTime: "4"
image: "https://cdn-images-1.medium.com/max/800/0*5__C6FjJxW_xMtSN.png"
---

### by Co-Founder & CTO of Tracebit

When we started building Tracebit — a B2B SaaS security product — one of my key early decisions was to pick a programming language. While many startups gravitate toward Python, TypeScript, Golang, or Rust, I went a different way: C#.

## Productivity First

I think a stack which lets you spend time on what actually matters is the core of a great developer experience. I wanted:

- an expressive, fully-featured language which would let us quickly test and refine ideas
- the assurance offered by static types when maintaining and refactoring code
- a stable platform that would still work well as our team and codebase grew

C# has allowed us to be highly productive from the earliest days and it feels like a really solid foundation to build on.

## Modern, Open & Cross-Platform

I was pleasantly surprised to find that .NET is now fully open source and MIT-licensed. The cross-platform support lets us develop on MacBooks, and deploy to Linux containers on ARM cores. Microsoft’s [“chiseled” container images](https://devblogs.microsoft.com/dotnet/announcing-dotnet-chiseled-containers/) are a nice touch too, giving us a lean deployment option which minimizes CVE management.

## Popularity

*Stack Overflow Developer Survey 2024*

C# consistently ranks as a highly popular programming language, though perhaps without generating the buzz that some other languages might — especially among startups! This established presence gives us real advantages:

- A great talent pool from which to hire
- Plenty of world-class libraries at our fingertips
- Lots of documentation and examples when needed
- Well-traveled paths with fewer unexpected roadblocks

## Rich Standard Library

The .NET ecosystem comes with quality libraries for just about everything we’ve needed. Along with the usual suspects (collections, JSON processing, etc), [Entity Framework](https://learn.microsoft.com/ef/) and [ASP.NET](https://dotnet.microsoft.com/apps/aspnet) stand out as excellent frameworks in which to build.

This has been particularly valuable for us as a security product. We have high standards for dependencies, and having so many trusted and well-maintained components available has saved us a lot of time!

## Expressive language features

C# as a language has many nice features, such as LINQ, pattern-matching, anonymous functions, primary constructors and null-coalescing operators that make it both expressive and succinct. I’ve honestly found it a pleasure to read and write.

When it comes to the type system, I think C# has found a really nice balance — it’s powerful without feeling overly complex. I particularly like the support for generics, record types, and reflection.

## Great Tooling

The development ecosystem offers some excellent tools:

- Powerful IDEs with great debugging and refactoring support
- Great static analyzers that will often suggest fixes automatically
- Sophisticated tooling for memory profiling and runtime diagnostics

These make it a joy to work with the language, and help avoid nasty surprises in production.

## It’s Fast

*Note: This graphic has been updated from the original post with the latest TechEmpower results.*

While performance wasn’t our main reason for choosing C#, it’s certainly a nice advantage. It’s clearly a priority for the .NET team and each release brings [meaningful performance improvements](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-9). We process a lot of data on behalf of our customers and I’ve been very impressed by the throughput we’ve been able to achieve with simple and idiomatic C# — while still offering many options to optimize hot code paths if necessary.

## How It’s Going

After thousands of commits and over 100,000 lines of code, I’m very happy with our choice. We’ve brought on team members who had never used C# before, and everyone’s become productive surprisingly quickly — shipping code to production on their first day.

No programming language is perfect for every situation, and what works for us might not work for everyone. But C# has been a key part of Tracebit’s success so far. If you’ve overlooked C# based on outdated perceptions (like I almost did), I’d definitely recommend taking a closer look!
