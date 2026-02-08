import { app } from '@azure/functions';
import { AzureOpenAI } from 'openai';

// System prompt that defines the AI assistant's behavior
const SYSTEM_PROMPT = `You are a helpful AI assistant for NEWFTEC, a technology consulting company specializing in cloud solutions and GenAI for small and medium businesses.

Your role is to:
1. Answer questions about NEWFTEC's services (Cloud Migration, GenAI & Intelligent Automation, App Modernization, Data Analytics, DevOps, Security)
2. Help visitors understand how technology can benefit their business
3. Provide helpful information about cloud and AI solutions
4. Guide users toward scheduling a consultation when appropriate

Keep responses concise (2-3 sentences for simple questions, up to 1 paragraph for complex ones).
Be friendly, professional, and avoid overly technical jargon unless asked for details.
If you don't know something specific about NEWFTEC, be honest and suggest contacting the team directly.

Key facts about NEWFTEC:
- Specializes in helping small and medium businesses with enterprise-grade technology
- Offers fixed-price projects with no surprise invoices
- Provides knowledge transfer so clients can maintain solutions
- 10+ years experience, 50+ projects delivered, 98% client satisfaction
- Core values: Powerful, Simple, Durable (named after Newfoundland dog breed qualities)`;

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

      const response = await client.chat.completions.create({
        model: deploymentName,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95
      });

      const assistantMessage = response.choices[0]?.message?.content || 
        "I apologize, but I couldn't generate a response. Please try again or contact us directly.";

      context.log(`Response generated successfully`);

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: assistantMessage,
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
