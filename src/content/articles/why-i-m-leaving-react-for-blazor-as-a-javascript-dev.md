---
title: "Why I’m LEAVING React for Blazor (as a JavaScript Dev)"
excerpt: "After building financial apps with React, I made a decision that put my team in shock —  I’m fuckin switching to the Blazor."
publishedDate: "2025-07-09"
category: ".NET"
readTime: "5"
image: "https://cdn-images-1.medium.com/max/1200/1*EjdUOORknlA7Iz_VKSqvTg.png"
---

### After building financial apps with React, I made a decision that put my team in shock — I’m fuckin switching to the Blazor.

> Yes, you read that right

— a JavaScript developer moving to C# and .NET.

[**Friend’s Link**](https://medium.com/@isitvritra101/why-im-leaving-react-for-blazor-as-a-javascript-dev-b9f4f1b744e8?sk=af3ad5c59b905195462262b80ff7d5bf)

## 🔺The problem I face with React in Finance

Last month, our trading platform lost $2,347 due to a JavaScript rounding error. Initially I thought it’s a bug —but it was JavaScript doing exactly what it’s designed to do. When you multiply 0.1 by 0.2 in JavaScript, you don’t get 0.02. You get 0.020000000000000004.In a portfolio management system handling millions in assets, these tiny errors add up very very fast…

Now I will tell you exactly the 3 Major reason to choose BLAZOR!

---

## 🔺Why Blazor?

### 1. Money Calculations

React —

```javascript
// somewhat like this I wrote in code...
const calculateTotal = (positions) => {
  let total = 0;
  positions.forEach(position => {
    total += position.shares * position.price;
  });
  return total;
};

// Test with real numbers
const positions = [
  { shares: 100, price: 142.51 },
  { shares: 50, price: 89.33 }
];

console.log(calculateTotal(positions));
// founds --> Result: 18716.999999999996 (NOT 18717.00!)
```

Blazor —

```csharp
// Calculate portfolio value
decimal CalculateTotal(List
 positions)
{
    decimal total = 0;
    foreach (var position in positions)
    {
        total += position.Shares * position.Price;
    }
    return total;
}

// Test with same numbers
var positions = new List
{
    new Position { Shares = 100, Price = 142.51m },
    new Position { Shares = 50, Price = 89.33m }
};

Console.WriteLine(CalculateTotal(positions));
// Result: 18717.00 (EXACTLY!)
```
The difference? C# has a `decimal` type made for money. JavaScript doesn't.

> See I don’t want you to choose Blazor over the react I am just sharing Where I found Blazor surpassing React in term of ease

### 2. Real-Time Stock Prices

Building real-time features in React means major war with WebSockets, handling reconnections, and managing complex state.

> Blazor just works.

REACT —

```javascript
function StockPrices() {
  const [prices, setPrices] = useState({});
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    const ws = new WebSocket('wss://api.stocks.com');
    
    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Need to reconnect manually
      setTimeout(() => {
        // Reconnection logic here...
      }, 5000);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices(prev => ({...prev, [data.symbol]: data.price}));
    };
    
    return () => ws.close();
  }, []);
  
  return (
    
      {!connected && 
Reconnecting...
}
      {Object.entries(prices).map(([symbol, price]) => (
        {symbol}: ${price}
      ))}
    
  );
}
```

BLAZOR —

```typescript
@page "/stocks"
@using Microsoft.AspNetCore.SignalR.Client

    @foreach (var stock in stocks)
    {
        @stock.Key: $@stock.Value
    }

@code {
    private Dictionary stocks = new();
    private HubConnection? connection;

    protected override async Task OnInitializedAsync()
    {
        connection = new HubConnectionBuilder()
            .WithUrl("https://api.stocks.com/hub")
            .WithAutomaticReconnect() // Auto-reconnect built in!
            .Build();

        connection.On("PriceUpdate", (symbol, price) =>
        {
            stocks[symbol] = price;
            InvokeAsync(StateHasChanged);
        });

        await connection.StartAsync();
    }
}
```

> Blazor handles reconnections automatically. No manual timers, no connection state management.

### 3. Aha! Security

In React, your entire app code is visible in the browser. Anyone can open DevTools and see your business logic. In Blazor Server, your code runs on the server — the browser only sees the UI updates.

REACT Order Form —

```javascript
function OrderForm() {
  const [order, setOrder] = useState({});
  
  const validateOrder = () => {
    // This validation logic is visible to everyone!
    if (order.quantity > 10000) {
      return "Order too large";
    }
    if (order.price  {
    const error = validateOrder();
    if (error) {
      alert(error);
      return;
    }
    // Submit logic
  };
  
  return (
    // Form JSX here
  );
}
```

BLAZOR Order Form —

```typescript
@page "/order"

    
    
    
    
    
    
    Place Order

@code {
    private Order order = new();
    
    private async Task SubmitOrder()
    {
        // This runs on the server - invisible to users!
        if (order.Quantity > 10000)
        {
            // Handle large order
        }
        
        if (order.Price  Here’s the final comparison that made me switch

REACT —

```javascript
import React, { useState, useEffect } from 'react';
import Decimal from 'decimal.js';

function Portfolio() {
  const [positions, setPositions] = useState([]);
  const [total, setTotal] = useState(new Decimal(0));
  
  useEffect(() => {
    // Fetch positions
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        setPositions(data);
        calculateTotal(data);
      });
  }, []);
  
  const calculateTotal = (positions) => {
    const sum = positions.reduce((acc, pos) => {
      const value = new Decimal(pos.shares).mul(pos.price);
      return acc.add(value);
    }, new Decimal(0));
    setTotal(sum);
  };
  
  return (
    
      
## Portfolio Value: ${total.toFixed(2)}

      {positions.map(pos => (
        
          {pos.symbol}: {pos.shares} @ ${pos.price}
        
      ))}
    
  );
}
```

BLAZOR —

```swift
@page "/portfolio"
@inject IPortfolioService PortfolioService

## Portfolio Value: @Total.ToString("C")

@foreach (var position in Positions)
{
    
        @position.Symbol: @position.Shares @ @position.Price.ToString("C")
    
}

@code {
    private List
 Positions = new();
    private decimal Total => Positions.Sum(p => p.Shares * p.Price);
    
    protected override async Task OnInitializedAsync()
    {
        Positions = await PortfolioService.GetPortfolioAsync();
    }
}
```

> Look at that Blazor code. No decimal libraries. No manual calculations. No state management. It just works.

---
I’m not saying everyone should drop React. But if you’re building financial applications, you owe it to yourself to try Blazor. The precision, security, and simplicity will definately make you to go for Blazor and if you are from C# then most welcome….

Start small. Build one feature in Blazor. Compare it to your React version.
