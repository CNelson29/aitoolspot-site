# Social Media Content Scheduler

## Overview

This N8N workflow automates your entire social media publishing pipeline. It checks your **Airtable content calendar** every 30 minutes for posts that are due, enhances your raw captions using **Anthropic Claude (Haiku)**, routes content to the correct platform (**Twitter/X**, **LinkedIn**, or both), publishes the post, and marks it as `Published` in Airtable — all without lifting a finger.

---

## Workflow Architecture

```
[Schedule Trigger] → [Fetch Pending Posts (Airtable)]
                            ↓
                 [Enhance Caption (Anthropic Claude)]
                            ↓
                  [Route by Platform (Switch)]
               ↙          ↓           ↘
      [Twitter]      [LinkedIn]     [Both]
           ↘              ↓           ↙
              [Mark as Published (Airtable)]
```

---

## Nodes Explained

| Node | Purpose |
|------|---------|
| **Schedule Trigger** | Fires every 30 minutes to check for due posts |
| **Fetch Pending Posts** | Queries Airtable for rows where Status=Pending AND Scheduled_Date ≤ NOW |
| **Enhance Caption with AI** | Uses Claude Haiku to rewrite the raw caption for the target platform |
| **Route by Platform** | Splits execution to Twitter, LinkedIn, or both branches |
| **Post to Twitter** | Publishes tweet (auto-truncated to 280 chars) |
| **Post to LinkedIn** | Publishes LinkedIn post with professional formatting |
| **Post to Both Platforms** | Handles 'Both' option — posts to Twitter first, then LinkedIn |
| **Mark as Published** | Updates Airtable record: Status → Published, logs timestamp & final caption |

---

## Setup

### Prerequisites
- N8N instance (cloud or self-hosted, v1.0+)
- Airtable account (free tier works)
- Anthropic API key
- Twitter Developer App with OAuth 2.0 (Read + Write)
- LinkedIn Developer App with OAuth 2.0

### Step 1 — Airtable Setup
Create a base called **Social Media** with a table called **Content Calendar**:

| Field Name | Type | Notes |
|------------|------|-------|
| `Title` | Single line text | Post title/reference |
| `Raw_Caption` | Long text | Your raw post idea |
| `Platform` | Single select | Options: `Twitter`, `LinkedIn`, `Both` |
| `Scheduled_Date` | Date & Time | When to publish |
| `Image_URL` | URL | Optional media attachment |
| `Status` | Single select | Options: `Pending`, `Published`, `Failed` |
| `Published_At` | Date & Time | Auto-filled by workflow |
| `Final_Caption` | Long text | Auto-filled by workflow |

### Step 2 — Configure N8N Credentials

1. **Airtable**: Settings > Credentials > New > Airtable Personal Access Token
2. **Anthropic**: Settings > Credentials > New > Anthropic API → paste your secret key
3. **Twitter**: Settings > Credentials > New > Twitter OAuth2 API → authorize via Twitter Developer Portal
4. **LinkedIn**: Settings > Credentials > New > LinkedIn OAuth2 API → authorize via LinkedIn Developer Portal

> ⚠️ N8N does not auto-attach credentials from an imported workflow JSON — after import, open each
> node (Fetch Pending Posts, Enhance Caption with AI, Post to Twitter, Post to LinkedIn, Post to Both
> Platforms, Mark as Published) and re-select your own credential from the dropdown.

### Step 3 — Update Workflow Variables

In the **Fetch Pending Posts** and **Mark as Published** nodes, replace:
- `YOUR_AIRTABLE_BASE_ID` → Your actual base ID (from Airtable URL: `airtable.com/YOUR_BASE_ID/...`)

### Step 4 — Activate

Toggle the workflow to **Active**. Add your first row to Airtable with `Status = Pending` and a `Scheduled_Date` a few minutes in the future to test.

---

## Usage

### Adding Content to the Queue
1. Open your Airtable **Content Calendar**
2. Add a new row with:
   - **Title**: Short reference name
   - **Raw_Caption**: Your content idea (doesn't need to be polished — AI will enhance it)
   - **Platform**: Select `Twitter`, `LinkedIn`, or `Both`
   - **Scheduled_Date**: When you want it posted
   - **Status**: Set to `Pending`
3. Done! The workflow handles the rest.

### Monitoring
- Check the `Status` column — it updates to `Published` after successful posting
- The `Final_Caption` column shows the AI-enhanced caption that was actually posted
- The `Published_At` column logs the exact posting timestamp
- In N8N, check **Executions** for detailed logs of every run

---

## Customization Tips

- **Change posting frequency**: Edit the Schedule Trigger (e.g., every 15 minutes for high-volume accounts)
- **Add Instagram**: Use the HTTP Request node with the Instagram Graph API, connected after the Switch node
- **Add error handling**: Create an error workflow that sets Status to `Failed` and sends you a Slack/email alert
- **Batch limit**: The workflow fetches max 5 due posts per run to avoid API rate limits — adjust in Fetch Pending Posts node
- **Custom AI persona**: Modify the Claude system prompt to match your brand voice

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Posts not triggering | Check Scheduled_Date format — must be ISO 8601 |
| Twitter 403 error | Verify your Twitter app has Read+Write permissions |
| LinkedIn unauthorized | Re-authorize LinkedIn credential (tokens expire after 60 days) |
| Anthropic timeout | Switch model to `claude-haiku` (already default) or reduce `maxTokens` |
| Airtable 422 error | Verify your Base ID and column names match exactly |

---

## Support

For questions, customization requests, or feature suggestions, reach out via the marketplace platform where you purchased this template.

**Version**: 1.0.0 | **N8N Compatibility**: v1.0+
