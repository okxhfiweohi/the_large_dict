/**
 * @author unknown
 */
import type { Sweeper } from "../component/Sweeper.ts";
import { get_config } from "../config";
import { get_data } from "../data.ts";
import { qq } from "../utils/mini_query.ts";
import { show_imgs } from "../utils/show_imgs.ts";

const plugin: PluginType = {
  title: "插入网络图片",
  key: "image",
  config_type: "switch",
  handle_apply() {
    if (!get_config("image")) {
      return;
    }
    const { data, word } = get_data();

    const word_uri = encodeURI(word);

    const wid = data?.lgk_id?.w ?? "";
    const wlink =
      `https://dictionary.langeek.co/en/word/${wid}?entry=${word_uri}`;
    const pids: any[] = data?.lgk_id?.p ?? [];
    const lgk_desc = document.createElement("span");
    lgk_desc.innerHTML =
      `From Langeek Dictionary: <a style="color: white; font-weight: bold;" href="${wlink}" referrerpolicy="no-referrer">${word}</a>`;
    const thumbs = pids.map((pid) => ({
      value: pid,
      url: `https://cdn.langeek.co/photo/${pid}/thumb/${word_uri}?type=jpeg`,
    }));
    const originals = pids.map((pid) => ({
      url: `https://cdn.langeek.co/photo/${pid}/original/${word_uri}?type=jpeg`,
      alt: word,
      description: lgk_desc,
      k: pid,
    }));

    const img_indexes = Object.fromEntries(
      originals.map((v, idx) => [String(v.k), idx]),
    );

    const onclick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      show_imgs(originals, img_indexes[el.getAttribute("value") || ""] ?? 0);
    };
    const sweeper = qq(".content>.side tlgd-sweeper") as Sweeper;
    thumbs.forEach((item) => {
      sweeper.add_img_item(item.url, item.value, onclick);
    });
  },
};
export default plugin;
