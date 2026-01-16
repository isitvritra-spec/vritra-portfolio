---
title: "AutoMapper and MediatR Going Commercial: What .NET Developers Need to Know Now"
excerpt: "Jimmy Bogard’s Announcement"
publishedDate: "2025-04-03"
category: ".NET"
readTime: "7"
image: "https://cdn-images-1.medium.com/max/800/1*6l3aKr1t5jwDRpfB3tWn9A.jpeg"
---

### Jimmy Bogard’s Announcement

You’ve probably heard the news by now — Jimmy Bogard, the mastermind behind AutoMapper and MediatR, has decided to take these beloved .NET libraries commercial. For senior .NET developers like you, who’ve built countless projects relying on these tools, this shift raises questions. What does it mean for your existing codebases? Will it hit your budget? And where do these libraries go from here?

lets break the wall and find the granule details of this change, break down its implications, and explore what it means for your day-to-day work as an experienced developer.

## The News and What’s Changing

Jimmy Bogard recently announced on his blog that AutoMapper and MediatR are adopting a commercial model.

> Don’t panic!

— the core libraries aren’t disappearing behind a paywall. Both will stay open-source, meaning you can keep using them as you always have. However, Bogard is introducing commercial versions or additional features that’ll come with a price tag. This move is about sustainability, ensuring these libraries can evolve and stay maintained long-term.

**For AutoMapper — **this might mean paid extras like advanced mapping options or performance boosts beyond what the free version offers. Think faster object-to-object mapping or more complex transformation tools. **MediatR — **could see premium features too — maybe better debugging support or integrations with paid platforms. The open-source versions will still work, but the shiny new toys will cost you.

So, what’s the catch for us(.NET developers)? If you’re happy with the current functionality, nothing changes right away. You can keep your existing projects humming along. But if you want those new features — or if your next project demands them — you’ll need to weigh the cost. For teams with tight budgets or solo developers, this could shift how you approach these tools.

Support is another angle to consider. With a commercial offering, Bogard might focus more on paying customers. Community support for the free versions could take a backseat. It’s a pattern we’ve seen before in open-source projects that go this route — think paid support tickets getting priority over GitHub issues. If you lean on forums or community fixes, you might feel that shift over time.

## The upside?

Commercial backing could mean more frequent updates and polished features. AutoMapper’s already a workhorse for mapping DTOs to entities, like this simple example:

```dart
var config = new MapperConfiguration(cfg => cfg.CreateMap());
var mapper = config.CreateMapper();
var userDto = mapper.Map(user);
```

> A commercial version might optimize this further — faster execution or less memory overhead.

A revenue stream might mean more resources for bug fixes and innovation. If you’ve ever cursed a stale pull request or a missing feature, this could be good news.

## The downside?

Cost. If you’re on a large team or managing multiple projects, licensing fees could add up. Performance gains sound great, but they’re not free anymore. And if support skews toward paid users, you might spend more time digging through docs or forums for answers.

Here’s where alternatives come in. AutoMapper’s not the only mapping game in town. You could go manual with custom mappers or try lighter libraries like Mapster or AgileMapper. In a previous article, I explored some of these options and their trade-offs — check it out
[**.NET Object Mapping: How We Process $2M Worth of Stock Trades Every Minute**
*Our object mapping strategy couldn’t handle the scale…*isitvritra101.medium.com](https://isitvritra101.medium.com/net-object-mapping-how-we-process-2m-worth-of-stock-trades-every-minute-ff42b147d0f5)[](https://isitvritra101.medium.com/net-object-mapping-how-we-process-2m-worth-of-stock-trades-every-minute-ff42b147d0f5)
Manual mapping, for instance, gives you full control:

```csharp
var userDto = new UserDto { Id = user.Id, Name = user.Name };
```

It’s more code but zero overhead — no NuGet package, no configuration. It’s tedious for big objects, and you’re on the hook for maintenance….

MediatR has competitors too. Libraries like Brighter or MassTransit offer similar mediator patterns. They might lack MediatR’s simplicity, but they’re worth a look if you’re dodging commercial costs. The choice depends on your project — small apps might not justify the switch, but complex systems could benefit.

Say AutoMapper’s paid version cuts mapping time by 20%. COOL…, but if your app’s issue isn’t mapping, it’s a moot point. I’ve written about performance tweaks in .NET before — things like reducing allocations or caching —
[**10x Faster JSON Serialization: The Overlooked .NET Feature Senior Developers Miss**
*JSON serialization is the silent performance killer in many .NET applications. It’s easy to overlook because it’s such…*isitvritra101.medium.com](https://isitvritra101.medium.com/10x-faster-json-serialization-the-overlooked-net-feature-senior-developers-miss-fa578dc3828f)[](https://isitvritra101.medium.com/10x-faster-json-serialization-the-overlooked-net-feature-senior-developers-miss-fa578dc3828f)[**Performance Costs of Async/Await in .NET: What Senior Developers Need to Know**
*As senior .NET developers, we’ve all used async/await as the go-to pattern for handling asynchronous operations. It’s…*isitvritra101.medium.com](https://isitvritra101.medium.com/performance-costs-of-async-await-in-net-what-senior-developers-need-to-know-185ab74c7acb)[](https://isitvritra101.medium.com/performance-costs-of-async-await-in-net-what-senior-developers-need-to-know-185ab74c7acb)
Often, the open-source versions are fast enough, especially if you profile your code first.

## Where Do We Go From Here?

The commercialization of AutoMapper and MediatR is a turning point. It’s a chance for these libraries to grow, but it comes with strings attached — cost, support shifts, and decisions about whether to pay up or pivot. As a senior .NET developer, you’ve got options. Stick with the free versions if they meet your needs. Explore alternatives if the price doesn’t justify the perks. Or invest in the commercial editions if the features align with your goals.

This isn’t a crisis — it’s a fork in the road. Evaluate your projects, crunch the numbers, and decide what’s best for your team. Bogard’s move might shake up how we use these tools, but it won’t break them. Your experience as a developer gives you the edge to adapt, whether that’s tweaking code, swapping libraries, or paying for the upgrade. Keep an eye on how this plays out — sustainability could mean better tools tomorrow, even if it costs us today….

---

## Strategic Architecture Questions

The more interesting questions revolve around architectural direction:

- Has our industry become too dependent on third-party libraries for functionality that could be considered core concerns?
- Should mapping logic and in-process messaging be externalized to libraries at all?
- Do commercial libraries deliver enough value to justify their cost versus in-house implementations?

## Larger Open Source Sustainability Question

Bogard’s decision reflects a broader conversation happening across the software industry. How do we ensure the sustainability of critical infrastructure code? The idealism of

> **“free forever”**

open source often collides with the reality of maintainer burnout, security responsibilities, and evolving platform requirements.

The facts are undeniable:

- Most enterprise applications depend on dozens or hundreds of open-source libraries
- Many critical libraries are maintained by individuals or small teams with limited resources
- Security vulnerabilities in dependencies create significant business risks
- Few organizations contribute meaningfully (financially or otherwise) to their dependencies

## 📝End Notes

Jimmy Bogard’s decision to commercialize AutoMapper and MediatR represents a natural evolution in the lifecycle of successful open-source projects. Rather than viewing this change with alarm, forward-thinking development teams will recognize it as an opportunity to reevaluate architecture decisions and potentially improve their codebases.

Whether you choose to purchase licenses, migrate to alternatives, or implement custom solutions, the reflection process itself will likely yield insights into your system’s design and dependencies.

> For the broader .NET ecosystem, this moment invites us to reconsider our collective approach to open-source sustainability and the true cost of the “free” tools we’ve come to depend on.

---

Hope so you like it — here is my research button 🔹
