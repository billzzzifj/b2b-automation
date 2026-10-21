/**
 * Lagos B2B Lead Funnel & Outreach Automation Factory
 * Dynamic Outreach Dispatcher & URL Generator
 * 
 * Enforces client-side Hash Routing for zero-friction Vercel & static hosting.
 */

import { SECTORS } from './lagosTargets50.js';

/**
 * Returns bulletproof hash-based demo URL for a target company
 * Format: https://domain.com/#/demo/[company-slug]
 */
export function getDemoUrl(company) {
  if (!company || !company.slug) return '';
  const origin = typeof window !== 'undefined' && window.location && window.location.origin
    ? window.location.origin
    : 'https://b2b-automation.vercel.app';
  return `${origin}/#/demo/${company.slug}`;
}

/**
 * Returns bulletproof hash-based outreach URL for a target company
 * Format: https://domain.com/#/outreach/[company-slug]
 */
export function getOutreachUrl(company) {
  if (!company || !company.slug) return '';
  const origin = typeof window !== 'undefined' && window.location && window.location.origin
    ? window.location.origin
    : 'https://b2b-automation.vercel.app';
  return `${origin}/#/outreach/${company.slug}`;
}

/**
 * Generates 4 hyper-personalized outreach scripts + commercial scope proposal
 * tailored for a target company's diagnosed operational leak.
 */
export function generateOutreachPack(company) {
  if (!company) return {};

  const demoUrl = getDemoUrl(company);
  const persona = company.targetPersona || 'Managing Director';
  const sector = SECTORS[company.sector]?.name || 'Industrial Services';

  // 1. WhatsApp Friction-Breaker Script
  const whatsappMsg = `Hello team ${company.name},

Saw your operations out in ${company.location}. 

We noticed your team is currently handling high-friction requests (${company.diagnosedLeak.toLowerCase().slice(0, 90)}...).

We mocked up a 100% interactive, live calculation engine custom-built for ${company.name} so your clients get instant pricing and dispatch straight into WhatsApp:

👉 Test your live portal here: ${demoUrl}

No generic software—the math matches Lagos rates. Would you be open to a 5-minute Loom walkthrough this week?`;

  const whatsappUrl = `https://wa.me/${company.samplePhone || '2348033045612'}?text=${encodeURIComponent(whatsappMsg)}`;

  // 2. LinkedIn Executive DM
  const linkedinMsg = `Hi ${persona.split(' ')[0] || 'there'},

I lead conversion infrastructure for B2B industrial firms across Lagos.

Quick observation on ${company.name}: Your clients in ${company.location} are asking for rapid quotes, but your team is losing roughly ~${company.estimatedMonthlyHoursLost} hours every month on manual back-and-forth calculations (${company.diagnosedLeak.slice(0, 80)}...).

Rather than sending a slide deck, our team built an interactive white-label rate engine configured with ${company.name}'s exact operational specs:

🔗 ${demoUrl}

It lets your clients configure volumes, calculate landed costs in Naira, and dispatch qualified bookings directly to your desk.

Could I send over a 90-second video showing how this eliminates quoting bottlenecks?`;

  // 3. Cold Email with Diagnostic Teardown & ROI Math
  const emailSubject = `Diagnostic Teardown: Eliminating ${company.name}'s ${company.estimatedMonthlyHoursLost}h/mo quoting bottleneck`;
  const emailBody = `Dear ${persona},

I hope this finds you well.

While auditing high-friction B2B operations in ${company.location}, our team identified a specific operational leak costing ${company.name} an estimated ${company.estimatedMonthlyHoursLost} hours of staff time each month:

"${company.diagnosedLeak}"

When prospective clients wait hours for manual calculations, 40%+ bounce to competitors or get stalled in WhatsApp voice note negotiations.

To solve this, we engineered a custom, zero-friction interactive solution engine specifically for ${company.name}:

👉 Access your company's live system: ${demoUrl}

Key capabilities built for your desk:
1. Instant Real-Time Calculations (Naira & statutory Lagos fees included).
2. Automated 1-Click WhatsApp Booking Dispatch (with zero staff math needed).
3. Pre-qualification gates that filter out low-intent inquiries automatically.

We're rolling this out across four Lagos sectors this quarter. If you'd like to inspect the code or test plugging it into your domain, let me know when you have 10 minutes.

Warm regards,

B2B Growth Engineering Lead
Lagos B2B Automation Factory`;

  // 4. 90-Second Loom Video Teleprompter Script
  const loomScript = `⏱️ 90-SECOND LOOM TELEPROMPTER SCRIPT (0:00 – 1:30)
Company: ${company.name} (${company.location})
Target Persona: ${persona}
Open on your screen: ${demoUrl}

--------------------------------------------------------------------------------
[0:00 - 0:15] THE PERSONALIZED HOOK
"Hey ${persona.split(' ')[0] || 'team'} at ${company.name}, I’m recording this quick 90-second teardown directly from Lagos. I was reviewing your operations in ${company.location}, and I noticed a huge opportunity to accelerate your deal velocity."

[0:15 - 0:40] THE DIAGNOSED OPERATIONAL LEAK (Show their website or typical WhatsApp flow)
"Right now, when an enterprise or commercial client wants pricing, they run into this friction: ${company.diagnosedLeak} Our telemetry shows operations like yours lose approximately ${company.estimatedMonthlyHoursLost} productive hours every month just recalculating the same specs manually."

[0:40 - 1:15] THE LIVE SOLUTION DEMO (Interact with ${demoUrl} on screen)
"So instead of telling you how to fix it, we built the working solution for ${company.name}. [Action: Drag slider on the screen] Notice how your clients can choose their exact specifications, toggle Lagos corridor logistics, and see statutory fees calculated live. When they're ready, they click this button right here: [Action: Click WhatsApp Dispatch], and your desk receives an immaculate, pre-qualified booking card instantly."

[1:15 - 1:30] FRICTIONLESS CALL TO ACTION
"We can deploy this white-labeled onto your domain within 72 hours. If this could save your operations team 20 hours this month, let’s grab 7 minutes on Thursday. The link is right below this video. Cheers!"
--------------------------------------------------------------------------------`;

  // 5. Commercial Proposal Scope
  const proposal = `COMMERCIAL IMPLEMENTATION PROPOSAL // ${company.name.toUpperCase()}
================================================================================
Project: High-Conversion B2B Solution Engine & Automated Booking Funnel
Client: ${company.name} (${company.location})
Prepared by: Elite Autonomous Systems Architect, Lagos B2B Automation Factory
Estimated ROI: Recovers ~${company.estimatedMonthlyHoursLost} productive hours/month (~₦4.8M+ in recovered desk capacity)
================================================================================

PHASED ROADMAP & SCOPE OF WORK:
--------------------------------------------------------------------------------
• Phase 1: Custom Engine Architecture & Visual Branding (Days 1–4)
  - White-label deployment of ${sector} on custom subdomain (e.g. quote.${company.slug}.com).
  - Fine-tuning mathematical pricing algorithms to match ${company.name}'s exact proprietary margins and rate sheets.

• Phase 2: WhatsApp Business API & Webhook Dispatch Integration (Days 5–8)
  - Integration with ${company.name}'s official WhatsApp Business number and commercial desk.
  - Automated pre-flight data validation, PDF generation, and CRM webhook sync.

• Phase 3: Sales Rep & Commercial Desk Training (Days 9–12)
  - 1-on-1 team training for ${company.name}'s estimating reps.
  - Deployment of standardized WhatsApp & email frictionless outbound playbooks.

• Phase 4: Production Go-Live & Conversion Optimization (Days 13–15)
  - Deployment of standardized WhatsApp & email frictionless outbound playbooks.
  - Domain cut-over with SSL, edge caching, and live traffic analytics.
  - 30-day continuous A/B test optimization on quote completion rate.

COMMERCIAL INVESTMENT (NGN ₦):
--------------------------------------------------------------------------------
• Implementation & Turnkey Engineering Fee: ₦1,250,000 (One-time)
• Monthly SLA, Hosting & Automation Maintenance: ₦185,000 / month
• Terms: 60% mobilization advance, 40% upon successful client booking dispatch.

Sign-off & Inquiries: operations@lagosb2bautomation.example`;

  return {
    demoUrl,
    whatsappMsg,
    whatsappUrl,
    linkedinMsg,
    emailSubject,
    emailBody,
    loomScript,
    proposal
  };
}
