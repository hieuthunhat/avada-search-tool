const weaviate = require('weaviate-client');
const dotenv = require('dotenv');

dotenv.config();

let client;
let response;

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

async function searchProducts(searchQuery) {
  try {
    await initWeaviate(); // đảm bảo client đã kết nối

    if (await client.isLive()) {
      const collectionExists = await client.collections.exists('Movie');
      if (!collectionExists) return null;

      const movies = client.collections.get('Movie');
      response = await movies.generate.nearText(
        searchQuery,
        {singlePrompt: searchQuery},
        {limit: 5, returnMetadata: ['distance']}
      );

      for (const item of response.objects) {
        console.log(
          `${item.properties.title}: ${new Date(item.properties.release_date).getUTCFullYear()}`
        );
        console.log(`Distance to query: ${item.metadata.distance}`);
      }

      return response;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  searchProducts
};
