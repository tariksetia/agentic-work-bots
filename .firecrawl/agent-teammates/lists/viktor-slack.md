Compare 7 AI agents for Slack: pricing, setup, permissions, and which fits your team. Slackbot, Agentforce, Dust, Glean, Moveworks, Zapier, Viktor.

The seven AI agents for Slack worth comparing in 2026 are Viktor, an [AI employee](https://viktor.com/ai-employee) who does recurring work end to end in Slack and Microsoft Teams; Slackbot and native Slack AI, for teams on Business+; Salesforce Agentforce, for organizations that run on Salesforce; Dust, for teams that build many narrow agents; Glean, for enterprise knowledge search; Moveworks, for IT and HR helpdesks; and Zapier, for rule-based automation across apps.

Pricing checked October 2026. Every figure below links to the vendor page it came from.

The market calls these Slack AI agents. Viktor’s category is “AI employee”: an AI employee does the work end to end, including recurring Tasks on a schedule, instead of only answering questions. Every Slack AI integration also inherits Slack’s plan gates, so the required Slack tier sits next to each price.

## What are Slack AI agents, and how do they differ from bots and assistants?

Slack’s developer documentation defines agents as “autonomous, goal-oriented AI apps that can reason, use tools, and maintain context across conversations in Slack. They go beyond simple Q&A bots by planning actions, calling external systems, and iterating on results without constant human intervention” ( [docs.slack.dev](https://docs.slack.dev/ai)). Four terms get mixed up when people search for a Slack AI agent, a Slack bot AI or a Slack AI assistant.

- **Slackbot:** Slack’s built-in helper, which reached [general availability on January 13, 2026](https://www.salesforce.com/news/press-releases/2026/01/13/slackbot-announcement/) for Business+ and Enterprise+ customers.
- **Assistant:** a reactive app that waits for a prompt. Salesforce describes an AI assistant as one that “Responds to a person’s commands, one request at a time” ( [Salesforce](https://www.salesforce.com/agentforce/ai-agents/)).
- **Autonomous agent:** Gartner separates assistants, which “depend on human input and do not operate independently,” from agents that “have the capacity to operate and perform complex, end-to-end tasks” ( [Gartner, August 2025](https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025)). The same release calls mislabelling assistants as agents “agentwashing”.
- **Proactive agent:** Slack says proactive agents “use context to identify problems and make recommendations on how to solve them,” and can act on preset instructions ( [Slack](https://slack.com/blog/productivity/proactive-ai-agents-definition-core-components-and-business-value)). In practice it starts from a schedule, a webhook or a data change rather than from someone typing.

Most Slack apps are invoked by an @mention in a channel, a DM, the agent view in the sidebar or a thread reply, though support varies; Claude Code in Slack “does not work in direct messages (DMs)” ( [Claude Code docs](https://code.claude.com/docs/en/slack)).

## The best AI agents for Slack at a glance

| Product | What it does in Slack | Best for | Entry price | Required Slack plan |
| --- | --- | --- | --- | --- |
| Viktor | AI employee who runs recurring Tasks across tools | Ops teams whose recurring work spans several tools | $0 plan with up to $100 in free credits, no credit card; paid plans from $50 per month per workspace, no per-seat fee | Free or paid Slack |
| Slackbot and Slack AI | Summaries, search answers and recaps over Slack content | Teams already on Business+ | Bundled in paid plans; Business+ $15 per user per month, billed annually | Pro for basic AI; Business+ for Slackbot and search answers |
| Salesforce Agentforce | CRM-grounded agents in channels | Sales and service teams on Salesforce | $0.10 per action via Flex Credits, or $125 per user per month unmetered add-on | Any Slack plan plus an Agentforce license |
| Dust | Custom agents that answer @Dust in channels | Teams building many narrow agents | Pro seat $24 per month, billed annually | None stated on the Marketplace listing |
| Glean | Permission-aware enterprise search | Large organizations with knowledge across many tools | Quote only | Paid Slack plan for the Assistant view |
| Moveworks | IT and HR ticket deflection | Enterprise IT and HR helpdesks | Quote only | Business+ or Enterprise+ for real-time search |
| Zapier | Trigger-action Zaps and Zapier Agents | Predictable rule-based automation | Free tier; Professional $19.99 per month billed annually ($29.99 monthly) | Free or paid Slack |

## What makes an AI agent worth running in Slack?

Score each candidate on six things.

- **Invocation:** it should answer an @mention and a DM, and ideally run on a trigger without anyone asking.
- **Department fit:** Moveworks is built for IT and HR tickets, Agentforce for CRM records and Zapier for moving data between apps.
- **Setup effort:** it ranges from one OAuth screen for a Marketplace app to a connected Salesforce org and admin activation for Agentforce ( [Slack help](https://slack.com/help/articles/36218109305875-Set-up-and-manage-Agentforce-in-Slack)).
- **Permissions:** check the OAuth scopes and whether answers respect channel and file access. Slack’s guidance is that “Every app should only have the minimum permissions (scopes) necessary to perform its function” ( [docs.slack.dev](https://docs.slack.dev/concepts/security)).
- **Pricing model:** per-seat, per-action, per-task and credit pricing diverge at volume.
- **Required Slack tier:** search is the hidden upgrade. Moveworks needs Business+ or Enterprise+ for real-time search, Glean needs a paid plan for its Assistant view, and the Free plan caps a workspace at 10 apps ( [Slack help](https://slack.com/help/articles/115003205446-Slack-plans-and-features)).

## Viktor: the AI employee for recurring work

Viktor is an [AI employee](https://viktor.com/ai-employee) who [works in Slack](https://viktor.com/integrations/slack) and Microsoft Teams, connects to 3,200+ tools and does the work. You invoke him as @Viktor in any channel he has been added to, or in a DM, and he also works through chat in the Viktor web app, available to all users since August 6, 2026 ( [Viktor changelog](https://viktor.com/changelog)).

[See the 3,200+ tools Viktor connects to →](https://viktor.com/integrations)

A recurring Task for an ops manager runs like this:

1. Input: “@Viktor every Monday at 8 a.m., compare open HubSpot pipeline and paid Stripe invoices with the forecast in Google Sheets.”
2. Transformation: he reconciles mismatched account names, flags closed-won deals with no invoice and asks owners in Slack for missing PO numbers.
3. Output: he posts the variance summary and a PDF in #ops-updates, then runs again the next Monday.

He also opens GitHub pull requests, updates CRM records and builds internal apps in Viktor Spaces.

**Pros:**

- Install from the [Slack Marketplace](https://slack.com/marketplace/A0A2VN5TR5K) and connect tools, most through one-click OAuth.
- Pricing is usage-based per workspace with no per-seat charge: the $0 plan includes up to $100 in free credits with no credit card, and paid plans start at $50 a month per workspace ( [viktor.com](https://viktor.com/pricing)).
- He asks for confirmation before high-stakes actions such as sending external email or deploying to production.
- He holds SOC 2 Type 1 and CASA Tier 3, runs in isolated workspaces and does not train models on customer data ( [viktor.com](https://viktor.com/security)).

**Cons:**

- SOC 2 Type 2 and ISO 27001 are in progress, so a team that needs a completed Type 2 report at signing should ask for the timeline.
- Cost tracks the work he does, so watch credit use in the first month before scheduling many Tasks.
- He reads only the channels he is invited to.

**Best for:** operations teams whose recurring reports cross several tools and who want the finished deliverable posted. [Start with up to $100 in free credits, no credit card required.](https://viktor.com/pricing)

## Slackbot and native Slack AI: the agent you already have

Slack no longer sells the AI add-on on its website. The features are bundled into paid plans, and the add-on itself retires on March 1, 2027 for customers who still hold it through a sales contract ( [Slack help](https://slack.com/help/articles/4426294050451-Slack-feature-and-plan-retirements)). Before June 2025 it cost [$10 per user per month](https://www.salesforce.com/news/stories/slack-ai-news-update/).

So the cost of Slack AI is the plan price. Pro is $7.25 per active user per month billed annually ($8.75 monthly) and includes conversation summaries, huddle notes and automatic search filters ( [Slack](https://slack.com/pricing/pro)). Business+ is $15.00 billed annually ($18.00 monthly) and adds search answers, recaps, file summaries, translations, AI workflow automation and Slackbot ( [Slack](https://slack.com/pricing/businessplus)), capped at 15 messages per member per week ( [Slack help](https://slack.com/help/articles/53579676130195-Slackbot-limits-and-credit-usage)). Enterprise+ adds enterprise search and enterprise-grade AI; Slack lists it at $45 per user per month billed annually, sold through sales ( [Slack](https://slack.com/pricing)).

Native AI works on Slack data; pulling from Stripe or HubSpot needs a connector step, an MCP server connected to Slackbot or a third-party app ( [docs.slack.dev](https://docs.slack.dev/ai)).

**Pros:**

- No third-party install or extra vendor review.
- Workflow Builder gained a “Generate AI response” step on May 21, 2026 that summarizes, extracts action items and classifies text from channels, canvases, lists and files ( [Slack](https://slack.com/blog/news/generate-ai-steps-workflow-builder)).
- Salesforce announced 30 new AI features for Slack on March 31, 2026, rolling out over the following months ( [TechCrunch](https://techcrunch.com/2026/03/31/salesforce-announces-an-ai-heavy-makeover-for-slack-with-30-new-features/)).

**Cons:**

- Free and Pro get Slackbot only in a trial or preview.
- Workflow Builder caps workflows at 100 steps and keeps conditional branching to Business+ and above ( [Slack help](https://slack.com/help/articles/26800170438419-FAQ--Slack-Workflow-Builder)).
- In August 2024 PromptArmor showed that indirect prompt injection could make Slack AI leak private-channel content; Slack patched it on August 20, 2024 and reported no unauthorized access ( [PromptArmor](https://promptarmor.substack.com/p/data-exfiltration-from-slack-ai-via), [Slack](https://slack.com/blog/news/slack-security-update-082124)).

**Best for:** teams already on Business+ who want summaries and answers over their own channels.

## Salesforce Agentforce: the CRM-connected agent

Agentforce runs on “all Slack plans with a Salesforce Agentforce license” ( [Slack help](https://slack.com/help/articles/36218786859667-Use-Agentforce-in-Slack)), so the Salesforce contract is the constraint, not the Slack tier. A Slack owner or admin requests the connection, a Salesforce System Admin approves it and a Slack owner activates it ( [Slack help](https://slack.com/help/articles/30754346665747-Connect-Salesforce-and-Slack)). Slack users without a Salesforce account need a provisional license, which Salesforce offers as a no-cost Identity license ( [Slack](https://slack.com/blog/news/digital-labor-for-every-team)).

Salesforce lists three models plus editions with bundled credits ( [Salesforce](https://www.salesforce.com/agentforce/pricing/)):

- Flex Credits at $500 per 100,000; a standard action uses 20 credits, or $0.10.
- Conversations: pay per conversation for customer-facing agents, available to existing Conversations customers through an account executive.
- Per-user licences: a $5 metered user licence plus credits, or an unmetered add-on at $125 per user per month, sold on top of a qualifying edition: Core and above on current pricing ( [Salesforce](https://www.salesforce.com/sales/pricing/)), or the Enterprise, Unlimited and Performance editions listed on its add-ons page ( [Salesforce](https://www.salesforce.com/sales/pricing/add-ons/)).

Salesforce announced new Sales Cloud editions on September 3, 2026, and says existing customers keep their pricing on legacy editions ( [Salesforce newsroom](https://www.salesforce.com/news/stories/salesforce-simplifies-editions-2026/)). Core costs $195 per user per month, billed annually ( [Salesforce](https://www.salesforce.com/sales/pricing/)).

**Pros:**

- Agents read live Salesforce data, so a rep can act on a deal from a channel.
- Salesforce’s Business Associate Addendum lists named Agentforce services as HIPAA Covered Services once a BAA is signed ( [Salesforce](https://www.salesforce.com/company/legal/business-associate-addendum-restrictions/)); confirm coverage for the Employee Agent type used in Slack before relying on it.
- Salesforce announced Agentforce Steps in Slack Workflow Builder on March 5, 2025, designed so a Slack event can trigger an agent without a user asking ( [Salesforce](https://www.salesforce.com/news/press-releases/2025/03/05/agentforce-2dx-news/)).

**Cons:**

- Someone has to design each agent and its data sources first.
- Several pricing models make the monthly cost hard to forecast.
- Agents in Slack are employee-facing, so unless users hold the unmetered add-on, their actions draw on the org’s shared Flex Credits.

**Best for:** organizations already on Salesforce with an admin team that can own agent design. Ask your Salesforce admin whether your edition qualifies for the unmetered add-on.

## Dust: the builder for many narrow agents

Dust lets a team build agents from connected data and talk to them as @Dust in Slack channels. A Free seat costs $0 with 500 lifetime credits, and a free workspace is capped at 5 members ( [Dust docs](https://docs.dust.tt/docs/user-documentation/admins/usage-seats-and-credits/seat-management)). Pro costs $24 per seat per month billed annually with 8,000 credits a month, Max costs $120 per seat per month billed annually with 40,000 credits, and the Business plan allows up to 3 data connectors and 5 Spaces ( [Dust](https://dust.tt/home/pricing)).

Syncing Slack channels into Dust requires each workspace to create its own Slack app (“Dust Data Sync”); connections on the legacy shared app were supported only until March 3, 2026 ( [Dust docs](https://docs.dust.tt/docs/user-documentation/admins/connections-management/slack)). The interactive @Dust bot is a separate Marketplace app, switched on from workspace settings. Slack Tools run on personal OAuth, so agent actions “will appear as if you performed them directly” ( [Dust docs](https://docs.dust.tt/docs/user-documentation/agents/tools/slack-tools)).

**Pros:**

- Sync covers only the channels an admin selects.
- Dust’s Slack scopes are public: the Data Sync manifest lists 4 user and 17 bot scopes ( [Dust docs](https://docs.dust.tt/docs/user-documentation/admins/connections-management/slack)), and the Marketplace listing shows 28 user and 18 bot token scopes ( [Slack Marketplace](https://slack.com/marketplace/A09214D6XQT-dust)).
- Dust announced HIPAA compliance on January 29, 2025 ( [Dust changelog](https://docs.dust.tt/docs/changelog)).

**Cons:**

- The interactive app asks for broad access, including user-level write scopes.
- Credits vary by model and task and do not roll over.
- The self-created sync app adds admin work.

**Best for:** teams that want several narrow agents, such as a support-policy bot or a sales-collateral bot.

## Glean: permission-aware enterprise search

Glean publishes no prices: glean.com/pricing redirects to the homepage, where the only sales call to action is “Get a demo” ( [Glean](https://www.glean.com/)). Its docs describe two pricing models, [Core Suite](https://docs.glean.com/glean-core-suite-pricing) (per-user seats, with model usage billed separately) and [Enterprise Flex](https://docs.glean.com/glean-enterprise-flex-pricing) (seats plus pooled FlexCredits). Vendr’s February 2026 data, a third-party estimate, puts the median annual contract at $98,890 ( [Vendr](https://www.vendr.com/marketplace/glean)). In Slack, the Assistant view needs a paid Slack plan ( [Slack Marketplace](https://slack.com/marketplace/A097AUHM5AS-glean)).

**Pros:**

- The current Slack connector is federated: it “retrieves live Slack messages at query time” and “does not index or store message content” ( [Glean docs](https://docs.glean.com/administration/platform/embedded-integrations/slackbot/reference)).
- Each user authorizes access to their own private channels and DMs, so answers stay within what the asker can see.
- Glean publishes its full scope list, 22 user scopes and 22 bot scopes ( [Glean docs](https://docs.glean.com/connectors/native/slack/setup/slack-rts-connector)), and posts its [HIPAA BAA](https://www.glean.com/legal/baa) publicly.

**Cons:**

- No self-serve entry point and no published price, so a pilot means procurement.
- With real-time search on, Glean uses two Slack apps that each user must authorize.

**Best for:** organizations with knowledge spread across dozens of systems, where the main problem is finding the answer. If you need the work finished and not only the answer found, with a self-serve start instead of a quote, see the Viktor section or [how Viktor compares with Glean](https://viktor.com/blog/viktor-vs-glean).

## Moveworks: the IT and HR helpdesk agent

Moveworks does not publish a rate card; the pricing page asks for a quote ( [Moveworks](https://www.moveworks.com/us/en/pricing)), and professional services rates start at $300 per hour ( [Moveworks](https://www.moveworks.com/us/en/professional-services/services-and-support-packages)). Vendr’s 2026 data, a third-party estimate, puts the median annual contract at $130,000, with implementation fees of $50,000 to $200,000 ( [Vendr](https://www.vendr.com/marketplace/moveworks)). ServiceNow [completed its acquisition of Moveworks](https://newsroom.servicenow.com/press-releases/details/2025/ServiceNow-completes-acquisition-of-Moveworks/default.aspx) in December 2025.

**Pros:**

- Forrester noted in April 2025 that Moveworks ships “over 100 prebuilt AI agents across more than 20 business systems such as Salesforce, SAP, and Workday” ( [Forrester](https://www.forrester.com/blogs/the-rise-of-digital-coworkers-moveworks-bets-big-on-ai-agents/)).
- Moveworks publishes its [security certifications](https://www.moveworks.com/us/en/platform/security) and documents the general assistant’s 21 bot scopes ( [Moveworks docs](https://docs.moveworks.com/ai-assistant/chat-platform-experiences/slack)).

**Cons:**

- Real-time enterprise search needs a Business+ or Enterprise+ Slack workspace ( [Moveworks docs](https://docs.moveworks.com/ai-assistant/enterprise-search/configure-enterprise-search/slack-setup-for-enterprise-search)).
- Its pages do not claim HIPAA compliance or offer a BAA.
- It focuses on employee support, mainly IT and HR requests.

**Best for:** IT and HR teams at large companies that measure success in ticket deflection. ServiceNow customers should ask whether Moveworks is part of their [ITSM package](https://www.servicenow.com/products/itsm/pricing.html).

## Zapier: rule-based automation across apps

Zapier’s Free plan includes 100 tasks a month. Professional starts at $19.99 a month billed annually ($29.99 billed monthly) for 750 tasks, and Team starts at $69 a month billed annually ($103.50 monthly) for 2,000 tasks and 25 users; Enterprise is quote-based ( [Zapier](https://zapier.com/pricing)). With pay-per-task billing on, extra tasks are charged at a higher per-task rate than the tasks in your plan ( [Zapier](https://zapier.com/pricing)), and total usage is capped at three times the plan’s task limit ( [Zapier help](https://help.zapier.com/hc/en-us/articles/15279018245901)). Zapier Agents is billed separately in activities ( [Zapier help](https://help.zapier.com/hc/en-us/articles/26559132765325)). The Agents Pro plan costs $400 a year, billed annually ( [Zapier](https://zapier.com/pricing)). Zapier says it is moving Agents to AI by Zapier ( [Zapier help](https://help.zapier.com/hc/en-us/articles/26559132765325)), so pricing may change.

Tables and Interfaces have been included in Free, Professional and Team at no extra cost since September 18, 2025 ( [Zapier](https://zapier.com/blog/zaps-tables-interfaces-mcp/)). Zapier works with free and paid Slack; free Slack has a 10-app cap ( [Zapier help](https://help.zapier.com/hc/en-us/articles/8495993391629)) and a 90-day message history ( [Slack help](https://slack.com/help/articles/115002422943)).

**Pros:**

- The Zap editor is no-code; a Slack-to-Google-Sheets Zap takes minutes.
- Team adds SAML SSO and audit logs, Enterprise adds SCIM, and AI Guardrails by Zapier includes a Detect Prompt Attack action for prompt injection.

**Cons:**

- Fixed trigger-action logic is the ceiling: a step that needs a judgment call needs human review or another tool.
- Task-based pricing scales with volume, so many recurring multi-step Zaps can push a plan into overage.
- Zapier is not for health data: “You can’t use it to automate anything involving protected health information (PHI)” ( [Zapier](https://zapier.com/blog/is-zapier-hipaa-compliant/)).

**Best for:** predictable, explicit workflows, such as a new row in Sheets posting to #alerts. When a step needs a judgment call instead of a fixed rule, see the Viktor section or [Viktor vs Zapier Agents](https://viktor.com/blog/viktor-vs-zapier-agents).

## ChatGPT and Claude in Slack: what the standalone chat apps can do

Yes, ChatGPT integrates with Slack in two ways. Slack can be connected as an app inside ChatGPT to search your workspace and take admin-enabled Slack actions ( [OpenAI help](https://help.openai.com/en/articles/12525822-using-slack-in-chatgpt)). And @ChatGPT is an organization assistant that an admin installs in Slack or Microsoft Teams. It replaces the earlier ChatGPT app in Slack and is available to Business and Enterprise users ( [OpenAI help](https://help.openai.com/en/articles/20001536-chatgpt-with-slack-and-microsoft-teams)). The connector is for eligible Plus, Pro, Business, Enterprise and Edu users ( [OpenAI help](https://help.openai.com/en/articles/12525822-using-slack-in-chatgpt)). Neither is counted in the seven, because both are general chat products that also run in Slack.

Claude’s Slack product split on August 3, 2026. Claude Tag replaced the earlier app for Team and Enterprise workspaces and is in beta, while the older Claude in Slack app remains for Pro and Max individuals ( [Claude support](https://support.claude.com/en/articles/15594475-what-is-claude-tag)). Claude Tag answers @Claude in channels and DMs, runs standing routines on a schedule, and starts with no external access until an owner grants it ( [Claude docs](https://claude.com/docs/claude-tag/overview)). Team and Enterprise chats are not used for training by default ( [Anthropic](https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training)).

## What each one costs: Slack AI tiers vs third-party pricing

This table separates what you pay Slack from what you pay the vendor.

| Product | Vendor cost | Slack plan needed | Cost on top of the Slack seat |
| --- | --- | --- | --- |
| Viktor | $0 plan with up to $100 in free credits, no credit card; paid plans from $50 per month per workspace, no per-seat fee | Free or paid | Credits only; no seat fee |
| Slackbot and Slack AI | Included in the plan | Pro $7.25, Business+ $15 or Enterprise+ $45 per user per month, billed annually | None |
| Salesforce Agentforce | $0.10 per action, $5 metered user or $125 unmetered add-on per user per month | Any Slack plan plus an Agentforce license | Salesforce edition plus Agentforce licence |
| Dust | Pro $24, Max $120 per seat per month, billed annually; Enterprise quote | None stated | Seats plus credits over the allowance |
| Glean | Quote; Vendr median $98,890 a year (third-party) | Paid plan for the Assistant view | Seats plus model usage or FlexCredits |
| Moveworks | Quote; Vendr median $130,000 a year (third-party) | Business+ or Enterprise+ for real-time search | Licence plus implementation and services from $300 per hour |
| Zapier | Free; Professional $19.99 or Team $69 per month, billed annually ($29.99 and $103.50 monthly); Agents Pro $400 a year | Free or paid | Plan plus Agents add-on plus overage |

## Slack agents vs Microsoft Teams with Copilot Studio

The platform decides most of this: the pricing favors Teams if your company runs Microsoft 365, and the app ecosystem favors Slack if it runs Slack. The [Microsoft Teams comparison](https://viktor.com/blog/best-ai-agents-for-microsoft-teams) covers that side.

**Where Teams wins:**

- Microsoft 365 Copilot costs $30 per user per month billed annually for enterprise ( [Microsoft](https://www.microsoft.com/en-us/copilot/pricing/enterprise)), and Copilot Business has a $21 list price for up to 300 users, with a promotional $18 for the first year when bought by December 31, 2026, both paid yearly ( [Microsoft](https://www.microsoft.com/en-us/copilot/pricing/business)). Licensed users get standard Copilot Studio agent features at no extra charge in supported employee-facing scenarios ( [Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)).
- Copilot Studio capacity is tenant-wide: $200 a month for a 25,000-credit pack, with a pay-as-you-go option ( [Microsoft](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio)).
- Event triggers, such as a new SharePoint item, let Copilot Studio agents act without a prompt ( [Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about)).

**Where Slack wins:**

- Copilot Studio agents cannot publish to Slack in the current agent experience ( [Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-channels-overview)).
- Slack’s MCP server reached general availability on February 17, 2026 ( [Slack](https://slack.com/blog/news/mcp-real-time-search-api-now-available)).
- @ChatGPT now runs in both Slack and Teams, so among the chat-vendor apps only Claude Tag is Slack-only ( [Claude docs](https://claude.com/docs/claude-tag/overview)).

## How do you install an AI agent in Slack without code?

By default any workspace member can install a Marketplace app; if a Workspace Owner has turned on app approval, an admin approves it first ( [Slack help](https://slack.com/help/articles/202035138-Add-apps-to-your-Slack-workspace)).

1. Click Add to Slack on the Marketplace listing. An approver can leave out optional scopes, but required scopes are approved together ( [Slack help](https://slack.com/help/articles/360024269514-Manage-app-requests-for-your-workspace)).
2. Review the OAuth screen. Marketplace apps that request search, history, file or canvas scopes get an enhanced review at submission ( [docs.slack.dev](https://docs.slack.dev/slack-marketplace/slack-marketplace-app-guidelines-and-requirements/)).
3. Authorize, then invite the app to the channels it should read; history scopes only cover conversations “that your Slack app has been added to” ( [docs.slack.dev](https://docs.slack.dev/reference/scopes/channels.history)).
4. Use it with an @mention, a DM or its agent view in the sidebar.

Vendor extras: Agentforce needs a connected Salesforce org, Dust a self-created app for channel sync, Glean a per-user authorization, and Claude Tag a Primary Owner or Owner.

**No-code path:** Workflow Builder runs on Pro, Business+ and Enterprise+, with triggers such as a schedule, a webhook, a posted message or an emoji reaction ( [Slack help](https://slack.com/help/articles/17542172840595-Build-a-workflow--Create-a-workflow-in-Slack)), and connector steps for Google Sheets, Jira, Salesforce and Zoom ( [Slack help](https://slack.com/help/articles/20155812595219-Slack-connectors-for-Workflow-Builder)).

**Developer path:** the Agents & AI Apps framework, Bolt custom steps and the Slack MCP server, open only to Marketplace-published or internal apps ( [docs.slack.dev](https://docs.slack.dev/ai/slack-mcp-server/)).

To try these steps with Viktor, [get started for free →](https://app.viktor.com/signup)

## Do Slack AI agents respect permissions and keep your data private?

Slack requires every Marketplace app to follow “a zero copy and zero LLM training policy” ( [Slack help](https://slack.com/help/articles/33076000248851-Work-with-AI-agents-in-Slack)), and its API terms prohibit using API data to train a large language model ( [Slack API terms](https://slack.com/terms-of-service/api)). Above that floor vendors differ, so check five things.

- **Channel and file inheritance:** answers should stop at what the asker can see. Anthropic says: “If someone can’t access a specific file, channel, or record in the source system, the connector can’t reach it from Claude either” ( [Anthropic](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities)). Watch search:read.public: “The searching user need not be a member of the public channels, just of the workspace, for the channels to be included in the search results” ( [docs.slack.dev](https://docs.slack.dev/reference/scopes/search.read.public)).
- **Scopes:** ask for the full list before approval; Glean, Moveworks and Dust publish theirs.
- **Retention:** Slack’s developer policy requires deletion within 14 business days when an app is removed ( [docs.slack.dev](https://docs.slack.dev/developer-policy/)).
- **Training:** OpenAI’s Business, Enterprise and Edu plans and Anthropic’s Team and Enterprise plans are excluded by default; consumer tiers depend on a user setting.
- **HIPAA:** Glean and Salesforce publish BAA terms, and Slack itself is HIPAA-configurable only on Enterprise with a BAA ( [Slack help](https://slack.com/help/articles/360020685594-Slack-and-HIPAA)).

Audit third-party OAuth tokens on a schedule too: the August 2025 Salesloft Drift compromise “impacted more than 700 organizations” through stolen tokens ( [FINRA](https://www.finra.org/rules-guidance/guidance/salesloft-drift-AI-supply-chain-attack)).

## Which AI agent for Slack should you use?

Pick by the work you need done, then by the platform you already pay for.

The default pick for any team that wants one AI employee doing real work across tools, not only operations, is Viktor. He runs recurring Tasks across connected tools such as HubSpot, Stripe and Google Sheets, does the work end to end, and posts the finished deliverable.

For narrower cases:

- **Answers and summaries:** Slackbot and Slack AI, Glean, Dust.
- **Actions inside one system:** Agentforce in Salesforce, Moveworks in IT and HR tools.
- **Fixed rules:** Zapier.

**IT and HR helpdesk:** Moveworks, with enterprise budget and a Business+ or Enterprise+ workspace for real-time search. **Sales and CRM:** Agentforce, if Salesforce is your system of record; budget for a qualifying edition for the unmetered add-on (Core and above on current pricing). **Engineering:** Claude Tag on Team and Enterprise workspaces. **Knowledge search across many tools:** Glean.

**Small business:** Moveworks and Glean sell through quotes, and Agentforce needs a Salesforce subscription and admin setup. The low-friction starting points are native Slack AI on Pro or Business+, Zapier’s Free plan and Dust’s Free seats (500 lifetime credits each).

Then test the shortlist on the deliverable your team builds by hand every week.

[Book a demo and bring that deliverable →](https://viktor.com/contact-sales)

## FAQ

### Which AI integrates with Slack?

Slack bundles AI into its paid plans, with Slackbot on Business+ and Enterprise+. Agentforce, Dust, Glean, Moveworks, Zapier and an AI employee run in Slack as apps, and ChatGPT and Claude have their own Slack apps.

### Can ChatGPT integrate with Slack?

Yes. Eligible Plus, Pro, Business, Enterprise and Edu users can connect Slack inside ChatGPT to search what they can already see ( [OpenAI help](https://help.openai.com/en/articles/12525822-using-slack-in-chatgpt)), and an admin-installed @ChatGPT assistant runs in Slack for Business and Enterprise users ( [OpenAI help](https://help.openai.com/en/articles/20001536-chatgpt-with-slack-and-microsoft-teams)).

### How much does Slack AI cost per month?

Nothing extra: Slack no longer sells the AI add-on on its website and bundles AI features into paid plans. Pro costs $7.25 and Business+ $15.00 per active user per month on annual billing ( [Slack](https://slack.com/pricing)).

### What are proactive AI agents?

Slack describes them as agents that use context to spot problems and recommend fixes, or act on preset instructions, instead of waiting to be asked. In practice they start from a schedule, a webhook or a data change, as Claude Tag routines do.

### Which AI agents are best for small business?

Start with what is bundled or free: native AI on Pro and Business+, Zapier’s Free plan and Dust’s Free seats. Moveworks, Glean and Agentforce all need a procurement process first.

If your team’s work spans several tools, start with Viktor: [up to $100 in free credits, no credit card required](https://viktor.com/pricing).

4.9on G2G2 rating: 4.9 out of 5 stars

Start free.Viktor delivers.

Start for free today. No credit card required.

[Get Started For Free](https://app.viktor.com/signup) [See all plans](https://viktor.com/pricing)

[Book a Demo](https://viktor.com/contact-sales) [See all plans](https://viktor.com/pricing)

[Get Started for Free](https://app.viktor.com/signup)