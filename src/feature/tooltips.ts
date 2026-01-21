import { qa, qq } from "../utils/mini_query";
import { tooltip } from "../utils/tooltip";

function tip(s: string, content: string) {
  const el = qq(s) as HTMLElement;
  if (el) {
    tooltip(el, content);
  }
}
export function make_tooltips() {
  const cls = qq("header [d-cls]") as HTMLElement;
  if (cls) {
    tooltip(cls, `柯林斯星级 ${cls.getAttribute("d-cls") ?? "无"}`);
  }
  const phonetic = qq("header i") as HTMLElement;
  if (phonetic) {
    tooltip(phonetic, `/ ${phonetic.textContent.trim()} /`);
  }

  tip("header .frq", "COCA 语料库排名");
  tip("header .bnc", "BNC 语料库排名");

  tip(".exchange [d-e='d']", "过去式");
  tip(".exchange [d-e='p']", "过去分词");
  tip(".exchange [d-e='i']", "现在分词");
  tip(".exchange [d-e='3']", "第三人称单数");
  tip(".exchange [d-e='t']", "最高级");
  tip(".exchange [d-e='r']", "比较级");
  tip(".exchange [d-e='s']", "复数");

  qa(".info .tags u").forEach((elm) => {
    const tag = elm.innerHTML.trim();
    if (tag) {
      tooltip(elm as HTMLElement, tag);
    }
  });
}
