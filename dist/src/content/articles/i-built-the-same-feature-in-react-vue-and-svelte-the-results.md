---
title: "I Built the Same Feature in React, Vue, and Svelte — The Results Will Make You Question Everything"
excerpt: "Third coffee in a row…., reading that article about how some consultant is charging $500/hour because he chose Dapper over Entity…"
publishedDate: "2025-10-20"
category: ".NET"
readTime: "5"
image: "https://cdn-images-1.medium.com/max/1200/1*jeHURgHOyB0Ry5spnScksg.png"
---

Third coffee in a row…., reading that article about how some consultant is charging $500/hour because he chose Dapper over Entity Framework.

And I’m thinking… am I choosing my frontend frameworks the same dumb way I chose EF Core? Because **“everyone uses it”**?

This question make me to test this…. Built the same exact dashboard in React, Vue, and Svelte. Not some tutorial project kinda shit... but a real production-like feature.

**Let me tell you what I found…**

## 🕸️React vs Vue vs Svelte ?

You already know that last month I built a crypto price tracker for a client. Around 8,247 tokens updating prices. Real-time WebSocket data coming every 2–3 seconds. Filtering by market cap, sorting, search.

**It was laggy as hell in React Mann…**

Users complained. I blamed it on “too much data” and moved on.

But after few articles, I got curious that what if its not data but its REACT?

So friday night. when I was travelling, I clone the repo three times and built in Vue and Svelte.

---

## 🔺 What I Actually Built 🔺

> *I used the same API. Same logic. Same UI design. Only difference? The framework.*

### | — Let’s talk about Numbers

Bundle Size (Production Build, Gzipped)

```yaml
React:   138.6 KB
Vue 3:    87.2 KB  
Svelte:   19.4 KB
```

I was shocked with Svelte size mann.. it was low as hell.. did check again after 15 minutes.. extracted the zip again and it runs perfectly fine

> Svelte’s bundle was **7 times smaller** than React. For the exact same feature.

so if anyone living in tier 2 cities then it will load faster and almost by 3 seconds..

### | — Time to Interactive (On 3G Network)

```yaml
React:  3.8 seconds
Vue 3:  2.1 seconds
Svelte: 0.9 seconds
```

*~almost ☝️*

> Svelte loaded before React even finished parsing the JavaScript file.

Same with the memory usage..

### | — After Loading 8,247 Tokens

```yaml
React:  52.3 MB
Vue 3:  41.7 MB
Svelte: 23.8 MB
```

*This one hit me hard.*

### | — Real-Time Performance (Updates Coming Every 2–3 Seconds)

Tested on my OnePlus 7T (Snapdragon 660, not some flagship):

```vbnet
React:  Stuttering at 38 FPS, visible lag when scrolling
Vue 3:  Smooth-ish at 54 FPS, occasional frame drops  
Svelte: Buttery smooth 60 FPS, zero lag
```

Sunday evening while discussing with my fellows on Discord. They are like, “Bro, your React version looks broken.”

> That was just React struggling.

---

## — What Actually Happened?

## 🕸️React — Virtual DOM Problem

```javascript
function Dashboard({ tokens }) {
  const [filtered, setFiltered] = useState(tokens);
  
  return filtered.map(token => (
    
  ));
}
```

In this piece it looks simple, But every** WebSocket message **(every 2–3 seconds):

- React creates 8,247 Virtual DOM nodes
- Compares them with old Virtual DOM (diffing)
- Figures out what changed
- Updates real DOM

> **That’s happening 20–30 times per minute.**

I tried optimizing. Added `React.memo()` everywhere. Used `useMemo()` and `useCallback()` on literally everything. Code splitting with `lazy()`.

Got it from 38 FPS to 47 FPS. Still janky. And my code looked like shit with all those memos.

---

## 🕸️Vue

```xml

import { ref, computed } from 'vue';

const tokens = ref([]);
const filtered = computed(() => 
  tokens.value.filter(t => t.marketCap > 1000000)
);

```

Vue 3’s reactivity system only updates components that actually use the changed data, not the entire list like React.

When Bitcoin’s price changes, only Bitcoin’s row re-renders. Not all 8,247 rows.

This is huge. Performance boost was instant. No optimization gymnastics needed.

But Vue still uses Virtual DOM for dynamic content. Still some overhead.

---

## 🕸️Svelte

```xml

  let tokens = [];
  $: filtered = tokens.filter(t => t.marketCap > 1000000);

{#each filtered as token}
  
{/each}
```

Svelte doesn’t use a Virtual DOM. It compiles your components to vanilla JavaScript at build time.

There’s **no framework running in the browser.** No React. No Vue library. Nothing.

When a price updates, Svelte’s compiler generated code that **directly updates that specific DOM element.** No diffing. No reconciliation.

Just pure JavaScript doing: `element.textContent = newPrice;`

That’s it.

That’s why it’s 7x smaller and runs at 60 FPS on my mid-range phone.

---

## 🔺I am still not saying “No React”

### React — When You Need The Ecosystem

- Large team where hiring React devs is easiest
- Using React Native and need code sharing
- Need the massive library ecosystem (Redux, React Query, etc.)
- Existing codebase where rewrite cost > performance problems

### Vue 3

- New team learning frontend (easiest curve)
- Need official, cohesive ecosystem (Vue Router, Pinia from core team)
- Gradual adoption in existing jQuery projects
- Want good performance without steep learning

### Svelte — My New Default (For Serious)

- **Performance matters** (real-time apps, dashboards, anything with live data)
- New projects with no legacy baggage
- Users on slow networks or budget phones
- When you actually care about user experience over developer popularity

---

## 🕸️Some of the Rules you should make

- **Test on actual user devices** — Not your M1 MacBook. Their few bucks Android phones
- **Measure real performance** — FPS, memory, bundle size. Not GitHub stars
- **Question defaults** — “Everyone uses X” is not a technical reason
- **Users > Developers** — Your convenience doesn’t matter if users suffer
- **Show the data** — I have screenshots, metrics, proof. Not opinions

---

*Thank you* 🖤
