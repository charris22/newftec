import { app } from '@azure/functions';

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const hasOpenAIConfig = !!(
      process.env.AZURE_OPENAI_ENDPOINT && 
      process.env.AZURE_OPENAI_API_KEY
    );

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        config: {
          openaiConfigured: hasOpenAIConfig,
          deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'not set'
        }
      })
    };
  }
});
