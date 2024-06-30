import fspPerform from "./core";
import { isSupport } from "./util";
(function () {
  if (!isSupport()) return;
  const $fsp = {
    getFirstScreenTime: fspPerform.getFirstScreenTime.bind(fspPerform),
  };
  window.$fsp = $fsp;
})();
