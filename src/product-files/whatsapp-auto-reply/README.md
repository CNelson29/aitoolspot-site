# WhatsApp Business Auto-Reply Flow

## Overview

This N8N workflow creates a fully automated WhatsApp customer service bot powered by Anthropic Claude (Haiku). When a customer sends a WhatsApp message to your business number, the workflow:

1. **Receives** the message via Meta's Cloud API webhook
2. **Classifies** the intent and generates a personalized reply using AI
3. **Replies instantly** to the customer via WhatsApp
4. **Escalates** complex or sensitive queries to your Slack support channel

> ⚡ Average response time: **under 3 seconds**

---

## Architecture

```
WhatsApp Message
      │
      ▼
[Webhook Receiver] ──► [Meta Verification Handler]
      │
      ▼
[Extract Message Data]
      │
      ▼
[Anthropic Claude (Haiku) — Intent + Reply]
      │
      ├─── ESCALATE ──► [Slack Alert] ──► [Acknowledge 200]
      │
      └─── REPLY ───► [WhatsApp Send] ──► [Acknowledge 200]
```

---

## Prerequisites

| Requirement | Where to Get It |
|---|---|
| Meta Developer Account | https://developers.facebook.com |
| WhatsApp Business API Access | Meta App Dashboard → WhatsApp product |
| Phone Number ID | WhatsApp → API Setup |
| Permanent Access Token | System User in Business Manager |
| Anthropic API Key | https://console.anthropic.com/settings/keys |
| Slack Workspace (optional) | https://slack.com |

---

## Setup Guide

### Step 1 — Import the Workflow
1. In N8N, click **+** → **Import from JSON**
2. Paste the workflow JSON
3. Click **Save**

### Step 2 — Configure Credentials

#### WhatsApp Bearer Token
1. In N8N → Credentials → New → **HTTP Header Auth**
2. Name: `WhatsApp Bearer Token`
3. Header Name: `Authorization`
4. Header Value: `Bearer YOUR_WHATSAPP_ACCESS_TOKEN`

#### Anthropic API
1. In N8N → Credentials → New → **Anthropic API**
2. Paste your Anthropic API Key
3. Name it exactly `Anthropic account` (or re-select your credential in the **AI Intent Classifier & Reply Generator** node after import — N8N does not auto-link credentials from a shared workflow JSON)

#### Slack (optional)
1. In N8N → Credentials → New → **Slack API**
2. Add your Bot OAuth Token
3. Ensure the bot is invited to `#customer-support`

### Step 3 — Set Environment Variable
1. Go to **Settings → Variables** in N8N
2. Add: `WHATSAPP_PHONE_NUMBER_ID` = your Phone Number ID from Meta

### Step 4 — Configure Meta Webhook
1. Open your workflow and **copy the Webhook URL** from the `WhatsApp Webhook` node
2. In Meta Developer Dashboard → WhatsApp → Configuration → Webhook
3. Paste the URL
4. Set **Verify Token** to any secret string (e.g., `n8n_whatsapp_secret`)
5. Subscribe to: `messages`

> ⚠️ The workflow handles Meta's GET-based verification challenge automatically via the `Meta Webhook Verification` IF node — the `WhatsApp Webhook` trigger is pre-configured to accept **both GET and POST** (via "Allow Multiple HTTP Methods"), which is required for Meta to accept the webhook URL. If you rebuild this node from scratch, make sure that setting stays on — a POST-only webhook will make Meta reject the URL at this step.

### Step 5 — Customize the AI Prompt
In the **AI Intent Classifier & Reply Generator** node, edit the system prompt:
- Replace `[YOUR BUSINESS NAME]`
- Describe your products/services
- Add your real support email
- Adjust business hours

### Step 6 — Activate
Toggle the workflow to **Active** ✅

---

## Escalation Logic

If the AI cannot answer a question, it responds with `ESCALATE: [reason]`. The workflow detects this prefix and:
- Sends a detailed Slack alert to `#customer-support` with customer name, phone, and original message
- Does **not** send an AI reply to the customer (you handle it manually)

You can modify the escalation trigger in the **Route: Escalate or Reply** IF node.

---

## Customization Ideas

| Feature | How |
|---|---|
| Log all messages to Airtable/Notion | Add a DB node after Extract Message Data |
| Send media/buttons | Modify the Send WhatsApp Reply HTTP body to use `type: interactive` |
| Multi-language support | Add language detection prompt to the AI node |
| Business hours filter | Add an IF node before AI to check current time |
| FAQ knowledge base | Use a Vector Store (Pinecone/Supabase) + RAG before AI node |

---

## Troubleshooting

**Webhook not receiving messages?**
- Ensure the workflow is **Active**
- Double-check the webhook URL in Meta Dashboard
- Verify the `messages` subscription is enabled

**AI replies are too long?**
- Reduce `maxTokens` in the Anthropic node's Options
- Add "Keep reply under 160 characters" to the system prompt

**"Credential not found" or the AI node fails immediately?**
- N8N does not auto-attach credentials from an imported/shared workflow JSON — after import, open the
  **AI Intent Classifier & Reply Generator** node and re-select your own Anthropic credential from the dropdown.

**WhatsApp API returning 400 errors?**
- Confirm the Phone Number ID variable is correct
- Check the Access Token hasn't expired (use System User token for permanent access)

---

## Cost Estimate

| Service | Estimated Cost |
|---|---|
| Anthropic Claude Haiku | ~$0.0003 per message |
| Meta WhatsApp API | Free for first 1,000 conversations/month |
| N8N Cloud | Included in your plan |

**1,000 messages/month ≈ $0.30 in AI costs** 🎉

---

## Support

For setup help, open an issue or contact the template author. Include your N8N version and a sanitized copy of the error log.

---

*Template version: 1.0.0 | Compatible with N8N 1.x+*