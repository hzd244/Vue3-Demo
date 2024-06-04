self.addEventListener('message', e => { 
  executeLongTask()
});

const taskList = new Array(20000).fill(0);
const onTask = () => {
  const now = performance.now();
  while (performance.now() - now < 0.1) {} // 模拟耗时操作
};

const executeLongTask = () => {
  for (let i = 0; i < taskList.length; i++) {
    onTask();
  }
  self.postMessage('Greeting from Worker.js'); // 向主线程发送消息
};