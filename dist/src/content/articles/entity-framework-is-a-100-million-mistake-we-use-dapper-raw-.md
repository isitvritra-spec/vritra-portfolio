---
title: "Entity Framework is a $100 Million Mistake ( We Use Dapper + Raw SQL)"
excerpt: "Your database queries are costing you users."
publishedDate: "2025-08-23"
category: ".NET"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/1200/1*_7C-lbVBZ59fHlg-CYGHJg.png"
---

### Your database queries are costing you users.

I know because I watched 847 users abandon the fintech app that I was working on in one week. They’d click **“View Portfolio”** and just… leave. Gone. $50K in potential revenue vanished. (Client was just yelling, but you already know only I can fix it, so I was chill, but..

The Issue: Every single abandonment happened at the same spot — when our app took more than 8 seconds to load their portfolio data. Eight seconds of spinning loader. Eight seconds of wondering if the app was broken. Eight seconds are too long, man, and for the trader it can be a scary dream…

---

Well, I found that it’s been a long time since we've been using EF Core, and actually, I didn’t do that, but it was juniors who wrote code sometimes, and my coffee just didn’t allow me to look before merging it. Anyway, maybe he was thinking Microsoft’s “Supa ORM” would handle everything.

> it was generating SQL queries so bloated and inefficient that our database server was choking on what should have been simple data retrieval.

But here’s what nobody tells you about EF vs Dapper vs Raw SQL — and why still developers are choosing wrong.

**Here’s the thing **— Entity Framework is like having a really smart assistant who overthinks everything. You ask for a simple report, and they spend 30 minutes creating a presentation with charts, graphs, and footnotes. Sometimes you just need the damn numbers mann..

**Dapper**, on the other hand, talk directly to your database. You write exactly what you want, and it gives you exactly that. No extra shit wraps, no “let me optimize this for you,” just pure speed…GOD SPEED>>>

---

## Why This Performance Thing Actually Matters to Your App?

Satyam Nadella ask me this.. and I replied back with honesty,

*When your app is slow, users leave. It’s that simple.*

In fintech, every second matters. If someone’s trying to buy or sell stocks and your app is loading like it’s 2005, they’ll switch to Robinhood or TD Ameritrade in a heartbeat. I learned this the hard way when three enterprise clients complained about our **“slothiest performance”** in the same week.

Most developers think performance optimization is this complex, advanced topic. But the truth is, choosing the right data access can play a lot. Both will get you there, but one will do it much faster.

---

## What You’re Missing About EF Core vs Dapper

I am 100% sure that nobody will tell you in those coding bootcamps or university courses —

**Entity Framework** is Microsoft’s “supa” solution. It converts your C# objects into SQL automatically.

Write C# code, and EF handles all the database complexity for you. The problem is, this supa solution comes with a massive performance cost.

**Dapper** is the opposite. It’s a “micro-ORM” that basically says, “You write the SQL, I’ll just map the results to your objects.” No magic, no automatic query generation, just raw speed.

**Raw SQL** is exactly what it sounds like — you’re writing SQL queries directly and handling everything yourself.

The thing is, most developers pissed off when writing SQL. They think it’s hard or outdated. But the best-performing apps I’ve seen all use either **Dapper or raw SQL **for their critical queries.

---

## How This Actually Helps Your Application

When I switched my portfolio calculations from Entity Framework to Dapper, here’s what happened —

**Query Speed:** 12 seconds became 1.2 seconds. That’s 10x faster. right?

**Memory Usage:** Dropped from 2.1GB to 400MB on our main server.

**Database Load:** CPU usage on our database server went from 85% to 23%.

**User Complaints:** Went from 15–20 per week to maybe 2–3 per month.

> Instead of trying to figure out EF’s complex LINQ expressions, I just wrote straightforward SQL queries that did exactly what I needed.

---

## Simple Way to Get Started (No Complex Setup)

You don’t need to rewrite your entire application. Start small:

**Step 1:** Find your slowest query (the one that’s making users wait)

**Step 2:** Install Dapper in your project:

```typescript
Install-Package Dapper
```

**Step 3:** Replace your EF query with a simple Dapper call — **that’s it!**

```javascript
// Instead of this EF mess:
var positions = context.Positions
    .Include(p => p.Stock)
    .Where(p => p.UserId == userId)
    .ToList();

// Write this with Dapper:
var positions = connection.Query
(
    "SELECT * FROM Positions WHERE UserId = @UserId", 
    new { UserId = userId }
).ToList();
```

> Same result, way faster execution.
*and yea! one more thing! EF core is not the prisoner.. it can perform well in some cases —*

---

## 🔺When Each Option Makes Sense

### **Use Entity Framework when:**

- You’re building simple CRUD applications
- Your team is scared of writing SQL
- Performance isn’t critical (internal tools, admin panels)
- You have complex relationships and EF’s tracking helps

### **Use Dapper when:**

- Performance matters (customer-facing features)
- You have complex queries that EF makes messy
- You want control over your SQL
- You’re dealing with large datasets

### **Use Raw SQL when:**

- You need absolute maximum performance
- You’re doing complex reporting or analytics
- You have database-specific features to use
- You’re comfortable managing connections yourself

## 🔻BUT, Where Each Falls Short

**Entity Framework Problems:**

- Can generate terrible SQL queries
- Uses way more memory than needed
- Harder to optimize complex operations
- Sometimes creates N+1 query problems

**Dapper Limitations:**

- You need to know SQL (but honestly, you should anyway)
- No automatic change tracking
- More code for simple operations
- No lazy loading magic

**Raw SQL Issues:**

- Most verbose approach
- You handle all connection management
- Easy to create security holes if not careful
- No compile-time checking of queries

---

## **▪️Read my Diary (ifw)**

*I spent two years trying to make Entity Framework fast enough for our fintech app. I read every performance guide, implemented every optimization trick, and hired consultants who promised they could “tune” our EF queries.*

*I was treating the symptoms, not the disease.*

*The day I rewrote our core portfolio queries in Dapper, everything changed. Our app went from “pretty slow” to “surprisingly fast.” Our database bills dropped. Our users stopped complaining.*

*Yes, I had to write more SQL. Yes, I had to think more about database design. But you know what? I became a better developer because of it.*

*But, Entity Framework has its place — I still use it for admin features and simple data entry forms. But for anything that users actually care about? Anything that affects their experience? I reach for Dapper every single time.*

Thank You 🖤
