# Avada Search Tool using RAG

> AI-powered product search tool for Shopify stores using Retrieval-Augmented Generation with Weaviate vector database and OpenAI

## Overview

This application provides intelligent product search capabilities for Shopify stores by combining:
- **Vector Database**: Weaviate for semantic product storage
- **AI Embeddings**: OpenAI text2vec for product vectorization  
- **Generative AI**: OpenAI GPT for natural language responses
- **Real-time Sync**: Webhooks for automatic product synchronization

## Features

- 🔍 **Semantic Search**: Natural language product queries
- 🤖 **AI Responses**: Personalized product recommendations
- ⚡ **Real-time Sync**: Automatic Shopify product updates
- 🎯 **Vector Search**: Similarity-based product matching
- 📊 **Analytics**: Search performance tracking

## Notes
- This project serves as an **educational demonstration** of RAG (Retrieval-Augmented Generation) implementation within the Avada framework ecosystem
- The application is designed to be deployed as a **Storefront widget** for end-users, rather than an Admin dashboard tool
- **Framework Integration**: Demonstrates how AI-powered search can be embedded using Avada's development patterns and best practices
- **Technical Guidance**: Project development was supervised and reviewed by CTO Nguyen Tuan Anh
- **Learning Objectives**: 
  - Vector database integration with Shopify
  - Real-time webhook synchronization
  - AI-powered semantic search implementation
  - Modern frontend-backend architecture patterns

## Preparation

* [A Firebase account](https://firebase.google.com/)

* A Firebase project

* [A Shopify partner account](https://www.shopify.com/partners)

* A Shopify app in partner account

* [A Weaviate Cloud account](https://console.weaviate.cloud/) for vector database

* [An OpenAI API account](https://platform.openai.com/) for AI embeddings and generation

## Installation

* Choose a project staging for Firebase application

```bash
firebase use --add
```

* Configure all settings for Firebase development environment by create a new file `.runtimeconfig.json` inside the `packages/functions`

```json
{
  "shopify": {
    "api_key": "<Shopify API Key>",
    "secret": "<Shopify Secret>",
    "firebase_api_key": "<Firebase API Key>"
  },
  "app": {
    "base_url": ""
  }
}
```

* Create a file `.env` inside `packages/functions` for AI services configuration

```dotenv
# Weaviate Configuration
WEAVIATE_API_KEY=<Your Weaviate API Key>
WEAVIATE_URL=<Your Weaviate Cluster URL>

# OpenAI Configuration  
OPENAI_API_KEY=<Your OpenAI API Key>

# Shopify Configuration
SHOPIFY_API_KEY=<Your Shopify Access Token>
SHOPIFY_STORE=<your-store>.myshopify.com
```

* Create a file `.env.development` with content in [packages/assets](/packages/assets)

```dotenv
VITE_SHOPIFY_API_KEY=<Insert here>
VITE_FIREBASE_API_KEY=<Insert here>
VITE_FIREBASE_AUTH_DOMAIN=<Insert here>
VITE_FIREBASE_PROJECT_ID=<Insert here>
VITE_FIREBASE_STORAGE_BUCKET=<Insert here>
VITE_FIREBASE_APP_ID=<Insert here>
VITE_FIREBASE_MEASUREMENT_ID=<Insert here>
```

* Create an empty Firestore database
* Deploy the Firestore default indexes
```bash
firebase deploy --only firestore
```

* Initialize Weaviate collection for products
```bash
cd packages/functions
node src/services/weaviateCollection.js
```

* Sync all products from Shopify to Weaviate
```bash
node src/scripts/syncAllProducts.js
```

* Setup Shopify webhooks for real-time sync
```bash
# Clean up old webhooks
node src/scripts/cleanupWebhooks.js

# Setup new webhooks
node src/scripts/setupWebhook.js
```

## Development

* To start to develop, please run 2 below commands

```bash
npm run dev
```

```bash
GOOGLE_APPLICATION_CREDENTIALS=<Path to service-account.json> firebase serve
```

## Lint

* All your files must be passed [ESLint](https://eslint.org/):

To setup a git hook before committing to Gitlab, please run:

```bash
cp git-hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

## Where you can see all function logs

* You can see all logs from your functions by follow commands

```bash
firebase functions:log
```

* You also view in Web interface by access

![View all logs from Firebase web interface](https://i.imgur.com/SLYqnhS.png)

## Common issues

### When you open an embedded app in local, it can throw an error like that

![Content Security Policy Error](https://raw.githubusercontent.com/baorv/faster-shopify-dev/master/screenshot.png)

**Solution**

Install [Disable Content-Security-Policy (CSP)](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden) to disable CSP in Chromium browers

### I got message `Unauthorized` after authentication

**Solution**

Go `https://console.firebase.google.com/u/0/project/{project-id}/settings/serviceaccounts/adminsdk`

Click `Generate new private key`

Use command to export global environment

```bash
export GOOGLE_APPLICATION_CREDENTIALS=<Path to service-account.json>
```

### I got message `PERMISSION_DENIED: Missing or insufficient permissions`

**Solution**

Enable permission `Service Account Token Creator` for `user@appspot.gserviceaccount.com`

![Enable Permission for appspot](https://firebasestorage.googleapis.com/v0/b/pdf-invoice-4717c.appspot.com/o/images%2Fdev-docs%2Fiam_enable_jwt_creator.png?alt=media&token=ea1a3c08-64e2-4519-a6fc-81620249dbbd)

### I can't see `FIREBASE_MEASUREMENT_ID` in Firebase project

**Solution**

You can enable Analytics for your project from Firebase project

![Enable Google Analytics on your app](https://firebasestorage.googleapis.com/v0/b/avada-development.appspot.com/o/images%2Fscreenshots%2Fenable_analytics.png?alt=media&token=559669e1-65d5-4e7b-b2dd-ce82517a262e)

## TODO

- [ ] Add testing
- [x] CI/CD
- [ ] Add document
- [x] Weaviate vector database integration
- [x] OpenAI embeddings and generation
- [x] Real-time Shopify webhook sync
- [x] Semantic product search
- [ ] Search analytics dashboard
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Migrate to Storefront