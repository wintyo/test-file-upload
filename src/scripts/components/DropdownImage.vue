<template lang="pug">
div
  .dropdown(
    :class="{ '-dropping': $data.isDropping }"
    @dragover.prevent="$data.isDropping = true"
    @dragleave="$data.isDropping = false"
    @drop="onDrop"
  )
    template(v-if="$data.previewPath === ''")
      p この領域に画像ファイルをドロップしてください
    template(v-else)
      .close(@click="onDelete")
      img(:src="$data.previewPath")
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';

interface IProps {
  file: File | null;
}

interface IData {
  isDropping: boolean;
  previewPath: string;
}

export default Vue.extend({
  props: {
    file: { type: File },
  } as RecordPropsDefinition<IProps>,
  data(): IData {
    return {
      isDropping: false,
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
    onDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
      this.isDropping = false;
      if (event.dataTransfer == null) {
        return;
      }
      console.log(event.dataTransfer.files);
      this.$emit('change', event.dataTransfer.files[0]);
    },
    onDelete() {
      this.$emit('change', null);
    },
  }
});
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: solid 1px #ccc;

  &.-dropping {
    background-color: #ffcccc;
  }
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  width: 20px;
  background-color: #fff;
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
