import Vue from 'vue';
import VueRouter from 'vue-router';

// routes
import { ROUTES } from '~/router/Routes';

// pages
import Index from '~/pages/Index.vue';
import ImageUpload from '~/pages/ImageUpload.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: ROUTES.INDEX.path,
      component: Index,
    },
    {
      path: ROUTES.IMAGE_UPLOAD.path,
      component: ImageUpload,
    },
  ],
});

export default router;
