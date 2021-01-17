// canvasにtoBlobがない時のpolyfill
if (!HTMLCanvasElement.prototype.toBlob) {
  console.log('use toBlob polyfill');
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value(this: HTMLCanvasElement, callback: BlobCallback, type?: string, quality?: any) {
      const binStr = atob(this.toDataURL(type, quality).split(',')[1]);
      const arr = new Uint8Array(binStr.length);

      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i);
      }

      callback(new Blob([arr], { type: type || 'image/png' }));
    },
  });
}
