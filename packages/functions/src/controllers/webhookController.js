async function listenCreateProduct(ctx) {
  const productData = ctx.req.body;

  console.log('Product ID:', productData?.id);
  console.log('Product Title:', productData?.title);
  console.log('Product Handle:', productData?.handle);
  console.log('Product Status:', productData?.status);
  console.log('Variants:', productData?.variants?.length || 0);

  ctx.status = 200;
  ctx.body = {success: true, action: 'created'};
}

async function listenUpdateProduct(ctx) {
  console.log('✏️ Product Updated from Shopify');
  const productData = ctx.req.body;

  console.log('Product Title:', productData?.title);

  ctx.status = 200;
  ctx.body = {success: true, action: 'updated'};
}

async function listenDeleteProduct(ctx) {
  console.log('🗑️ Product Deleted from Shopify');
  const productData = ctx.req.body;

  console.log('Product ID:', productData?.id);

  ctx.status = 200;
  ctx.body = {success: true, action: 'deleted'};
}

module.exports = {
  listenCreateProduct,
  listenUpdateProduct,
  listenDeleteProduct
};
