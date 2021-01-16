<template lang="pug">
div
  p.test test--!
  .block
    p 通常のPOST遷移
    form(
      :action="`${$data.API_ROOT}/api/upload`"
      method="POST"
      enctype="multipart/form-data"
    )
      input(type="file", name="file")
      button(type="submit") 送信
</template>

<script lang="ts">
import Vue from 'vue';

import { API_ROOT } from '~/constants/Api.ts';

export default Vue.extend({
  data() {
    return {
      API_ROOT,
    };
  },
});
</script>

<style lang="scss" scoped>
.test {
  color: red;
}

.block {
  padding: 20px;
  border: solid 1px #000;
}
</style>
