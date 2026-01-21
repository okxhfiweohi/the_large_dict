import { qq } from "./utils/mini_query";
let cache: null | {
  word: string;
  data: Record<string, any>;
  tags: Record<string, string>;
  exchanges: Record<string, string>;
  sense_percent: Record<string, number>;
} = null;
export function get_data() {
  if (cache) {
    return cache;
  }
  const word_el = qq("header b")! as HTMLElement;
  const word = word_el.textContent.trim();
  const data_str = qq(".json.data")?.textContent;
  let data: Record<string, any> = {};
  try {
    data = data_str ? JSON.parse(data_str) : {};
  } catch {}
  const tags: Record<string, string> = {};
  qq(".info .tags")?.querySelectorAll("u").forEach((el) => {
    const v = el.textContent.trim();
    const k = el.getAttribute("d-t") ?? v;
    tags[k] = v;
  });
  const exchanges: Record<string, string> = {};
  qq(".info .exchange")?.querySelectorAll("u").forEach((el) => {
    const v = el.textContent.trim();
    const k = el.getAttribute("d-e");
    if (k) {
      exchanges[k] = v;
    }
  });
  const sense_percent: Record<string, number> = {};
  qq(".content .main .percent .sense")?.querySelectorAll("li").forEach((el) => {
    const k = el.childNodes[0].textContent?.trim();
    const v = Number(el.querySelector("i")?.textContent);
    if (k) {
      sense_percent[k] = v >= 0 ? v : 0;
    }
  });
  cache = {
    word,
    data,
    tags,
    exchanges,
    sense_percent,
  };
  return cache;
}
