// 添加事件监听器以接收主线程传递的消息
self.addEventListener('message', function (e) {
  const imageBitmap = e.data.imageBitmap;  // 获取到主线程中的图片资源

  // 将图像数据转换为灰度图像
  createImageBitmap(processImage(imageBitmap)).then(processedImageBitmap => {
      // 发送处理后的图像数据给主线程
      self.postMessage({ processedImageBitmap }, [processedImageBitmap]);
  });
});

// 在Web Worker中处理图像数据
function processImage(inputImageBitmap) {
  const canvas = new OffscreenCanvas(inputImageBitmap.width,    inputImageBitmap.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(inputImageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const inputData = new Uint8Array(imageData.data.buffer);
  const outputData = new Uint8Array(inputData.length); // 创建长度一行的empty数组

  // 将图像数据转换为灰度
  for (let i = 0; i < inputData.length; i += 4) {
      const avg = (inputData[i] + inputData[i + 1] + inputData[i + 2]) / 3;
      outputData[i] = avg;
      outputData[i + 1] = avg;
      outputData[i + 2] = avg;
      outputData[i + 3] = inputData[i + 3]; // 保留 alpha 值
  }

  // 创建并返回处理后的 ImageData 对象
  return new ImageData(new Uint8ClampedArray(outputData.buffer), canvas.width, canvas.height);
}
