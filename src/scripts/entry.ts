import '../css/base.scss';
import './polyfills/toBlob';

import Vue from 'vue';
import router from './router/';

import App from './App.vue';

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />',
});
