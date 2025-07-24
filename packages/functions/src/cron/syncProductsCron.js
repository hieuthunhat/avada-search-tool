// const cron = require('node-cron');
// const ProductRepository = require('../repositories/productRepository');

// async function syncShopifyToWeaviate() {
//   const products = await ProductRepository.pullAllProductsFromShopify();
//   await ProductRepository.insertShopifyProducts(products);
//   console.log(`[${new Date().toISOString()}] Synced ${products.length} products from Shopify`);
// }

// cron.schedule('*/10 * * * *', async () => {
//   try {
//     await syncShopifyToWeaviate();
//   } catch (error) {
//     console.error('Error syncing products:', error.message);
//   }
// });

// module.exports = {
//   syncShopifyToWeaviate
// };
