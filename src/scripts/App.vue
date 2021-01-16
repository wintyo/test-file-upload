<template lang="pug">
div
  .block
    p 通常のPOST遷移
    form(
      :action="`${$data.API_ROOT}/api/upload`"
      method="POST"
      enctype="multipart/form-data"
    )
      input(type="file", name="file")
      button(type="submit") 送信
  .block
    p ajaxでPOST送信(input版)
    form(@submit="onInputAjaxSubmit")
      InputFile(
        :file="$data.inputAjaxFile"
        @change="$data.inputAjaxFile = $event"
      )
      button(type="submit", :disabled="$data.inputAjaxFile == null") 送信
</template>

<script lang="ts">
import Vue from 'vue';
import axiosBase from 'axios';

import { API_ROOT } from '~/constants/Api.ts';

// components
import InputFile from '~/components/InputFile.vue';

const axios = axiosBase.create({
  baseURL: API_ROOT,
});

interface IData {
  API_ROOT: string;
  inputAjaxFile: File | null;
}

export default Vue.extend({
  components: {
    InputFile,
  },
  data(): IData {
    return {
      API_ROOT,
      inputAjaxFile: null,
    };
  },
  methods: {
    async onInputAjaxSubmit(event: Event) {
      event.preventDefault();
      if (this.inputAjaxFile == null) {
        return;
      }
      const formData = new FormData();
      formData.append('file', this.inputAjaxFile);
      await axios.request({
        method: 'post',
        url: '/api/upload',
        data: formData,
      });
      console.log('upload succeeded!');
    }
  }
});
</script>

<style lang="scss" scoped>
.block {
  padding: 20px;
  border: solid 1px #000;
}
</style>
