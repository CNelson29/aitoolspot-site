# The AI Tool → Real Project Playbook

### Stop collecting AI tools. Start shipping things with them.

---

## Why this book is different

Most "AI tools" content is a list: 50 tools, one paragraph each, a screenshot, an affiliate link.
You close the tab knowing *about* fifty tools and knowing *how to use* zero of them.

This book does the opposite. It picks **five tools we've actually tested** (they're reviewed in
depth on AIToolSpot — every price, feature, and pro/con below matches those reviews), and for each
one walks you through **one real, complete project** — the kind of thing you'd actually be asked to
build at work or for your own business. Three of the five projects in this book are things we
*literally built and tested ourselves* while preparing this edition — not hypotheticals.

By the end, you won't just know what n8n or Claude "can do in theory." You'll have built:
- A support ticket triage system that answers simple questions on its own and hands off the hard
  ones to a human, with full context
- A social media pipeline that turns rough ideas into polished, platform-ready posts on a schedule
- A research assistant that reads your own documents and answers questions with your actual content
- A consistent visual brand kit using one AI image tool
- A real, working view into who's actually visiting your website — not a vague "get more traffic" tip

Each chapter is: **what the tool is genuinely best at → the project → step-by-step → what you now
know how to do that you didn't before.**

---

## Chapter 1 — n8n: Build a Support Triage System That Actually Escalates Correctly

### Why n8n

n8n is an open-source, node-based automation platform (self-hosted tier is completely free, cloud
plans start around $20/month). What makes it different from Zapier or Make is that it has genuine
AI-agent nodes built into the visual canvas — you can drop a Claude or GPT node directly into a
workflow and give it real business logic to execute, not just "send this text to a chatbot."

**The project:** a webhook-driven system that receives a support ticket from any source (a web form,
a chat widget, an email parser — anything that can send JSON), has Claude read it and decide whether
it can answer confidently, and either replies directly or hands it to a human with full context.

### Step by step

1. **Start with one webhook node.** It receives `{customerName, customerEmail, message, channel}` — the
   shape doesn't matter yet, just get something hitting the workflow.
2. **Add an AI node with a real system prompt**, not a generic one. Give it your actual business
   info: hours, policies, what you sell. Instruct it to reply as structured JSON: `{action: "reply"
   or "escalate", reply, reason, urgency, sentiment}`. Structured output is what makes step 3 possible.
3. **Parse the AI's response defensively.** AI models occasionally don't follow the format perfectly.
   Wrap the parse in a try/catch, and if it fails, **default to escalate** — never let a parsing bug
   silently swallow a customer message. This one line is the difference between a toy and something
   you'd trust in production.
4. **Branch on `action`.** If `escalate`, post a rich context card to Slack (customer info, the
   message, urgency, sentiment) so a human doesn't have to go dig for context. If `reply`, send the
   drafted answer back through whatever channel the ticket came from.
5. **Always acknowledge the original webhook**, on *every* branch. It's tempting to only wire up the
   "happy path" — but if the escalate branch never responds to the webhook, some external platforms
   will assume the request failed and retry it forever. Test both branches before you call it done.

**What you now know how to do:** design an AI system with a *safe failure mode*, not just a happy
path — the single most common gap between a demo and something you'd actually run.

---

## Chapter 2 — Claude: Build a Research Assistant That Answers From *Your* Documents

### Why Claude

Claude's standout feature for this project is its 200K token context window — roughly 150,000 words
in a single conversation, enough for a full legal contract set or a year of meeting notes — combined
with **Projects**, a persistent workspace that holds files and instructions across conversations.
Free plan exists; Claude Pro is $20/month and removes the usage ceiling that makes this project
annoying on the free tier.

**The project:** turn a folder of your own documents (client contracts, product docs, past reports,
whatever you reference constantly) into an assistant that answers questions grounded in *that*
content — not generic web knowledge.

### Step by step

1. **Create a Project**, not just a chat. This is the part people skip — a regular chat forgets
   everything when it ends; a Project persists.
2. **Upload the real source documents**, not summaries of them. Claude's long context means you don't
   need to pre-chunk or compress — feed it the actual contracts, the actual meeting notes.
3. **Write custom instructions that force citation.** Tell it explicitly: "When you answer, quote the
   specific document and section you're drawing from. If the answer isn't in the provided documents,
   say so — don't guess." This single instruction is what turns a generic chatbot into a trustworthy
   research tool.
4. **Test it adversarially.** Ask it something the documents genuinely don't cover. If it invents an
   answer instead of saying "I don't see that in the provided documents," your instructions need to
   be stricter — tighten the "don't guess" language until it holds even under a leading question.
5. **Keep the Project alive and add to it.** Every new contract, every new report — drop it in. The
   value compounds; you're building an assistant that knows your specific business, not the internet.

**What you now know how to do:** the difference between "asking a chatbot a question" and building a
grounded, citation-honest research tool — and why the instruction to admit "I don't know" is the most
valuable line you'll write.

---

## Chapter 3 — n8n + Claude: Build a Social Content Pipeline That Doesn't Sound Like a Robot

### Why this combo

This builds directly on Chapter 1's pattern, applied to content instead of support. n8n's 400+
integrations mean it can reach into Airtable (a free, familiar spreadsheet-like database) as your
content calendar, and let Claude do the one job it's genuinely good at: rewriting a rough idea into a
platform-appropriate voice.

**The project:** an Airtable calendar where you drop rough post ideas, and a workflow that checks it
on a schedule, polishes each idea for its target platform, publishes it, and marks it done.

### Step by step

1. **Design the Airtable base first**, before touching n8n: `Title`, `Raw_Caption`, `Platform`
   (Twitter / LinkedIn / Both), `Scheduled_Date`, `Status` (Pending/Published), `Final_Caption`. This
   is your single source of truth — get the schema right and the workflow stays simple.
2. **Schedule Trigger, every 30 minutes**, checks for rows where `Status = Pending` and
   `Scheduled_Date` has passed.
3. **One AI node, one prompt, platform-aware.** Feed it the platform *and* the raw caption, and
   instruct it explicitly on tone per platform — punchy and hashtag-light for Twitter, longer and
   professional for LinkedIn. A single generic prompt produces the same voice everywhere, which reads
   as obviously automated; a platform-aware prompt is the whole difference.
4. **Route by platform, not by a giant if/else.** Use a proper Switch/rules node with one branch per
   platform value (`Twitter`, `LinkedIn`, `Both`) — it's more maintainable than nested conditionals
   once you add a fourth platform later.
5. **Always write back to Airtable last** — `Status → Published`, timestamp, and the *actual* final
   caption that got posted (not the raw one). Without this, you have no record of what your AI voice
   actually said publicly, which matters the first time someone asks "did we really post that?"

**What you now know how to do:** build a scheduled, multi-branch automation with an AI step that
adapts its output to context — the core pattern behind most "AI content" tools you'd otherwise pay a
subscription for.

---

## Chapter 4 — Midjourney: Build a Consistent Visual Brand Kit in One Afternoon

### Why Midjourney

Midjourney V7's two most useful features for this specific project are **Character/Style References**
(`--cref` / `--sref`), which let you lock a consistent look across many generations, and
**Personalization**, which learns your taste after you rate ~200 images. It's subscription-based
(no free tier) and runs via Discord or the web dashboard at midjourney.com.

**The project:** a small, consistent brand kit — logo mark, a hero/banner image, and a matching social
template — that all look like they came from the same designer, not three random AI generations.

### Step by step

1. **Generate the logo mark first**, and generate several variations of it. This becomes your anchor.
2. **Use `--sref` with your chosen logo image** on every subsequent prompt (hero banner, social
   template). This is the step people skip, and it's the entire reason random AI-generated brand
   assets look inconsistent — without a style reference, each generation is a fresh, unrelated
   aesthetic roll.
3. **Write one shared style vocabulary** and reuse it verbatim across prompts: the same 3-4 color
   words, the same mood words ("cinematic," "minimal," "dark," whatever fits your brand). Consistency
   comes from repeating the same language, not from the tool remembering for you.
4. **Use Draft Mode while iterating**, and only spend full-quality renders once you've locked the
   composition — it's meaningfully faster and cheaper for the exploration phase.
5. **Use Vary Region (inpainting)** for small fixes instead of regenerating the whole image from
   scratch — you'll keep everything that already works and only touch what's actually wrong.

**What you now know how to do:** produce a *matching set* of AI-generated brand assets instead of a
pile of disconnected images — the single skill that separates "I used Midjourney once" from "I have a
brand kit."

---

## Chapter 5 — GA4 + Search Console: See Exactly Who's Visiting Your Site (No Guessing)

### Why this project is in an AI tools book

This one isn't about a flashy AI feature — it's about a gap almost everyone leaves open: most people
launch a site, glance at a vague dashboard once, and never actually connect the dots between "someone
searched for X" and "someone landed on my page and did (or didn't) read it." Google Analytics 4
(GA4) and Search Console are both free, and together they answer two different, complementary
questions: GA4 tells you what people did once they arrived; Search Console tells you what they
searched to find you in the first place.

**The project:** get real numbers — sessions, pageviews, top pages, traffic sources, search clicks and
impressions — flowing from your site into a report you can actually read, instead of "I think we get
some traffic."

### Step by step

1. **Confirm your GA4 property is actually linked**, not just that a tracking snippet exists on the
   page. A measurement ID (`G-XXXXXXX`) alone doesn't let you pull reports via the API — you need the
   underlying numeric property ID, which most people never look up because the dashboard hides it.
2. **Set up Search Console with the exact same domain format** you use in GA4 (`https://` vs without,
   trailing slash or not) — a surprisingly common reason people "have no data" is a silent mismatch
   between the two.
3. **Pull sessions, users, and pageviews for a real window** — 7 days is noisy for a small site; 30
   days gives you a trend you can actually act on.
4. **Look at top pages, not just totals.** A site's traffic is almost never evenly spread — usually
   one or two pages carry most of it. Knowing *which* pages work tells you what to make more of.
5. **Look at traffic source breakdown** (direct / organic search / social / referral). A site living
   entirely on "direct" traffic and almost no organic search is a very different problem to solve
   than one already getting organic clicks but with a low click-through rate — the fix is completely
   different depending on which one you actually have.
6. **Check Search Console's click-through rate and average position together.** A page ranking on
   page 1 (position ~1-10) with a low CTR usually means your title/description isn't compelling
   enough to click — that's a copywriting fix, not an SEO fix. A page buried at position 30+ needs
   actual content/authority work instead.

**What you now know how to do:** read your own site's real numbers instead of guessing — and tell the
difference between a traffic problem, a ranking problem, and a "nobody wants to click this title"
problem, which are three completely different fixes.

---

## Where to go from here

Each of these five projects is deliberately small enough to finish in an afternoon, and real enough
to actually use afterward. If you build all five, you'll have hands-on experience with the two
patterns that show up under almost every "AI automation" product on the market: **AI-in-the-loop
decision making with a safe fallback** (Chapters 1 and 3), and **grounding AI in your own real data
instead of its general knowledge** (Chapter 2). Chapter 4 and 5 round it out with the visual and
measurement sides most "AI tools" content skips entirely.

You don't need fifty tools. You need to have actually built five things.
