const weaviate = require('weaviate-client');
const dotenv = require('dotenv');

dotenv.config();

let client;

async function initWeaviate() {
  if (!client) {
    client = await weaviate.connectToWeaviateCloud(process.env.WEAVIATE_URL, {
      authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
      headers: {
        'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY
      }
    });
  }
}

module.exports = {initWeaviate};
