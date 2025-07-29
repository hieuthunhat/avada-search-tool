const ProductRepository = require('../repositories/productRepository');

/**
 * Webhook handler for Shopify product creation events
 * @param {Object} ctx - Koa context object
 * @param {Object} ctx.req.body - Product data from Shopify
 * @returns {Promise<void>}
 */
async function listenCreateProduct(ctx) {
  const productData = ctx.req.body;
  if (!productData) {
    ctx.status = 400;
    ctx.body = {error: 'No body data'};
    return;
  }

  const data = await ProductRepository.addProduct({product: productData});
  ctx.status = 200;
  ctx.body = {success: true, action: 'created', data: data};
}

/**
 * Webhook handler for Shopify product update events
 * @param {Object} ctx - Koa context object
 * @param {Object} ctx.req.body - Updated product data from Shopify
 * @returns {Promise<void>}
 */
async function listenUpdateProduct(ctx) {
  const productData = ctx.req.body;
  if (!productData) {
    ctx.status = 400;
    ctx.body = {error: 'No body data'};
    return;
  }
  const data = await ProductRepository.updateProduct({product: productData});
  ctx.status = 200;
  ctx.body = {success: true, action: 'updated', data: data};
}

/**
 * Webhook handler for Shopify product deletion events
 * @param {Object} ctx - Koa context object
 * @param {Object} ctx.req.body - Deleted product data from Shopify
 * @returns {Promise<void>}
 */
async function listenDeleteProduct(ctx) {
  const productData = ctx.req.body;
  if (!productData) {
    ctx.status = 400;
    ctx.body = {error: 'No body data'};
    return;
  }
  const data = await ProductRepository.deleteProduct({product: productData});

  ctx.status = 200;
  ctx.body = {success: true, action: 'deleted', data: data};
}

export default {
  listenCreateProduct,
  listenUpdateProduct,
  listenDeleteProduct
};
