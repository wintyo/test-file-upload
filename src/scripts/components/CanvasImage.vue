<template lang="pug">
div
  canvas.canvas(
    ref="elCanvas"
    width="400"
    height="400"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
  )
  br
  button(@click="onClearButtonClick") クリア
</template>

<script lang="ts">
import Vue from 'vue';

interface IPos {
  x: number;
  y: number;
}

function drawLine(elCanvas: HTMLCanvasElement, pos1: IPos, pos2: IPos) {
  const context = elCanvas.getContext('2d');

  if (context == null) {
    return;
  }

  context.beginPath();
  context.moveTo(pos1.x, pos1.y);
  context.lineTo(pos2.x, pos2.y);
  context.stroke();
}

interface IData {
  isDragging: boolean;
  prevPos: IPos | null;
}

export default Vue.extend({
  data(): IData {
    return {
      isDragging: false,
      prevPos: null,
    };
  },
  mounted() {
    document.addEventListener('mouseup', this.onMouseUp);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onMouseUp);
  },
  methods: {
    getBase64() {
      const elCanvas = this.$refs.elCanvas as HTMLCanvasElement;
      return elCanvas.toDataURL('image/png');
    },
    getBlob() {
      return new Promise<Blob>((resolve, reject) => {
        const elCanvas = this.$refs.elCanvas as HTMLCanvasElement;
        elCanvas.toBlob((blob) => {
          if (blob == null) {
            reject();
            return;
          }
          resolve(blob);
        });
      });
    },
    onMouseDown(event: MouseEvent) {
      this.isDragging = true;
      this.prevPos = {
        x: event.offsetX,
        y: event.offsetY,
      };
    },
    onMouseMove(event: MouseEvent) {
      if (!this.isDragging || this.prevPos == null) {
        return;
      }
      const pos: IPos = {
        x: event.offsetX,
        y: event.offsetY,
      };

      const elCanvas = this.$refs.elCanvas as HTMLCanvasElement;
      drawLine(elCanvas, this.prevPos, pos);

      this.prevPos = pos;
    },
    onMouseUp() {
      this.isDragging = false;
      this.prevPos = null;
    },
    onClearButtonClick(event: Event) {
      event.preventDefault();
      event.stopPropagation();
      const elCanvas = this.$refs.elCanvas as HTMLCanvasElement;
      const context = elCanvas.getContext('2d');
      if (context == null) {
        return;
      }

      context.clearRect(0, 0, elCanvas.width, elCanvas.height);
    }
  }
});
</script>

<style lang="scss" scoped>
.canvas {
  border: solid 1px #000;
}
</style>
