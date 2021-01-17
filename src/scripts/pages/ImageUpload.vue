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
      InputImage(
        :file="$data.inputAjaxFile"
        @change="$data.inputAjaxFile = $event"
      )
      button(type="submit", :disabled="$data.inputAjaxFile == null") 送信
  .block
    p ajaxでPOST送信(dropdown版)
    form(@submit="onDropAjaxSubmit")
      DropdownImage(
        :file="$data.dropAjaxFile"
        @change="$data.dropAjaxFile = $event"
      )
      button(type="submit", :disabled="$data.dropAjaxFile == null") 送信
  .block
    p canvas画像を送信(base64版)
    form(@submit="onBase64CanvasSubmit")
      CanvasImage(
        ref="base64CanvasImage"
      )
      div
        input(v-model="$data.base64FileName", type="text")
        button(type="submit", :disabled="$data.base64FileName === ''") 送信
  .block
    p canvas画像を送信(blob版)
    form(@submit="onBlobCanvasSubmit")
      CanvasImage(
        ref="blobCanvasImage"
      )
      div
        input(v-model="$data.blobFileName", type="text")
        button(type="submit", :disabled="$data.blobFileName === ''") 送信
  .block
    p アップロード済みファイルリスト
    ul
      template(v-for="filePath in $data.uploadedFilePaths")
        li
          img(:src="`${$data.API_ROOT}/tmp/${filePath}`")
          p {{ filePath }}
</template>

<script lang="ts">
import Vue from 'vue';
import axiosBase from 'axios';

import { API_ROOT } from '~/constants/Api.ts';

// components
import InputImage from '~/components/InputImage.vue';
import DropdownImage from '~/components/DropdownImage.vue';
import CanvasImage from '~/components/CanvasImage.vue';

const axios = axiosBase.create({
  baseURL: API_ROOT,
});

interface IData {
  API_ROOT: string;
  uploadedFilePaths: Array<string>;
  inputAjaxFile: File | null;
  dropAjaxFile: File | null;
  base64FileName: string;
  blobFileName: string;
}

export default Vue.extend({
  components: {
    InputImage,
    DropdownImage,
    CanvasImage,
  },
  data(): IData {
    return {
      API_ROOT,
      uploadedFilePaths: [],
      inputAjaxFile: null,
      dropAjaxFile: null,
      base64FileName: '',
      blobFileName: '',
    };
  },
  async created() {
    await this.fetchUploadedFiles();
  },
  methods: {
    async fetchUploadedFiles() {
      const res = await axios.request<Array<string>>({
        method: 'get',
        url: '/api/upload-files'
      });
      this.uploadedFilePaths = res.data;
    },
    async uploadImageFile(imageFile: File) {
      console.log(imageFile);
      const formData = new FormData();
      formData.append('file', imageFile);
      await axios.request({
        method: 'post',
        url: '/api/upload',
        data: formData,
      });
      console.log('upload succeeded!');
      await this.fetchUploadedFiles();
    },
    async onInputAjaxSubmit(event: Event) {
      event.preventDefault();
      if (this.inputAjaxFile == null) {
        return;
      }
      await this.uploadImageFile(this.inputAjaxFile);
    },
    async onDropAjaxSubmit(event: Event) {
      event.preventDefault();
      if (this.dropAjaxFile == null) {
        return;
      }
      await this.uploadImageFile(this.dropAjaxFile);
    },
    async onBase64CanvasSubmit(event: Event) {
      event.preventDefault();
      const base64CanvasImage = this.$refs.base64CanvasImage as InstanceType<typeof CanvasImage>;
      const base64 = base64CanvasImage.getBase64();

      await axios.request({
        method: 'post',
        url: '/api/upload-base64',
        data: {
          fileName: this.base64FileName,
          base64,
        },
      });
      console.log('upload succeeded!');
      await this.fetchUploadedFiles();
    },
    async onBlobCanvasSubmit(event: Event) {
      event.preventDefault();
      const blobCanvasImage = this.$refs.blobCanvasImage as InstanceType<typeof CanvasImage>;

      const blob = await blobCanvasImage.getBlob();
      // image/pngとかなので、後ろの方が拡張子
      const ext = blob.type.split('/')[1];
      console.log(blob);
      await this.uploadImageFile(new File([blob], `${this.blobFileName}.${ext}`, { type: blob.type }));
    },
  }
});
</script>

<style lang="scss" scoped>
.block {
  padding: 20px;
  border: solid 1px #000;
}
</style>
