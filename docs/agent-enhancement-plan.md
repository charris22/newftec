# NEWFTEC Agent Enhancement Plan

## Overview

Enhance the AI assistant to become a true customer engagement agent with:
- **Communication actions**: Send emails/texts to the business owner on behalf of customers
- **Meeting scheduling**: Integrate with calendar for booking consultations
- **Adaptive cards**: Structured data capture UI components
- **Centralized assets**: Prompts, schemas, and configs in repo for version control

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (Astro)                            │
│  ┌─────────────┐  ┌─────────────────┐  ┌──────────────────────────┐ │
│  │ Chat Widget │  │ Adaptive Cards  │  │ Meeting Scheduler UI     │ │
│  └──────┬──────┘  └────────┬────────┘  └────────────┬─────────────┘ │
└─────────┼──────────────────┼───────────────────────┼────────────────┘
          │                  │                       │
          ▼                  ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Azure Functions API Layer                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │ /chat    │  │ /submit-form │  │ /schedule│  │ /send-contact   │  │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └───────┬─────────┘  │
└───────┼───────────────┼───────────────┼────────────────┼────────────┘
        │               │               │                │
        ▼               ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Azure AI Foundry                                │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐ │
│  │ Agent + Tools  │  │ Prompt Library │  │ Conversation Memory    │ │
│  └────────────────┘  └────────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
        │               │               │                │
        ▼               ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      External Services                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ SendGrid     │  │ Twilio       │  │ Microsoft Graph          │   │
│  │ (Email)      │  │ (SMS)        │  │ (Calendar/Outlook)       │   │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Proposed Repository Structure

```
newftec/
├── astro-site/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAgentWidget.astro        # Enhanced with card rendering
│   │   │   ├── AdaptiveCard.astro         # NEW: Card renderer
│   │   │   └── MeetingScheduler.astro     # NEW: Scheduling UI
│   │   └── pages/
│   │       └── chat.astro
│   └── api/
│       └── src/functions/
│           ├── chat.js                    # Enhanced with tool routing
│           ├── submit-form.js             # NEW: Form submission handler
│           ├── schedule-meeting.js        # NEW: Calendar integration
│           └── send-contact.js            # NEW: Email/SMS dispatch
│
├── agent/                                 # NEW: Centralized agent assets
│   ├── prompts/
│   │   ├── system.md                      # Main system prompt
│   │   ├── scheduling.md                  # Meeting scheduling context
│   │   ├── contact-capture.md             # Lead capture guidelines
│   │   └── service-advisor.md             # Service recommendation logic
│   │
│   ├── tools/                             # Function definitions for Foundry
│   │   ├── send-email.json                # Tool schema
│   │   ├── send-sms.json
│   │   ├── schedule-meeting.json
│   │   ├── show-contact-form.json
│   │   └── show-service-card.json
│   │
│   ├── cards/                             # Adaptive Card templates
│   │   ├── contact-form.json
│   │   ├── meeting-scheduler.json
│   │   ├── service-inquiry.json
│   │   ├── quote-request.json
│   │   └── confirmation.json
│   │
│   ├── schemas/                           # Data validation schemas
│   │   ├── contact.schema.json
│   │   ├── meeting.schema.json
│   │   └── inquiry.schema.json
│   │
│   └── config/
│       ├── foundry.config.json            # Foundry deployment settings
│       └── services.config.json           # API keys reference (env vars)
│
├── scripts/                               # NEW: Deployment/sync scripts
│   ├── sync-prompts-to-foundry.js         # Push prompts to Foundry
│   ├── sync-tools-to-foundry.js           # Register tools in Foundry
│   └── validate-cards.js                  # Validate card JSON schemas
│
└── docs/
    └── agent-enhancement-plan.md          # This file
```

---

## Phase 1: Contact Actions (Week 1-2)

### 1.1 Email Integration (SendGrid)

**Tool Definition** (`agent/tools/send-email.json`):
```json
{
  "name": "send_email_to_owner",
  "description": "Send an email to the NEWFTEC team on behalf of the customer. Use when customer wants to get in touch, request info, or follow up.",
  "parameters": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string", "description": "Customer's name" },
      "customer_email": { "type": "string", "description": "Customer's email for reply" },
      "subject": { "type": "string", "description": "Email subject line" },
      "message": { "type": "string", "description": "Message content" },
      "intent": { 
        "type": "string", 
        "enum": ["general_inquiry", "service_interest", "quote_request", "meeting_request"],
        "description": "Customer's intent category"
      }
    },
    "required": ["customer_name", "customer_email", "message", "intent"]
  }
}
```

**Azure Function** (`api/src/functions/send-contact.js`):
```javascript
const { app } = require('@azure/functions');
const sgMail = require('@sendgrid/mail');

app.http('send-contact', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const { customer_name, customer_email, subject, message, intent, channel } = await request.json();
    
    // Send email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: process.env.OWNER_EMAIL,
      from: 'noreply@newftec.com',
      replyTo: customer_email,
      subject: subject || `[${intent}] New inquiry from ${customer_name}`,
      html: buildEmailTemplate({ customer_name, customer_email, message, intent })
    });

    // Optionally send SMS notification
    if (process.env.ENABLE_SMS_ALERTS === 'true') {
      await sendSmsAlert(customer_name, intent);
    }

    return { jsonBody: { success: true, message: 'Contact sent successfully' } };
  }
});
```

### 1.2 SMS Integration (Twilio)

**Tool Definition** (`agent/tools/send-sms.json`):
```json
{
  "name": "send_sms_alert",
  "description": "Send an urgent SMS alert to the owner. Use sparingly for high-priority or time-sensitive requests.",
  "parameters": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string" },
      "urgency": { "type": "string", "enum": ["normal", "high", "urgent"] },
      "summary": { "type": "string", "maxLength": 160 }
    },
    "required": ["customer_name", "summary"]
  }
}
```

---

## Phase 2: Adaptive Cards (Week 2-3)

### 2.1 Card Types

| Card | Purpose | Triggers When |
|------|---------|---------------|
| `contact-form` | Capture name, email, message | User wants to get in touch |
| `meeting-scheduler` | Select date/time, meeting type | User wants to schedule consultation |
| `service-inquiry` | Multi-select services, budget range | User exploring services |
| `quote-request` | Detailed project info capture | User ready for quote |

### 2.2 Contact Form Card (`agent/cards/contact-form.json`)

```json
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "📬 Let's Get in Touch",
      "weight": "Bolder",
      "size": "Large"
    },
    {
      "type": "TextBlock",
      "text": "Fill out the form below and we'll get back to you within 24 hours.",
      "wrap": true,
      "spacing": "Small"
    },
    {
      "type": "Input.Text",
      "id": "name",
      "label": "Your Name",
      "isRequired": true,
      "errorMessage": "Please enter your name"
    },
    {
      "type": "Input.Text",
      "id": "email",
      "label": "Email Address",
      "style": "Email",
      "isRequired": true
    },
    {
      "type": "Input.Text",
      "id": "phone",
      "label": "Phone (optional)",
      "style": "Tel"
    },
    {
      "type": "Input.ChoiceSet",
      "id": "interest",
      "label": "What are you interested in?",
      "isMultiSelect": true,
      "choices": [
        { "title": "Cloud Migration", "value": "cloud-migration" },
        { "title": "AI & Automation", "value": "ai-solutions" },
        { "title": "App Modernization", "value": "modern-apps" },
        { "title": "Data & Analytics", "value": "data-analytics" },
        { "title": "DevOps", "value": "devops" },
        { "title": "Security & Compliance", "value": "security" }
      ]
    },
    {
      "type": "Input.Text",
      "id": "message",
      "label": "Tell us about your project",
      "isMultiline": true,
      "placeholder": "What challenges are you facing? What are your goals?"
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Send Message",
      "style": "positive",
      "data": { "action": "submit_contact" }
    }
  ]
}
```

### 2.3 Card Renderer Component

**Frontend Component** (`astro-site/src/components/AdaptiveCard.astro`):
```astro
---
interface Props {
  card: object;
  onSubmit?: string;
}
const { card, onSubmit } = Astro.props;
---

<div class="adaptive-card-container" data-card={JSON.stringify(card)} data-submit-endpoint={onSubmit}>
  <div class="card-content"></div>
</div>

<script>
  // Use adaptivecards.io JS library to render
  import * as AdaptiveCards from 'adaptivecards';
  
  document.querySelectorAll('.adaptive-card-container').forEach(container => {
    const cardData = JSON.parse(container.dataset.card);
    const adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.parse(cardData);
    
    adaptiveCard.onExecuteAction = async (action) => {
      if (action instanceof AdaptiveCards.SubmitAction) {
        const endpoint = container.dataset.submitEndpoint;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        // Handle response
      }
    };
    
    container.querySelector('.card-content').appendChild(adaptiveCard.render());
  });
</script>
```

---

## Phase 3: Meeting Scheduling (Week 3-4)

### 3.1 Calendar Integration Options

| Option | Pros | Cons |
|--------|------|------|
| **Microsoft Graph API** | Direct Outlook integration, free slots | Requires Azure AD setup |
| **Calendly API** | Easy setup, built-in scheduling | Monthly cost, external dependency |
| **Cal.com** | Open source, self-hostable | More setup work |

**Recommendation**: Start with Calendly for quick MVP, migrate to Graph API later.

### 3.2 Meeting Scheduler Tool

```json
{
  "name": "schedule_meeting",
  "description": "Schedule a consultation meeting with the customer",
  "parameters": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string" },
      "customer_email": { "type": "string" },
      "meeting_type": {
        "type": "string",
        "enum": ["discovery_call", "technical_deep_dive", "project_kickoff"],
        "description": "Type of meeting to schedule"
      },
      "preferred_times": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Customer's preferred time slots (ISO 8601)"
      },
      "notes": { "type": "string" }
    },
    "required": ["customer_name", "customer_email", "meeting_type"]
  }
}
```

### 3.3 Meeting Types

| Type | Duration | Description |
|------|----------|-------------|
| Discovery Call | 30 min | Initial conversation about needs |
| Technical Deep Dive | 60 min | Detailed technical discussion |
| Project Kickoff | 90 min | Scope and planning session |

---

## Phase 4: Foundry Integration (Week 4-5)

### 4.1 Sync Scripts

**Prompt Sync Script** (`scripts/sync-prompts-to-foundry.js`):
```javascript
const fs = require('fs');
const path = require('path');
const { AzureOpenAI } = require('@azure/openai');

async function syncPrompts() {
  const promptsDir = path.join(__dirname, '../agent/prompts');
  const prompts = {};
  
  // Read all prompt files
  for (const file of fs.readdirSync(promptsDir)) {
    if (file.endsWith('.md')) {
      const name = path.basename(file, '.md');
      prompts[name] = fs.readFileSync(path.join(promptsDir, file), 'utf-8');
    }
  }
  
  // Update Foundry agent configuration
  // (Implementation depends on Foundry API)
  console.log('Synced prompts:', Object.keys(prompts));
}

syncPrompts();
```

### 4.2 Environment Variables

```env
# Foundry
AZURE_OPENAI_ENDPOINT=https://your-foundry.openai.azure.com
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o

# Communication Services
SENDGRID_API_KEY=SG.xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx
OWNER_EMAIL=chris@newftec.com
OWNER_PHONE=+1xxx

# Calendar
CALENDLY_API_KEY=xxx
# Or for Graph API:
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_TENANT_ID=xxx
```

---

## Agent Behavior Guidelines

### When to Show Adaptive Cards

The agent should show cards when:
1. User explicitly asks to "contact", "schedule", or "get a quote"
2. User provides enough context that structured input would help
3. Conversation reaches natural decision point

**Prompt guidance** (`agent/prompts/system.md`):
```markdown
## Tool Usage Guidelines

### show_contact_form
Use when:
- User says "I'd like to get in touch" or "contact you"
- User has questions that require follow-up
- User expresses interest but hasn't provided contact info

### show_meeting_scheduler  
Use when:
- User explicitly wants to "schedule a call" or "book a meeting"
- User says "let's discuss" or "can we talk?"
- After qualifying interest, offer to schedule

### send_email_to_owner
Use when:
- User has completed a form OR provided all needed info conversationally
- Message is ready to send (you have name, email, and message content)
- Always confirm with user before sending
```

---

## Implementation Checklist

### Phase 1: Contact Actions
- [ ] Set up SendGrid account and verify domain
- [ ] Create `send-contact` Azure Function
- [ ] Add `send_email_to_owner` tool to Foundry agent
- [ ] Test email delivery end-to-end
- [ ] (Optional) Set up Twilio for SMS alerts

### Phase 2: Adaptive Cards
- [ ] Create card JSON templates in `agent/cards/`
- [ ] Build `AdaptiveCard.astro` renderer component
- [ ] Add `show_card` tool to Foundry agent
- [ ] Integrate card rendering in chat widget
- [ ] Handle form submissions → API → email

### Phase 3: Meeting Scheduling
- [ ] Set up Calendly or Graph API integration
- [ ] Create `schedule-meeting` Azure Function
- [ ] Build meeting scheduler card
- [ ] Add calendar availability display
- [ ] Send confirmation emails

### Phase 4: Foundry Sync
- [ ] Structure `agent/` directory as specified
- [ ] Write sync scripts for prompts and tools
- [ ] Add npm scripts for deployment
- [ ] Document local dev vs. production workflow

---

## Questions to Resolve

1. **Email provider**: SendGrid vs. Azure Communication Services?
2. **Calendar**: Calendly (quick) vs. Graph API (integrated)?
3. **SMS alerts**: Enable for all contacts or only high-priority?
4. **Card styling**: Match site theme or standard Adaptive Cards look?
5. **Data storage**: Store contact submissions in Cosmos DB for CRM features?

---

## Next Steps

1. **Approve plan** - Review and confirm approach
2. **Set up services** - Create SendGrid/Twilio accounts
3. **Phase 1 implementation** - Email contact flow
4. **Iterate** - Add cards, scheduling, polish

Ready to start implementation when you approve the plan.
