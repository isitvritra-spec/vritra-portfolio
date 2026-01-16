---
title: "Creating a JSON Class in C# | B2Basic Series Ep-1"
excerpt: "Understanding how to work with JSON"
publishedDate: "2025-09-03"
category: ".NET"
readTime: "5"
image: "https://cdn-images-1.medium.com/max/800/1*riiY5AdvYkyW0XVIpJZE4w.png"
---

### Understanding how to work with JSON

If you’ve ever wondered how to map a JSON object to a C# class, you’re just in luck!

## Introduction to JSON Class in C#

JSON and C# share a special relationship in the coding ecosystem. Understanding their intricate workings also releases possibilities that simplify your way of coding

### ▪️What is JSON and why am I talking about it in 1st Episode?

JSON, an acronym for **JavaScript Object Notation**, is a lightweight data exchange format that is easy to read and write. It’s used quite frequently in modern applications for data storage and communication between a server and a web application.

> all thanks to its language-independent nature *💞*

look into this, simple JSON →

```json
{
    "name":"John",
    "age":30,
    "car":null
}
```

Here we have a JSON object with three properties: name, age, and car. So it actually stores in <key>: <value> pair, where key is kinda string type and value can be of any type.. but yeah that’s why its easy to understand for all LANGUAGES! even our language too.. :)

> At its core, a JSON class in C# is a class representation of a relevant JSON structure. It signifies how a JSON object maps directly to a C# class. By doing this, we make it more convenient to access and manipulate data. C# can then use these classes to deserialize JSON objects into a usable format.

### ▪️No Fluffs, let’s see how and where we should work with JSON

let’s switch —

**Case 1: When you encounter JSON data in your application**, the first step is often to interpret it and translate it into a C# class. That can be done using the Newtonsoft.json library, or we have the System.json library already present there!

So, *using the Newtonsoft.Json library, we can easily deserialize a JSON string into a corresponding C# object.*

Take a look —

```csharp
using Newtonsoft.Json;

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Car { get; set; }
}

...
// Assume jsonString contains a JSON object similar to the one in our initial example
Person person = JsonConvert.DeserializeObject
(jsonString);
```
Person is our class, and the JSON data you already see above.

Now,

**Case 2: Creating a C# class for JSON. **So whenever you get, let's say a JSON data! If it is from the internet and you want to make a class in your **Visual Studio,** then you go for the **Paste-Special** feature

- Copy your JSON data
- In Visual Studio, go to **Edit → Paste Special → Paste JSON as Classes**
- Visual Studio will automatically generate the class structure

But if it is a run-time case, then you can do something like this using the **NewtonSoft.json** library —

```csharp
using Newtonsoft.Json;

public class Person
{
    [JsonProperty("id")]
    public int Id { get; set; }
    
    [JsonProperty("name")]
    public string Name { get; set; }
    
    // ... other properties
}

// Usage:
Person person = JsonConvert.DeserializeObject
(jsonString);
```
But if your JSON is like a Nested thing, like —

```json
{
  "Name" : "Megan",
  "Vehicle": {
      "Type" : "Sedan",
      "Model" : 2025,
      "Color" : "Pink"
    }
}
```

Then also it will deserialize it, but here is how it should look —

```csharp
public class Owner 
{
    public string Name { get; set; }
    public Vehicle Car { get; set; }

    public Owner()
    {
        Car = new Vehicle();
    }
}

public class Vehicle
{
    public string Type { get; set; }
    public int Model { get; set; }
    public string Color { get; set; }
}
```

▪️**Getting the actual Data out! **Once you’ve got your JSON deserialized into C# objects. You can now extract and work with that data like any regular C# object.

```typescript
string ownerName = owner.Name;  
string carType = owner.Vehicle.Type; 

var userSkills = user.Skills.Where(s => s.Contains("C#")).ToList();

var departmentName = user.Department?.Name ?? "No Department";
```

**Case 3: What about Arrays in JSON? **Arrays are super common in JSON! Like this —

```json
{
  "users": ["Alice", "Bob", "Charlie"],
  "scores": [95, 87, 92]
}
```

Your C# class would be:

```csharp
public class Data
{
    public List Users { get; set; }
    public List Scores { get; set; }
}
```

And then you can loop through them like:

```csharp
foreach(string user in data.Users)
{
    Console.WriteLine($"User: {user}");
}
```

## End Note

So there you have it! JSON to C# classes —

- **Paste Special** for quick class generation
- **Newtonsoft.Json** for runtime deserialization
- **Nested objects** need separate classes
- **Arrays** become `List<T>`
- **Extract data** using standard C# object access

> Once your JSON becomes a C# object, you can use LINQ, properties, and methods that C# offers. No more struggling with string parsing or manual data extraction!

Thank you 🖤
