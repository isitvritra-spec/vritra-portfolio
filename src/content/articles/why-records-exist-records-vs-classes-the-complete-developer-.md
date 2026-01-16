---
title: "Why Records Exist? | Records vs Classes | The Complete Developer’s Decision Guide [2024]"
excerpt: "TL;DR: Records are specialized reference types in C# designed for holding immutable data, with automatic value-based equality and…"
publishedDate: "2024-11-11"
category: ".NET"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/800/0*IX-7rPELH_stibJi.png"
---

> TL;DR: Records are specialized reference types in C# designed for holding immutable data, with automatic value-based equality and simplified syntax. While they have a tiny performance overhead compared to classes, they insanely reduce boilerplate code and make data handling safer!
They’re perfect for DTOs, API responses, and domain events.

## What Are Records Really? Let’s Clear the Confusion

Think of records as a drink menu that lists specific cocktails with their ingredients, while classes are like a mixology school that trains you to create endless drink variations. Before going technical, let’s understand what problem records solve:

- The old way with classes — look at all this code just to hold some data!

```csharp

public class PersonClass
{
    public string FirstName { get; init; }
    public string LastName { get; init; }
    
    public PersonClass(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    // Need to implement equality to compare data
    public override bool Equals(object? obj)
    {
        if (obj is not PersonClass other) return false;
        return FirstName == other.FirstName && 
               LastName == other.LastName;
    }

    // Need this for collections
    public override int GetHashCode()
    {
        return HashCode.Combine(FirstName, LastName);
    }

    // Need this for debugging
    public override string ToString()
    {
        return $"Person {{ FirstName = {FirstName}, LastName = {LastName} }}";
    }
}
```

- The new way with records — ***same exact functionality***!

```csharp
public record PersonRecord(string FirstName, string LastName);
```

> 📝 we will continue with this same class and record example!

## Why Records Exist?

Records were introduced because developers spent too much time writing repetitive code just to handle data! just kidding..
Here’s what you get automatically with records:

- **Immutability**

```csharp
var person = new PersonRecord("John", "Doe");

person.FirstName = "Jane";  // This won't compile:

// Instead, you create a new record with changes:
var updatedPerson = person with { FirstName = "Jane" };  Value-Based Equality (This is Huge!)
```

- **Value-Based Equality (This is Huge!)**

With classes:

```csharp
var person1 = new PersonClass("John", "Doe");
var person2 = new PersonClass("John", "Doe");
Console.WriteLine(person1 == person2); // False! Different references
```

With Records:

```csharp
var record1 = new PersonRecord("John", "Doe");
var record2 = new PersonRecord("John", "Doe");
Console.WriteLine(record1 == record2); // True! Same data = equal
```

- **Easy Copying with Changes**

```csharp
var original = new PersonRecord("John", "Doe");

// Create new record with just FirstName changed:
var updated = original with { FirstName = "Jane" };
```

> but you know what! Records are little or say slightly slow.. lets look into

---

## Why Records Are (Slightly) Slower ??

Records have a small performance overhead compared to classes. but why, and why it usually doesn’t matter:

```csharp
// Benchmark: Creating 1 million instances
public class PerformanceComparison
{
    private const int Iterations = 1_000_000;

    [Benchmark]
    public void CreateClasses()
    {
        for (int i = 0; i 
{
    public T Data { get; init; }
    public bool Success { get; init; }
    public string? Message { get; init; }
    public DateTime Timestamp { get; init; }

    // Need constructor
    // Need equality
    // Need ToString
    // Need hash code
    // So much boilerplate!
}
```

With record — done in one line!

```csharp
public record ApiResponseRecord(T Data, bool Success, string? Message, DateTime Timestamp);
```

- **Immutability = Thread Safety**

This is thread-safe because records are immutable:

```csharp
public record Configuration(
    string ApiKey,
    string BaseUrl,
    int Timeout
);

// Can be safely shared between threads
public class Service
{
    private readonly Configuration _config;
    
    public Service(Configuration config)
    {
        _config = config;
    }
    
    // No need for locks - config can't change!
}
```

- **Perfect for Domain Events**

Records are perfect for events — they’re facts that happened

```csharp
public record OrderPlaced(
    Guid OrderId,
    string CustomerEmail,
    decimal Amount,
    DateTime PlacedAt
);

public record PaymentReceived(
    Guid OrderId,
    string TransactionId,
    decimal Amount,
    DateTime PaidAt
);
```

> 🚩 These are immutable facts — they should never change!

---

## DO or DON’T

### 1. Deep Record Hierarchies Can Be Slow

❌ DON’T DO THIS:

```csharp

public record Entity(Guid Id);
public record Person(Guid Id, string Name) : Entity(Id);
public record Employee(Guid Id, string Name, decimal Salary) : Person(Id, Name);
public record Manager(Guid Id, string Name, decimal Salary, string Department) 
    : Employee(Id, Name, Salary);
```

**WHY?** Every equality check must traverse the entire hierarchy!

✔️ USE COMPOSITION:

```csharp
public record Manager(
    Guid Id,
    PersonInfo Person,
    EmployeeInfo Employment,
    string Department
);
```

### 2. Be Careful with Collections

❌ PROBLEMATIC:

```csharp
public record UserList(List Users)
{
    public UserList AddUser(User user) =>
        this with { Users = new List(Users) { user } };
}
```

This creates a new list EVERY time!

✔️ BETTER:

```csharp
public class UserCollection
{
    private readonly List _users = new();
    public IReadOnlyList Users => _users.AsReadOnly();
    
    public void AddUser(User user) => _users.Add(user);
}
```

---

Lets Check **REAL EXAMPLES**

### 1. API Contracts

```csharp
public record CreateUserRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName
);

public record CreateUserResponse(
    Guid UserId,
    string Email,
    DateTime CreatedAt
);
```

### 2. Domain Events

```csharp
public record OrderShipped(
    Guid OrderId,
    string TrackingNumber,
    DateTime ShippedAt,
    Address ShippingAddress
);
```

### 3. Configuration

```csharp
public record DatabaseConfig(
    string ConnectionString,
    int MaxConnections,
    TimeSpan Timeout,
    bool EnableRetry
);
```

### 4. Value Objects in DDD

```csharp
public record Money(decimal Amount, string Currency)
{
    public static Money Zero(string currency) => new(0, currency);
    
    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Currency mismatch");
            
        return this with { Amount = Amount + other.Amount };
    }
}
```

---

before we close the chapter take a screenshot of this :

- Large mutable collections

✅ Use Records For:

- DTOs and API contracts
- Configuration objects
- Domain events
- Value objects
- Any immutable data structures

❌ Avoid Records For:

- Objects that need frequent updates
- Deep inheritance hierarchies
- Large mutable collections
- Complex business logic

so,

> Records in C# are not just syntactic sugar — they’re a powerful tool for handling data in a safe, immutable way. While they come with a small performance overhead, the benefits of reduced code, automatic equality, and immutability usually far outweigh the cost!!

### **Remember:**

- Records = Immutable data containers
- Classes = Mutable objects with behavior
- Choose based on your needs, not performance
- Watch out for hierarchies and collections

Now you have a complete understanding of when and why to use records in your C# applications!

---

Now you have a complete understanding of when and why to use records in your C# applications!

## Those who wanna say Thanks | Buy me a Coffee🖤

---

*Found this helpful? Follow me for more in-depth .NET articles and hit that clap 👏 button if you learned something new!*

```markdown

| **Use Records For**                      | **Avoid Records For**                    |
|------------------------------------------|------------------------------------------|
| DTOs and API contracts                   | Objects that need frequent updates       |
| Configuration objects                    | Deep inheritance hierarchies             |
| Domain events                            | Large mutable collections                |
| Value objects                            | Complex business logic                   |
| Any immutable data structures            |                                          |
```
