/**
 * @author unknown
 */

import { get_config } from "../config";
import { load_script } from "../utils/load_script";
import { show_msg } from "../utils/show_msg";

const plugin: PluginType = {
  title: "调试控制台",
  key: "web_debug_console",
  config_type: "switch",
  handle_apply() {
    const config = get_config(this.key);
    if (!config) {
      return;
    }
    if (!((window as any).eruda)) {
      show_msg({
        type:"info",
        text: "控制台已加载！"
      })
      return;
    }
    load_script(
      "https://cdnjs.cloudflare.com/ajax/libs/eruda/3.4.3/eruda.min.js",
      { loading: null },
    ).then(() => {
      (window as any).eruda.init();
    });
  },
};
export default plugin;
