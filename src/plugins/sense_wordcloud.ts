/**
 * @author unknown
 */

import { get_config } from "../config";
import { load_script } from "../utils/load_script";
import { get_data, qq } from "../utils/mini_query";
import { show_modal_box } from "../utils/show_modal_box";
import { show_msg } from "../utils/show_msg";

const plugin: PluginType = {
  title: "释义词云",
  key: "sense_wordcloud",
  config_type: "switch",
  handle_apply() {
    const config = get_config(this.key);
    if (!config) {
      return;
    }
    const el = qq(".content .main .percent .sense") as HTMLElement;
    if (el) {
      const { sense_percent } = get_data();
      const div = document.createElement("div");
      if (sense_percent && Object.keys(sense_percent).length) {
        el.onclick = handle_first_click;
      }
      async function handle_first_click() {
        load_script(
          "https://cdn.jsdelivr.net/npm/wordcloud2@1.0.0/src/wordcloud2.min.js",
          { module: false },
        ).then(() => {
          el.onclick = show;
          show();
          setTimeout(gen_wordcloud);
        });
      }
      function gen_wordcloud() {
        div.style.minHeight = "max(30vh, 300px)";
        const data = Object.entries(sense_percent).map((v) => {
          v[1] = 1 + 3 * (v[1] > 0 ? v[1] : 0) / 100;
          return v;
        });
        (window as any).WordCloud(div, {
          list: data,
          fontFamily: '"LXGW WenKai GB", "Times New Roman", Times, serif',
          gridSize: 14,
          fontWeight: 500,
          weightFactor: 20,
          shrinkToFit: true,
          rotateRatio: 0,
          click: function (item: any) {
            const s = item[0];
            show_msg(`${s} : ${sense_percent[s] ?? 0}%`);
          },
        });
      }

      function show() {
        show_modal_box({
          title: "释义词云",
          content: div,
        });
      }
    }
  },
};
export default plugin;
