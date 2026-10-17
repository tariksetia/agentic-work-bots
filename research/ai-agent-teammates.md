# AI agent teammates: market scan

Researched 2026-10-17 with the Firecrawl CLI. Fourteen web searches from different angles ("AI teammate", "AI coworker", "AI employee", "digital worker", "agentic teammate for Slack", "AI SDR digital worker", "assign tasks to an agent in Linear/Jira", "AI coworker with its own computer", and others), four comparison articles (Viktor x2, Agenta, Gamma), and one scrape of each candidate's product page.

Raw output is in `.firecrawl/agent-teammates/`:
- `search/q1.json` to `q14.json`: search results
- `lists/`: comparison articles
- `pages/<slug>.md`: one product page per company (Grok Bot and Meta Muse are copied from the earlier scrapes)
- `urls.txt`: slug-to-URL map

OpenAI products (ChatGPT Work, Codex) were left out on purpose and not scraped.

**Scope.** An "AI agent teammate" here means an agent that joins a team's existing workspace (Slack, Teams, email, a project tracker or a code host), takes on assigned work and finishes it with little hand-holding. Pure chatbots and pure workflow builders are out. Big-platform agents (Slackbot, Asana, Atlassian, Microsoft, GitHub, Linear) are in, because they compete for the same job.

---

## 1. Companies (41)

### A. General-purpose teammates that live in team chat

| Company / product | URL | One-line pitch | Main features |
|---|---|---|---|
| **xAI: Grok Bot** | x.ai/bot | "Message Bots like teammates." AI teammates that finish the work | Each Bot has its own computer and signs into your apps; learns a workflow by watching you do it once and saves it as a routine; scheduled routines; several Bots in one thread hand work to each other; keeps context and learns over time. $30, $100 or $200 a month |
| **Viktor** | viktor.com | "Not a tool. A hire." The AI employee that lives in Slack and Teams | Takes tasks end to end (research, build, update tools); offers to turn one-off asks into recurring jobs; incident handling (opens the incident, pages on-call, stages the rollback); asks before anything it can't undo; 9,800+ integrations; says 72k teams use it |
| **Lindy** | lindy.ai | "Your AI teammate that plugs into your tools, learns how you work" | @mention in Slack for ad-spend debugging, support triage (Zendesk/Intercom), finding the bad PR behind an outage, Stripe reconciliation; one-click action buttons (pause, revert, page someone); memory; $50 free credits |
| **Runbear** | runbear.io | "AI teammates your whole team can @mention" | Named, shared agents (@SalesOps, @Support, @HR) in Slack and Teams; uses team knowledge from Notion, Zendesk and HubSpot; drafts replies for a human to approve; 2,000+ tools; no-code; $99 or $399 a month |
| **Dash** (Dashpup) | dashpup.ai | "The best hire your team will make this year." | Set up once, used by the whole team in Slack and Teams; automatic Monday update; publishes with your approval; works the shared inbox; covers pipeline, ad spend, support escalations and code branches; "ask, approve, ship" |
| **Tasklet** | tasklet.ai | "Run your business on agents" | Describe a goal, connect tools, runs 24/7; shared agents, connections and context across the team; any MCP server or API; uses a browser when there's no API |
| **Anthropic: Claude Tag** | (Slack app; source is a TechStartups article, 2026-06-23) | Claude joins Slack "as a team member" | @Claude in any granted channel and hand it tasks; access to chosen tools, data and codebases; remembers context over time; admins control access per channel; beta for Enterprise and Team plans |
| **Slack: Slackbot** | slack.com/features/slackbot | "Personal AI agent for work" | Native agent that works across connected apps; Slack CRM; shareable skills; one answer posted for the whole channel |
| **Salesforce: Agentforce in Slack** | slack.com/ai-agents | "Turn agents into teammates" | Agent templates; uses conversation context; automates Slack actions; guardrails, zero data retention, toxicity monitoring |
| **Zapier Agents** | zapier.com/agents | "Meet your new AI teammates" | Hand real work to agents backed by live business data across Zapier's app catalogue; builds an "AI dream team" |
| **Agenta** | agenta.ai | "AI coworkers that learn how you work" | Agents defined by trigger, steps, rules and escalation; bring your own subscription or model; its own computer and workspace; chat in the tools your team already uses; self-hostable |
| **Dust** | dust.tt | "Multiplayer AI for human-agent collaboration" | Agents grounded in company context; multiplayer, cross-functional work; choice of model; governance; templates for engineering, support, sales, marketing and data ops; 3,000+ orgs |
| **Coworker AI** | coworker.ai | "Right context, right model, anywhere you work" | OM2 organizational-memory knowledge graph; routes each request to the cheapest model that can do it (claims 9x to 51x cheaper); 50+ connectors; works through MCP in any client; SOC 2; US-hosted |

### B. Personal and small-business "AI employees"

| Company | URL | Pitch | Main features |
|---|---|---|---|
| **Meta: Muse** | ai.meta.com/muse | "AI that gets it done." A personal AI agent | Browses the web, makes purchases, creates documents, uses Connectors; keeps working in the background after the app closes; asks you to approve critical actions; free tier plus paid; Mac app |
| **Sintra** | sintra.ai | "AI Employees: your first digital workers team that never sleep" | A roster of named helpers (Soshie for social, Cassie for support, Vizzy for meeting prep); learns your business; shared workspaces; about $16 to $24 a month |
| **Spinnable** | spinnable.ai | "Hire AI employees for any role, from $50/month" | Each worker gets its own email address and phone number; persistent memory; follows up on its own; reachable in Slack and WhatsApp |
| **CellCog** | cellcog.ai | "Hire an AI employee for any role" | Hire with one prompt; each employee gets its own computer, inbox, phone and task board; hands coding work to Claude Code, Codex or Cursor and checks the result; output goes to a Drive you own; sits in meetings; can use your computer with permission; from $29 a month |
| **Workforce AI** | hireworkforce.ai | "ChatGPT gives you advice. Workforce does the work." | Joins Zoom as a talking face; takes work by text, WhatsApp, email or chat; pauses to show you what it will do before acting; 60+ integrations; $249 a month, pitched against a $30/hr hire |
| **Teammates.ai** | teammates.ai | "Autonomous AI teammates for customer service, sales & hiring" | Role-based AI employees, from $25 a month |
| **Supervity** | supervity.ai | "Hire an AI employee" | A catalogue of role-specific finance, procurement and sales employees mapped to SAP modules (GL, AP/AR, procure-to-pay and more) |

### C. Teammates built into work platforms

| Company | URL | Pitch | Main features |
|---|---|---|---|
| **Asana: AI Teammates** | asana.com/product/ai/ai-teammates | "Your team just got bigger" | Agents that work on Asana projects: launch briefs, status reports, OKR risk, intake triage and SLA flags, go/no-go checks; many integrations |
| **Teamwork.com: AI Teammates** | teamwork.com/ai/teammates | "AI built for how teams actually work" | Named agents: Scout (productivity, joins meetings), Flo (project health, client updates), Dotty (support desk), Jack (custom jobs); Remi (resourcing) and Kash (profitability) coming soon |
| **Atlassian: Rovo** | atlassian.com/software/rovo | "AI that knows your business" | Teamwork Graph for context; third-party SaaS connectors; available in Atlassian apps, desktop, mobile, a browser extension and over MCP |
| **Linear: Agents** | linear.app/agents | "Artificial colleagues. Natural collaboration." | Assign issues to agents while the human stays the main assignee ("delegate issues, but not accountability"); live progress; orchestration; built-in Linear Agent; build your own |
| **Microsoft: Copilot Cowork** | microsoft.com (Inside Track article) | "From AI assistant to capable teammate" | Multi-step work in Word, Excel, PowerPoint, Outlook and Teams; up to 20 custom skills; Work IQ context; approval checkpoints; available through the Frontier program |
| **GitHub: Copilot agents** | github.com/features/copilot/agents | "AI agents that do more than write code" | Background coding agent; pick an agent per task; manage agents and tasks together; reviews PRs |

### D. Engineering and ops teammates

| Company | URL | Pitch | Main features |
|---|---|---|---|
| **Cognition: Devin** | devin.ai | "Your team's autonomous software engineer" | Runs in the cloud or locally; tests in its own browser; keeps going until the PR is ready to merge; works from Slack, Linear and Jira; automations, security scans, review, wiki; enterprise security |
| **Factory** | factory.ai | "Build your autonomous software factory" | "Droids" that plan, build, review and ship from desktop, terminal, web and CLI; work inside your code host, tracker, chat and CI; works with any model (Claude, Gemini, Grok, Kimi and others); Droid Computers, dedicated hardware for running agents locally |
| **Edge Delta: AI Teammates** | edgedelta.com/product/agentic-teammates | "Meet your AI teammates" | Four agents (SRE, security, software engineer, cloud): cut alert noise, find root causes, suggest fixes; performance dashboards |

### E. Revenue and customer-facing digital workers

| Company | URL | Pitch | Main features |
|---|---|---|---|
| **Artisan** (Ava) | artisan.co | "Ava runs your GTM. Your team gets to be more human." | Finds and enriches leads, sends personalized outreach as your reps, books meetings; two-way CRM sync; turns manual touches into rep tasks; 6,000+ sales teams |
| **11x** (Alice, Julian) | 11x.ai | "Agents that drive revenue" | Inbound, outbound and account expansion over voice, chat, email, social and SMS; named digital workers |
| **Qualified** (Piper) | qualified.com/ai-sdr | "Meet Piper, the #1 AI SDR Agent" | Never misses an inbound lead; face-to-face website engagement; email nurture; books meetings; personalized offers; works with the team in Slack |
| **Buzz** | buzz.ai | AI SDR that "runs multichannel outreach on its own" | Lookalike and intent-based prospecting; enrichment waterfall; scheduled updates and reports; always-on conversations |
| **Relevance AI** | relevanceai.com | "Invent 2.0: your 24/7 AI solutions engineer" | Helps teams decide what to automate and build an "AI workforce" (multi-agent); embedded deployment team; evals, monitoring, governance |
| **Sierra** | sierra.ai | "The leading conversational AI platform for businesses" | Customer-facing agents across chat, SMS, WhatsApp, email, voice and ChatGPT; Ghostwriter builds agents from SOPs; monitors and experiments; outcome-based pricing |
| **Ema** | ema.co | "AI employees for HR, IT, and Finance" | Always-on builder; EmaFusion mixes models; "live in days"; free trial |
| **Moveworks** (ServiceNow) | moveworks.com | "AI that gets work done" | One AI front door for employee requests; 1,000+ prebuilt agents; customizable agents; built for regulated data |
| **Glean Agents** | glean.com/product/ai-agents | "Scale agents like enterprise software" | Orchestrate, build, test, monitor and govern agents on top of Glean's enterprise index |
| **DevRev: Computer** | devrev.ai | "What is an AI teammate?" (company blog) | Reasoning, Memory ("team intelligence"), Actions (read and write across the stack), Conscience (built-in governance); support-triage focus |
| **A.Team** | a.team | "Agentic AI teammates for consumer brands" | Agentic teammates on an intelligence layer over brand data; starts work before anyone asks; automated reporting |

### F. Infrastructure for human-and-agent teams

| Company | URL | Pitch | Main features |
|---|---|---|---|
| **Ando** | ando.so (source is a TechCrunch article, 2026-09-24) | Team messaging built for human and AI workers | Positioned as a Slack replacement; agents get their own identity and inbox; $20M pre-seed and seed from Accel, Index and Emergence |

**Found in comparison lists but not scraped:** Perplexity Computer, OpenClaw, Gumloop, Notion AI Agent, Vellum, Atomicwork, Aisera, Rezolve.ai, n8n, Claude Cowork. Also ChatGPT Work and Business, which are OpenAI products and were skipped on purpose.

---

## 2. Most common features (ranked by number of companies, out of 41)

I tagged each feature by hand after reading the scraped pages, and cross-checked with keyword counts. Treat the numbers as approximate.

| # | Feature | Companies | Notes |
|---|---|---|---|
| 1 | **Connects to the tools you already use** (integrations, connectors, MCP) | ~38 | Table stakes. The selling point has become the size of the catalogue: Viktor 9,800+, Runbear 2,000+, Tasklet "any MCP or API", Moveworks 1,000+ agents |
| 2 | **Works in team chat (Slack and/or Teams)** | ~27 | The main way work gets handed over. Slack is ahead of Teams. Most pages show an @mention screenshot |
| 3 | **Persistent memory / learns your business over time** | ~22 | Pitched as a knowledge graph (Coworker OM2, Rovo Teamwork Graph, DevRev Memory, Microsoft Work IQ) or as "learns how you work" (Lindy, Agenta, Grok Bot, Sintra) |
| 4 | **Runs in the background, on a schedule, 24/7** | ~22 | Recurring routines and reports (Viktor's Monday report, Dash's Monday update, Grok Bot routines, Tasklet 24/7, Muse keeps going after the app closes) |
| 5 | **Human approval before risky actions** | ~18 | Viktor, Muse, Dash, Workforce AI, Copilot Cowork, Linear's accountability model, Agentforce guardrails, DevRev "Conscience" |
| 6 | **Hired like a named employee or role** | ~16 | Ava, Alice and Julian, Piper, Viktor, Devin, Scout, Flo and Dotty, Soshie and Cassie, Runbear's @SalesOps. Priced against a salary |
| 7 | **Email as a channel, or its own inbox** | ~16 | SDRs (Artisan, 11x, Qualified, Buzz); SMB employees with their own address (Spinnable, CellCog); Ando gives agents inboxes |
| 8 | **Enterprise security and governance** (SOC 2, SSO, per-channel permissions, zero retention) | ~15 | Strongest on enterprise and platform products |
| 9 | **Shared, multiplayer agents** (anyone on the team can use the same agent) | ~13 | Runbear, Tasklet, Dust, Claude Tag, Slackbot, Dash, Agenta, Sintra workspaces |
| 10 | **No-code setup** (describe it in plain English, or show it once) | ~12 | Sierra Ghostwriter builds from SOPs; Grok Bot learns by watching; Tasklet and CellCog take a one-line brief |
| 11 | **Writes code, opens PRs, handles incidents** | ~11 | Devin, Factory, GitHub, Linear, Edge Delta, plus generalists (Lindy, Viktor, Dash, Agenta, Claude Tag) |
| 12 | **Several agents that hand work to each other** | ~10 | Grok Bot threads, Relevance agent teams, Teamwork.com's lineup, Edge Delta's four agents, CellCog passing work to coding agents |
| 13 | **Voice, phone or meetings** | ~8 | 11x voice, Sierra voice, Workforce AI on Zoom, CellCog and Spinnable phone numbers, Teamwork.com Scout and Copilot in meetings |
| 14 | **Its own computer or browser** | ~8 | Grok Bot, Devin, Factory, CellCog, Agenta, Tasklet (browser fallback), Muse (web browsing) |
| 15 | **Works with any model / routes between models** | ~6 | Factory, Coworker, Dust, Agenta, Ema (EmaFusion) |
| 16 | **Outcome-based pricing** | 1 | Sierra only |

### Pricing (where the page shows it)
- **Consumer and SMB:** $16 to $50 a month per "employee" (Sintra, Teammates.ai, CellCog, Spinnable). Grok Bot is $30, $100 or $200 a month. Muse has a free tier.
- **Teams:** Runbear $99 or $399 a month. Workforce AI $249 a month.
- **Enterprise** (Sierra, Ema, Moveworks, Glean, Relevance, Devin, Factory): contact sales or usage-based.

---

## 3. Notable outliers

- **Ando** builds the workspace, not the agent: a Slack replacement where agents have their own identities and inboxes. It's the only one betting that today's chat tools can't host agents well.
- **Grok Bot** learns by watching you do a task once and saving it as a routine. Its Bots also pass work between themselves without approving every step ("you watch them take action instead of approving every step"). Most products go the other way and add more approval gates.
- **Factory: Droid Computers** is physical hardware for running agents locally, the only hardware product in the set.
- **CellCog** gives each employee its own computer, inbox and phone, and has it hand coding work to Claude Code, Codex or Cursor and then check the result. It manages other agents rather than replacing them.
- **Workforce AI** joins Zoom calls as a talking face instead of a silent note-taker.
- **Linear** formalizes "delegate, not abdicate": the human stays the primary assignee and the agent is listed as a contributor.
- **Sierra** charges by outcome ("pay for a job well done"), and it's the only one that does.
- **Coworker AI** sells on cost (9x to 51x cheaper through organizational memory plus model routing) rather than on capability.
- **Supervity** packages employees as SAP job roles (GL specialist, AP manager), the most narrowly vertical catalogue found.
- **Meta Muse** is consumer-first and can make purchases for you, which none of the team-focused products advertise.

## 4. Takeaways for bot-works
- Integrations, Slack/Teams presence, memory and scheduled background work are now the baseline. A new entrant needs all four on day one.
- Products try to stand out on **trust** (approval flows, accountability, per-channel permissions), **identity** (named hires with their own inbox, phone or computer) and **economics** (outcome pricing, cheaper model routing).
- Open gaps: few products charge by outcome, few teammates work in both Slack and Teams equally well, and team-level multi-agent handoff (Grok Bot style) is still rare outside the large vendors.

## Caveats
- Claude Tag, Copilot Cowork, Ando and DevRev were judged from news or blog articles, not product pages. Moveworks is now part of ServiceNow.
- Some pages were heavy on animation and scraped thinly (Teammates.ai, A.Team, Sierra), so their feature lists may be incomplete.
- Pricing is as shown on the page on 2026-10-17.
