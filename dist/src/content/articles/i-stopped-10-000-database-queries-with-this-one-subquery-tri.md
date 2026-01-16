---
title: "I Stopped 10,000+ Database Queries With This One Subquery Trick (My Boss Was Shocked)"
excerpt: "use a SQL subquery in a C# application to eliminate N+1 queries and improve performance"
publishedDate: "2025-05-19"
category: ".NET"
readTime: "15"
image: "https://cdn-images-1.medium.com/max/800/0*5jlJ6LEYwIeODsBR.png"
---

### use a SQL subquery in a C# application to eliminate N+1 queries and improve performance

> I’ll start with a confession: I’m still quite new to the world of performance analysis and optimization.

Monitoring how .NET applications behave in the real world, especially when it comes to database queries and SQL performance, is something I’ve only recently started paying attention to after a deep dive on a recent client project, and I’ve been really enjoying it so far.

But it’s a rabbit hole I’ve just begun to explore, and the deeper I go, the more I realize how much I don’t know.

---

### [Non-members can read the full article here](https://isitvritra101.medium.com/fix-n-1-queries-without-eager-loading-using-sql-subqueries-df396eb7ab79?sk=8fc8d865c8d5d062367720da8b4e742d)

---

> If you spot any gaps in my understanding or obvious mistakes in how I’ve profiled or interpreted the data, I’d really appreciate your feedback. I’m sharing this as someone who’s learning in public, hoping to get better with each post.

## Getting a Single Record from a One-to-Many Relationship

Fetching a single record from a one-to-many relationship is a common task in most applications. Whether you’re retrieving the latest comment on a post, the most recent order for a customer, or the latest activity for a user, this pattern shows up frequently in everyday programming.

However, it can become a performance issue — especially when each parent record has many associated records. The typical solution of using `.Include()` for eager loading helps avoid N+1 queries, but it often comes at the cost of increased memory usage, since it loads ALL associated records into memory, even if you're only interested in one of them.

In this post, we’ll look at a more efficient alternative using SQL subqueries. Instead of eager loading every associated record, we’ll fetch just the specific record you need, like the most recent one, directly within your main query.

> This solution avoids the N+1 query problem, avoids unnecessary memory consumption, and keeps your SQL queries fast.

This post will walk you through a real-world example and show how to use a subquery for better performance.

## Setting Up Example

Our starting point is a standard ASP.NET Core MVC application with a Members page that shows a list of 500 members at the `/Members` endpoint (without pagination). Each row lists the member's name and email. That's it.

> Here’s the new requirement: to add a third column showing each member’s latest activity timestamp, so the management can see the most active members.

This simple request presents some interesting challenges, especially as the number of associated records grows. There are a few different ways to solve it, each with different (speed and memory) performance characteristics. We’ll walk through each approach and compare them.

Let’s start by setting up the necessary data models and seeding our database with realistic data to test performance.

## Tracking Member Activities

We’ll track member activity in a new table, where each row represents an action taken by a member and when it happened. This gives us the data we need to display their most recent activity later.

### Create the Models

```csharp
public class Team
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List Members { get; set; }
}

public class Member
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public int TeamId { get; set; }
    public Team Team { get; set; }
    public List Activities { get; set; }
}

public class Activity
{
    public int Id { get; set; }
    public string Action { get; set; }
    public DateTime CreatedAt { get; set; }
    public int MemberId { get; set; }
    public Member Member { get; set; }
}
```

### DbContext

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) 
        : base(options)
    {
    }

    public DbSet Teams { get; set; }
    public DbSet Members { get; set; }
    public DbSet Activities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity()
            .HasOne(m => m.Team)
            .WithMany(t => t.Members)
            .HasForeignKey(m => m.TeamId);

        modelBuilder.Entity()
            .HasOne(a => a.Member)
            .WithMany(m => m.Activities)
            .HasForeignKey(a => a.MemberId);
    }
}
```

### Seeding

We’ll create a few teams, each with 50 members, and generate 10 activities for every member. This will give us around 5,000 activity records to work with — enough to surface real performance issues.

```csharp
public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();

        // Return if data already exists
        if (context.Teams.Any())
        {
            return;
        }

        var random = new Random();
        var actions = new[] { "created_task", "commented", "uploaded_file" };

        // Create 10 teams
        for (int i = 0; i 1}@example.com",
                    TeamId = team.Id
                };
                context.Members.Add(member);
            }
        }
        context.SaveChanges();

        // Get all members
        var members = context.Members.ToList();

        // Create 10 activities for each member
        foreach (var member in members)
        {
            for (int i = 0; i ();
DbInitializer.Initialize(context);
```

> Now that we’ve set up our data, we’re ready to update the `/Members` page to show each member's latest activity timestamp as a third column.

## The Simplest Solution that Works: But at a Cost

Let’s start with the simplest possible implementation — show each member’s latest activity timestamp as a third column. We’ll do this by querying the activities for each member, sorted in descending order by their creation date, and picking the latest activity.

Let’s add a `GetLatestActivity` method on the Member class which will calculate and return the latest activity in a naive way:

```csharp
public class Member
{
    // ... existing properties

    // This is not part of the model, just a helper method
    public Activity GetLatestActivity(ApplicationDbContext context)
    {
        return context.Activities
            .Where(a => a.MemberId == Id)
            .OrderByDescending(a => a.CreatedAt)
            .FirstOrDefault();
    }
}
```

Finally, let’s update the Index view to display the latest activity:

```xml
@model IEnumerable

    Members

    
        
            
                
                    
                        Name
                    
                    
                        Email
                    
                    
                        Latest Activity
                    
                
            
            
                @foreach (var member in Model)
                {
                    
                        
                            @member.Name
                        
                        
                            @member.Email
                        
                        
                            @{
                                var latestActivity = member.GetLatestActivity(Context.RequestServices.GetRequiredService());
                                if (latestActivity != null)
                                {
                                    @((DateTime.Now - latestActivity.CreatedAt).TotalDays > 1 
                                        ? $"{(int)(DateTime.Now - latestActivity.CreatedAt).TotalDays} days ago" 
                                        : $"{(int)(DateTime.Now - latestActivity.CreatedAt).TotalHours} hours ago")
                                }
                                else
                                {
                                    No activity
                                }
                            }
                        
                    
                }
            
        
    

```

This works as expected. It loads the members and shows their most recent activity in format like “3 hours ago” or “2 days ago.”

However, if you look at the request profiling data, you’ll notice a little problem. To load the 500 members, we’re running 501 SQL queries. Also, the page got slower. On my machine, it takes around 1.5 seconds on average to render the page.

Why? That’s because for every member, Entity Framework runs a separate query to get their latest activity. As we’re running one query to fetch all members, and one query for each member to fetch their activities.

> We’ve just created an N+1 problem

## Memory Profile

Let’s inspect the memory usage by profiling the page:

It reports around 3.8 KB memory and 49 objects allocated. Not bad, actually.

> 💡 Just to be clear, this simple solution is totally fine if you’re only dealing with a handful of records. If you’re paginating and showing 10 or 20 members on a page, you probably won’t notice any performance hit at all. Entity Framework makes it easy to reach for related entities, and sometimes that’s all you need.

But once the number of records starts to grow, the cracks begin to show. What worked fine in development can quietly become an issue in production.

Let’s see if we can reduce the number of SQL queries.

## Attempt 1: Eager Loading — Better Queries, Worse Memory

Let’s fix the N+1 problem with the traditional solution: Eager-loading the associated records.

In the **MembersController**, add the `.Include(m => m.Activities)` method to load all activities up front:

```csharp
public IActionResult Index()
{
    var members = _context.Members
        .Include(m => m.Activities)
        .ToList();
    
    return View(members);
}
```

Next, let’s update the view to use the eager-loaded activities:

```csharp

    @{
        var latestActivity = member.Activities.OrderByDescending(a => a.CreatedAt).FirstOrDefault();
        if (latestActivity != null)
        {
            @((DateTime.Now - latestActivity.CreatedAt).TotalDays > 1 
                ? $"{(int)(DateTime.Now - latestActivity.CreatedAt).TotalDays} days ago" 
                : $"{(int)(DateTime.Now - latestActivity.CreatedAt).TotalHours} hours ago")
        }
        else
        {
            No activity
        }
    }

```

Let’s reload the page and inspect the profiling results.

At first glance, this seems like a win:

- We’ve gone from 501 queries to just 2 — one for members, one for their activities.
- The page now loads in 342 ms, down from 1.5 s, and the queries took 122 ms.

```css

Metric             Before         After
Number of Queries  501            2
Page Load Time     1.5 s          342 ms
Query Time         203 ms         122 ms
```

> **Success?** Well…not exactly. Yes, we did fix our N+1 problem. However, we’ve introduced another, much bigger problem. Let’s examine the memory usage and allocations.

If you remember, earlier our naive solution used up ~3.8 KB of memory and allocated 49 objects.

Now that we’re eager to loadthe activities, we are:

- using ~168 KB of memory, which is over 44x the memory it took before
- allocating 550 objects, which is 501 objects more than before

### **Why?**

Because we’re loading every activity for every member into memory.

> That’s a lot of memory and CPU overhead — just to show one value per row.

**Agreed**, you can mitigate a lot of these issues with techniques like pagination, but in applications running in memory-constrained environments, handling thousands of concurrent users, or processing large datasets in background jobs — these kinds of inefficiencies add up fast.

## When Eager Loading Backfires

This is why I find this example interesting: when we see N+1 queries, our first instinct is often to eager load. And most of the time, that is the right move.

But in this case, eager loading might actually make things worse than simply running extra database queries. You can paginate the number of members you fetch, but Entity Framework will still load all the associated activities for the paginated records — even if you only need one per member.

We’ve fixed the query count. But we’ve quietly created a memory problem that doesn’t scale.

## Should we just cache it?

At this point, you might be wondering: why not just cache the latest activity?

For example, by adding a `LatestActivityId` foreign key on the members table, you can add a one-to-one relationship from Member to Activity. So each member has one latest activity.

```csharp
public class Member
{
    // ... existing properties
    public int? LatestActivityId { get; set; }
    public Activity LatestActivity { get; set; }
}
```

Now, every time a member performs an action, you create a new activity and update the member:

```csharp
var activity = new Activity 
{
    MemberId = member.Id,
    Action = "commented",
    CreatedAt = DateTime.Now
};
_context.Activities.Add(activity);
await _context.SaveChangesAsync();

member.LatestActivityId = activity.Id;
await _context.SaveChangesAsync();
```

This works. And in some cases, this denormalization is exactly what you want — especially if you frequently need the latest activity and don’t mind the overhead of keeping that pointer up to date.

However, caching can get tricky quite fast. You’re also introducing data duplication and increasing the complexity of keeping it accurate over time — especially if activities can be deleted or updated later. As they say:

> There are only two hard things in computer science: cache invalidation, naming things, and off-by-one errors.

Let’s see if we can avoid the complexity by solving this cleanly with SQL — specifically, using subqueries.

## The Better Way: Using a SubQuery

A SQL subquery is just a query inside another SQL query. It is used to perform operations that require multiple steps or complex logic, involving multiple tables.

Some common use cases for subqueries include:

- Filtering records based on data from related tables
- Reducing memory usage by offloading computation to the database
- Conditionally selecting rows without requiring explicit joins or external code logic

In our case, a subquery gives us a clean way to fetch just the latest activity timestamp for each member as another column, directly in the SELECT clause of our main query.

No eager loading, no sorting in C#, no extra memory usage.

Let’s give it a try.

## Subqueries in Action

Let’s implement the subquery-based solution and see how it performs.

First, update the MembersController. We’ll remove the `.Include(m => m.Activities)` eager load and instead use a raw SQL query with a subquery:

```csharp
public IActionResult Index()
{
    var members = _context.Members
        .FromSqlRaw(@"
            SELECT m.Id, m.Name, m.Email, m.TeamId,
                (SELECT TOP 1 a.CreatedAt 
                 FROM Activities a 
                 WHERE a.MemberId = m.Id 
                 ORDER BY a.CreatedAt DESC) as LatestActivityDate
            FROM Members m")
        .ToList();
    
    return View(members);
}
```

However, this approach has a problem — we can’t directly map the `LatestActivityDate` column to our Member entity. In EF Core, we'd need to create a projection or use a dynamic type.

Let’s create a ViewModel for this purpose:

```csharp
public class MemberWithActivityViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime? LatestActivityDate { get; set; }
}
```

And update our controller:

```csharp
public IActionResult Index()
{
    var members = _context.Members
        .Select(m => new MemberWithActivityViewModel
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            LatestActivityDate = _context.Activities
                .Where(a => a.MemberId == m.Id)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => a.CreatedAt)
                .FirstOrDefault()
        })
        .ToList();
    
    return View(members);
}
```

The beauty of this is that Entity Framework Core translates this LINQ query into a SQL query with a subquery. It’s all done in a single round trip to the database.

Let’s update our view to use the new ViewModel:

```xml
@model IEnumerable

    
    
        @foreach (var member in Model)
        {
            
                
                    @member.Name
                
                
                    @member.Email
                
                
                    @if (member.LatestActivityDate.HasValue)
                    {
                        @((DateTime.Now - member.LatestActivityDate.Value).TotalDays > 1 
                            ? $"{(int)(DateTime.Now - member.LatestActivityDate.Value).TotalDays} days ago" 
                            : $"{(int)(DateTime.Now - member.LatestActivityDate.Value).TotalHours} hours ago")
                    }
                    else
                    {
                        No activity
                    }
                
            
        }
    

```

Let’s reload the page and check out the results.

After using a subquery, here’re the results:

- We’re running a single SQL query
- The query took just 6.7 ms to run
- The full page rendered in about 170 ms on average
- Allocating much fewer objects
- Using nearly 24 KB of memory

We’re now running a single SQL query, which is a huge improvement. Here’s the SQL query containing the subquery that is getting executed:

```vbnet
SELECT 
    m.[Id], 
    m.[Name], 
    m.[Email], 
    (SELECT TOP 1 a.[CreatedAt] 
     FROM [Activities] a 
     WHERE a.[MemberId] = m.[Id] 
     ORDER BY a.[CreatedAt] DESC) AS [LatestActivityDate]
FROM [Members] AS m
```

And here’s the memory consumption:

> It performs better on almost every metric.

The subquery performed better on almost every metric, except memory compared to the original naive solution.

## Using a Cleaner LINQ Approach

If you prefer a cleaner LINQ approach without raw SQL, you can create an extension method for easier reuse:

```typescript
public static class MemberExtensions
{
    public static IQueryable WithLatestActivity(this IQueryable members, ApplicationDbContext context)
    {
        return members.Select(m => new MemberWithActivityViewModel
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            LatestActivityDate = context.Activities
                .Where(a => a.MemberId == m.Id)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => a.CreatedAt)
                .FirstOrDefault()
        });
    }
}
```

Then your controller becomes:

```csharp
public IActionResult Index()
{
    var members = _context.Members
        .WithLatestActivity(_context)
        .ToList();
    
    return View(members);
}
```

Ultimately, Entity Framework Core generates the same optimized SQL that’s executed against your database.

Let’s walk through what’s happening in the subquery:

```sql
SELECT TOP 1 a.[CreatedAt] 
FROM [Activities] a 
WHERE a.[MemberId] = m.[Id] 
ORDER BY a.[CreatedAt] DESC
```

We’re:

- Looking in the Activities table
- Filtering by MemberId to match the current row in the outer Members query
- Sorting by CreatedAt in descending order
- Grabbing the most recent one (TOP 1)
- And exposing it as a computed column called LatestActivityDate

The LatestActivityDate is computed on the fly in our subquery. No joins, no eager loading, no extra C# objects — just clean SQL, generated from our LINQ expression.

## Isn’t this N+1 Query Again?

Now, when I first came across subqueries, my first thought was — aren’t we just running multiple queries in the database? That is, we are running a query to find the latest activity query for each member. So have we not simply moved our N+1 query problem from Entity Framework to the database layer?

Well, the answer is quite involved, and to be honest, I am not sure I understand it fully.

Logically, we are running multiple queries in the database to get all members and individual queries to fetch the latest activity. But it’s not like Entity Framework is sending multiple queries to the database. Also, this is exactly the kind of work databases are designed to do — and they’re incredibly good at it. Query planners, indexes, and tight memory management all make subqueries like this very efficient, even at scale.

> *💡 If you want to see exactly what the database will do, you can prefix the query with EXPLAIN and the database will tell you how it will process it (I’m using SQL Server Management Studio for this).*

More importantly, from Entity Framework’s point of view, we’re now making just one database call. That means one network round-trip, far less memory usage, and no extra C# objects being instantiated.

## Conclusion

In this post, we’ve explored three ways to fetch the latest activity for each member:

- **Naive approach**: Query for each member’s latest activity separately (N+1 problem)
- **Eager loading**: Include all activities and filter in memory (memory problem)
- **Subquery**: Let the database do the filtering and return just what we need (best performance)

Of the three, the subquery approach strikes the best balance between query performance and memory usage. It avoids the N+1 problem without incurring the memory overhead of eager loading all activities.

Next time you need to fetch a specific related record (like the latest, greatest, or earliest) from a collection, consider using a subquery approach instead of eager loading the entire collection. Your app will be faster, use less memory, and scale better.

> Do you have other approaches to solving this problem? Let me know in the comments!
