# Full Stack + AI Engineering — Complete Syllabus

**A companion to your 6-month roadmap.** The roadmap tells you *when* (week-by-week, tied to your calendar). This tells you *what*, in full — every concept broken down to the level you actually search and learn at, with the verified resource for each, and a fallback search term for anything not explicitly covered. Use this as your master checklist; check off units as you close them.

---

## How to Use This Document

- Each **Module** is a subject area. Each **Unit** inside it is one sitting's worth of learning — small enough to search for and finish, specific enough that the search actually returns the right thing.
- Every unit lists: the **exact concepts** inside it, the **primary resource** (verified, not guessed), a **secondary resource** if the first doesn't click, and what **"done" looks like** (problems solved / thing built / question you can now answer).
- **Tier** marks priority: 🔴 Essential (never skip) · 🟡 Recommended (strong differentiator) · 🟢 Optional (nice to have). Matches Part 9 of the roadmap — if time gets tight, drop 🟢 first, then 🟡, never 🔴.
- Sequencing matters — modules are numbered in the order that makes each one easiest to learn (e.g., SQL before RAG, Python before ML, RAG before Agents). Follow the order within a module; you can interleave modules the way the roadmap's calendar does.
- If a unit's resource isn't working for you, don't force it — the "if this doesn't land" search term is there specifically so you can find a second teacher without losing the thread.

---

## Curriculum Map

| # | Module | Units | Tier | Rough Hours |
|---|---|---|---|---|
| 1 | Data Structures & Algorithms | 18 | 🔴 | 130–150h |
| 2 | Databases | 3 | 🔴 | 20–25h |
| 3 | Testing | 2 | 🔴 | 10–12h |
| 4 | DevOps & Cloud | 4 | 🔴/🟡 | 25–30h |
| 5 | System Design | 5 | 🔴 | 25–30h |
| 6 | Python & Data Foundations | 2 | 🔴 | 15–20h |
| 7 | Machine Learning Fundamentals | 2 | 🔴 | 20–25h |
| 8 | LLM & Generative AI Engineering | 9 | 🔴/🟡 | 45–55h |
| 9 | Interview Readiness | 3 | 🔴 | ongoing |

---

## MODULE 1 — Data Structures & Algorithms 🔴

**Objective:** solve unseen problems, in a pattern you recognize, inside a 30–45 minute interview window.
**Primary spine for the whole module:** takeuforward.org/strivers-a2z-dsa-course — follow the *site* itself in sequence (not the YouTube channel browsed on its own — Striver, the creator, says this directly). It embeds the right video at the right point and already matches the unit order below.
**Secondary, per-unit:** NeetCode 150 (neetcode.io/practice) — same patterns, one short video per problem; use when Striver's explanation of that specific unit isn't landing.
**Solve on:** LeetCode (free tier).

| Unit | Concepts inside it | "Done" looks like |
|---|---|---|
| 1.1 Complexity Analysis | Big-O notation, time vs. space complexity, best/average/worst case | Can state the complexity of any solution you write without thinking hard |
| 1.2 Arrays & Hashing | Hashmap/hashset usage, frequency counting, prefix sums, two-sum pattern, grouping/categorization problems | ~12–15 problems solved |
| 1.3 Two Pointers | Opposite-direction pointers, same-direction pointers, sorted-array techniques | ~8–10 problems |
| 1.4 Sliding Window | Fixed-size window, variable-size window, substring problems | ~8 problems |
| 1.5 Stack | Monotonic stack, parentheses/bracket matching, next-greater-element | ~10 problems |
| 1.6 Binary Search | Search-space reduction, "search on the answer," rotated sorted arrays | ~10 problems |
| 1.7 Linked List | Reversal, fast-slow pointers (cycle detection), merge operations, dummy-node technique | ~12 problems |
| 1.8 Trees | DFS (preorder/inorder/postorder), BFS (level order), BST properties, tree construction/serialization | ~18 problems |
| 1.9 Tries | Prefix trees, word search / autocomplete patterns | ~5 problems |
| 1.10 Heap / Priority Queue | Min-heap vs. max-heap, k-th largest/smallest, merge k sorted lists | ~10 problems |
| 1.11 Backtracking | Subsets, permutations, combinations, constraint satisfaction (N-Queens style) | ~10 problems |
| 1.12 Intervals | Merge intervals, interval scheduling, overlap detection | ~8 problems |
| 1.13 Graphs | BFS/DFS traversal, connected components, cycle detection, matrix-as-graph problems | ~15 problems |
| 1.14 Advanced Graphs | Union-Find (Disjoint Set), Dijkstra's shortest path, Minimum Spanning Tree (Prim's/Kruskal's), topological sort | ~10 problems |
| 1.15 Greedy | Activity selection, interval-scheduling greedy proofs, exchange arguments | ~8 problems |
| 1.16 1-D Dynamic Programming | Fibonacci-style recurrence, house robber, climbing stairs, coin change, memoization vs. tabulation | ~15 problems |
| 1.17 2-D Dynamic Programming | Grid paths, longest common subsequence, edit distance, 0/1 knapsack | ~12 problems |
| 1.18 Bit Manipulation & Math | XOR tricks, bitmasking, GCD/LCM, modular arithmetic | ~8 problems |

**Practice discipline (applies to every unit):** first pass on a new unit — understand the *approach* untimed, watch the video after attempting, not before. Once a unit has 8–10 problems behind it, start timing yourself (25–30 min/medium). Every 2 weeks, cold-redo 2–3 problems from a unit you learned earlier — that's what builds retention, not new problems alone.

---

## MODULE 2 — Databases 🔴

**Objective:** design a real relational schema, write real queries, and reason about when to cache.

| Unit | Concepts inside it | Primary resource | If this doesn't land | Tier |
|---|---|---|---|---|
| 2.1 SQL Fundamentals | SELECT/JOIN types (inner, left, right, full), WHERE/GROUP BY/HAVING, aggregate functions, subqueries | freeCodeCamp — "SQL Tutorial: Full Database Course for Beginners" (Mike Dane), free YouTube, project-based | Search "SQLBolt interactive" for a hands-in-browser alternative | 🔴 |
| 2.2 PostgreSQL & Database Design | Primary/foreign keys, normalization (1NF–3NF), indexing, transactions, Postgres-specific syntax | postgresql.org/docs/current/tutorial.html — go here *after* 2.1 | Search "database normalization tutorial" and "database indexing explained" | 🔴 |
| 2.3 Redis & Caching | Key-value caching, TTL/expiry, cache-aside pattern, when caching helps vs. hides a real problem | Search "Redis crash course Node.js" | Search "Redis crash course" (creator-agnostic) | 🟡 |

---

## MODULE 3 — Testing 🔴

**Objective:** ship code with real automated coverage, not "it worked when I clicked around."

| Unit | Concepts inside it | Primary resource | If this doesn't land | Tier |
|---|---|---|---|---|
| 3.1 Unit Testing (Jest) | Test structure (describe/it), assertions, mocking functions, `beforeEach`/`afterEach`, code coverage | jestjs.io/docs/getting-started (official docs) + search "Programming with Mosh React Testing Library" for a walkthrough | Search "Lama Dev React Testing" — free YouTube, real-world Axios-mocking example | 🔴 |
| 3.2 Component/Integration Testing (RTL) | Testing behavior over implementation, querying by role/text (not by CSS class), simulating user events, async utilities, mocking API calls | testing-library.com/docs/react-testing-library/intro (official docs) | Same as above — Mosh/Lama Dev cover both Jest and RTL together | 🔴 |

---

## MODULE 4 — DevOps & Cloud 🔴 / 🟡

**Objective:** take something from "runs on my machine" to "runs in production, on a schedule you don't have to babysit."

| Unit | Concepts inside it | Primary resource | If this doesn't land | Tier |
|---|---|---|---|---|
| 4.1 Docker | Images vs. containers, Dockerfile syntax, Docker Compose (multi-container apps), volumes, basic networking | freeCodeCamp — "Docker Full Course", free YouTube | Search "Docker crash course" | 🔴 |
| 4.2 AWS Fundamentals | EC2, S3, IAM basics, VPC basics, Elastic Beanstalk, free-tier limits | freeCodeCamp — "AWS Certified Cloud Practitioner" (Andrew Brown, ~14h), free YouTube | Search "AWS fundamentals crash course" | 🔴 |
| 4.3 AWS Hands-On Deployment | Actually containerizing + deploying a real project on AWS (ties 4.1+4.2 together) | freeCodeCamp — "AWS Cloud Project Bootcamp", free | — | 🔴 |
| 4.4 CI/CD & Observability | GitHub Actions pipeline stages (build/test/deploy), structured logging, error tracking (Sentry-style) | Search "GitHub Actions tutorial freeCodeCamp"; separately, "Sentry Node.js tutorial" | Search "CI/CD pipeline explained" | 🟡 |

---

## MODULE 5 — System Design 🔴

**Objective:** hold a 45-minute design conversation without freezing, and reason about trade-offs out loud.

| Unit | Concepts inside it | Primary resource | Tier |
|---|---|---|---|
| 5.1 Core Concepts | Vertical vs. horizontal scaling, CAP theorem, latency vs. throughput, availability | Gaurav Sen (YouTube channel), free | 🔴 |
| 5.2 Networking & APIs | Load balancers, API gateways, REST vs. RPC vs. GraphQL trade-offs, rate limiting | Gaurav Sen + ByteByteGo (YouTube + newsletter), free | 🔴 |
| 5.3 Data & Storage at Scale | SQL vs. NoSQL trade-offs, replication, sharding/partitioning, CDN caching, cache-invalidation strategies, consistent hashing | ByteByteGo, free; search "system design primer" on GitHub for a written companion | 🔴 |
| 5.4 Async & Messaging | Message queues, pub/sub, event-driven architecture | Search "message queues explained system design" | 🟡 |
| 5.5 Classic Design Problems | Design a URL shortener, a rate limiter, a chat app, a news feed, a notification system | Practice writing these out yourself (Excalidraw/draw.io), then check against Gaurav Sen's or ByteByteGo's version of the same problem | 🔴 |

*(Optional, paid, only if free resources aren't sticking: Grokking the System Design Interview on Educative — the closest thing to a "gold standard" structured course.)*

---

## MODULE 6 — Python & Data Foundations 🔴

**Objective:** Python stops feeling foreign; you can read, write, and debug it as fluently as you already do JS.

| Unit | Concepts inside it | Primary resource | Tier |
|---|---|---|---|
| 6.1 Python Core Language | Syntax, data types, control flow, functions, OOP (classes/inheritance), virtual environments, `pip`, file I/O, JSON handling, `requests` library | freeCodeCamp — "Learn Python – Full Course for Beginners" (Mike Dane, ~4h), free YouTube. You already code professionally — move fast through syntax, slow down only where OOP feels genuinely new | 🔴 |
| 6.2 NumPy & Pandas | Arrays and vectorized operations (NumPy); DataFrames, cleaning, filtering, grouping, pivot tables (Pandas) | freeCodeCamp — "Learn Python for Data Science" (Frank Andrade, ~17h), free YouTube — covers both with real projects | 🔴 |

---

## MODULE 7 — Machine Learning Fundamentals 🔴

**Objective:** understand and defend the ML workflow end to end — not research-depth math, workflow fluency.

| Unit | Concepts inside it | Primary resource | Secondary | Tier |
|---|---|---|---|---|
| 7.1 Core ML Concepts | Supervised vs. unsupervised learning, train/test split, overfitting vs. underfitting, bias-variance trade-off, evaluation metrics (accuracy, precision/recall, RMSE) | StatQuest with Josh Starmer (YouTube channel), free — short 5–15 min videos on *why* each concept works | Watch alongside 7.2, not instead of it | 🔴 |
| 7.2 scikit-learn Practical | Linear/logistic regression, decision trees, random forests, model training/evaluation code, cross-validation, feature scaling/encoding | freeCodeCamp — "Machine Learning with Python and Scikit-Learn" (Aakash N S, ~18h), free YouTube, hands-on | Search "scikit-learn crash course" | 🔴 |

**"Done" for this module:** one completed, documented ML mini-project on a real (e.g. Kaggle) dataset — the point isn't model quality, it's proving you understand the full workflow: data → split → train → evaluate → iterate.

---

## MODULE 8 — LLM & Generative AI Engineering 🔴 / 🟡

**Objective:** the actual point of this whole syllabus — go from "understands the concept" to "can build and defend it." Sequenced deliberately: prompting → embeddings → RAG from scratch → RAG with a real vector DB → LangChain → agents → MCP.

| Unit | Concepts inside it | Primary resource | Secondary | Tier |
|---|---|---|---|---|
| 8.1 Prompt Engineering | Zero-shot vs. few-shot prompting, chain-of-thought, system vs. user prompts, structured/JSON outputs, prompt evaluation | DeepLearning.AI — "ChatGPT Prompt Engineering for Developers", free (email signup), ~1.5h, taught by Andrew Ng + an OpenAI researcher | — | 🔴 |
| 8.2 Embeddings & Semantic Search | What an embedding actually is, cosine similarity, comparing embedding models, dense vs. sparse retrieval | Covered inside the RAG-from-scratch resource below — don't learn this in isolation, learn it while building | — | 🔴 |
| 8.3 RAG — From Scratch | Chunking strategies, building a retriever by hand (no framework), grounding generation in retrieved context, hybrid keyword+semantic search | Search "Learn RAG From Scratch" — a free YouTube tutorial by a LangChain engineer, deliberately framework-free so you understand the mechanics first | Venelin Valkov — "What is RAG? The Complete Tutorial: From Scratch to Deployed API on Production" (free YouTube) — goes further: hand-built retriever → LangChain refactor → FastAPI → Docker | 🔴 |
| 8.4 Vector Databases | Indexing basics, similarity search at the database level, when to use Chroma vs. pgvector vs. a managed service | Chroma's own docs (trychroma.com) for the easiest first prototype; pgvector's GitHub docs for the Postgres-backed version (reuses Module 2) | Krish Naik's RAG crash course (YouTube, free) for an alternate walkthrough | 🔴 |
| 8.5 LangChain Fundamentals | Chains, document loaders, retrievers, runnables, prompt templates | docs.langchain.com (official tutorials) — authoritative, stays current as the framework changes fast | — | 🔴 |
| 8.6 AI Agents & Tool-Calling | Function/tool-calling primitives (the core mechanism under every agent framework), the ReAct pattern (reason → act → observe) | Krish Naik — "Agentic AI with LangGraph and MCP Crash Course" (~2.5h, free YouTube) — covers this and the next two units in one course | — | 🔴 |
| 8.7 LangGraph & Multi-Step Agents | State graphs (nodes/edges), building a tool-calling chatbot, memory across turns, streaming, human-in-the-loop feedback | Same Krish Naik course as 8.6 | — | 🔴 |
| 8.8 Model Context Protocol (MCP) | Why MCP exists (tool interoperability across agent frameworks), building a trivial MCP server/tool from scratch | Same Krish Naik course as 8.6 (it ends with an MCP-server-from-scratch section); spec itself at modelcontextprotocol.io | — | 🟡 |
| 8.9 LLM Evaluation & Fine-Tuning Concepts | How to know if a RAG/agent system is actually working (eval harnesses, hallucination checks), LoRA/PEFT — conceptual only, when fine-tuning beats RAG/prompting and vice versa | Search "LoRA fine-tuning explained" and "RAG evaluation metrics explained" | — | 🟢 |

**"Done" for this module:** a public repo where you hand-built a RAG pipeline with a real vector database (8.3–8.5), and a working feature where an LLM calls a real function/tool and acts on the result, not just generates text (8.6–8.7).

---

## MODULE 9 — Interview Readiness 🔴

**Objective:** everything above, retrievable under pressure, in front of another person.

| Unit | Concepts inside it | Approach | Tier |
|---|---|---|---|
| 9.1 Behavioral | STAR method, building a story bank from real achievements you already have (Redux refactor, lead-gen automation, Physynex direction, the Module 8 rebuild itself, Croire Paints ownership) | Write out 5–6 stories in STAR format, then say them out loud, don't just read them | 🔴 |
| 9.2 Technical Conceptual Q&A | React internals (reconciliation, hooks rules, closures), Node.js event loop, REST API design, caching strategies, JWT vs. sessions, CORS, plus the AI-specific set: how RAG works end-to-end, chunking trade-offs, vector vs. keyword search, hallucination mitigation, agent architecture patterns, fine-tuning vs. RAG vs. prompting | You already have a 30-question prep document from an earlier session covering the full-stack half in depth — extend it with the AI-conceptual list above once Module 8 is done | 🔴 |
| 9.3 Mock Practice | Timed DSA under interview conditions, verbal system design, recorded behavioral answers | Pramp (free, peer-matched) or Interviewing.io (free tier); Claude is also a free, always-available option for drilling between scheduled mocks | 🔴 |

---

## Appendix — Full Concept Checklist

Check off units as you close them. This is the same content as above, flattened into one trackable list.

**Module 1 — DSA**
- [ ] 1.1 Complexity Analysis
- [ ] 1.2 Arrays & Hashing
- [ ] 1.3 Two Pointers
- [ ] 1.4 Sliding Window
- [ ] 1.5 Stack
- [ ] 1.6 Binary Search
- [ ] 1.7 Linked List
- [ ] 1.8 Trees
- [ ] 1.9 Tries
- [ ] 1.10 Heap / Priority Queue
- [ ] 1.11 Backtracking
- [ ] 1.12 Intervals
- [ ] 1.13 Graphs
- [ ] 1.14 Advanced Graphs
- [ ] 1.15 Greedy
- [ ] 1.16 1-D Dynamic Programming
- [ ] 1.17 2-D Dynamic Programming
- [ ] 1.18 Bit Manipulation & Math

**Module 2 — Databases**
- [ ] 2.1 SQL Fundamentals
- [ ] 2.2 PostgreSQL & Database Design
- [ ] 2.3 Redis & Caching

**Module 3 — Testing**
- [ ] 3.1 Unit Testing (Jest)
- [ ] 3.2 Component/Integration Testing (RTL)

**Module 4 — DevOps & Cloud**
- [ ] 4.1 Docker
- [ ] 4.2 AWS Fundamentals
- [ ] 4.3 AWS Hands-On Deployment
- [ ] 4.4 CI/CD & Observability

**Module 5 — System Design**
- [ ] 5.1 Core Concepts
- [ ] 5.2 Networking & APIs
- [ ] 5.3 Data & Storage at Scale
- [ ] 5.4 Async & Messaging
- [ ] 5.5 Classic Design Problems

**Module 6 — Python & Data Foundations**
- [ ] 6.1 Python Core Language
- [ ] 6.2 NumPy & Pandas

**Module 7 — Machine Learning Fundamentals**
- [ ] 7.1 Core ML Concepts
- [ ] 7.2 scikit-learn Practical

**Module 8 — LLM & Generative AI Engineering**
- [ ] 8.1 Prompt Engineering
- [ ] 8.2 Embeddings & Semantic Search
- [ ] 8.3 RAG — From Scratch
- [ ] 8.4 Vector Databases
- [ ] 8.5 LangChain Fundamentals
- [ ] 8.6 AI Agents & Tool-Calling
- [ ] 8.7 LangGraph & Multi-Step Agents
- [ ] 8.8 Model Context Protocol (MCP)
- [ ] 8.9 LLM Evaluation & Fine-Tuning Concepts

**Module 9 — Interview Readiness**
- [ ] 9.1 Behavioral
- [ ] 9.2 Technical Conceptual Q&A
- [ ] 9.3 Mock Practice

---

*Companion to Prasanth_FullStack_AI_Roadmap.md — that document has the calendar (what week you do this in) and the strategic analysis; this one is the pure content map. Total: 48 units across 9 modules. If a resource stops being free or gets replaced, search using the concept name in the "Concepts inside it" column — that's the actual technical term, so it'll surface the right content regardless of which specific course is current.*