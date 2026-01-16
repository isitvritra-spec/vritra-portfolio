---
title: "RAG Chunking: Mistake That’s Costing You 80% Accuracy"
excerpt: "Confess- I know this article will not get that much views but I am too lean to AI from last 2 years. I wanna share the learning side"
publishedDate: "2025-10-11"
category: "AI"
readTime: "4"
image: "https://cdn-images-1.medium.com/max/1200/1*d7lLFarImpWGUU0L4u9Gkw.png"
---

### Confess- I know this article will not get that much views but I am too lean to AI from last 2 years. I wanna share the learning side

You spent weeks building your RAG pipeline. Embeddings? Check. Vector DB? Check. LLM fine-tuned? Check. Yet your chatbot still returns garbage when users ask anything beyond FAQ-level queries.

Reason Behind that —

> **Your chunking strategy!**

most RAG failures happen before the LLM ever sees the query. They happen in first few lines of code where you split documents into chunks. Let me fix that for you…

---

## Why Chunking Actually Matters (Beyond the Obvious)

Sure, you know chunks need to fit in your token window. But here’s what breaks in production —

### The Context —

Your fixed 500-token chunks split a SQL tutorial right where it explains JOIN syntax. User asks “how to join tables” and gets half an answer.

Well that’s the basic mistakes you might do while preparing the data for your chatbot may be..

### The Redundancy—

Also Overlapping chunks sound smart until you realize your retrieval returns 4 variations of the same paragraph, wasting 3 of your top-k slots

### The Semantic —

You chunk by paragraphs, but your technical docs have 2-line paragraphs and 50-line code blocks. Your retrieval accuracy just became a coin flip.

And it actually cost a lot if you are building something that solving some real problem or helping you to generate money. Because in a production system handling 10K queries/day, poor chunking can drop your accuracy from 85% to 60%. That’s 2,500 failed interactions daily.

---

## The Three Categories That Matter

## 🔺Tier 1: Simple & Fast

### Fixed-Length Chunking

The naive approach that sometimes works.

```ini
# 500 tokens, no overlap
chunks = [doc[i:i+500] for i in range(0, len(doc), 500)]
```

It can be used when you are working with something FAQs, simple docs, prototyping, you need something working by EOD.

but it can break if Technical docs, code examples or some multi-step explanations required... ‘*Basically anything where context flows across boundaries*’

> Add 20% overlap to catch split concepts without going full sliding window.

---

### Sentence-Based Chunking

Just words, ‘*Respect sentence boundaries, preserve complete thoughts*’

```ini
# Using spaCy/nltk
sentences = nlp(doc).sents
chunks = [" ".join(sentences[i:i+5]) for i in range(0, len(sentences), 5)]
```

**Can be Used, **Conversational AI, Q&A systems, customer support where queries are short.

**But can be break**, When Technical explanations that span multiple sentences, or when your “sentences” are actually bullet points.

> Variable chunk sizes will mess with your retrieval scoring if you’re not normalizing.

---

### Paragraph-Based Chunking

You already know about this..

> Use it when, Articles, reports, documentation with proper formatting.

---

## Tier 2: Context-Aware(Production Best)

### Sliding Window Chunking

Overlap chunks to maintain context flow

```ini
chunk_size = 500
overlap = 100
chunks = [doc[i:i+chunk_size] for i in range(0, len(doc), chunk_size - overlap)]
```

Legal docs, medical records, technical manuals where continuity matters more than storage.

> *lets talk Maths! 20% overlap = 20% more chunks to store and index. Worth it if accuracy gains justify the cost.*

*Tip: Hash overlapping regions and only retrieve unique sections during search.*

---

### Semantic Chunking

Use embeddings to find natural breakpoints.

> instead of arbitrary boundaries, break where topics actually shift.

```ini
# Conceptual - use sentence-transformers
embeddings = model.encode(sentences)
similarity_scores = cosine_similarity(embeddings[:-1], embeddings[1:])
breakpoints = [i for i, score in enumerate(similarity_scores) if score  and please batch your embedding generation or you’ll wait hours for large docs.

---

### Recursive Chunking

**It should be document Hierarchy — sections → paragraphs → sentences.**

Perfect for structured docs with clear heading hierarchy.

```scss
def recursive_chunk(element, max_size):
    if len(element)  Generate summaries once during indexing, not during retrieval.

---

## Tier 3: Intelligence-Driven

leaving this for next article.. please be hooked!

---

**References**

- Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
- Jurafsky, D., & Martin, J. H. (2021). Speech and Language Processing (3rd ed.)
- Manning, C. D., et al. (2008). Introduction to Information Retrieval

---

***thank you ***🖤
