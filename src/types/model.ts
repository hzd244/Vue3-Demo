import { Ref } from 'vue';

export type taskVO = {
  /** 弹窗的显示与隐藏 */
  val: boolean;
  /** 优先级 */
  no: number;
  /** 超时时间 */
  timeout?: number;
};

export type statusVO = 'before' | 'start' | 'end';

export type taskNodeVO = {
  /** 任务监听的ref值 */
  watchRef: Ref<boolean>;
  /** 任务返回的ref值 */
  nextRef: Ref<boolean>;
  /** 超时时间 */
  timeout?: number;
  /** 该任务的状态 */
  status: Ref<statusVO>;
  /** 优先级 */
  no: number;
  /** 下一个任务 */
  nextTask?: taskNodeVO | null | undefined;
};
