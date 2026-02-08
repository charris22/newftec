# NEWFTEC Chat API

Azure Functions backend for the AI chat widget, powered by Azure OpenAI.

## Prerequisites

1. **Azure Subscription** with Azure OpenAI access
2. **Node.js 18+** installed
3. **Azure Functions Core Tools v4** installed:
   ```bash
   npm install -g azure-functions-core-tools@4
   ```

## Azure OpenAI Setup

### 1. Create Azure OpenAI Resource

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name newftec-rg --location eastus

# Create Azure OpenAI resource
az cognitiveservices account create \
  --name newftec-openai \
  --resource-group newftec-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus
```

### 2. Deploy a Model

1. Go to [Azure OpenAI Studio](https://oai.azure.com/)
2. Select your resource
3. Go to **Deployments** → **Create new deployment**
4. Deploy `gpt-4o` (or `gpt-4o-mini` for lower cost)
5. Note the **deployment name** (e.g., `gpt-4o`)

### 3. Get Your Keys

```bash
# Get endpoint
az cognitiveservices account show \
  --name newftec-openai \
  --resource-group newftec-rg \
  --query "properties.endpoint" -o tsv

# Get API key
az cognitiveservices account keys list \
  --name newftec-openai \
  --resource-group newftec-rg \
  --query "key1" -o tsv
```

## Local Development

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Configure Environment

Edit `local.settings.json` with your values:

```json
{
  "Values": {
    "AZURE_OPENAI_ENDPOINT": "https://your-resource.openai.azure.com/",
    "AZURE_OPENAI_API_KEY": "your-api-key",
    "AZURE_OPENAI_DEPLOYMENT_NAME": "gpt-4o"
  }
}
```

### 3. Run Locally

```bash
npm start
# or
func start
```

The API will be available at `http://localhost:7071/api/chat`

### 4. Test the API

```bash
# Health check
curl http://localhost:7071/api/health

# Send a chat message
curl -X POST http://localhost:7071/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What services do you offer?"}'
```

## Deployment

### Option 1: Azure Static Web Apps (Recommended)

When deploying the Astro site to Azure Static Web Apps, the `/api` folder is automatically deployed as the backend.

1. Configure the SWA with these application settings:
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`

### Option 2: Standalone Azure Functions

```bash
# Create Function App
az functionapp create \
  --resource-group newftec-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name newftec-chat-api \
  --storage-account <storage-account-name>

# Deploy
func azure functionapp publish newftec-chat-api

# Configure settings
az functionapp config appsettings set \
  --name newftec-chat-api \
  --resource-group newftec-rg \
  --settings \
    AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/" \
    AZURE_OPENAI_API_KEY="your-key" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o"
```

## API Reference

### POST /api/chat

Send a message to the AI assistant.

**Request:**
```json
{
  "message": "What services do you offer?",
  "conversationHistory": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
```

**Response:**
```json
{
  "message": "We offer Cloud Migration, GenAI & Intelligent Automation, App Modernization, Data Analytics, DevOps, and Security services. Which area interests you most?",
  "usage": {
    "promptTokens": 150,
    "completionTokens": 45
  }
}
```

### GET /api/health

Check API health and configuration status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-08T12:00:00.000Z",
  "config": {
    "openaiConfigured": true,
    "deploymentName": "gpt-4o"
  }
}
```

## Cost Estimation

Azure OpenAI pricing (approximate, check current rates):
- GPT-4o: ~$5/1M input tokens, ~$15/1M output tokens
- GPT-4o-mini: ~$0.15/1M input tokens, ~$0.60/1M output tokens

Typical chat interaction uses ~500-1000 tokens total = $0.01-0.02 per conversation with GPT-4o.

## Customizing the AI Behavior

Edit the `SYSTEM_PROMPT` in `src/functions/chat.js` to customize:
- Tone and personality
- Knowledge about your services
- Response length guidelines
- Topics to avoid

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check API key in settings |
| 404 Model not found | Verify deployment name matches |
| CORS errors | Ensure CORS is configured in host settings |
| Timeout | Increase function timeout or reduce max_tokens |

## Security Notes

- Never commit `local.settings.json` to git (it's in `.gitignore` by default)
- Use Azure Key Vault for production secrets
- Consider adding rate limiting for production use
- Monitor usage in Azure OpenAI Studio
