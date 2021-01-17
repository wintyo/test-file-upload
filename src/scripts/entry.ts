import '../css/base.scss';
import './polyfills/toBlob';

import Vue from 'vue';

import App from './App.vue';

new Vue({
  el: '#app',
  components: { App },
  template: '<App />',
});
