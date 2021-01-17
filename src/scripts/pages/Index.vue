<template lang="pug">
div
  h1 リンク一覧
  ul
    li: router-link(:to="ROUTES.IMAGE_UPLOAD.getUrl()") 画像アップロード
</template>

<script lang="ts">
import Vue from 'vue';

import { ROUTES } from '~/router/Routes';

export default Vue.extend({
  data() {
    return {
      ROUTES,
    };
  },
});
</script>

<style lang="scss" scoped>
//
</style>
