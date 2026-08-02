# AI Support Triage & Auto-Reply

## Overview

This N8N workflow receives a support ticket from **any channel** (web form, email forwarder, chat
widget — anything that can POST JSON to a webhook), classifies it with Claude, and either:

1. **Auto-replies** with a drafted answer (for questions your knowledge base can already answer), or
2. **Escalates to Slack** with a full context card (customer info, message, urgency, sentiment) when
   the AI isn't confident or the request needs a human (complaints, account-specific data, refunds).

If Claude's response isn't valid JSON for any reason, the workflow **fails safe**: it escalates to a
human instead of silently dropping the ticket or crashing.

> **Scope note:** this is a focused, working MVP — one real workflow that captures the "auto-resolve
> common questions, escalate the rest with context" value. It does **not** include a vector-database
> knowledge base (Pinecone), Redis session memory, a Zendesk/Intercom integration, a churn-risk monitor,
> or a knowledge-base auto-updater. Those are meaningful separate projects, not included here — add them
> yourself later if you need them, using this workflow as the entry point.

---

## Architecture

```
[Support Ticket Webhook] → [AI Triage & Reply Generator (Claude)] → [Parse Triage Result]
                                                                            │
                                                              [Route: Escalate or Reply]
                                                               ↙                      ↘
                                              [Escalate to Slack]              [Respond: Auto-Reply]
                                                      ↓
                                            [Respond: Escalated]
```

---

## Prerequisites

| Requirement | Where to Get It |
|---|---|
| N8N instance (cloud or self-hosted, v1.0+) | — |
| Anthropic API key | https://console.anthropic.com/settings/keys |
| Slack workspace (for escalations) | https://slack.com |

No Pinecone, Redis, Zendesk, or Twilio needed for this version.

---

## Setup Guide

### Step 1 — Import the Workflow
In N8N, click **+** → **Import from JSON**, paste the workflow, click **Save**.

### Step 2 — Configure Credentials
N8N does not auto-attach credentials from an imported workflow JSON. After import, open each node and
re-select your own credential:
- **AI Triage & Reply Generator** → your Anthropic API credential
- **Escalate to Slack** → your Slack credential (bot must be invited to the target channel)

### Step 3 — Customize the Knowledge Base
Open **AI Triage & Reply Generator** and edit the system prompt's "Knowledge base" section with your
real business info (hours, products, shipping, returns, support email). The more specific this is, the
more tickets get auto-resolved instead of escalated.

### Step 4 — Point Your Channel at the Webhook
Copy the webhook URL from the **Support Ticket Webhook** node. Send it a POST request with this JSON
body from your web form / email parser / chat widget:
```json
{ "customerName": "Jane Doe", "customerEmail": "jane@example.com", "message": "...", "channel": "web-form" }
```
The webhook responds with either `{"status":"replied","reply":"...","sentiment":"..."}` or
`{"status":"escalated","urgency":"...","sentiment":"..."}` — wire that response into however you
actually send messages back to the customer on your channel (email, chat widget, etc.).

### Step 5 — Activate
Toggle the workflow to **Active**.

---

## Customization Ideas

| Feature | How |
|---|---|
| Real knowledge base (RAG) | Add a Vector Store node (Pinecone/Supabase) before the AI node, feed retrieved docs into the prompt |
| Log every ticket | Add an Airtable/Notion node after Parse Triage Result |
| Sentiment/churn tracking over time | Add a node that appends `sentiment`/`urgency` to a sheet or DB on every run |
| Multi-language | Add a language-detection step and adjust the system prompt |
| Actually send the reply | Add an email/Gmail/Chat-widget node using the `reply` field before the final Respond node |

---

## Troubleshooting

**AI node fails immediately?**
Re-select your Anthropic credential in the node (see Step 2) — imported workflows never carry over
credential bindings automatically.

**Everything escalates, nothing auto-replies?**
Your knowledge base section is probably too vague — add real specifics (exact policies, exact hours).

**Slack message doesn't arrive?**
Make sure the bot is invited to `#customer-support` (or whichever channel you set) and re-select the
Slack credential after import.

---

## Cost Estimate

| Service | Estimated Cost |
|---|---|
| Anthropic Claude Haiku | ~$0.0005 per ticket |
| N8N | Included in your plan |
| Slack | Free tier is enough |

1,000 tickets/month ≈ **$0.50** in AI costs.

---

*Template version: 1.0.0 (rebuilt from scratch, replaces the earlier unbuilt "blueprint" concept) | Compatible with N8N 1.x+*
