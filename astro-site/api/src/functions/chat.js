import { app } from '@azure/functions';
import { AzureOpenAI } from 'openai';

// System prompt that defines the AI assistant's behavior
const SYSTEM_PROMPT = `You are an AI assistant for NEWFTEC, a technology consulting company helping small and medium businesses with cloud solutions and GenAI.

## Your Capabilities
1. Answer questions about NEWFTEC services: Cloud Migration, GenAI & Intelligent Automation, App Modernization, Data Analytics, DevOps, Security & Compliance
2. Help businesses understand technology benefits and solutions
3. Capture contact information and send messages to the NEWFTEC team
4. Guide visitors toward scheduling consultations

## Key Facts About NEWFTEC
- Enterprise-grade solutions for SMBs
- Fixed-price projects, no surprise invoices
- Knowledge transfer included
- 10+ years experience, 50+ projects, 98% client satisfaction
- Core values: Powerful, Simple, Durable

## Using Tools
You have access to the "send_contact_email" tool to send inquiries to the NEWFTEC team.

### When to capture contact info:
- User explicitly wants to get in touch, schedule a call, or request a consultation
- User has specific project questions that need expert follow-up
- User is ready to discuss their business needs

### How to collect information naturally:
1. When a user asks to contact NEWFTEC or schedule a call, ask for their name and email
2. Ask what services interest them or their project goals
3. Once you have: name, email, and their message/question, use the send_contact_email tool

### Example conversation flow:
User: "I'd like to schedule a consultation"
Assistant: "I'd be happy to help arrange that! Could you share your name and email address?"
User: "John Smith, john@example.com"
Assistant: "Great, John! What specific areas would you like to discuss - cloud migration, AI solutions, or something else?"
User: "We're interested in modernizing our legacy apps"
Assistant: [Uses send_contact_email tool, then confirms]

## Response Guidelines
- Keep responses concise (2-3 sentences for simple questions)
- Be friendly, professional, and avoid unnecessary jargon
- If you don't know something, be honest and suggest contacting the team
- After successfully sending a contact email, confirm and reassure the user they'll hear back soon`;

// Tool definitions for Azure OpenAI function calling
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'send_contact_email',
      description: 'Send an email to the NEWFTEC team with customer contact information and their inquiry. Use this when a customer wants to get in touch, schedule a consultation, or has questions requiring follow-up.',
      parameters: {
        type: 'object',
        properties: {
          customer_name: {
            type: 'string',
            description: 'The full name of the customer'
          },
          customer_email: {
            type: 'string', 
            description: 'The email address of the customer'
          },
          customer_phone: {
            type: 'string',
            description: 'The phone number of the customer (optional)'
          },
          message: {
            type: 'string',
            description: 'A summary of what the customer is interested in or their question'
          },
          services_of_interest: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['cloud-migration', 'ai-solutions', 'modern-apps', 'data-analytics', 'devops', 'security', 'general']
            },
            description: 'Array of service categories the customer is interested in'
          },
          urgency: {
            type: 'string',
            enum: ['normal', 'high'],
            description: 'Set to high if customer indicates time-sensitive need'
          }
        },
        required: ['customer_name', 'customer_email', 'message']
      }
    }
  }
];

// Internal function to call send-contact endpoint
async function executeSendContactEmail(args, context) {
  try {
    // Call the send-contact function internally
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:7071';
    const response = await fetch(`${apiBaseUrl}/api/send-contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });
    
    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: 'Email sent successfully to the NEWFTEC team.' };
    } else {
      context.log(`Send contact failed: ${result.error}`);
      return { success: false, error: result.error || 'Failed to send email' };
    }
  } catch (error) {
    context.log(`Tool execution error: ${error.message}`);
    return { success: false, error: 'Unable to send email at this time' };
  }
}

// Initialize Azure OpenAI client
function getOpenAIClient() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';
  
  if (!endpoint || !apiKey) {
    throw new Error('Azure OpenAI configuration is missing. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY.');
  }
  
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: deploymentName
  });
}

app.http('chat', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      };
    }

    try {
      const body = await request.json();
      const { message, conversationHistory = [] } = body;

      if (!message || typeof message !== 'string') {
        return {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Message is required' })
        };
      }

      context.log(`Processing chat message: ${message.substring(0, 50)}...`);

      const client = getOpenAIClient();
      const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';

      // Build messages array with conversation history
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ];

      let response = await client.chat.completions.create({
        model: deploymentName,
        messages,
        tools: TOOLS,
        tool_choice: 'auto',
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95
      });

      let assistantMessage = response.choices[0]?.message;

      // Handle tool calls if present
      if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
        context.log(`Tool calls requested: ${assistantMessage.tool_calls.map(t => t.function.name).join(', ')}`);
        
        // Add assistant's response with tool calls to messages
        messages.push(assistantMessage);

        // Process each tool call
        for (const toolCall of assistantMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments);
          
          let toolResult;
          if (functionName === 'send_contact_email') {
            toolResult = await executeSendContactEmail(args, context);
          } else {
            toolResult = { error: `Unknown function: ${functionName}` };
          }

          // Add tool result to messages
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          });
        }

        // Get final response after tool execution
        response = await client.chat.completions.create({
          model: deploymentName,
          messages,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.95
        });

        assistantMessage = response.choices[0]?.message;
      }

      const finalMessage = assistantMessage?.content || 
        "I apologize, but I couldn't generate a response. Please try again or contact us directly.";

      context.log(`Response generated successfully`);

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: finalMessage,
          usage: {
            promptTokens: response.usage?.prompt_tokens,
            completionTokens: response.usage?.completion_tokens
          }
        })
      };

    } catch (error) {
      context.error('Chat API error:', error);
      
      // Return user-friendly error
      const errorMessage = error.code === 'DeploymentNotFound' 
        ? 'AI service is being configured. Please try again later.'
        : 'Sorry, I encountered an issue. Please try again or contact us directly.';

      return {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
      };
    }
  }
});
