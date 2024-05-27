import type { AnchorList, HrefShow, HrefMap } from './constants';

export const generateHrefMap = (anchorList: AnchorList[]) => {
  const result: { [key: string]: string[] } = anchorList.reduce((acc, curr) => {
    acc[curr.href] = [curr.href];
    if (curr.children && curr.children.length > 0) {
      const childTitles = curr.children.map(child => child.href);
      acc[curr.href].push(...childTitles);
    }
    return acc;
  }, {} as { [key: string]: string[] });
  return result;
};

export const generateHrefShow = (anchorList: AnchorList[]) => {
  const result: HrefShow = {};
  anchorList.forEach(v => {
    result[v.href] = false;
  });
  return result;
};

export const findParentHref = (href: string, hrefMap: HrefMap) => {
  const arr = Object.keys(hrefMap);
  let parent = '';
  if (arr.includes(href)) {
    return href;
  }
  for (let i = 0; i < arr.length; i++) {
    if (hrefMap[arr[i]]?.includes(href)) {
      parent = arr[i];
      break;
    }
  }
  return parent;
};

// 获取元素
export const getElement = (
  target: string | HTMLElement | Window | null | undefined,
) => {
  if (target === '') return null;
  if (typeof target === 'string') {
    try {
      return document.querySelector<HTMLElement>(target);
    } catch {
      return null;
    }
  }
  return target;
};

// 获取滚动的区域元素
export const getScrollElement = (
  target: HTMLElement,
  container: HTMLElement | Window,
) => {
  if (isWindow(container)) {
    return target.ownerDocument.documentElement;
  }
  return container;
};

export function animateScrollTo(
  container: HTMLElement | Window,
  from: number,
  to: number,
  duration: number,
  callback?: unknown,
) {
  const startTime = Date.now();

  let handle: number | undefined;
  const scroll = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(
      time > duration ? duration : time,
      from,
      to,
      duration,
    );

    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nextScrollTop);
    } else {
      container.scrollTop = nextScrollTop;
    }
    if (time < duration) {
      handle = window.requestAnimationFrame(scroll);
    } else if (typeof callback === 'function') {
      callback();
    }
  };

  scroll();

  return () => {
    handle && window.cancelAnimationFrame(handle);
  };
}

export const getOffsetTop = (el: HTMLElement) => {
  let offset = 0;
  let parent = el;

  while (parent) {
    offset += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement;
  }

  return offset;
};

export const getOffsetTopDistance = (
  el: HTMLElement,
  containerEl: HTMLElement,
) => {
  return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl));
};

export const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
};

export function throttleByRaf(cb: (...args: any[]) => void) {
  let timer = 0;

  const throttle = (...args: any[]): void => {
    if (timer) {
      window.cancelAnimationFrame(timer);
    }
    timer = window.requestAnimationFrame(() => {
      cb(...args);
      timer = 0;
    });
  };

  throttle.cancel = () => {
    window.cancelAnimationFrame(timer);
    timer = 0;
  };

  return throttle;
}

export const isWindow = (val: unknown): val is Window => {
  return val === window;
};
