export interface Category {
  id: string
  label: string
  question: string
  description: string
}

export interface Tool {
  id: string
  categoryId: string
  name: string
  blurb: string
  bestFor: string
  price: string
  href: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'support',
    label: 'Customer Support',
    question: 'Do customers email or message you with the same questions over and over?',
    description: 'Chatbots and inbox assistants that answer routine questions before they reach you.',
  },
  {
    id: 'marketing',
    label: 'Marketing & Content',
    question: 'Do you spend hours writing social posts, ads, or product descriptions?',
    description: 'Writing and design tools that turn a rough idea into a finished post or ad.',
  },
  {
    id: 'scheduling',
    label: 'Scheduling & Time',
    question: 'Does your calendar get double-booked or take forever to coordinate?',
    description: 'Tools that manage your calendar and reschedule around conflicts automatically.',
  },
  {
    id: 'sales',
    label: 'Sales & CRM',
    question: 'Do leads slip through the cracks because follow-up takes too long?',
    description: 'CRM and prospecting tools that keep leads moving without manual chasing.',
  },
  {
    id: 'meetings',
    label: 'Meetings & Notes',
    question: 'Do you forget what was said in calls or meetings a day later?',
    description: 'Transcription and note-taking tools that turn calls into searchable summaries.',
  },
  {
    id: 'finance',
    label: 'Bookkeeping & Finance',
    question: 'Do you dread reconciling your books every month?',
    description: 'Tools that categorize transactions and answer plain-English questions about your numbers.',
  },
]

export const TOOLS: Tool[] = [
  {
    id: 'intercom-fin',
    categoryId: 'support',
    name: 'Intercom Fin',
    blurb: 'AI support agent that resolves customer questions instantly, in your existing help desk.',
    bestFor: 'Businesses already fielding repetitive support tickets or chats',
    price: 'Usage-based, paid',
    href: 'https://www.intercom.com/fin',
  },
  {
    id: 'zendesk-ai',
    categoryId: 'support',
    name: 'Zendesk AI',
    blurb: 'AI layered on top of Zendesk\'s help desk — auto-routes, drafts replies, summarizes tickets.',
    bestFor: 'Teams already on Zendesk who want AI without switching platforms',
    price: 'Add-on to Zendesk plans',
    href: 'https://www.zendesk.com/service/ai/',
  },
  {
    id: 'tidio',
    categoryId: 'support',
    name: 'Tidio',
    blurb: 'Live chat + AI chatbot built for small online stores and service businesses.',
    bestFor: 'Small teams wanting an affordable, simple first chatbot',
    price: 'Free tier available',
    href: 'https://www.tidio.com',
  },
  {
    id: 'canva-magic-studio',
    categoryId: 'marketing',
    name: 'Canva Magic Studio',
    blurb: 'AI design tools inside Canva — generate images, resize for every platform, remove backgrounds.',
    bestFor: 'Anyone making their own social posts, flyers, or ads',
    price: 'Free tier available',
    href: 'https://www.canva.com/magic-studio/',
  },
  {
    id: 'jasper',
    categoryId: 'marketing',
    name: 'Jasper',
    blurb: 'AI writing platform for ad copy, email campaigns, and on-brand marketing content at scale.',
    bestFor: 'Businesses producing a steady volume of marketing copy',
    price: 'From $59/mo',
    href: 'https://www.jasper.ai',
  },
  {
    id: 'buffer-ai',
    categoryId: 'marketing',
    name: 'Buffer AI Assistant',
    blurb: 'Social media scheduling with AI caption drafting built in.',
    bestFor: 'Businesses posting regularly across multiple social channels',
    price: 'From ~$6/channel/mo',
    href: 'https://buffer.com',
  },
  {
    id: 'motion',
    categoryId: 'scheduling',
    name: 'Motion',
    blurb: 'AI calendar that auto-schedules your tasks and meetings around each other.',
    bestFor: 'Owners juggling meetings, deadlines, and a to-do list in one calendar',
    price: 'From ~$29/mo',
    href: 'https://www.usemotion.com',
  },
  {
    id: 'reclaim',
    categoryId: 'scheduling',
    name: 'Reclaim.ai',
    blurb: 'Auto-schedules focus time and tasks directly on the calendar you already use.',
    bestFor: 'Anyone who wants AI scheduling without switching calendar apps',
    price: 'Free tier available',
    href: 'https://reclaim.ai',
  },
  {
    id: 'hubspot-ai',
    categoryId: 'sales',
    name: 'HubSpot (Free CRM + AI)',
    blurb: 'Free CRM with AI-assisted follow-ups, deal tracking, and email drafting built in.',
    bestFor: 'Businesses that don\'t have a CRM yet and need one that scales',
    price: 'Free tier available',
    href: 'https://www.hubspot.com',
  },
  {
    id: 'apollo',
    categoryId: 'sales',
    name: 'Apollo.io',
    blurb: 'Sales prospecting database plus AI-personalized outreach sequencing.',
    bestFor: 'Businesses doing active outbound sales, not just inbound leads',
    price: 'Free tier, paid from ~$59/user/mo',
    href: 'https://www.apollo.io',
  },
  {
    id: 'otter',
    categoryId: 'meetings',
    name: 'Otter.ai',
    blurb: 'Joins your calls, transcribes them, and generates a searchable summary with action items.',
    bestFor: 'Anyone who takes a lot of client or team calls',
    price: 'Free tier available',
    href: 'https://otter.ai',
  },
  {
    id: 'builtin-notetakers',
    categoryId: 'meetings',
    name: 'Zoom AI Companion / Google Meet notes',
    blurb: 'Built into video call tools you likely already pay for — no new subscription needed.',
    bestFor: 'Businesses that want meeting notes without adding another tool',
    price: 'Included in existing Zoom/Google Workspace plans',
    href: 'https://www.zoom.com/en/ai-assistant/',
  },
  {
    id: 'quickbooks-intuit-assist',
    categoryId: 'finance',
    name: 'QuickBooks + Intuit Assist',
    blurb: 'Built-in AI that categorizes transactions, forecasts cash flow, and answers plain-English questions about your numbers.',
    bestFor: 'Businesses already on QuickBooks, or looking for one system that does both books and AI',
    price: 'Included in QuickBooks Online plans',
    href: 'https://quickbooks.intuit.com',
  },
]

export function toolsForCategory(categoryId: string): Tool[] {
  return TOOLS.filter((t) => t.categoryId === categoryId)
}
