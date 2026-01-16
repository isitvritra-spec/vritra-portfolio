---
title: "Use DICTIONARY!! but why?? A Senior Developer’s Performance Guide"
excerpt: "In software development, performance isn’t just a luxury — it’s a necessity. As senior developers, we often face the crucial decision of…"
publishedDate: "2024-08-19"
category: ".NET"
readTime: "9"
image: "https://cdn-images-1.medium.com/max/800/1*KfvCfzt5_L0sNClysJ4SrA.gif"
---

In software development, performance isn’t just a luxury — it’s a necessity. As senior developers, we often face the crucial decision of selecting the most appropriate data structure for our tasks. The choice between **List<T>**, **Dictionary<TKey, TValue>**, and **HashSet<T>** can make or break an application’s performance, especially at scale. This article aims to provide you with the insights needed to make informed decisions, backed by performance metrics and real-world scenarios

We’ll explore when to use each, their performance characteristics, and how to optimize them for peak efficiency

## LIST<T>

Picture a Swiss Army knife. Versatile, right? That’s our List! It’s the go-to tool for when you need a bit of everything.

> well-suited for scenarios requiring ordered collections and frequent positional access

## What’s it good for?

- Storing a collection of items in a specific order
- Adding or removing items from any position
- Accessing items by their index

## Practical Application: To-Do List App

Consider a task management system where order is crucial:

```csharp
public class Task
{
    public string Description { get; set; }
    public bool IsCompleted { get; set; }
}

public class ToDoList
{
    private List tasks = new List();

    public void AddTask(string description)
    {
        tasks.Add(new Task { Description = description, IsCompleted = false });
    }

    public void CompleteTask(int index)
    {
        if (index >= 0 && index  GetIncompleteTasks()
    {
        return tasks.Where(t => !t.IsCompleted).ToList();
    }
}
```

Under the hood, List uses a dynamic array. It’s like a magical expanding suitcase — it grows as you add more items. But here’s the kicker!

when it grows, it doesn’t just add one more slot. ***it doubles in size! ***💨

This means adding items is usually super fast (O(1)), but occasionally when it needs to grow, it takes a bit longer (O(n)). On average, though, it’s still pretty zippy!

## so, **When to use List<T>?**

- When you need to maintain order
- When you frequently access items by their position
- When you’re dealing with a collection that changes size often

## **and, When to think twice?**

- If you’re constantly searching for items by their value (not index)
- If you’re dealing with millions of items and need lightning-fast lookups!!

## Dictionary<TKey, TValue>

> 🪶 Optimizing for Lookup Speed

When rapid key-based retrieval is a priority, Dictionary<TKey, TValue> emerges as a powerful solution.

*Need to find something? Zap! You’re there instantly. 🌠*

## What’s it good for?

- Lightning-fast lookups by key
- Storing key-value pairs
- Checking if a key exists without iterating through everything

## Practical Application: User Profile Caching

In a high-traffic application, efficient user profile retrieval is critical. Let’s say we’re building a user profile system for our social media app. We want to access user profiles super fast by their ID.

```csharp
public class UserProfile
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
}

public class UserProfileCache
{
    private Dictionary profileCache = new Dictionary();

    public void AddOrUpdateProfile(UserProfile profile)
    {
        profileCache[profile.Id] = profile;
    }

    public UserProfile GetProfile(int userId)
    {
        return profileCache.TryGetValue(userId, out var profile) ? profile : null;
    }

    public bool ProfileExists(int userId)
    {
        return profileCache.ContainsKey(userId);
    }
}
```

**Dictionary<TKey, TValue>** uses a hash table under the hood. Think of it as a super-organized library where every book (value) has a unique call number (key). The librarian (hash function) can tell you exactly where to find any book almost instantly!

> enabling O(1) average-case time complexity for key-based operations

## so, When to use Dictionary

- When you need blazing-fast lookups
- When you’re working with key-value pairs
- When you need to check for existence quickly

## and, When to think twice

- If you need to maintain a specific order (use SortedDictionary<TKey, TValue> instead)
- If you’re dealing with a small number of items (the overhead might not be worth it)

## HashSet<T>

> 🪶 Efficient Uniqueness and Set Operations

Imagine a nightclub where every person must be unique. That’s HashSet. It’s the bouncer that ensures no duplicates get in. 🚫👥

> It excels in scenarios where maintaining a collection of unique elements is paramount

## What’s it good for?

- Storing a collection of unique items
- Checking for membership super fast
- Set operations like union, intersection, and difference

## Practical Application: Unique Identifier Tracking

Let’s build a system to track unique hashtags used in our social media app.

```csharp
public class HashtagTracker
{
    private HashSet uniqueHashtags = new HashSet(StringComparer.OrdinalIgnoreCase);

    public bool AddHashtag(string hashtag)
    {
        return uniqueHashtags.Add(hashtag);
    }

    public bool HasBeenUsed(string hashtag)
    {
        return uniqueHashtags.Contains(hashtag);
    }

    public int UniqueHashtagCount => uniqueHashtags.Count;

    public IEnumerable GetCommonHashtags(HashtagTracker other)
    {
        return uniqueHashtags.Intersect(other.uniqueHashtags, StringComparer.OrdinalIgnoreCase);
    }
}
```

HashSet is built on the same principle as Dictionary<TKey, TValue>, but it only stores keys, no values

## so, When to use HashSet

- When you need to ensure uniqueness
- When you need fast membership tests
- When you’re performing set operations

## and, When to think twice

- If you need to associate values with your items (use Dictionary<TKey, TValue>)
- If order matters (consider SortedSet)

## :: Performance Analysis::

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using System;
using System.Collections.Generic;

[MemoryDiagnoser]
public class DataStructureBenchmarks
{
    private const int N = 1_000_000;
    private List _list;
    private Dictionary _dict;
    private HashSet _set;

    [GlobalSetup]
    public void Setup()
    {
        _list = new List(N);
        _dict = new Dictionary(N);
        _set = new HashSet(N);

        var random = new Random(42);
        for (int i = 0; i  _list.Contains(N / 2);

    [Benchmark]
    public bool DictContains() => _dict.ContainsKey(N / 2);

    [Benchmark]
    public bool SetContains() => _set.Contains(N / 2);

    [Benchmark]
    public void ListAdd() => _list.Add(N + 1);

    [Benchmark]
    public void DictAdd() => _dict[N + 1] = true;

    [Benchmark]
    public void SetAdd() => _set.Add(N + 1);
}

public class Program
{
    public static void Main(string[] args)
    {
        var summary = BenchmarkRunner.Run();
    }
}
```

```csharp

|      Method  |            Mean |         Error |        StdDev |   Gen 0 | Allocated |
|------------  |----------------:|--------------:|--------------:|--------:|----------:|
| ListContains | 2,924,483.95 ns | 57,638.858 ns | 91,235.298 ns |       - |      40 B |
| DictContains |        22.36 ns |      0.479 ns |      0.787 ns |       - |         - |
|  SetContains |        19.84 ns |      0.424 ns |      0.635 ns |       - |         - |
|     ListAdd  |        27.59 ns |      0.589 ns |      0.918 ns |  0.0153 |      32 B |
|     DictAdd  |        31.84 ns |      0.681 ns |      1.061 ns |  0.0153 |      32 B |
|      SetAdd  |        31.47 ns |      0.673 ns |      1.048 ns |  0.0153 |      32 B |

```

## Analysis

**For Lookup Operations** Dictionary<TKey, TValue> and HashSet<T> demonstrate superior performance, with near-constant time complexity. List<T> exhibits linear time complexity, making it less suitable for large-scale lookup operations.

**For Insertion Operations** all three structures show comparable performance for single insertions. However, List<T> may experience occasional performance hits due to internal array resizing.

**For Memory Utilization** List<T> proves to be the most memory-efficient per element. Dictionary<TKey, TValue> and HashSet<T> trade some memory efficiency for their speed advantages in lookup operations.

Alright, hotshots! 🔥 You’ve mastered the basics, now let’s kick it up a notch with some advanced techniques

## Advanced Techniques: Fine-tuning for Peak Performance

- **Custom Equality Comparers: Your Own Comparison Logic**

Sometimes, you need your Dictionary<TKey, TValue> or HashSet to compare things in a special way. so implement** IEqualityComparer<T>** to define custom equality and hash code generation:

```csharp
public class CaseInsensitiveComparer : IEqualityComparer
{
    public bool Equals(string x, string y) => string.Equals(x, y, StringComparison.OrdinalIgnoreCase);
    public int GetHashCode(string obj) => obj.ToLowerInvariant().GetHashCode();
}

var uniqueStrings = new HashSet(new CaseInsensitiveComparer());
uniqueStrings.Add("CSharp");
Console.WriteLine(uniqueStrings.Contains("csharp")); // True
```

### 2. Capacity Planning: Optimizing Memory Allocation

When you know you’re going to add a ton of items, give your data structures a heads-up:

```csharp
var bigList = new List(1_000_000); // Preallocate for better performance
var bigDict = new Dictionary(1_000_000);
```

> This strategy minimizes reallocation overhead, particularly beneficial for large collections.

**3. ConcurrentDictionary<TKey, TValue>: Thread-Safe Operations**

For multi-threaded scenarios

```cpp
private ConcurrentDictionary _userCache = new ConcurrentDictionary();

public UserProfile GetOrAddUser(int userId, Func createProfile)
{
    return _userCache.GetOrAdd(userId, createProfile);
}
```

## **let’s Case Study: **Architecting a High-Performance Social Media Backend

Let’s apply our knowledge to design a performant backend for a social media platform:

```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public HashSet Followers { get; set; } = new HashSet();
    public HashSet Following { get; set; } = new HashSet();
}

public class Post
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
}

public class SocialMediaBackend
{
    private Dictionary _users = new Dictionary();
    private List
 _posts = new List();
    private Dictionary> _hashtags = new Dictionary>(StringComparer.OrdinalIgnoreCase);

    public void AddUser(User user)
    {
        _users[user.Id] = user;
    }

    public void AddPost(Post post)
    {
        _posts.Add(post);
        // Extract and index hashtags
        foreach (var word in post.Content.Split())
        {
            if (word.StartsWith("#"))
            {
                if (!_hashtags.TryGetValue(word, out var postIds))
                {
                    postIds = new HashSet();
                    _hashtags[word] = postIds;
                }
                postIds.Add(post.Id);
            }
        }
    }

    public IEnumerable GetUserFeed(int userId)
    {
        if (_users.TryGetValue(userId, out var user))
        {
            return _posts.Where(p => user.Following.Contains(p.UserId))
                         .OrderByDescending(p => p.Timestamp);
        }
        return Enumerable.Empty();
    }

    public IEnumerable GetPostsByHashtag(string hashtag)
    {
        if (_hashtags.TryGetValue(hashtag, out var postIds))
        {
            return _posts.Where(p => postIds.Contains(p.Id))
                         .OrderByDescending(p => p.Timestamp);
        }
        return Enumerable.Empty();
    }
}
```

- Dictionary<TKey, TValue> for rapid user and hashtag lookups
- HashSet<T> for efficient follower/following relationships and hashtag-post associations
- List<T> for maintaining post order and facilitating efficient sorting

## END NOTE :
The choice of data structure can significantly impact your application’s performance and scalability. As senior developers, our responsibility is to make informed decisions based on the specific requirements and constraints of each scenario.

- Use List<T> when order matters and you need frequent positional access.
- Opt for Dictionary<TKey, TValue> when fast key-based lookups are crucial.
- Choose HashSet<T> for maintaining unique collections and performing set operations.

> Remember, the best choice often depends on the specific use case, expected data volume, and access patterns. Regular profiling and benchmarking are essential to ensure your choices align with your application’s performance goals.

By mastering these data structures and understanding their strengths and limitations, you’re well-equipped to architect high-performance C# applications that can scale to meet the demands of modern software systems.

## Those who wanna say Thanks | Buy me a Coffee🖤
