---
title: "My Client Asked Why I Charge $180/Hour When Bubble.io is Free — So I Built Their Dashboard in Both"
excerpt: "So my client sends me this Slack message —"
publishedDate: "2025-10-31"
category: "AI"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/800/1*Ec2tbIMnzmgSqGavunYD6Q.png"
---

### So my client sends me this Slack message —

> “Hey, I’ve been reading about Bubble.io. don’t you think **$180/hr**. is bit too much, when I can build this myself for free?”

**Fair question, honestly.**

I could’ve sent him a long explanation about scalability and vendor lock-in and all that shit. But instead I said —

> “Let me build your dashboard in both. Then you decide.”

that was a bold move cuz AI literally sometime fucked you up…but I know where it lags without human.. :) btw ***He agreed***.

## What Even Is Bubble.io?

For people who don’t know — **Bubble **is a** “no-code” **platform. Basically, you drag and drop elements on a screen, connect them to a database, set up some workflows, and boom — you have a working web app.

### No JavaScript. No backend code. No deployment headaches.

They promise that** WE Build in hours what would take developers weeks…**And honestly? Over 4.6 million apps have been built on Bubble as of 2025. So clearly, it works for a lot of people.

My client saw the YouTube ads, the success stories, and thought —

> “Why am I paying a developer when this exists?”

Can’t blame him :)

---

## What He Actually Wanted

He’s building a SaaS product. Needs an admin dashboard to manage his users.

### The requirements —

- Display around 847 users (growing to potentially 10,000+)
- Real-time activity tracking
- Filtering by user type, subscription status, activity level
- Export data to CSV
- Stripe payment integration for subscription management
- User analytics and graphs

> Pretty standard stuff. Nothing crazy.

**In Next.js with Supabase?** This would take me about 18–20 hours of focused work.

But I was curious. *Could Bubble really do this?*

---

## Building It in Bubble

Well, I signed up. Free account. No credit card needed.

The interface is actually… **nice**? Drag and drop. **Create a “User” data type. Add fields. Build the UI**. Within a couple of hours, I had a working login system. User list displaying. Basic filtering working.

> I’m not gonna lie — I was impressed.

The tutorials showed building login/signup in literally 4 minutes. That part is real. **It’s FAST for basic CRUD operations. **By the end of my build session, I had something that looked professional. It worked. My client could technically use it right now.

Around 6 hours of time and my thought was

> “Damn, am I wasting my career writing code?”

---

## Then The Problems Started

The Stripe integration. That’s where things got weird.

Bubble has plugins for Stripe. But I needed custom webhook handling for subscription events. **Cancel, upgrade, payment failed — all that**.

**Bubble only supports JavaScript for custom code**. No Python, no backend flexibility. The plugin marketplace didn’t have exactly what I needed. I could hack it together, but it felt… brittle. Like I’m fighting the platform instead of working with it.

Then I checked something that made my stomach drop.

### Can I export this code?

No. You can’t. If you build on Bubble, you’re locked in. Forever. Want to migrate? Rebuild from scratch. **lol**

> **That’s the first red flag.**

### Talking about the Performance

I started digging into forums. Looking for real users at scale.

Found a post from January 2025 —

> “I’m pulling just 20 items and it’s consistently slow and laggy”

Multiple users reporting performance issues as apps grow, especially with heavy data operations.

My client has 847 users now. But he’s planning for 10,000+. What happens then?

With custom code, I can optimize queries, add caching, use CDN for assets. With Bubble? I’m limited to their infrastructure and optimization capabilities.

---

## 🕸️Let’s be Real Cost

Here’s where it gets interesting.

> Bubble is “free” — but not really.

> Free plan gives you 50,000 Workload Units (WU) per month. Starter plan is $32/month for 175,000 WU. Growth plan is $119/month for 250,000 WU.

### What the hell is a Workload Unit?

Basically, every database operation, every API call, every workflow execution costs WUs. Go over your monthly limit? **They charge $0.30 per 1,000 additional WUs.**

I found a Reddit thread from January 2025 where someone’s marketplace app became **“financially unsustainable due to high WU consumption”**

I did rough math for my client’s use case. With 10,000 active users doing regular operations?

> **~ $400–600** per month in WU overages alone. 😮‍💨 . Over 3 years? That’s **$14,400 to $21,600.**

> My Next.js solution? Fixed $75/month (Vercel + Supabase). Total 3-year cost: $2,700.

### Suddenly, my $180/hour doesn’t look that expensive.

---

## 🕸️Building The Next.js Version

I built the exact same dashboard in **Next.js** with **Supabase **as the backend. Took me around 18 hours total. ***Three times longer than Bubble.***

But what I got is,

- Full control over every query
- Can optimize for 100,000+ users easily
- Fixed monthly hosting cost
- Can hire any React developer to maintain it
- Can export, migrate, modify anything
- No vendor lock-in
- No unpredictable **“Workload Unit”** charges

> The code is mine. The architecture is mine. The scaling strategy is mine.

---

## 🕸️My Honest Take on Low-Code

I’m not anti-Bubble. I’m not anti-low-code. **4.6 million apps **built on Bubble proves it works for a lot of people. And it should.

### Low-code is perfect for —

- MVPs that need quick validation before committing serious resources
- Internal tools with under 1,000 users and simple workflows
- Non-technical founders testing ideas
- Projects where speed to market matters more than long-term flexibility

### **But it’s NOT for —**

- Apps expected to scale beyond mid-size
- Products where performance is critical
- Cases requiring on-premise hosting or strict data control
- When you need complex custom logic
- Native mobile apps (Bubble’s mobile support is still limited and in beta)

> The real question isn’t “Should I use low-code?”

---

## 🕸️Finally With Client —

I showed him both versions running side by side. Bubble version worked. Looked good. Could deploy it today while Next.js version also worked. Looked identical.** Took 3x longer to build.**

Then I showed him the numbers **:) **| He stared at the screen for a minute and with no words I got an email

> *“You can continue working on project. I don’t want dependency over my code”*

---

## 🕸️Charging $180/Hour ?

Remember Man, *When clients hire me, they’re not just paying for code. But *paying for —

*Bubble is great. But it’s a tool for a specific job. ***And my job?** Building products that scale, that clients own, that don’t come with hidden costs three years down the line.

My client chose Next.js. We deployed it.

*He’s happy. His users are happy. And his AWS bill is predictable.*

**That’s worth $180/hour :)**

---

*thank you *🖤
