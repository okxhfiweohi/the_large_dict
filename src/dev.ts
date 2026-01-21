import { html, render } from "lit";
import { ConfigPanel } from "./component/ConfigPanel";
import "sober/button";
const dev_root = document.getElementById("the_large_dict_test_preview_root_");

function toggle_all_tags() {
  document.querySelectorAll(".t_lg_d .info .tags").forEach((el) => {
    el.classList.toggle("less-children");
  });
}

if (dev_root) {
  toggle_all_tags();
  const conf_p = new ConfigPanel();
  render(
    html`
      <div style="display:flex;justify-content: flex-end;">
        <s-button @click="${() => toggle_all_tags()}"> 标签 </s-button>
        <s-button @click="${() => location.reload()}"> 刷新 </s-button>
      </div>
      ${conf_p}
    `,
    dev_root,
  );
}
