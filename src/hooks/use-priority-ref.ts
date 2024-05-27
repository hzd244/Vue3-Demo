import { nextTick, ref, watch, computed } from 'vue';
import { taskVO, taskNodeVO, statusVO } from '@/types/model';

/**
 * watchRef: 任务监听的ref值
 * nextRef: 任务返回的ref值
 * no: 任务优先级
 * status: 该任务的状态 before start end
 * nextTask: 下一个任务
 * timeout: 超时时间
 */

export function useTaskRef() {
  // 当前的任务
  let curTask: taskNodeVO | null | undefined = null;
  // 是否正在开始一个任务
  let isStarting: boolean = false;

  // 执行任务
  function executeTask() {
    isStarting = true;
    // 如果当前任务已结束，执行下一个任务
    if (curTask?.status.value === 'end') {
      curTask = curTask.nextTask;
      executeTask();
    } else if (curTask?.status.value === 'start') {
      curTask.nextRef.value = curTask.watchRef.value;
      const stop = watch(curTask.watchRef, newVal => {
        if (curTask) {
          curTask.nextRef.value = curTask.watchRef.value;
          if (!newVal) {
            // 当前任务结束
            curTask.status.value = 'end';
            curTask = curTask.nextTask;
            stop(); // 取消监听
            executeTask(); // 继续执行下一个任务
          }
        }
      });
    } else if (curTask) {
      // 如果是第三种状态 before：任务未开始W
      let timeout = 0;
      const tempTask = curTask;
      const stopWatchEvent = watch(tempTask.status, newVal => {
        if (newVal !== 'before') {
          if (timeout) {
            clearTimeout(timeout);
          }
          stopWatchEvent();
          executeTask(); // 开始执行任务
        }
      });
      // 如果当前任务状态为未开始，则等待预定的超时时间，如果还没有开始，则跳过当前任务。
      timeout = setTimeout(() => {
        if (tempTask?.status.value === 'before') {
          stopWatchEvent();
          curTask = tempTask.nextTask; // 指向下一个任务
          executeTask();
        }
        timeout = 0;
      }, curTask.timeout || 100);
    } else {
      isStarting = false;
    }
  }

  function taskRef(task: taskVO) {
    const watchRef = ref<boolean>(task.val);
    const nextRef = ref<boolean>(task.val);
    // 声明一个任务结点
    const realTask: taskNodeVO = {
      watchRef, // 任务监听的ref值
      nextRef, // 任务返回的ref值
      no: task.no, // 任务优先级
      status: ref<statusVO>('before'), // 该任务的状态 before start end
      timeout: task?.timeout, // 超时时间
    };
    watch(realTask.watchRef, () => {
      // 开始任务
      if (realTask.watchRef.value) {
        realTask.status.value = 'start';
        if (!isStarting) {
          curTask = realTask;
          executeTask();
        }
      } else {
        // 结束任务
        realTask.status.value = 'end';
      }
    });

    // 根据任务结点的优先级属性，插入到指定位置
    if (!curTask) {
      curTask = realTask;
    } else {
      let tempTask = curTask.nextTask; // 指向当前任务结点的下一个结点
      let prev = curTask; // 指向当前任务结点

      // 如果当前链表中只有一个任务结点
      if (!tempTask) {
        // 要插入的节点的优先级小于当前任务节点，在前面插入
        if (realTask.no < prev.no) {
          realTask.nextTask = prev;
          curTask = realTask;
        } else {
          // 在后面插入
          prev.nextTask = realTask;
        }
      }

      while (tempTask) {
        // 找到要插入的位置
        if (prev.no < realTask.no && tempTask.no > realTask.no) {
          prev.nextTask = realTask;
          realTask.nextTask = tempTask;
          break;
        } else if (!tempTask.nextTask) {
          // 如果最后一个节点也没有满足条件，则新增的任务放到末尾
          tempTask.nextTask = realTask;
          break;
        }
        // 结点指针同步移动
        prev = tempTask;
        tempTask = tempTask.nextTask;
      }
    }

    // 定义一个自定义的响应式变量，实现：赋值为x后，其值可以不等于x
    const taskVal = computed({
      get: () => nextRef.value,
      set: value => {
        watchRef.value = value;
      },
    });

    return taskVal;
  }

  nextTick(() => {
    executeTask();
  });

  const container = {
    taskRef,
  };

  return container;
}

// 生成一个任务容器
const taskContainer = useTaskRef();

export default taskContainer;
