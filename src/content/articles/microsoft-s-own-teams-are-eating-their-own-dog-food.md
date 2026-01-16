---
title: "Microsoft’s own teams are eating their own dog food"
excerpt: "How the .NET community is challenging everything we thought we knew about building software"
publishedDate: "2025-07-23"
category: ".NET"
readTime: "8"
image: "https://cdn-images-1.medium.com/max/1200/1*uM_Si5L8h7WvfTTR9gNWzg.png"
---

### How the .NET community is challenging everything we thought we knew about building software

**Microsoft Copilot Backend** was built with .NET Aspire by a team of just 5 developers in 4 months. **Xbox Services** used the same approach for their large-scale modernization. **Fidelity Investments** built their Active Trader Pro on .NET MAUI, handling real-time financial data without the complexity of a distributed architecture.

> and they are fuckin production systems handling real users, real money, and real business requirements.

[*Free To Read Here*](https://isitvritra101.medium.com/microsofts-own-teams-are-eating-their-own-dog-food-aee96f300efb?sk=3f444930d262933332f1f20564ccf195)

.NET architecture is changing day by day and I don’t want you to miss anything.. not even a bit. So I read tons of articles, watched too many podcast and followed and looks over the tweet of MVP and what I found is clearly a gold for people who are looking for ‘What’s Happening Update me’ kinda articles

---

## ‘Performance over Purity’

**David Fowler**, the Distinguished Engineer who literally helps build .NET, has been brutally honest about what he sees in real-world applications —

> “I wrote this guidance after years of trying to help developers diagnose performance issues in their code bases. [LinkedIn](https://www.linkedin.com/posts/davidfowl_github-davidfowlaspnetcorediagnosticscenarios-activity-7102720818299748352-nDws) Naively storing a large request or response body into a single byte[] or string may result in quickly running out of space in the LOH and may cause performance issues.” [GitHub](https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AspNetCoreGuidance.md)

philospically(if its a word) What he wanna say is

> **your beautiful, theoretically pure architecture means nothing if your app crawls**.

Fowler’s `AspNetCoreDiagnosticScenarios` repository is a greatest hits of architectural mistakes but fail spectacularly in production. The kind of code that passes code reviews but fails users. He was not giving a technical advice actually — it’s the implicit message that *‘You are prioritizing ****what works**** over ****what’s textbook correct***

---

## Jimmy Bogard’s — The Man Who Built Our Tools Questions Our Foundations

While Microsoft was questioning performance assumptions, **Jimmy Bogard** dropped a F-BOMB that shook the entire ecosystem. The creator of **AutoMapper** and **MediatR** — tools that have shaped how millions of developers build .NET applications — made two announcements that changed everything.

First, he commercialized his most popular open-source projects. But more importantly, he started questioning the very architectural patterns those tools enabled:

*“A traditional layered/onion/clean architecture is monolithic in its approach… The problem is this approach/architecture is really only appropriate in a minority of the typical requests in a system.”*

Think about that for a moment Guys…. The person whose tools enabled Clean Architecture at scale is telling us we’re using it wrong most of the time.

---

## Vertical Slice Revolution

Bogard’s alternative pattern is a complete mindset shift. Instead of organizing code by technical concerns (controllers, services, repositories), **Vertical Slice Architecture** organizes by business features. Each slice contains everything needed for a specific user capability.

for Juniors think like thiss… Traditional Clean Architecture might give you —

- A `ProductController` that talks to
- A `ProductService` that uses
- A `ProductRepository` that queries
- A `Product` entity

Vertical Slice Architecture gives you:

- A `GetProductDetails` slice with its own query, handler, and view model
- An `UpdateProductPrice` slice with its own command and validation
- A `DeleteProduct` slice with its own authorization and business rules

Each slice is independent, focused, and contains exactly what it needs — nothing more, nothing less.

> *“Controller MUST talk to a Service that MUST use a Repository”* represents cargo cult programming rather than sound architectural thinking, Bogard argues. And honestly? He has a point.

---

## — Hangover?

When we all thought microservices were the answer to everything? **Steve Smith**, Microsoft MVP and longtime Clean Architecture advocate, certainly does. And he’s got some regrets —

> “What do you do when you find yourself in microservice hell? How do you keep the gains you (hopefully) made in breaking up your legacy ball of mud, without having to constantly contend with a massively distributed system? Migrate to a modular monolith.”

Oh just don’t look from his opinion.. thought like your own opinion — it’s reflecting a industry-wide awakening. The same companies that rushed to microservices are quietly migrating back to monoliths!? means Fccck..

These are **modular monoliths** — architectures that give you the benefits of microservices (clear boundaries, independent features) without the operational shitss(service discovery, distributed transactions, network calls for everything).

Smith calls it the** “Goldilocks architecture” **— not too coupled like traditional monoliths, not too distributed like microservices, but just right for most teams…. (Opinion required in comments👀 )

---

## Let’s Talk About Team Size

Listen! most of us aren’t building Netflix. We’re not Amazon. We aren’t hundreds of developers who need to work independently on different services. We are teams of 5–15 people trying to build and maintain a business application Right?

For these teams, microservices aren’t just overkill !!— they’re actively harmful. Every service boundary becomes a potential failure point. Every database call becomes a network call hell! Every deployment required coordination.

> In modular monolith, You get clean boundaries between business domains, but everything runs in the same process, shares the same database transaction, and deploys as a single unit.

---

## Find Anti-Patterns

**Derek Comartin** from **CodeOpinion **examine why our well-intentioned architectural decisions go wrong —

> “One of the most common and very overlooked issues when writing a distributed system is consistency. You have one thing happening in one part of your system that triggers something else to happen in another part of the system, except it doesn’t happen. And that can be a nightmare to deal with.”

Sick Truth — Architecture solves specific problems, but when applied blindly, they create new ones.

Take the **Repository pattern**. In theory, it provides a clean abstraction over data access. But When you apply it blindly — It often becomes a leaky abstraction that hides the best practices of ORM while adding complexity.

> I’m really not a fan of repositories, mainly because they hide the important details of the underlying persistence mechanism.”

When you’re using **Entity Framework Core(Most Hated but Mostly Used)**, you already have a repository pattern — `DbContext` acts as your unit of work, and `DbSet<T>` acts as your repository. Adding another layer of repository interfaces often just creates busy work without meaningful benefits

## Ah! Let’s talk about Testing.

**Matthew Jeorrett** advocates for “subcutaneous testing” — a middle ground between unit tests and full integration tests —

*“You duck under the authentication and validation, and you’ve got to the point where you’ve got your DTO that’s been passed in and deserialized. And then you test everything else down to the database and back.”*

The idea is simple — skip the parts that are hard to test (authentication, HTTP concerns) and test everything else as an integrated unit. It’s faster than full end-to-end tests but more realistic than isolated unit tests.

But here’s the point to be noted — even Jeorrett admitsthat it has limitations — *“Although it was an interesting path to go down, I think on reflection, end-to-end tests probably are preferable.”*

This kind of honest self-reflection is everywhere in the 2025 .NET community. Experts are willing to admit when their ideas don’t work as well as hoped.

---

I know everyone was waiting for this topic —

## Performance

**Agoda’s Engineering Team** dropped some uncomfortable truths about async programming —

> “Async does not automatically make your application faster. In fact, in lower traffic web apps, you will sometimes see a small dip in performance (usually less than 1%), due to the introduction of state-machines.”

This challenges the “async everything” mentality that has dominated .NET development. Sometimes, the simple synchronous solution is not just easier to understand — it’s actually faster.

Microsoft’s own research backs this up. The **Web Frameworks Benchmark results for 2024** show that:

- Minimal API patterns consistently outperform heavily layered architectures
- Simple approaches often beat complex ones
- Over-abstraction introduces measurable overhead

---

## Microsoft’s own teams are eating their own dog food

**Microsoft Copilot Backend** was built with .NET Aspire by a team of just 5 developers in 4 months. **Xbox Services** used the same approach for their large-scale modernization. **Fidelity Investments** built their Active Trader Pro on .NET MAUI, handling real-time financial data without the complexity of a distributed architecture.

> and they are fuckin production systems handling real users, real money, and real business requirements.

---

## AI Factor

There’s one more trend reshaping everything — AI integration. Microsoft’s Extensions.AI library provides standard APIs for AI services, but the architectural implications run deeper.

AI workloads have different characteristics than traditional web applications. They’re often batch-oriented, require different scaling patterns, and have unpredictable resource requirements. The rigid layered architectures that worked for CRUD applications might not be the best fit for AI-enhanced systems.

---

## End Note 🖤

As Rico Fritzsche puts it: *“The real key is pragmatism: extract genuinely shared logic, but never force abstractions prematurely.”*

This is the mature .NET ecosystem talking. We’ve moved beyond the phase where every new pattern was automatically better than the last. We’re in the phase where we choose tools based on their fitness for purpose, not their novelty or complexity.
