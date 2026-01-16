---
title: "Why you shouldn’t use vector databases for RAG"
excerpt: "The contrarian take on building better retrieval augmented generation systems"
publishedDate: "2025-05-17"
category: "AI"
readTime: "5"
image: "https://cdn-images-1.medium.com/max/1200/0*6HQd3y82CypMGqYf.png"
---

### The contrarian take on building better retrieval augmented generation systems

## What is RAG, and why should you care?

Every day, millions of people interact with ChatGPT, Claude, and other large language models, fundamentally changing how we interact with computers. The appeal is obvious: instead of learning specific interfaces, users can simply communicate in natural language. The machine adapts to the human, not the other way around.

This shift has organizations scrambling to create similar experiences with their own data. Whether it’s building a support chatbot that understands product documentation, crafting an assistant that writes personalized emails, or developing an internal tool to help employees access company knowledge, they all require the same foundation: giving LLMs access to proprietary information.

Enter Retrieval Augmented Generation (RAG), a workflow that’s deceptively simple in concept:

- User asks a question
- The system retrieves relevant documents based on that question
- LLM generates an answer using those retrieved documents as context

When implemented correctly, RAG provides more accurate, up-to-date responses while reducing hallucinations. But here’s where most engineers go wrong: they default to vector databases without considering whether that’s actually the optimal approach.

## The engineer’s shortcut: Vector databases

The typical RAG implementation looks something like this:

```sql
User Question → Convert to Embedding → Query Vector DB → Retrieve Similar Documents → Generate Answer
```

It makes intuitive sense. Vector embeddings capture semantic meaning, so similar concepts cluster together in the vector space. By converting questions and documents to the same embedding space, you can find relevant information even when the exact keywords don’t match.

Engineers love this approach because it seems elegant. You don’t need complex query parsing or keyword matching — just transform everything to vectors and let similarity algorithms do the work.

But this shortcut creates two critical problems that significantly degrade the quality of the results.

## Problem 1: Unrefined queries lead to irrelevant results

The first major issue occurs at the initial step: we take the raw user query, convert it directly to an embedding, and use that to retrieve documents.

Think about what happens when you use Google. You don’t always search with your actual question — you distill it to key terms that are more likely to yield relevant results. If you want to know “What’s the best way to organize React components in a large project?”, you might search for “React component organization best practices large applications.”

LLMs excel at this kind of query refinement, but in the standard vector DB approach, we skip this crucial step. The embedding captures the semantic meaning of the original question, but that doesn’t always align with the optimal search query.

## Problem 2: Vector search sacrifices precision for recall

The second problem is more fundamental: vector similarity search is strong at recall but often weaker at precision compared to traditional full-text search.

Vector search excels at finding conceptually related content (recall) — documents that discuss similar topics, even if they use different terminology. However, it’s less effective at pinpointing exactly what you need (precision).

Full-text search, on the other hand, prioritizes precision. When exact keyword matches exist, they’re usually highly relevant. The trade-off is that full-text search might miss conceptually similar content that uses different terminology.

This explains why many RAG systems that rely exclusively on vector databases end up implementing additional re-ranking steps after initial retrieval. It’s also why vector databases increasingly add full-text capabilities — they recognize the inherent limitations of pure vector search.

## A more human approach to RAG

Since we’re trying to build systems that mimic human intelligence, shouldn’t we structure our RAG pipelines to mirror how humans actually search for information?

When people need to find information, they:

- Reframe their question into effective search terms
- Use search engines optimized for retrieving relevant information
- Scan results to identify the most useful content

A better RAG design would follow this pattern:

```sql
User Question → LLM Refines Into Search Query → Hybrid Search (Combining Full-text and Semantic) → Retrieve Relevant Documents → LLM Generates Answer
```

This approach addresses both problems:

- The LLM refines the user’s original question into an optimized search query
- Hybrid search combines the precision of full-text search with the recall of semantic search

## The solution: Simpler (and better) RAG with search engines

Here’s my contrarian take:

> instead of jumping to vector databases for RAG, start with a quality search engine that combines full-text and semantic capabilities.

Modern search engines offer hybrid search functionality that delivers better overall relevance than pure vector retrieval. They’re also:

- Easier to deploy and maintain
- Optimized for fast queries at scale
- Designed with relevance as the primary objective
- More intuitive for debugging search results

For most RAG applications, the workflow becomes much simpler:

- The user submits a question
- LLM transforms that question into an effective search query
- The search engine retrieves relevant documents using hybrid search
- LLM generates a response using those documents as context

This approach aligns with how humans actually search for information, leveraging the strengths of both LLMs and search technology while avoiding unnecessary complexity.

## The power of simplicity in RAG: Back to search basics

Vector databases certainly have their place in the machine learning ecosystem, but they’re not always the best foundation for RAG systems. By taking a step back and considering how humans search for information, we can build more effective, simpler RAG architectures.

> The next time you’re designing a RAG system, consider whether a good search engine might be the better choice. Your users (and your future self maintaining the system) will thank you.
