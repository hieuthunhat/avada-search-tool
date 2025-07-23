import Router from 'koa-router';
import webhookController from '../controllers/webhookController';

const router = new Router({
  prefix: ''
});

// Debug route
// router.all('*', async (ctx, next) => {
//   console.log('Webhook request:', {
//     method: ctx.method,
//     path: ctx.path,
//     url: ctx.url,
//     headers: ctx.headers
//   });
//   await next();
// });

router.post('/products/create', webhookController.listenCreateProduct);
router.post('/products/update', webhookController.listenUpdateProduct);
router.post('/products/delete', webhookController.listenDeleteProduct);

export default router;
