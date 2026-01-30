/**
 * @author unknown
 */

import { get_config } from "../config";
import { get_data, qq } from "../utils/mini_query";
import "../component/sober.js";

const plugin: PluginType = {
  title: "打字记忆",
  key: "check_input_word",
  config_type: "switch",
  handle_apply() {
    const config = get_config(this.key);
    if (!config) {
      return;
    }
    const footer = qq("footer") as HTMLElement;
    if (footer) {
      const { word } = get_data();
      const answer = normalize_space(pure_word(word));
      const std_word = get_std_word(answer);
      const el = document.createElement("s-text-field");
      el.style.display = "grid";
      el.style.width = "auto";
      el.style.margin = "0.5em";
      el.label = "请输入单词 (打字记忆)";
      const icon = document.createElement("s-icon");
      icon.slot = "start";
      icon.innerHTML =
        `<svg viewBox="0 -960 960 960"><path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"></path></svg>`;

      const clear_btn = document.createElement("s-icon-button");
      clear_btn.style.visibility = "hidden";
      clear_btn.slot = "end";
      const clear_icon = document.createElement("s-icon");
      clear_icon.name = "close";
      clear_btn.append(clear_icon);
      clear_btn.onclick = () => {
        el.value = "";
        el.error = false;
        render_clear_btn();
      };
      el.append(icon);
      el.append(clear_btn);

      function render_clear_btn() {
        clear_btn.style.visibility = el.value ? "visible" : "hidden";
      }

      el.onchange = (ev) => {
        const target = ev.target as HTMLInputElement;
        const value = target.value;
        const std_value = get_std_word(value);
        if (!std_value) {
          el.error = false;
        } else if (std_value !== std_word) {
          el.error = true;
          const normalized_space = normalize_space(value);
          if (normalized_space !== value) {
            el.value = normalized_space;
          }
        } else {
          el.error = false;
          el.value = answer;
        }
        render_clear_btn();
      };
      el.oninput = (ev) => {
        const target = ev.target as HTMLInputElement;
        const value = target.value;
        const std_value = get_std_word(value);
        if (!std_value || std_word === std_value) {
          el.error = false;
        } else {
          el.error = true;
        }
        render_clear_btn();
      };
      footer.append(el);
      render_clear_btn();
    }
  },
};
function normalize_space(s: string) {
  return s
    .replace(/[\s\u00A0\u3000\u200B]/g, " ").replace(/\s+/g, " ").trim() // 空白标准化
    .replace(/[\x00-\x1F\x7F]/g, ""); // 过滤控制符
}
function pure_word(w: string) {
  return w
    .replace(
      /[\uff01-\uff5e]/g,
      (c) => String.fromCharCode(c.charCodeAt(0) - 65248),
    ) // 全角转半角
    .replace(/[\u2013\u2014]/g, "-") // 横线统一
    .replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, "'") // 引号统一
    .normalize("NFKD").replace(/[^\x00-\x7F]/g, ""); // 转ASCII
}
function remove_punct(s: string) {
  return s.replace(/[\u3000-\u303F\uFF00-\uFFEF\p{P}\p{S}]/gu, "");
}

function get_std_word(s: string) {
  return normalize_space(remove_punct(pure_word(s).toLowerCase()));
}

export default plugin;
