async function listenCreateProduct(ctx) {
  console.log('🆕 Product Created from Shopify');

  let productData;

  if (ctx.req.body) {
    console.log('Enter FB funcs');
    productData = ctx.req.body;
  } else if (ctx.request.body) {
    productData = ctx.request.body;
  } else {
    console.log('❌ No body found');
    ctx.status = 400;
    ctx.body = {error: 'No body data'};
    return;
  }

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
  const productData = ctx.req.body || ctx.request.body;

  console.log('Product:', productData?.title);

  ctx.status = 200;
  ctx.body = {success: true, action: 'updated'};
}

async function listenDeleteProduct(ctx) {
  console.log('🗑️ Product Deleted from Shopify');
  const productData = ctx.req.body || ctx.request.body;

  console.log('Product ID:', productData?.id);

  ctx.status = 200;
  ctx.body = {success: true, action: 'deleted'};
}

export default {
  listenCreateProduct,
  listenUpdateProduct,
  listenDeleteProduct
};
