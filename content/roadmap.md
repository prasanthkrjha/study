# Full Stack + AI Engineering Roadmap — 6 Months

**Prepared for:** Prasanth Kumar Jha · **Based on:** current resume (ATS version) + live job postings + broader July 2026 India tech-hiring data (HireDoor, Taggd, AccioJob) + your actual GitHub/portfolio
**Window:** 6 months, working full-time (10 AM–7/8 PM weekdays)
**Goal:** Full Stack Developer–ready everywhere, AI Engineer–ready for the growing category of applied-AI/GenAI roles

---

### A quick note before we start — corrections folded in

**TCS AI Careers is out of the plan.** No response yet, so it's not a live factor — removed everywhere below.

**On Physynex's AI pipeline — this matters, and it's good news, not bad:** you clarified that while you understand the concepts (retrieval, guardrails, red-flag detection, lead classification), the implementation was AI-assisted — so hands-on, you're honestly not there yet technically. That's a genuinely useful thing to know before spending 6 months on a plan. It changes the shape of Months 3–4 below: instead of "upgrading" the existing pipeline, you now **rebuild it yourself from scratch**, using what it already does as your spec. You already have the part most engineers skip — knowing exactly *what* a real AI feature needs to do and *why*. What's ahead is the hands-on muscle to implement it, which is a much shorter road when the conceptual map is already in your head.

**Research broadened beyond Indeed.** The gap analysis and market context below now pull from India-wide 2026 hiring data (HireDoor's July 2026 hiring report, Taggd's Full Stack and IT hiring reports, AccioJob's hiring trends analysis) alongside live job postings, so it isn't resting on one platform.

This also isn't a cold start. The gaps flagged in your last roadmap — testing, MongoDB depth, system design, DSA, Docker/cloud — are still open and remain the backbone of Months 1–3 below.

---

## Table of Contents

**Part 1 — Where You Stand Today**
1.1 Strengths & transferable skills
1.2 Gap analysis: Full Stack track
1.3 Gap analysis: AI Engineering track
1.4 Skill tiers: essential / recommended / optional
1.5 Interview-ready vs. needs-work
1.6 The strategic call: AI Engineer, not ML Engineer — and why

**Part 2 — Reality Check**
2.1 What 6 months can realistically buy you
2.2 Your weekly time budget
2.3 Trade-offs, stated plainly

**Part 3 — The 6-Month Roadmap** (week-by-week, month-by-month)

**Part 4 — DSA Deep Dive** (progression + problem counts)

**Part 5 — Project Portfolio Plan**

**Part 6 — GitHub & Resume**

**Part 7 — Interview Preparation**

**Part 8 — Learning Resource Guide** (concept-by-concept, with how-to-use notes)

**Part 9 — If Time Gets Tight: Priority Order**

**Appendix — Full Milestone Checklist**

---

## Part 1 — Where You Stand Today

### 1.1 Strengths & Transferable Skills

These are real, and you should stop underselling them:

- **Production React/Next.js/TypeScript depth.** 65+ shipped components, Redux/Context refactors with a measured 30%+ maintainability gain, multiple *live* products (not tutorial projects). This is your floor, not your ceiling — it's already competitive.
- **Backend-adjacent range most "frontend" candidates don't have.** Node.js middleware design, the BFF pattern, secure API proxying (sanitization, token forwarding, header injection), Express. You already think about backend concerns — you just haven't formalized the database/testing/infra side yet.
- **Genuine product-level understanding of applied AI — still rare, even without the hands-on code yet.** You specified and directed exactly what a serious AI feature needs: retrieval logic (keyword + embeddings hybrid), topic/guardrail controls, red-flag symptom detection, lead classification. Most engineers never get this far — they either avoid AI features entirely or bolt on a raw API call with no product thinking. To be precise about where you actually stand (per your own correction): the Physynex implementation was AI-assisted, so the hands-on technical depth — writing the retrieval code yourself, defending every choice under questioning — isn't there yet. That's exactly what Months 3–4 rebuild, using Physynex's own requirements as the spec. Pulled from live job postings while researching this: an Accenture "AI/ML Engineer" listing (7.5 yrs min) and a remote "Senior Full Stack AI Engineer" role (₹22–30 LPA) both ask for this shape of work. You already understand the shape of the job — the roadmap builds the hands to match.
- **Full delivery-lifecycle exposure.** CI/CD (Jenkins), deployment, third-party integrations (HubSpot, Webflow, ZeroBounce).
- **Entrepreneurial/product range that's unusual at 2–3 years in.** Physynex and Croire Paints (croirepaints.com — a live 3D product showcase using Three.js/React Three Fiber, currently not on your resume) are real, live, customer-facing products you built and shipped, not internal-only assignments. This is strong behavioral-interview material.
- **You quantify everything.** 30%+, 25%, 20%, 15% — this is genuinely good resume practice and most candidates don't do it.

### 1.2 Gap Analysis — Full Stack Developer Track

Checked against your resume, your actual GitHub, and real "Full Stack Developer" postings on Indeed India (2–6 yrs band) as of July 2026:

| Gap | Why it matters | Evidence |
|---|---|---|
| **SQL / relational databases** | Near-universal expectation alongside or instead of MongoDB. A live GLOINNT "Full Stack Developer (MERN/MEAN)" posting and a Carlton IT listing both explicitly wanted relational DB comfort, not just Mongo. | 0 mentions on resume |
| **Automated testing** | "Write clean, maintainable code and perform unit testing" appears directly in a real job description you're a strong fit for otherwise. | 0 mentions on resume/GitHub |
| **DSA / coding-interview fluency** | Still gates most Indian tech interviews regardless of role or seniority. | No LeetCode/competitive profile referenced |
| **System design fundamentals** | Standard from mid-level up; increasingly asked even at 2–3 YOE for product companies. | Not mentioned |
| **Docker** | Table-stakes for "owns a feature end-to-end" positioning. | Not mentioned |
| **One cloud platform (recommend AWS)** | Two of three detailed job postings pulled during research explicitly required AWS or Azure service familiarity, not just Jenkins CI/CD. | Not mentioned |

### 1.3 Gap Analysis — AI Engineering Track

| Gap | Why it matters | Evidence |
|---|---|---|
| **Python** | The single biggest blocker. Every AI-adjacent posting pulled — Accenture's AI/ML Engineer role, the Gen AI Solutions Engineer role, the remote Full Stack AI Engineer role — lists Python as a must-have, often "advanced." Your resume has zero Python. | 0 mentions |
| **ML fundamentals (workflow-level)** | Not deep math — but you should be able to explain train/test splits, overfitting, evaluation metrics, and when classical ML beats an LLM call. | Not present |
| **Hands-on RAG implementation** | You directed and understand the concept (retrieval, guardrails, red-flagging, lead classification) — genuinely good product instinct — but the code itself was AI-assisted. Writing and defending the implementation yourself is the real gap, not just adding a vector database on top of something you already built by hand. Treat Month 3 as building the thing for the first time, not upgrading it. | Physynex's pipeline exists and works, but wasn't hand-built by you |
| **Agent frameworks + tool use** | Every mid-to-senior AI job posting checked (Accenture, CloudiQS) explicitly asks for agentic libraries — LangChain/LangGraph, AutoGen, or AWS's Strands/Bedrock AgentCore. | Not present |
| **Model Context Protocol (MCP) awareness** | As of mid-2026, MCP has become the standard tool-interoperability layer across essentially every major agent framework (LangGraph, CrewAI, Claude Agent SDK, OpenAI Agents SDK, Strands) — and it's explicitly listed as a "must-have" in the CloudiQS senior posting. Worth knowing conceptually even before you're using it daily. | Not present |

### 1.4 Skill Tiers

**Essential (blocks you from being competitive without it):**
SQL/Postgres · Testing (Jest + RTL) · DSA · System design basics · Docker · One cloud platform · Python · Applied ML fundamentals · Real RAG with a vector database · Basic agent/tool-use pattern

**Recommended (strong differentiator, not a hard blocker):**
GitHub Actions CI/CD · Redis · WebSockets · Basic observability (error tracking/logging) · FastAPI (Python backend — several AI-engineer postings specifically want this alongside or instead of Node) · LangChain/LangGraph fluency · MCP hands-on · LLM evaluation basics · Fine-tuning concepts (conceptual, not hands-on)

**Optional (nice to have, don't chase these first):**
GraphQL · Kubernetes · React Native · Multi-cloud · Computer vision · Deep learning math / training models from scratch · Open-source contributions to third-party projects

### 1.5 Interview-Ready vs. Needs Significant Work

**Interview-ready right now:**
- React/JS/TS fundamentals, hooks, component architecture, state management patterns
- Node.js/Express, REST API design, middleware/auth/session concepts
- Explaining Physynex's AI assistant at the *product/architecture* level — what it does, why each piece exists (guardrails, red-flagging, lead classification) — you already have a 30-question prep document from an earlier session covering this and general React/JS/Node fundamentals; reuse and extend it, don't rebuild it
- Agile process questions, ownership/initiative stories (Physynex, Croire Paints)

**Needs significant work:**
- DSA in *timed coding-interview format* specifically (you code well on the job — that's a different skill from solving an unseen problem in 30 minutes)
- System design in whiteboard/verbal-reasoning format
- SQL (currently ~zero)
- Testing (currently ~zero)
- **Defending Physynex's RAG implementation at the code level** — right now, "walk me through how you built the retrieval logic" is a genuine risk area, because you can explain the *what* and *why* but not yet every implementation choice. This closes specifically in Month 3, once you've rebuilt it yourself.
- Python/ML/AI technical depth beyond the prompt-engineering level — you can't yet defend vector DB trade-offs, chunking strategy choices, or agent architecture decisions in an interview
- Cloud/deployment architecture depth (Jenkins CI/CD is real experience, but it's not the same as being able to reason about AWS service choices)

### 1.6 The Strategic Call: AI Engineer, Not ML Engineer

This distinction matters enough to state plainly, because it determines what you spend your limited hours on.

**ML Engineer / LLM Engineer** — trains, fine-tunes, and optimizes models from the inside. Requires real depth in linear algebra, probability/statistics, and frameworks like PyTorch/TensorFlow. Realistic timeline to competitive: 12–24+ months of focused study, often alongside formal coursework. Not what you're asking for, and not necessary for the roles your profile fits.

**AI Engineer** — takes existing foundation models (GPT, Claude, Gemini, Llama) via API and builds reliable, production-grade *systems* around them: RAG pipelines, agents, tool-calling workflows, evaluation harnesses. Requires strong software engineering (you have this), Python, and applied understanding of LLM behavior — not model internals. This is a software engineering job with an AI-shaped surface area, and it's the fastest, highest-upside move for someone already building production software, which is exactly your position.

Market data backs this, and not just from one source: current industry comparisons describe the field shifting hard toward AI engineer roles for working software engineers specifically *because* you keep everything you already know and layer applied-AI skills on top, rather than starting a new specialization from zero. Broader India-specific data points the same direction — a July 2026 hiring report tracking 18,400+ Indian tech listings found AI Engineer roles growing faster month-over-month than any other tracked role (+21%), averaging ₹18.8 LPA, with Bengaluru alone accounting for over a third of listings; separately, "AI-Integrated Full-Stack Developer" is now named explicitly as one of the highest-demand full-stack role categories in India for 2026, which is precisely the hybrid position this roadmap is built to get you into. That's this roadmap's entire bet. Every AI-track item below (Python, RAG, vector DBs, agents, MCP) is chosen because it serves the AI Engineer path — not the ML research path.

---

## Part 2 — Reality Check

### 2.1 What 6 Months Can Realistically Buy You

Being direct, as you asked:

- **Full Stack readiness: very achievable, close to done.** You're not starting from zero — you're closing five well-defined gaps (SQL, testing, DSA, system design, Docker/cloud) on top of a genuinely strong existing base. Six months at a sustainable pace comfortably gets you interview-ready across the mid-level Full Stack market.
- **"AI Engineer" (applied/product AI, RAG + agents): achievable and realistic.** This is a software-engineering skill layered on top of skills you already have. Six months is enough to build 2–3 genuinely strong, defensible AI-integrated projects and speak fluently about the concepts.
- **"ML Engineer" (training/fine-tuning models from scratch, research-depth math): not realistic in 6 months alongside a full-time job**, and — per the strategic call above — not the path that matches either your background or where the market is pulling. If a role explicitly demands this, it's outside this roadmap's scope; that's a 12–24 month investment with a different daily structure (much more math, much less shipping).
- **DSA depth vs. breadth.** ~180–200 problems over 6 months (detailed in Part 4) is a strong bar for mid-tier-and-above product companies and matches what most working engineers achieve in this timeframe. If you specifically target FAANG-tier companies, expect their bar to sit higher (often 300–400+ problems, refined over a longer window) — worth knowing now rather than discovering it in month 5.
- **Doing both tracks at once means slower depth in each** than focusing on one alone. The sequencing below is deliberately designed so Full Stack fundamentals (which you're closer to finishing) land first, and AI depth builds on top — so if time gets tight anywhere, you fall back to "strong Full Stack engineer with real applied-AI experience," which is itself a highly competitive, hard-to-fake position, not a failure state.

### 2.2 Your Weekly Time Budget

Built around 10 AM–7 PM weekdays (sometimes 8 PM), with burnout avoidance as a hard constraint — and restructured around single-subject focus per session, not split hours. That's the right call for technical material: switching subjects mid-session costs you the ramp-up time twice, and real understanding needs enough unbroken time to read/watch *and* immediately practice, not just skim two things shallowly.

| Day | Window | Focus (one subject, full session) | Time |
|---|---|---|---|
| Mon | 8:30–10:30 PM | DSA — full session | 2h |
| Tue | 8:30–10:30 PM | Full-Stack topic — full session | 2h |
| Wed | 8:30–10:30 PM | DSA — full session | 2h |
| Thu | 8:30–10:30 PM | AI/Python topic — full session | 2h |
| Fri | Flexible | Light DSA review, or fully off | 0–1h |
| Sat | Morning + afternoon | Project work — one continuous focus (the mid-session break is for rest, not for switching subjects) | 4h |
| Sun | Morning | One single-focus block, rotating weekly: DSA weak-spot review, OR extended theory/course video, OR extra project time — whichever the week needs most | 2.5h |
| Sun | End of session | Logistics only — plan next week. Not a learning task, so it doesn't break the single-focus rule | 0.5h |
| Sun | Afternoon/evening | Rest — protected, not optional | 0h |

**Total: ~15–16 hrs/week → ~65–70 hrs/month → ~400–420 hrs over 6 months.** Same total as the original design — this repackages the hours into deeper, uninterrupted blocks, it doesn't add hours.

**How this maps onto the month-by-month tables in Part 3:** the "DSA" column = your Monday + Wednesday sessions. The "Full-Stack" column = your Tuesday session. The "AI/Python" column = your Thursday session. Project work = mostly Saturday, with Sunday as overflow if something needs more room that week.

**On 8 PM days:** don't try to force the full 2h block in — shift to 9:00–10:30 PM (1.5h) and keep it single-subject, just shorter. A shorter uninterrupted block beats a full-length one chopped into two subjects.

**Non-negotiable:** at least one full day off per week (built in above as Sunday evening + flexible Friday). If you miss a day, don't double up the next day to "catch up" — just resume the plan. Catch-up cramming is the single most common cause of burnout-driven quitting in self-study plans like this one.

### 2.3 Trade-offs, Stated Plainly

1. **Depth vs. breadth in DSA:** you're optimizing for "strong at most companies," not "strongest possible at any company." If a specific FAANG-tier interview appears on your calendar, you'll want a 3–4 week intensive bump beyond this plan.
2. **AI Engineer vs. ML Engineer:** covered in 1.6 — this roadmap deliberately does not chase deep ML math or from-scratch model training. That's the right call for your timeline and background, but it does mean roles that specifically want research-level ML depth stay out of reach after 6 months.
3. **Two tracks, one calendar:** if a month runs short, Part 9 tells you exactly what to cut and what to protect. Full Stack fundamentals are protected first; the more exploratory AI-agent work is the first to compress.
4. **Simultaneous job interviewing:** Months 5–6 assume you're also actively interviewing, which eats into study time. That's intentional — the point of the roadmap is to get hired, not to keep studying indefinitely.

---

## Part 3 — The 6-Month Roadmap

Each month = 4 weeks. Each week follows the template in 2.2 unless noted.

### MONTH 1 — Foundation Repair + Python Onboarding

**Focus:** Close the cheapest, highest-signal full-stack gaps. Get Python fluent enough to build with. Start the DSA habit.

| Week | DSA | Full-Stack | AI/Python |
|---|---|---|---|
| 1 | Arrays & Hashing (~12 problems) | Jest fundamentals — unit test a few existing components | Python syntax, data types, control flow (fast — you already think like a programmer) |
| 2 | Arrays & Hashing cont. + Two Pointers start (~13 problems) | React Testing Library — test user interactions, not implementation details | Python: functions, OOP basics, virtual environments, pip |
| 3 | Two Pointers cont. (~10 problems) | PostgreSQL setup + schema design, primary/foreign keys | Python: file I/O, JSON handling, `requests` library, working with APIs |
| 4 | Review + fill gaps (~5 problems, revisit misses) | SQL: joins, indexes, normalization basics; write queries against your own schema | Small Python CLI project (below) |

**Project:** Retrofit test coverage onto one existing component/small app (Jest + RTL). Separately, build a small Python CLI tool (e.g., a script that hits a public API and formats the output) — trivial in scope, but it's the thing that makes Python stop feeling foreign.

**Month 1 Milestone:**
- [ ] 35–40 DSA problems solved, comfortable with arrays/hashing/two-pointers patterns
- [ ] Can write and run Jest + RTL tests without looking up basic syntax
- [ ] Local Postgres instance running with a real schema (not just a tutorial one)
- [ ] Comfortable writing a 50–100 line Python script from scratch

---

### MONTH 2 — Backend Depth + Data Tooling

**Focus:** Containerize and deploy something for real. Get hands dirty with data in Python. First ML workflow end-to-end.

| Week | DSA | Full-Stack | AI/Python |
|---|---|---|---|
| 5 | Sliding Window (~8 problems) | Docker fundamentals — containerize an existing Node/Next app | NumPy + Pandas basics |
| 6 | Stack (~10 problems) | Docker Compose (multi-container: app + Postgres) | Pandas: cleaning and exploring a real dataset |
| 7 | Binary Search (~10 problems) | Deploy the containerized app (AWS free tier — EC2 or Elastic Beanstalk; or Render/Railway if you want a gentler on-ramp first) | scikit-learn: train/test split, a basic classifier, evaluation metrics |
| 8 | Linked List (~12 problems) | Redis basics — add a caching layer to something you've built | "ChatGPT Prompt Engineering for Developers" (DeepLearning.AI, free, ~1.5h) + start the LangChain short course |

**Project:** Ship the Docker + cloud deployment as a real, live URL. Separately: one classical ML mini-project on a Kaggle dataset (classification or regression) — the point isn't the model quality, it's proving you understand the *workflow* (data → split → train → evaluate → iterate).

**Month 2 Milestone:**
- [ ] ~40 more DSA problems (cumulative ~75–80)
- [ ] One project running in Docker, deployed, and reachable via a public URL
- [ ] A completed, documented ML mini-project (even a simple one) showing the full workflow
- [ ] Comfortable with Pandas for data cleaning/exploration

---

### MONTH 3 — System Design Basics + Real RAG (Flagship Project #1)

**Focus:** This is the month your AI story gets genuinely strong. You already know exactly what Physynex's retrieval system needs to do — you specified it — but it was AI-assisted, not hand-built. Now you build the same thing yourself, with real infrastructure this time.

| Week | DSA | Full-Stack | AI |
|---|---|---|---|
| 9 | Trees (~10 problems) | System design: scalability, caching, load balancing, CAP theorem (concepts only) | Embeddings deep-dive: how they're generated, what "similarity" means, chunking strategies |
| 10 | Trees cont. (~8 problems) | Practice designing: URL shortener, rate limiter (write it out, don't just read about it) | Vector databases: start with Chroma (fastest path to a working prototype) |
| 11 | Tries + Heap (~10 problems) | Practice designing: a basic chat app backend | LangChain fundamentals — retrieval chains, document loaders |
| 12 | Heap cont. + review (~5 problems) | — | Build: rebuild Physynex's retrieval pipeline yourself, from scratch, with a real vector database — same requirements, your own code this time |

**Project — Flagship #1:** This is a genuine from-scratch build, not a refactor. You already know the spec cold (you directed it) — now you implement every piece yourself for the first time: chunking, embedding calls, similarity search, guardrail logic, red-flag detection. Don't build it *inside* Physynex's private codebase. Build it as a **separate, standalone, public repo** — a small reusable RAG engine (chunking + embedding + Chroma/pgvector retrieval) — then wire it into Physynex once it works. Two wins at once: the hands-on RAG skill you're actually missing, and a genuinely public, well-documented repo with real production usage behind it, which solves a gap you have on GitHub right now (more in Part 6).

**Month 3 Milestone:**
- [ ] ~35 more DSA problems (cumulative ~110–115)
- [ ] Can whiteboard 3 classic system designs out loud, unscripted
- [ ] A working, public RAG repo *you wrote yourself*, with a real vector database, integrated into a live product
- [ ] Can defend every implementation choice — chunking strategy, embedding trade-offs, guardrail logic — because you wrote it this time, not just explain what it's supposed to do

---

### MONTH 4 — AI Agents + Advanced Full-Stack (Flagship Project #2)

**Focus:** Move from "retrieves information" to "takes action." This is the differentiator that shows up explicitly in senior AI job postings (tool use, agentic libraries, MCP) — you're building the junior version of that now.

| Week | DSA | Full-Stack | AI |
|---|---|---|---|
| 13 | Graphs — BFS/DFS (~8 problems) | WebSockets basics (real-time feature on an existing project) | Function/tool calling with LLM APIs — the core primitive under every agent framework |
| 14 | Graphs cont. (~8 problems) | Basic observability — structured logging + error tracking (Sentry or similar) on a deployed project | LangGraph basics — state, cycles, multi-step reasoning |
| 15 | Advanced Graphs (~8 problems) | — | Model Context Protocol (MCP) — read the spec, understand why it exists, build one trivial MCP tool |
| 16 | Greedy (~8 problems) | — | Build: an agentic feature with real tool-calling |

**Project — Flagship #2:** Give your AI assistant the ability to *act*, not just answer. Two options — pick based on comfort experimenting on a live product:
- **Extend Physynex:** connect the assistant to your real booking system (check availability, book a slot) via tool calling — powerful because it's a real production feature with real constraints.
- **Standalone agent project:** if you'd rather not touch Physynex's production path yet, build a fresh agentic project in the same domain (a booking/scheduling agent, or a research/support agent) as its own public repo. Lower risk, same learning, still portfolio-worthy.

Either way: this is where MCP awareness pays off directly, since it's explicitly listed as a requirement in current senior full-stack-AI postings.

**Month 4 Milestone:**
- [ ] ~32 more DSA problems (cumulative ~142–147)
- [ ] A working feature where the LLM calls a real function/tool and acts on the result (not just generates text)
- [ ] Can explain the difference between a RAG pipeline and an agent in interview-level terms
- [ ] Basic logging/error tracking live on at least one deployed project

---

### MONTH 5 — Integration, Capstone, and Interview Prep Begins

**Focus:** Hardest DSA stretch (Dynamic Programming). Build the flagship portfolio piece. Start mock interviews and applications — don't wait until month 6 to begin either.

| Week | DSA | Full-Stack | AI |
|---|---|---|---|
| 17 | 1-D DP intro (~8 problems) | Polish pass: add missing tests, tighten READMEs across all projects | LLM evaluation basics — how to know if your RAG/agent is actually working well |
| 18 | 1-D DP cont. (~7 problems) | Accessibility + performance audit on your best project | Fine-tuning concepts — LoRA/PEFT, conceptual only (what it's for, when RAG beats it) |
| 19 | 2-D DP (~7 problems) | **Start Capstone build** (see Part 5) | **Capstone build continues** |
| 20 | 2-D DP cont. + Bit Manipulation (~8 problems) | **Capstone build continues** | **Capstone build continues** |

**Project — Capstone:** A new, fully public, fully original full-stack + AI project — auth, database, deployed, tested, with a RAG and/or agent feature. This is designed specifically to fix the gap Part 6 identifies: right now your public GitHub doesn't reflect your actual skill level, and your best work (Sangeetha Connect, Physynex core, Croire Paints) is proprietary or client work you can't open-source wholesale. This one is 100% yours to publish. Ideas in Part 5.

**Also starting this month:**
- First mock interviews (technical + behavioral)
- First job applications — don't wait for "fully ready," start applying once Month 5 begins

**Month 5 Milestone:**
- [ ] ~30 more DSA problems (cumulative ~172–177)
- [ ] Capstone project live, public, and well-documented on GitHub
- [ ] At least 2 mock interviews completed
- [ ] Applications in flight

---

### MONTH 6 — Interview Sprint

**Focus:** Everything now points at getting hired. Review, drill weak spots, interview heavily.

| Week | DSA | System Design | Behavioral | Applications |
|---|---|---|---|---|
| 21 | Remaining topics (Bit Manipulation, Math) + timed practice (~10 problems) | 2 more mock designs (chat app, feed system) | Finalize STAR stories from real bullets | Ramp up volume |
| 22 | Timed mixed practice, company-tagged sets (~10 problems) | Mock design with a peer or on Pramp | Record yourself answering common questions | Continue |
| 23 | Weak-topic remediation (~8 problems) | Final review of core building blocks | Mock interview #3–4 | Continue |
| 24 | Light review only — protect energy for real interviews | — | — | Active interviewing |

**Month 6 Milestone:**
- [ ] ~190–200 total DSA problems solved across the 6 months
- [ ] 4+ mock interviews completed (technical + behavioral + system design)
- [ ] Resume, LinkedIn, GitHub all reflect the new skill set
- [ ] Actively interviewing across both Full Stack and AI-hybrid roles

---

## Part 4 — DSA Deep Dive

**Target: 180–200 problems over 24 weeks (~8 problems/week average).** This is a strong bar for mid-tier-and-above product companies. Structure follows the standard pattern-based progression, because pattern recognition transfers better than raw problem count. Full detail on exactly where to learn each topic below is in Part 8.1 — short version: takeuforward.org's structured site is your primary path, NeetCode 150 is your secondary explanation when something isn't landing.

**Primary resource:** Striver's A2Z DSA Course (takeuforward.org) — free, follow the site itself in sequence, not the YouTube channel on its own (see Part 8.1 for why).
**Secondary resource:** NeetCode 150 (neetcode.io) — free, video walkthroughs organized by pattern; use for a second explanation when Striver's isn't clicking.
**Platform:** LeetCode free tier is sufficient for the full plan.

| Weeks | Topic | Problems | Cumulative |
|---|---|---|---|
| 1–2 | Arrays & Hashing, Two Pointers | ~25 | 25 |
| 3–4 | Sliding Window, Stack | ~18 | 43 |
| 5–6 | Binary Search, Linked List | ~20 | 63 |
| 7–8 | Trees | ~18 | 81 |
| 9–10 | Tries, Heap / Priority Queue | ~15 | 96 |
| 11–12 | Backtracking, Intervals | ~18 | 114 |
| 13–14 | Graphs | ~15 | 129 |
| 15–16 | Advanced Graphs, Greedy | ~15 | 144 |
| 17–18 | 1-D Dynamic Programming | ~15 | 159 |
| 19–20 | 2-D DP, Bit Manipulation, Math | ~12 | 171 |
| 21–22 | Timed mixed review + company-tagged sets | ~15 | 186 |
| 23–24 | Weak-spot remediation + final review | ~10–15 | ~196–201 |

**How to practice, not just what:**
- First pass on a new pattern: understand the *approach*, don't time yourself. Watch the NeetCode video after attempting, not before.
- Once a pattern has 10+ problems behind it: start timing yourself (25–30 min per medium problem).
- Every 2 weeks: redo 2–3 problems from a pattern you learned 2+ weeks ago, cold. This is what actually builds retention — new problems alone don't.
- From Month 5 onward: simulate real interview conditions — no IDE autocomplete, explain your thinking out loud while you code, use a timer.

---

## Part 5 — Project Portfolio Plan

Five projects, each mapped to a month, each pulling double duty (skill-building + portfolio evidence):

1. **Month 1 — Tested & Typed:** Existing project retrofitted with real Jest + RTL coverage, plus a small Python CLI tool. Not flagship-tier, but proves testing discipline.
2. **Month 2 — Containerized & Deployed:** A full-stack app running in Docker, deployed to AWS (or Render/Railway), with a companion classical-ML mini-project (Kaggle dataset, scikit-learn) showing the full ML workflow.
3. **Month 3 — RAG Engine (Flagship #1):** Standalone, public, reusable RAG module (chunking + embeddings + Chroma or pgvector) — built from scratch, by hand, using Physynex's existing behavior as the spec. This is where "understands the concept" becomes "can implement it," which is the actual gap right now — then it gets integrated into Physynex.
4. **Month 4 — Agentic Feature (Flagship #2):** Real tool-calling — either a booking agent wired into Physynex, or a standalone agent project in the same domain.
5. **Month 5 — Capstone (Flagship #3):** A brand-new, fully public, fully original full-stack + AI project. Suggested directions (pick whichever you'd actually enjoy using):
   - **A DSA/interview-prep tracker with an AI coach** — genuinely useful to you personally (dogfooding this exact roadmap), auth + DB + a RAG-backed Q&A feature over your own notes + an agent that quizzes you.
   - **A document/knowledge-base assistant** for a domain you know (e.g., physiotherapy content, given your Physynex context) — upload docs, RAG-based Q&A, source citations.
   - **A smart support/FAQ agent-as-a-service** — multi-tenant, auth, a dashboard, an agent that can look up order/booking status via tool calls against a seeded database.

   All three exercise the same muscles: auth, database design, deployment, testing, RAG, and agentic tool use — pick based on what you'd stay motivated to keep polishing.

Each project needs, before you consider it "done": a live deployed URL, a README with an architecture diagram/screenshot, and test coverage on the core logic. A project without a README that explains *why*, not just *what*, reads as unfinished to anyone reviewing your GitHub.

---

## Part 6 — GitHub & Resume

### 6.1 What your GitHub actually shows right now

Checked directly (github.com/prasanthkrjha): 5 public repos — `BlogPage`, `Student-Enrollment-System`, `Weather-Update`, `dashboard-react`, `LandingPage`. These read as early-coursework projects. None of your real, production-grade work (Sangeetha Connect, Physynex, Croire Paints) has a public repo — understandably, since two are proprietary/client work. But the practical effect is that anyone who clicks through from your resume to your GitHub right now sees a much weaker signal than your actual level.

**This is exactly what Months 3–5's flagship projects are designed to fix** — they're deliberately built as new, standalone, public repos rather than changes buried inside private codebases.

**Concrete actions:**
- [ ] Add `github.com/prasanthkrjha` to your resume header — it's linked from your portfolio site but currently missing from the resume itself, which is the document ATS systems and recruiters scan first.
- [ ] Add a profile README (a repo named exactly `prasanthkrjha/prasanthkrjha`) — short intro, current focus (Full Stack + Applied AI), pinned project links.
- [ ] Once Months 3–5 projects are live, pin them (RAG engine, agentic feature, capstone) so they're what a visitor sees first — you don't need to delete the older repos, just stop leading with them.
- [ ] Each new repo: proper README (problem, architecture, tech stack, live link, screenshots, setup steps), meaningful commit history — not `fix`, `fix2`, `final fix`.
- [ ] Optional, lower priority: one or two small open-source contributions (docs fixes, small bug fixes) to a library you're already using (LangChain, a UI library) — real but not essential signal.

### 6.2 Resume Adjustments

Your resume is already in solid shape — quantified bullets, clean ATS-friendly structure, no fluff. Specific additions as your skills land, not all at once:

- **Immediately:** add the GitHub link (above).
- **After Month 3:** once the RAG engine repo is live, it's your strongest possible bullet — a standalone, open-source RAG module with a real integration, distinct from "used the OpenAI API."
- **After Month 4:** add a distinct "AI/ML Engineering" skills subsection (separate from your current "AI & Integrations" line) once Python, vector DBs, and agent frameworks are genuinely in daily use — this is what lets ATS keyword scans and recruiters searching for "AI Engineer" actually surface you.
- **Once testing is real (Month 1+):** a short line reflecting test coverage practice, either in a project bullet or the skills section.
- **Worth considering, space permitting:** Croire Paints (croirepaints.com) isn't on your resume at all right now, and it shows Three.js/3D work — a different axis than your other two listed projects. Only add it if you have room without crowding the AI story, which should stay the lead differentiator.
- **Keep the one-page discipline** you already have — resist the urge to add everything at once as new skills land.

---

## Part 7 — Interview Preparation

### 7.1 Technical Topics to Cover

**Full-stack conceptual (you're closer here than you think — extend, don't restart):**
React internals (reconciliation, rendering behavior, hooks rules, closures) · Node.js event loop · REST API design principles · database indexing & normalization · caching strategies (client, CDN, server, DB-level) · auth patterns (JWT vs. sessions) · CORS. You already have a 30-question interview-prep document from an earlier session covering React/JS fundamentals, the Node.js middleware/BFF pattern, and Gen AI/Physynex architecture at the conceptual level — treat that as your base layer for process and concept questions. Its Physynex answers cover the *what and why*; pair them with Month 3's rebuild so you can also answer the *how*, line by line, when someone digs in.

**AI/LLM conceptual (new ground — this is where you need the most reps):**
How RAG actually works end-to-end · chunking strategy trade-offs · when vector search beats keyword search (and when it doesn't) · embedding model selection trade-offs · hallucination mitigation approaches · prompt injection awareness (genuinely relevant to you — you already specified red-flag/guardrail detection for Physynex, so frame this as an extension of the security thinking you already demonstrated at the product level, now backed by Month 3's hands-on rebuild) · agent architecture patterns (the ReAct loop, tool calling, single-agent vs. multi-agent) · fine-tuning vs. RAG vs. prompting trade-offs.

**DSA & System Design:** covered in Parts 3 and 4.

### 7.2 Behavioral Preparation

Use the STAR method, and build your story bank from bullets you already have real evidence for:
- The Redux/Context refactor (30%+ maintainability) → *technical decision-making, code quality ownership*
- HubSpot/Webflow/ZeroBounce integration (25% efficiency) → *cross-functional collaboration, ambiguity*
- The Physynex retrieval pipeline (the original spec and direction) → *initiative, product thinking, translating a real user need (patient safety, lead quality) into AI feature requirements*
- The Month 3 rebuild and Month 4 agent-building work from this roadmap → *self-directed technical learning, closing your own gaps deliberately, growth mindset*
- Physynex and Croire Paints as products, not just codebases → *ownership, end-to-end thinking, entrepreneurial range*

### 7.3 Mock Interviews & Coding Practice Cadence

- **Months 1–4:** untimed DSA practice, focus on pattern recognition.
- **Month 5:** first mock interviews — Pramp (free, peer-matched) or Interviewing.io (free tier) for technical rounds; record yourself for behavioral answers and review the playback.
- **Month 6:** 1 mock interview per week minimum (technical, system design, or behavioral, rotating), plus timed LeetCode practice under interview conditions.
- Claude itself is a free, always-available option for drilling behavioral answers or talking through a system design out loud — useful between scheduled mocks, not a replacement for them.

---

## Part 8 — Learning Resource Guide (Concept-by-Concept)

### 8.0 How to actually learn each type of topic

Direct answer to the real question: it depends on the topic, not a one-size answer, and each item below is matched to how it's genuinely best learned rather than just a platform name.

- **DSA specifically:** a structured *site* beats browsing a YouTube channel, because sequencing and mixing theory-with-practice matters more than any single video — see 8.1.
- **Most other topics:** one long-form "full course" video from a named creator, watched start to finish, works well — it's pre-sequenced by the creator, so you're not stitching together random clips yourself.
- **Official docs:** your reference to come back to *after* the video, not your first stop for learning something from zero.

### 8.1 DSA — Concept by Concept

**Primary path:** takeuforward.org/strivers-a2z-dsa-course — the site, not the YouTube channel browsed on its own. Striver (Raj Vikramaditya, ex-Google/Amazon/Media.net) has said directly not to just watch his channel top-to-bottom — the *site* organizes ~455 problems across ~19 topics with the right video embedded at the right point, theory and problems together, in the order you should learn them. This is exactly the "one thing that teaches concept by concept" you asked for, and it already matches the topic order in Part 4 — follow it in sequence.

**Secondary / alternate explanations:** NeetCode 150 (neetcode.io/practice) — same core patterns, grouped by category, one short video per problem. Use this specifically when Striver's explanation of a topic isn't landing — a second teacher's framing often unsticks it.

**Platform to solve on:** LeetCode (free tier is enough).

### 8.2 Full-Stack — Concept by Concept

| Concept (from the plan) | Primary resource | Format |
|---|---|---|
| Testing — Jest + RTL | Search "Programming with Mosh React Testing Library" or "Lama Dev React Testing" | Free YouTube video, then testing-library.com/docs as your reference afterward |
| SQL / relational DB basics | freeCodeCamp — "SQL Tutorial: Full Database Course for Beginners" (Mike Dane) | Free YouTube, project-based — you build a Mario database, a bike-rental DB, etc. |
| PostgreSQL specifics | postgresql.org/docs/current/tutorial.html | Official docs — go here *after* the SQL course, for Postgres-specific syntax |
| Docker | freeCodeCamp — "Docker Full Course" | Free YouTube, comprehensive |
| AWS fundamentals | freeCodeCamp — "AWS Certified Cloud Practitioner" course (Andrew Brown, ~14h) | Free YouTube |
| AWS hands-on (Month 2's deploy step) | freeCodeCamp — "AWS Cloud Project Bootcamp" | Free — walks through containerizing and deploying a real project on AWS, matches what Month 2 asks you to do |
| System design fundamentals | Gaurav Sen (YouTube channel) | Free — explains scaling, caching, load balancing simply before going deep |
| System design, visual reference | ByteByteGo (YouTube + newsletter) | Free |
| System design, practice problems | Search "system design primer" on GitHub | Free, community-maintained roadmap + problem bank |
| System design, structured paid option | Grokking the System Design Interview (Educative) | Paid — closest thing to a "gold standard," optional, only if free resources aren't sticking |

### 8.3 AI / Python — Concept by Concept

| Concept (from the plan) | Primary resource | Format / note |
|---|---|---|
| Python fundamentals (Month 1) | freeCodeCamp — "Learn Python – Full Course for Beginners" (Mike Dane, ~4h) | Free YouTube — you already code professionally, so move fast through syntax and slow down only where OOP feels genuinely new |
| NumPy + Pandas (Month 2) | freeCodeCamp — "Learn Python for Data Science" (Frank Andrade, ~17h) | Free YouTube — covers Pandas/NumPy specifically with real projects, exactly what Month 2 needs |
| ML fundamentals, hands-on | freeCodeCamp — "Machine Learning with Python and Scikit-Learn" (Aakash N S, ~18h) | Free YouTube — hands-on with linear/logistic regression, decision trees, random forests |
| ML fundamentals, *why it works* | StatQuest with Josh Starmer (YouTube channel) | Free — short 5–15 min videos on the intuition behind each algorithm; watch alongside the course above, not instead of it |
| Prompt engineering | DeepLearning.AI — "ChatGPT Prompt Engineering for Developers" | Free (email signup), ~1.5h, taught by Andrew Ng + an OpenAI researcher |
| RAG — from scratch first | Search "Learn RAG From Scratch" (tutorial by a LangChain engineer) | Free YouTube — builds real understanding before a framework does the work for you; do this *before* the LangChain-based one below |
| RAG — scratch to production | Venelin Valkov — "What is RAG? The Complete Tutorial: From Scratch to Deployed API on Production" | Free YouTube — mirrors Month 3's arc almost exactly: hand-build a retriever → refactor with LangChain → wrap in FastAPI → containerize with Docker |
| RAG, alternate walkthrough | Krish Naik's RAG crash course (YouTube) | Free — Krish Naik is one of the most-followed AI/ML educators for Indian learners specifically; worth knowing his channel generally, you'll likely end up back there |
| LangChain fundamentals | docs.langchain.com (official tutorials) | Free, authoritative, stays current as the framework changes fast |
| Agents + LangGraph + MCP (Month 4) | Krish Naik — "Agentic AI with LangGraph and MCP Crash Course" (~2.5h) | Free YouTube — unusually well-matched to Month 4: LangGraph basics, a tool-calling chatbot, ReAct agent architecture, memory, and building an MCP server from scratch, all in one course |
| MCP, the spec itself | modelcontextprotocol.io | Official docs, straight from the source |
| Vector databases | Chroma's docs (trychroma.com) for the easiest first prototype; pgvector's GitHub docs once you want the Postgres-backed version | Official docs — both are simple enough to learn directly, no video needed |

### 8.4 If Something Isn't Listed — Search This Way

For recommended/optional-tier topics not deep-dived here (they matter less right now — see Part 9), use this exact phrasing so you land on real structured content instead of generic results:

- Redis caching → "Redis crash course Node.js"
- WebSockets → "Socket.io crash course" or "WebSockets Node.js tutorial"
- GitHub Actions CI/CD → "GitHub Actions tutorial freeCodeCamp"
- Observability/error tracking → "Sentry Node.js tutorial" or "structured logging Node.js"
- Fine-tuning concepts → "LoRA fine-tuning explained" or "PEFT fine-tuning tutorial"
- Database indexing/normalization → "database indexing explained" or "database normalization tutorial"
- JWT vs. sessions → "JWT vs session authentication explained"
- CAP theorem → "CAP theorem explained simply"
- GraphQL (optional) → "GraphQL crash course freeCodeCamp"

**General rule for anything not listed at all:** search "[topic] freeCodeCamp" first — their channel is consistently well-sequenced and free — then "[topic] crash course" as a fallback. Both phrasings reliably surface full structured tutorials instead of 3-minute clips.

### 8.5 Mock Interviews & Tools

| Need | Resource | Cost |
|---|---|---|
| Mock technical interviews | Pramp (peer-matched) | Free |
| Mock interviews, alternate | Interviewing.io | Free tier |
| Diagramming for system design | Excalidraw, draw.io | Free |

---

## Part 9 — If Time Gets Tight: Priority Order

If a week or a month runs short, this is the cut order — protect the top, compress or drop from the bottom.

**Tier 1 — Never skip, even if reduced in volume:**
1. DSA consistency (fewer problems/week is fine; stopping entirely is not)
2. Testing (Jest/RTL) — cheap to learn, commonly screened for
3. SQL fundamentals — near-universal expectation
4. One deployed, tested, cloud-hosted full-stack project
5. Python fundamentals + one working RAG project (your minimum viable AI story)

**Tier 2 — Compress before eliminating:**
6. System design (keep the vocabulary and 3–4 practiced designs even if you cut practice volume)
7. Docker (can go conceptual-only if truly squeezed)
8. ML fundamentals coursework (shrink to "can explain the workflow," skip the polished project)

**Tier 3 — First things to cut if the calendar demands it:**
9. AI agents / MCP depth (a strong differentiator, not a baseline requirement)
10. GraphQL, WebSockets, Redis, observability tooling
11. Fine-tuning experiments (conceptual understanding is enough regardless)
12. Open-source contributions to other people's projects
13. Kubernetes, multi-cloud, advanced infrastructure

---

## Appendix — Full Milestone Checklist

- [ ] **Month 1:** 35–40 DSA problems · Jest+RTL fluency · local Postgres schema · basic Python scripting
- [ ] **Month 2:** ~75–80 cumulative DSA problems · one Dockerized + cloud-deployed project · one completed ML mini-project
- [ ] **Month 3:** ~110–115 cumulative DSA problems · 3 whiteboard-ready system designs · public RAG repo you hand-built yourself, integrated into Physynex
- [ ] **Month 4:** ~142–147 cumulative DSA problems · working agentic/tool-calling feature · basic observability live
- [ ] **Month 5:** ~172–177 cumulative DSA problems · capstone project live and public · 2+ mock interviews · applications started
- [ ] **Month 6:** ~190–200 total DSA problems · 4+ mock interviews completed · resume/LinkedIn/GitHub fully updated · actively interviewing

---

*Built from your resume, your live GitHub and portfolio, live job postings, and broader July 2026 India tech-hiring data (HireDoor, Taggd, AccioJob) for both Full Stack Developer and AI Engineer roles. Revisit this monthly — if a role or interview surfaces a gap this plan didn't anticipate, adjust Part 9's priority order rather than the whole plan.*