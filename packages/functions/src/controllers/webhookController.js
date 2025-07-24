const ProductRepository = require('../repositories/productRepository');

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
