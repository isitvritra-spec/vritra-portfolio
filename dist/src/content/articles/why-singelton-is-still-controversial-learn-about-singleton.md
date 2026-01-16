---
title: "Why Singelton is Still Controversial : Learn About Singleton"
excerpt: "Why Use a Singleton? Scenarios Where It Fits"
publishedDate: "2024-12-17"
category: ".NET"
readTime: "6"
image: "https://cdn-images-1.medium.com/max/800/1*Hh3amkuYkZjQIbxRq40zeg.jpeg"
---

### Why Use a Singleton? Scenarios Where It Fits

The Singleton pattern is one of the simplest and most commonly used design patterns in software development. For junior developers stepping into .NET, understanding Singleton can feel both essential and overwhelming.

In this article, I’ll break down the Singleton pattern from the ground up, share some of my scenarios where it shines, and explain where not to use and how to use, hot right? also, I’ll include a practical fintech project example from my own experience and explore how to set up Singleton, Transient, and Scoped lifetimes in .NET. This article is straight from my personal practice, offering a complete, junior-friendly perspective.

Okay cool and lets go…

---

## What Is a Singleton?

A Singleton is a design pattern that ensures a class has only one instance throughout the **application lifecycle** and provides a global access point to that instance. In my fintech projects, I used Singletons extensively for centralized control of critical components, such as *transaction logging*, where a single logger instance ensured consistent and thread-safe tracking of transactions across different services. This pattern minimized resource usage and simplified configuration management.

> Characteristics…

- **Single Instance:** Ensures only one instance exists.
- **Global Access:** Provides access from anywhere in the application.
- **Thread Safety:** Handles multi-threading scenarios.

## Why Use a Singleton? Scenarios Where It Fits

To make it more relatable, let’s look at real-life examples where Singleton makes sense!

### Example 1: Centralized Logging

think you’re building a web app, and every action (like a button click) generates logs. If each action creates its own logger instance, your application will waste memory and slow down. A Singleton logger ensures:

- A single logger handles all logs.
- Consistent logging configuration across your app.

```undefined
public sealed class Logger
{
    private static readonly Lazy _instance = new Lazy(() => new Logger());

    public static Logger Instance => _instance.Value;

    private Logger()
    {
        // Initialize log file or other resources.
        Console.WriteLine("Logger Initialized");
    }

    public void Log(string message)
    {
        Console.WriteLine($"Log: {message}");
    }
}

// Usage
Logger.Instance.Log("Application Started");
Logger.Instance.Log("Another log entry");
```

### Example 2: Configuration Manager

You need to read app settings (like database connection strings) from a single source, like a `config.json` file. A Singleton Configuration Manager ensures:

- All parts of your app access the same configuration.
- Changes to settings are reflected globally.

```undefined
public sealed class ConfigurationManager
{
    private static readonly Lazy _instance = new Lazy(() => new ConfigurationManager());

    public static ConfigurationManager Instance => _instance.Value;

    private ConfigurationManager()
    {
        // Simulate loading configuration from file
        Console.WriteLine("Configuration Loaded");
    }

    public string GetSetting(string key)
    {
        // Simulate fetching a setting
        return key switch
        {
            "Database" => "ConnectionString",
            _ => "DefaultValue"
        };
    }
}

// Usage
string dbConnection = ConfigurationManager.Instance.GetSetting("Database");
Console.WriteLine($"Database Connection: {dbConnection}");
```

### Example 3: Caching

If your app fetches data from an API, you can store the results in a Singleton cache. This prevents unnecessary API calls, improving performance and saving bandwidth.

```undefined
public sealed class Cache
{
    private static readonly Lazy _instance = new Lazy(() => new Cache());

    public static Cache Instance => _instance.Value;

    private readonly Dictionary _cacheStore;

    private Cache()
    {
        _cacheStore = new Dictionary();
        Console.WriteLine("Cache Initialized");
    }

    public void Add(string key, object value)
    {
        _cacheStore[key] = value;
    }

    public object? Get(string key)
    {
        return _cacheStore.TryGetValue(key, out var value) ? value : null;
    }
}

// Usage
Cache.Instance.Add("User1", new { Name = "John", Age = 30 });
var user = Cache.Instance.Get("User1");
Console.WriteLine($"Cached User: {user}");
```

here we seriously need to discuss the lifecycle management…

---

## Lifecycle Management: Singleton, Transient, and Scoped in ASP.NET Core

When working with Dependency Injection (DI) in ASP.NET Core, understanding lifetimes is crucial.

### Singleton

A single instance is created and shared throughout the application lifecycle. Ideal for shared, immutable services like logging, configuration, or caching.

```csharp
services.AddSingleton();
```

### Transient

A new instance is created every time it’s requested. Use this for lightweight, stateless services like small calculations or temporary data.

```undefined
services.AddTransient();
```

### Scoped

A single instance is created per request. Use this for request-specific services like database contexts in web APIs.

```undefined
services.AddScoped();
```

> Choosing the Right Lifetime, Ask these questions

> **Is the service shared across the application?** Use Singleton.

> **Does the service hold temporary data?** Use Transient.

> **Is the service tied to a specific request?** Use Scoped.

## Fintech Payment Gateway : See me …

### Step 1: Define the Singleton

We’ll create a `PaymentGatewayConfig` class that ensures only one configuration instance is used.

```undefined
public sealed class PaymentGatewayConfig
{
    private static readonly Lazy
 _instance = new Lazy(() => new PaymentGatewayConfig());

    public static PaymentGatewayConfig Instance => _instance.Value;

    private PaymentGatewayConfig()
    {
        // ...some code
        Console.WriteLine("Payment Gateway Configuration Loaded");
        ApiKey = "YourSecureApiKey";
        Endpoint = "https://api.paymentgateway.com";
    }

    public string ApiKey { get; }
    public string Endpoint { get; }
}
```

### Step 2: Use the Singleton in a Payment Service
This service simulates a payment request, fetching configurations from the `PaymentGatewayConfig` Singleton.

```undefined
public class PaymentService
{
    public void ProcessPayment(decimal amount, string currency)
    {
        var config = PaymentGatewayConfig.Instance;

        Console.WriteLine($"Processing payment of {amount} {currency}");
        Console.WriteLine($"Using API Key: {config.ApiKey}");
        Console.WriteLine($"Sending to Endpoint: {config.Endpoint}");

        // Simulate API call
        Console.WriteLine("Payment Processed Successfully.");
    }
}
```

### Step 3: Run and Debug

Here’s how you can test the implementation:

```undefined
class Program
{
    static void Main(string[] args)
    {
        var paymentService = new PaymentService();
        paymentService.ProcessPayment(100.50m, "USD");
        paymentService.ProcessPayment(200.00m, "EUR");
    }
}
```

### Debugging Tips

- **Verify Singleton Initialization:** Set a breakpoint in the `PaymentGatewayConfig` constructor to ensure it’s called only once.
- **Check Configuration Access:** Use breakpoints to see how `PaymentGatewayConfig.Instance` is accessed.
- **Simulate Multi-threading:** Use `Task.Run` to simulate concurrent payment processing and ensure the Singleton remains thread-safe.

---

## When to Use This Approach

This Singleton implementation is ideal for:

- Centralized, immutable configurations.
- Scenarios requiring consistent access to settings across multiple services.
- Performance-sensitive fintech applications.

---

## Conclusion: Is Singleton Still Relevant?

Singleton is not just a design pattern; it’s a bridge to scalable and maintainable solutions when used judiciously. For junior developers, understanding Singleton is a must have step in mastering design patterns. While it’s not the answer to every problem, it remains a relevant and powerful tool when used correctly.

## Key Takeaways:

- Use Singleton for shared, globally accessible resources.
- Avoid errors by keeping Singletons stateless and thread-safe.
- Consider Dependency Injection for flexibility.

Singleton is old-school, but when used with modern practices, it’s far from outdated. Experiment with it in your projects, and you’ll soon see why it’s a classic!
