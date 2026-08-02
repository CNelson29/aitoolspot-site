// Catálogo de productos digitales vendidos en la propia tienda (checkout nativo).
// Los archivos deben vivir dentro de este proyecto (src/product-files/<slug>/) para
// que Vercel los incluya en el deploy — no referenciar rutas fuera de sites/aitoolspot/.
export interface StoreProduct {
  slug: string;
  name: string;
  priceUsd: number;
  tagline: string;
  description: string;
  features: string[];
  scopeNote?: string; // qué NO incluye, para no sobre-prometer
  filesDir: string;   // relativo a src/product-files/
}

export const CATALOG: StoreProduct[] = [
  {
    slug: 'whatsapp-auto-reply',
    name: 'N8N Workflow: WhatsApp Business Auto-Reply',
    priceUsd: 19,
    tagline: 'Automated WhatsApp customer replies, powered by Claude.',
    description:
      'A ready-to-import n8n workflow that receives WhatsApp Business messages, drafts a reply with ' +
      'Claude Haiku, sends it back automatically, and escalates anything it\'s not confident about to Slack.',
    features: [
      'Ready-to-import n8n workflow JSON',
      'Handles Meta\'s webhook verification automatically',
      'Escalates uncertain replies to Slack with full context',
      'Setup README included',
    ],
    filesDir: 'whatsapp-auto-reply',
  },
  {
    slug: 'social-scheduler',
    name: 'N8N Workflow: Social Media Content Scheduler',
    priceUsd: 17,
    tagline: 'Airtable content calendar → AI-polished posts on Twitter/X & LinkedIn.',
    description:
      'A ready-to-import n8n workflow that checks your Airtable content calendar every 30 minutes, ' +
      'rewrites your raw caption with Claude for the target platform, publishes it, and marks it done.',
    features: [
      'Ready-to-import n8n workflow JSON',
      'Publishes to Twitter/X, LinkedIn, or both',
      'AI-polished captions per platform',
      'Setup README included',
    ],
    filesDir: 'social-scheduler',
  },
  {
    slug: 'support-triage-auto-reply',
    name: 'N8N Workflow: AI Support Triage & Auto-Reply',
    priceUsd: 24,
    tagline: 'Auto-resolve simple tickets, escalate the rest with full context.',
    description:
      'A ready-to-import n8n workflow that classifies incoming support tickets with Claude, auto-replies ' +
      'to what it can confidently answer, and escalates everything else to Slack with a context card. ' +
      'Channel-agnostic — works with any form/chat/email that can POST JSON to a webhook.',
    features: [
      'Ready-to-import n8n workflow JSON',
      'Fails safe: escalates instead of crashing on bad AI output',
      'No Pinecone/Redis/Zendesk required',
      'Setup README included',
    ],
    scopeNote:
      'Does not include a vector-database knowledge base, CRM integration, or churn-risk monitoring — ' +
      'this is a focused, working starting point, not a full enterprise support suite.',
    filesDir: 'support-triage-auto-reply',
  },
  {
    slug: 'ai-tool-to-project-playbook',
    name: 'The AI Tool → Real Project Playbook',
    priceUsd: 29,
    tagline: 'Stop collecting AI tools. Build 5 real, working projects with the ones we actually tested.',
    description:
      'An ebook that skips the "50 tools, one paragraph each" format. Five tools we\'ve reviewed in ' +
      'depth, five complete real projects, step by step — including the exact support-triage and ' +
      'content-scheduling patterns we built and tested ourselves.',
    features: [
      'n8n: build a support triage system with a safe escalation fallback',
      'Claude: build a citation-honest research assistant from your own documents',
      'n8n + Claude: build a multi-platform social content pipeline',
      'Midjourney: build a consistent visual brand kit',
      'GA4 + Search Console: see your site\'s real traffic numbers, no guessing',
    ],
    filesDir: 'ai-tool-to-project-playbook',
  },
];

export function getProduct(slug: string): StoreProduct | undefined {
  return CATALOG.find((p) => p.slug === slug);
}
