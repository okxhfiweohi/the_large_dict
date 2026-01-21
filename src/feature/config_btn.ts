import { ConfigPanel } from "../component/ConfigPanel";
import { qq } from "../utils/mini_query";
import { show_modal_box } from "../utils/show_modal_box";

export function add_config_btn() {
  const el = document.createElement("span");
  el.classList.add("config-btn");
  const config = new ConfigPanel();
  el.onclick = () => {
    show_modal_box({
      title: "配置",
      content: config,
    })
  };
  qq(".float-footer")?.append(el);
}
