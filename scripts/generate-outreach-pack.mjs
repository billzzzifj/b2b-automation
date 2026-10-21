#!/usr/bin/env node

/**
 * Lagos B2B Lead Funnel & Personalized Outreach Automation Factory
 * Node.js CLI Automation Script
 * 
 * Generates:
 * 1. /outreach-exports/master-crm-import.csv (For Apollo, Instantly, HubSpot, Smartlead)
 * 2. /outreach-exports/sector-freight-playbook.md (15 companies)
 * 3. /outreach-exports/sector-furniture-playbook.md (12 companies)
 * 4. /outreach-exports/sector-packaging-playbook.md (12 companies)
 * 5. /outreach-exports/sector-equipment-playbook.md (11 companies)
 * 6. /outreach-exports/README-outreach-execution-manual.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LAGOS_TARGETS_50, SECTORS } from '../src/data/lagosTargets50.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const exportDir = path.join(rootDir, 'outreach-exports');

// Ensure output directory exists
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

console.log('\n🚀 [LAGOS B2B AUTOMATION FACTORY] Initializing Batch Outreach Generation...');
console.log(`📊 Processing master registry: ${LAGOS_TARGETS_50.length} Lagos B2B enterprise targets.\n`);

// Helper to escape CSV strings
function csvEscape(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Helper to generate full personalized scripts for a target
function generateScriptPack(c) {
  const persona = c.targetPersona || 'Managing Director';
  const demoUrl = `https://b2b-automation.vercel.app/#/demo/${c.slug}`;

  // WhatsApp
  const whatsappMsg = `Hello team ${c.name},

Saw your operations out in ${c.location}. 

We noticed your team is currently handling high-friction requests (${c.diagnosedLeak.toLowerCase().slice(0, 95)}...).

We mocked up a 100% interactive, live calculation engine custom-built for ${c.name} so your clients get instant pricing and dispatch straight into WhatsApp:

👉 Test your live portal here: ${demoUrl}

No generic software—the math matches Lagos rates. Would you be open to a 5-minute Loom walkthrough this week?`;

  const whatsappLink = `https://wa.me/${c.samplePhone || '2348033045612'}?text=${encodeURIComponent(whatsappMsg)}`;

  // LinkedIn
  const linkedinDm = `Hi ${persona.split(' ')[0] || 'there'},

I lead conversion infrastructure for B2B industrial firms across Lagos.

Quick observation on ${c.name}: Your clients in ${c.location} are asking for rapid quotes, but your team is losing roughly ~${c.estimatedMonthlyHoursLost} hours every month on manual back-and-forth calculations (${c.diagnosedLeak.slice(0, 80)}...).

Rather than sending a slide deck, our team built an interactive white-label rate engine configured with ${c.name}'s exact operational specs:

🔗 ${demoUrl}

It lets your clients configure volumes, calculate landed costs in Naira, and dispatch qualified bookings directly to your desk.

Could I send over a 90-second video showing how this eliminates quoting bottlenecks?`;

  // Cold Email
  const emailSubject = `Diagnostic Teardown: Eliminating ${c.name}'s ${c.estimatedMonthlyHoursLost}h/mo quoting bottleneck`;
  const emailFirstLine = `Saw your desk operations in ${c.location} and wanted to share a specific observation regarding your quoting velocity.`;
  const emailBody = `Dear ${persona},

I hope this finds you well.

While auditing high-friction B2B operations in ${c.location}, our team identified a specific operational leak costing ${c.name} an estimated ${c.estimatedMonthlyHoursLost} hours of staff time each month:

"${c.diagnosedLeak}"

When prospective clients wait hours for manual calculations, 40%+ bounce to competitors or get stalled in WhatsApp voice note negotiations.

To solve this, we engineered a custom, zero-friction interactive solution engine specifically for ${c.name}:

👉 Access your company's live system: ${demoUrl}

Key capabilities built for your desk:
1. Instant Real-Time Calculations (Naira & statutory Lagos fees included).
2. Automated 1-Click WhatsApp Booking Dispatch (with zero staff math needed).
3. Pre-qualification gates that filter out low-intent inquiries automatically.

We're rolling this out across four Lagos sectors this quarter. If you'd like to inspect the code or test plugging it into your domain, let me know when you have 10 minutes.

Warm regards,

B2B Growth Engineering Lead
Lagos B2B Automation Factory`;

  // Loom Teleprompter Script
  const loomScript = `[0:00 - 0:15] "Hey ${persona.split(' ')[0] || 'team'} at ${c.name}, I'm recording this quick 90-second teardown directly from Lagos. I was reviewing your operations in ${c.location}, and noticed an immediate opportunity to accelerate deal velocity."
[0:15 - 0:40] "Right now, your clients face this friction: ${c.diagnosedLeak} Operations like yours lose ~${c.estimatedMonthlyHoursLost} productive hours every month recalculating quotes manually."
[0:40 - 1:15] "Instead of a slide deck, we built this working solution specifically for ${c.name} at ${demoUrl}. Watch as a client configures rates and clicks to dispatch a formatted booking directly to your WhatsApp desk."
[1:15 - 1:30] "We can deploy this onto your domain in 72 hours. If this could recover 20 hours for your desk this month, let's grab 7 minutes on Thursday."`;

  return {
    persona,
    demoUrl,
    whatsappMsg,
    whatsappLink,
    linkedinDm,
    emailSubject,
    emailFirstLine,
    emailBody,
    loomScript
  };
}

// =========================================================================
// 1. Generate master-crm-import.csv
// =========================================================================
const csvHeaders = [
  'id',
  'company_name',
  'sector',
  'location',
  'target_persona',
  'diagnosed_leak',
  'hours_lost_monthly',
  'demo_url',
  'whatsapp_direct_link',
  'cold_email_subject',
  'cold_email_first_line',
  'cold_email_body',
  'linkedin_dm_text',
  'whatsapp_dm_text'
];

const csvRows = LAGOS_TARGETS_50.map(c => {
  const pack = generateScriptPack(c);
  return [
    c.id,
    csvEscape(c.name),
    csvEscape(c.sector),
    csvEscape(c.location),
    csvEscape(pack.persona),
    csvEscape(c.diagnosedLeak),
    c.estimatedMonthlyHoursLost,
    csvEscape(pack.demoUrl),
    csvEscape(pack.whatsappLink),
    csvEscape(pack.emailSubject),
    csvEscape(pack.emailFirstLine),
    csvEscape(pack.emailBody),
    csvEscape(pack.linkedinDm),
    csvEscape(pack.whatsappMsg)
  ].join(',');
});

const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
const csvPath = path.join(exportDir, 'master-crm-import.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`✅ Generated Master CRM CSV: ${csvPath} (${csvRows.length} records)`);

// =========================================================================
// 2. Generate Sector-Grouped Markdown Playbooks
// =========================================================================
const sectorKeys = ['freight', 'furniture', 'packaging', 'equipment'];

sectorKeys.forEach(secKey => {
  const sectorTargets = LAGOS_TARGETS_50.filter(c => c.sector === secKey);
  const secMeta = SECTORS[secKey];

  let md = `# ${secMeta.name.toUpperCase()} // B2B OUTREACH PLAYBOOK
**Total Targets:** ${sectorTargets.length} Lagos Companies  
**Solution Engine:** \`${secMeta.engineName}\`  
**Color Palette:** ${secMeta.theme.palette}  
**Date Generated:** ${new Date().toISOString().slice(0, 10)}

---

## Sector Overview & Friction Analysis
Lagos businesses in this sector face chronic manual quoting lag, unvetted social media DMs, and WhatsApp voice note pricing calculations. Every company in this playbook has a pre-built interactive calculator at \`/demo/[slug]\`.

---

`;

  sectorTargets.forEach(c => {
    const pack = generateScriptPack(c);

    md += `## Target #${c.id}: ${c.name}
- **Location Corridor:** ${c.location}
- **Target Persona:** ${pack.persona}
- **Sample Desk Contact:** \`${c.samplePhone}\` / \`${c.email}\`
- **Diagnosed Operational Leak:** *${c.diagnosedLeak}*
- **Estimated Desk Time Lost:** **~${c.estimatedMonthlyHoursLost} hours / month**
- **Personalized Demo URL:** [${pack.demoUrl}](${pack.demoUrl})
- **1-Click WhatsApp Direct Link:** [Launch WhatsApp Thread](${pack.whatsappLink})

### 1. Direct WhatsApp Message
\`\`\`text
${pack.whatsappMsg}
\`\`\`

### 2. LinkedIn Executive DM
\`\`\`text
${pack.linkedinDm}
\`\`\`

### 3. Cold Email Teardown
**Subject:** \`${pack.emailSubject}\`

\`\`\`text
${pack.emailBody}
\`\`\`

### 4. 90-Second Loom Teleprompter Script
\`\`\`text
${pack.loomScript}
\`\`\`

---

`;
  });

  const playbookPath = path.join(exportDir, `sector-${secKey}-playbook.md`);
  fs.writeFileSync(playbookPath, md, 'utf-8');
  console.log(`✅ Generated Sector Playbook: ${playbookPath} (${sectorTargets.length} companies)`);
});

// =========================================================================
// 3. Generate README Execution Manual
// =========================================================================
const readmeContent = `# Lagos B2B Lead Funnel & Outreach Automation Factory // Execution Manual

## Overview
This directory contains complete batch outreach assets for 50 high-friction B2B companies across four vital Lagos industrial sectors:
1. **Sector A: Freight Forwarding & Ocean Clearing** (15 companies)
2. **Sector B: Bespoke Joinery & Architectural Millwork** (12 companies)
3. **Sector C: Bulk Print & Industrial Packaging** (12 companies)
4. **Sector D: Heavy Equipment, Plant Hire & Industrial Staging** (11 companies)

---

## Files in this Directory
- \`master-crm-import.csv\`: Ready-to-import CSV with all 50 companies, demo links, WhatsApp API deep-links, and personalized cold emails. Compatible with HubSpot, Apollo.io, Instantly, Smartlead, or Google Sheets.
- \`sector-freight-playbook.md\`: Complete scripts for 15 Lagos freight forwarders (Cargo Naija, Valuehandlers, Bowwood, etc.).
- \`sector-furniture-playbook.md\`: Complete scripts for 12 custom millwork firms (Woodify NG, Oak & Teak, DO.II, Wood Empire, etc.).
- \`sector-packaging-playbook.md\`: Complete scripts for 12 bulk packaging converters (iPrints, Printivo, PrintPalash, Yama Pack, etc.).
- \`sector-equipment-playbook.md\`: Complete scripts for 11 heavy plant & crane rental firms (Mantrac, Adeyemi & Sons, Mikano, etc.).

---

## Recommended 4-Touch 7-Day Outbound Cadence
- **Day 1 (Morning):** WhatsApp Friction-Breaker via direct deep link (\`https://wa.me/...\`).
- **Day 2 (Afternoon):** Record a 90-second Loom using the Teleprompter Script while screen-sharing their live demo at \`/demo/[slug]\` in Loom Clean Mode. Send Loom link via WhatsApp.
- **Day 4:** Send LinkedIn Executive DM to the Managing Director / Commercial Lead.
- **Day 7:** Send Cold Email Teardown with the estimated monthly hours lost and financial ROI breakdown.

---
*Generated autonomously by Lagos B2B Lead Funnel Factory inside Google Antigravity.*
`;

const readmePath = path.join(exportDir, 'README-outreach-execution-manual.md');
fs.writeFileSync(readmePath, readmeContent, 'utf-8');
console.log(`✅ Generated Execution Manual: ${readmePath}`);

console.log('\n🎉 [COMPLETE] All 50 Lagos B2B outreach packs generated successfully in /outreach-exports/\n');
