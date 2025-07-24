import Router from 'koa-router';
import webhookController from '../controllers/webhookController';

const router = new Router({
  prefix: ''
});

router.post('/products/create', webhookController.listenCreateProduct);
router.post('/products/update', webhookController.listenUpdateProduct);
router.post('/products/delete', webhookController.listenDeleteProduct);

export default router;
