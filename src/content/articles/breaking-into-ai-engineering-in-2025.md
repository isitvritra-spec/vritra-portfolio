---
title: "Breaking into AI Engineering in 2025"
excerpt: "A roadmap that will help you up-skill or re-skill into an AI Engineer role — by Aurimas Griciūnas"
publishedDate: "2025-06-06"
category: "AI"
readTime: "10"
image: "https://cdn-images-1.medium.com/max/1200/1*0jZNk3Pd9XRb0gXK7fZS5A.png"
---

### A roadmap that will help you up-skill or re-skill into an AI Engineer role — [by Aurimas Griciūnas](https://substack.com/@swirlai)

Agentic AI and other buzzwords are emerging almost monthly, if not more often. In reality, they all describe different variations of Agentic Systems, it might be n agentic workflow or a multi-agent system, it’s just a different topology under the same umbrella.

If you are considering a career in AI Engineering in 2025, it might feel overwhelming and that is completely normal.

But you need to remember — you are not too late to the game. The role as such has only emerged over the past few years and is still rapidly evolving.

In order to excel in this competitive space, you will need a clear path and focused skills.

Here is a roadmap you should follow if you want to excel as an AI Engineer in today’s landscape.

> [Non Member can read here…](https://medium.com/ai-threads/breaking-into-ai-engineering-in-2025-201a73d43db5?sk=a68f2bebbc5da31cc34c079c2c412b4c)

---

## Fundamentals — learn as you go.

I have always been a believer that learning fundamentals is key to your career growth. This has not changed.

However, I have to admit that the game itself has changed with the speed that the industry is moving forward. Staring of with fundamentals before anything else is no longer an option. Hence, you should be continuously learning them as you build out modern AI Engineering skillset.

Here is a list of concepts and technologies I would be learning and applying in my day-to-day if I were to start fresh.

**Python and Bash:**

- FastAPI — almost all of the backed services implemented in Python are now running as FastAPI servers.
- Pydantic — the go to framework for data type validation. It is now also a Python standard for implementing structured outputs in LLM based applications.
- uv — the next generation Python package manager. I haven’t seen any new projects not using it.
- git — get your software version control fundamentals right.
- Asynchronous programming — extremely important in LLM based applications as your Agentic topologies will often benefit from calling multiple LLM APIs asynchronously without blocking.
- Learn how to wrap your applications into CLI tools that can be then executed as CLI scripts.

**Statistics and Machine Learning:**

- Understand the non-deterministic nature of Statistical models.
- Types of Machine Learning models — it will help you when LLMs are not the best fit to solve non-deterministic problem.
- General knowledge in statistics will help you in evaluating LLM based systems.
- Don’t get into the trap of thinking that AI Engineering is just Software Engineering with LLMs, some maths and statistics is involved.

---

## LLM and GenAI APIs.

You should start simple, before picking up any LLM Orchestration Framework begin with native client libraries. The most popular is naturally OpenAI’s client, but don’t disregard Google’s genai library, it is not compatible with OpenAI APIs but you will find use cases for Gemini models for sure.

So what should you learn?

**Types of LLMs:**

- Foundation vs. Fine-tuned.
- Code, conversational, medical etc.
- Reasoning Models.
- Multi-Modal Models.

**Structured outputs:**

- Learn how OpenAI and Claude enforces structured outputs via function calling and tool use.
- Try out simple abstraction libraries like Instructor — they are enough for most of the use cases and uses pydantic for the structure definition natively.

**Prompt Caching:**

- Learn how KV caching helps in reducing generation latency and costs.
- Native prompt caching provided by LLM providers.
- How LLM serving frameworks implement it in their APIs (e.g. vLLM).

---

## Model Adaptation.

I love the term Model Adaptation. The first time (and maybe the only time) I’ve seen it in literature was in the book “[AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)” by [Chip Huyen](https://open.substack.com/users/4141198-chip-huyen?utm_source=mentions). The term ideally encompasses what we, AI Engineers, do to make LLMs perform actions we expect.

What should you learn?

**Prompt Engineering:**

- Learn the proper prompt structure. It will differ depending on the provider you are using.
- Understand context size limitations.
- Prompting techniques like Chain of Thought, Tree of Thought, Few-shot.
- Advanced prompting techniques: Self-consistency, Reflection, ReAct.

**Tool Use:**

- Tool Use is not magic, learn how it is implemented via context manipulation.
- Don’t rush to agents yet, learn how LLMs are augmented with tools first.
- You might want to pick up a simple LLM Orchestrator Framework at this stage.

**Finetuning:**

- Learn when it is worth to Finetune vs. just Prompt Engineering or implementing RAG. In most cases it is not worth the effort.
- Try out tools like Unsloth for quick learning if you do decide to get your hands dirty.

---

## Storage and Retrieval.

**Vector Databases:**

- Learn strengths and weaknesses of vector similarity search.
- Different types of Vector DB indexes: Flat, IVFFlat, HNSW.
- When PostgreSQL pgvector is enough.

**Graph Databases:**

- High level understanding about Graph Databases.
- Don’t spend too much time here as there is still limited use for Graph DBs even though the promises connected with Graph Retrieval were and still are big.
- Current challenges still revolve around the cost of data preparation for Graph Databases.

**Hybrid retrieval:**

- Learn how to combine the best from keyword and semantic retrieval to get the most accurate results.

---

## RAG and Agentic RAG

**Data Preprocessing:**

- Learn data clean data before computing Embeddings.
- Different chunking strategies.
- Extracting useful metadata to be stored next to the embeddings.
- Advanced techniques like Contextual Embeddings.

**Data Retrieval, Generation and Reranking:**

- Experiment with amount of data being retrieved.
- Query rewriting strategies.
- Prompting for Generation with retrieved Context.
- Learn how reranking of retrieved results can improve the accuracy of retrieval in your RAG and Agentic RAG systems.

**MCP:**

- Agentic RAG is where MCP starts to play a role, you can implement different data sources behind MCP Servers. By doing so you decouple the domain responsibility of the data owner

### **LLM Orchestration Frameworks:**

- You don’t need to rush with choosing Orchestration Framework, most of them hide the low level implementation from you and you would be better off starting out without any Framework whatsoever and using light wrappers like Instructor instead.
- Once you want to pick up and Orchestrator, I would go for the popular ones because that is what you run into in the real world:

> — LangChain/LangGraph.

> — CrewAI.

> — LlamaIndex

> — Test out Agent SDKs of Hyper-scalers and AI Labs.

---

## AI Agents

**AI Agent and Multi-Agent Design Patterns:**

- ReAct.
- Task Decomposition.
- Reflexion.
- Planner-Executor.
- Critic-Actor.
- Hierarchical.
- Collaborative.
- …

**Memory:**

- Learn about Long and Short-Term memory in Agentic Systems and how to implement it in real world.
- Try out *mem0 *— the leading Framework in the industry for managing memory. It now also has an MCP server that you can plug into your agents.

**Human in or on the loop:**

- Learn hoe to delegate certain actions back to humans if the Agent is not capable to solve the problem or the problem is too sensitive.
- Human in the loop — a human is always responsible for confirming or performing certain actions.
- Human on the loop — the Agent decides if human intervention is needed.

**A2A, ACP, etc.:**

- Start learning Agent Communication Protocols like A2A by google or ACP by IBM.
- There are more Protocols popping out each week, but the idea is the same.
- Internet of Agents is becoming a real thing. Agents are implemented by different companies or teams and they will need to be able to communicate with each other in a distributed fashion.

**Agent Orchestration Frameworks:**

- Put more focus on Agent Orchestration Frameworks defined in the previous section.

---

## Infrastructure.

Infrastructure.

**Kubernetes:**

- Have at least basic understanding of Docker and Kubernetes.
- If your current company does not use K8s, it is more likely you will run into the one that does use it rather than the opposite.

**Cloud Services:**

- Each of the major cloud providers have their own set of services meant to help AI builders:
- Azure AI Studio.
- Google Vertex AI.
- AWS Bedrock.

**CI/CD:**

- Learn how to implement Evaluation checks into your CI/CD pipelines.
- Understand how Unit Eval Tests are different from Regression Eval Tests.
- Load test your applications.

**Model Routing:**

- Learn how to implement Model fallback strategies to make your
- Try tools like liteLLM, Orq or Martian.

**LLM Deployment:**

- Learn basics of LLM deployment Frameworks like vLLM.
- Don’t focus too much on this as it would be a rare case that you would need to deploy your own models in real world.

---

## Observability and Evaluation.

Observability and Evaluation.

**AI Agent Instrumentation:**

- Learn what SDKs exist for instrumenting Agentic applications, some examples:
- — Langsmith SDK.
- — Opik SDK.
- — Openllmetry.
- — …
- Learn Multi-Agent system Instrumentation. How do we connect traces from multiple agents into a single thread.
- You can also dig deeper into OpenTelemetry because most of the modern LLM Instrumentation SDKs are built on top of it.

**Observability Platforms:**

- There are many Observability platforms available off the shelf, but you nee to learn the fundamentals of LLM Observability:
- Traces and Spans.
- Evaluation datasets.
- Experimenting with changes to your application.
- Sampling Traces.
- Prompt versioning and monitoring.
- Alerting.
- Feedback collection.
- Annotation.

**Evaluation Techniques:**

- Understand the costs associated with LLM-as-a-judge based evaluations:
- Latency related.
- Monetary related.
- Know in which step of the pipeline you should be running evaluations to get most out of it. You will not be able to evaluate every run in production due to cost constraints.Security.
- Learn alternatives to LLM based evaluation:

***— Rule based.***

***— Regex based.***

***— Regular Statistical measures.***

---

## Security

**Guardrails:**

- Learn how to guardrail inputs to and outputs from the LLM calls.
- Different strategies:
- LLM based checks.
- Deterministic rules (e.g. Regex based).
- Try out tools like GuardrailsAI.

**Testing LLM based applications:**

- Learn how to test the security of your applications.
- Try to break your own Guardrails and jailbreak from system prompt instructions.
- Performing advanced Red Teaming to test emerging attack strategies and vectors.

---

## Looking Forward.

The future development of Agents will be an interesting area to observe. A lot of successful startups are most likely to succeed due to having one of the following:

- Distribution.
- Good UX.
- Real competitive motes, like physical products. Here is where robotics comes into play.

Looking Forward Elements.

**Voice, Vision and Robotics:**

- An interesting blend of capabilities that would allow a physical machine to interact with the world. The areas that I am looking forward to are:
- On-device Agents.
- Extreme Quantisation techniques.
- Foundation Models tuned specifically for robotics purposes.

**Automated Prompt Engineering:**

- New techniques are emerging that allow you to perform automated Prompt Engineering given that you have good test datasets ready for evaluation purposes.
- Play around with frameworks like DsPy or AdalFlow.

## Summary.

The skillset requirements for AI Engineers are becoming larger every month. The truth is that in your day-to-day you will only need a subset of it.

You should always start with your immediate challenges and adapt the roadmap accordingly.

However, don’t forget to look back and learn the fundamental techniques that power more advanced systems. In many cases these fundamentals are hidden behind layers of abstraction.

> Happy building!

> I have recently read this article in internet and now I am sharing this with you! Hope you like it.. more to come on AI Threads
