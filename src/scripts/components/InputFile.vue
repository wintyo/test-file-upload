<template lang="pug">
div
  template(v-if="$data.previewPath")
    .image-area
      .close(@click="onDelete")
      img(:src="$data.previewPath")
    br
  input(
    ref="elInput"
    type="file"
    @change="onChange"
  )
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';

interface IProps {
  file: File | null;
}

interface IData {
  previewPath: string;
}

export default Vue.extend({
  props: {
    file: { type: File },
  } as RecordPropsDefinition<IProps>,
  data(): IData {
    return {
      previewPath: '',
    };
  },
  watch: {
    file() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewPath = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      } else {
        this.previewPath = '';
      }
    }
  },
  methods: {
    onChange(event: Event) {
      const elInput = event.currentTarget as HTMLInputElement;
      if (!elInput || !elInput.files) {
        return;
      }
      this.$emit('change', elInput.files[0]);
    },
    onDelete() {
      this.$emit('change', null);
      // @ts-ignore ファイル情報もリセット
      this.$refs.elInput.value = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.image-area {
  display: inline-block;
}

.close {
  position: relative;
  height: 20px;
  width: 20px;
  margin-left: auto;
  cursor: pointer;

  &::before, &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 2px;
    width: 80%;
    background-color: #999;
    content: '';
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(135deg);
  }
}
</style>
