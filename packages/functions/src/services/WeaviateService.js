const weaviate = require('weaviate-client');
const dotenv = require('dotenv');
const WeaviateService = require('./DBWeaviateService');
dotenv.config();

const {configure} = weaviate;

async function initCollection() {
  const client = await WeaviateService.initWeaviate();

  try {
    if (await client.isLive()) {
      const collectionExists = await client.collections.exists('ProductShopify');

      if (!collectionExists) {
        await client.collections.create({
          name: 'ProductShopify',
          properties: [
            {name: 'product_id', dataType: configure.dataType.TEXT},
            {name: 'name', dataType: configure.dataType.TEXT},
            {name: 'price', dataType: configure.dataType.NUMBER},
            {name: 'description', dataType: configure.dataType.TEXT},
            {name: 'image', dataType: configure.dataType.TEXT},
            {name: 'category', dataType: configure.dataType.TEXT},
            {name: 'productCategory', dataType: configure.dataType.TEXT},
            {name: 'type', dataType: configure.dataType.TEXT},
            {name: 'rating', dataType: configure.dataType.NUMBER},
            {name: 'stock', dataType: configure.dataType.INT},
            {name: 'tags', dataType: configure.dataType.TEXT},
            {name: 'createdAt', dataType: configure.dataType.DATE},
            {name: 'updatedAt', dataType: configure.dataType.DATE},
            {name: 'isActive', dataType: configure.dataType.BOOLEAN},
            {name: 'discount', dataType: configure.dataType.NUMBER}
          ],
          vectorizers: weaviate.configure.vectorizer.text2VecOpenAI(),
          generative: configure.generative.openAI()
        });

        console.log('ProductShopify collection created successfully with OpenAI vectorizer!');
      } else {
        console.log('Collection already exists.');
      }
    }
    return client;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  initCollection
};
