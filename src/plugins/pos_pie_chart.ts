/**
 * @author unknown
 */

import { get_config } from "../config";
import { load_script } from "../utils/load_script";
import { get_data, qq } from "../utils/mini_query";
import { show_modal_box } from "../utils/show_modal_box";

const pos_name: Record<string, string> = {
  A: "冠词",
  C: "连词",
  D: "限定词",
  E: "存在句型",
  I: "介词",
  J: "形容词",
  M: "数词",
  N: "名词",
  P: "代词",
  R: "副词",
  T: "不定式",
  U: "感叹词",
  V: "动词",
  X: "否定词",
} as const;
const pos_color: Record<string, string> = {
  N: "#0EB83B",
  J: "#30DFF4",
  V: "#FF4C02",
  R: "#FE0097",
  P: "#9C5235",
  A: "#FFF244",
  C: "#4B5CC4",
  D: "#01E2A0",
  E: "#9FDB01",
  I: "#811EAF",
  M: "#187DB1",
  T: "#FFA401",
  U: "#4B5CC4",
  X: "#CA6924",
};

const plugin: PluginType = {
  title: "词性占比",
  key: "pos_pie_chart",
  config_type: "switch",
  handle_apply() {
    const config = get_config("pos_pie_chart");
    if (!config) {
      return;
    }
    const el = qq(".content .main .percent .pos") as HTMLElement;
    if (el) {
      const { word, data } = get_data();
      const { pos } = data;
      const div = document.createElement("div");
      if (pos) {
        el.onclick = handle_first_click;
      }
      function handle_first_click() {
        load_script([
          "https://cdn.jsdelivr.net/npm/chart.js",
          {
            url: "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2",
            on_load() {
              (window as any).Chart.register((window as any).ChartDataLabels);
            },
          },
        ]).then(() => {
          gen_chart();
          el.onclick = show;
          show();
        });
      }
      function gen_chart() {
        const pos_l = Object.entries(pos as Record<string, any>).sort((
          a,
          b,
        ) => (b[1]?.["frq"] ?? 0) - (a[1]?.["frq"] ?? 0));
        let total = pos_l.reduce((p, c) => p + (c[1]?.["frq"] ?? 0), 0);
        if (total === 0) {
          total = 0.0001;
        }
        const backgroundColor = pos_l.map((v) =>
          pos_color?.[v[0]] ?? pos_color["X"]
        );
        const data = pos_l.map((v) => v[1]["frq"] ?? 0);
        const s_unknown = "未知";
        const short_labels = pos_l.map((v) => pos_name[v[0]] ?? s_unknown);
        const labels = pos_l.map((v) =>
          `${pos_name[v[0]] ?? s_unknown} ${v[1]["frq"] ?? ""} (${
            ((v[1]["frq"] ?? 0) / total * 100).toFixed(2)
          }%) 排名:${v[1]["rk"]}`
        );
        const ctx = document.createElement("canvas");
        new (window as any).Chart(ctx, {
          type: "doughnut",
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor,
              borderColor: backgroundColor,
              borderAlign: "inner",
              hoverOffset: 4,
            }],
          },
          options: {
            cutout: "60%",
            plugins: {
              title: {
                display: Boolean(word),
                text: word,
              },
              legend: {
                align: "start",
                position: "bottom",
              },
              datalabels: {
                formatter(_: any, ctx: any) {
                  return short_labels[ctx.dataIndex] ?? s_unknown;
                },
                color: function (ctx: any) {
                  return ctx.dataset.backgroundColor;
                },
                borderRadius: 4,
                padding: 4,
                backgroundColor: "white",
              },
            },
          },
        });
        div.append(ctx);
      }

      function show() {
        show_modal_box({
          title: "词性占比",
          content: div,
        });
      }
    }
  },
};
export default plugin;
