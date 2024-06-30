import { isSupport, warn, getImgSrc, ignoreTagReg } from './util';

class FspPerform {
  constructor() {
    this.$data = {}; // 存放数据fsp time
    this.$iso = null; // IntersectionObserver实例
    this.$muo = null; // MutationObserver实例
    this.$perf = null; // PerformanceObserver实例
    this._stopFlag = false; // 停止监测的标志
    this._stopTime = 0; // 停止监测时的时间戳
    this._stepTime = 0; // record step time from timeorigin
    this._timeOrigin = null; // 记录性能测量开始时的时间的时间戳
    this._imgUrlList = new Set(); // 存储图片资源的列表
    this.init();
  }
  init() {
    if (!isSupport()) {
      warn("current browser doesn't support performance.");
      return;
    }
    this.initConfig();
    this.initIsObserver();
    this.initMuObserver();
    this.initPerfObserver();

    window.addEventListener(
      'scroll',
      () => {
        this.stopObserver();
      },
      { capture: true, once: true },
    );
  }
  initConfig() {
    this._stopFlag = false;
    this._timeOrigin = performance.timeOrigin; // performance.timeorigin: 性能测量开始时的时间的时间戳
    // this._stepTime = this._timeOrigin;
    let fspTime = { start: this._timeOrigin, end: null, duration: 0 };
    this.$data = { fspt: fspTime };
  }
  initIsObserver() {
    let iso = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          // entry.time：当前时间戳
          this.updateFspTime({ duration: entry.time });
          const src = getImgSrc(entry.target);
          src && this._imgUrlList.add(src);
        }
      });
    });
    this.$iso = iso;
  }
  initMuObserver() {
    const muo = new MutationObserver(mutations => {
      if (!mutations) return;
      mutations.forEach(mu => {
        if (!mu.addedNodes || !mu.addedNodes.length) return;
        mu.addedNodes.forEach(ele => {
          if (ele.nodeType === 1 && !ignoreTagReg.test(ele.nodeName)) {
            this.$iso.observe(ele);
          }
        });
      });
    });
    muo.observe(document, {
      childList: true,
      subtree: true,
    });
    this.$muo = muo;
  }
  initPerfObserver() {
    const perf = new PerformanceObserver(list => {
      const entries = list.getEntriesByType('resource');
      entries.forEach(item => {
        if (this._stopFlag && item.fetchStart > this._stopTime) return;
        if (this._imgUrlList.has(item.name)) {
          this.updateFspTime({ duration: item.responseEnd });
          this._imgUrlList.delete(item.name);
        }
      });
    });
    perf.observe({ entryTypes: ['resource'] });
    this.$perf = perf;
  }
  // 停止监测
  stopObserver() {
    if (this._stopFlag) return;
    this._stopTime = performance.now();
    this._stopFlag = true;
    this.$muo.disconnect();
    this.$iso.disconnect();
    this.$perf.disconnect();
  }
  // 更新FSP
  updateFspTime(data = {}) {
    if (data.duration) {
      data.duration -= this._stepTime;
      data.duration = Math.max(data.duration, this.$data.fspt.duration);
    }
    Object.assign(this.$data.fspt, data);
  }
  // 获取FSP
  getFirstScreenTime(delay = 5000, stop = true) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (stop) {
          this.stopObserver();
        }
        this.updateFspTime({
          end: this.$data.fspt.start + this.$data.fspt.duration,
        });
        resolve(this.$data.fspt);
      }, delay);
    });
  }
}

export default new FspPerform();
