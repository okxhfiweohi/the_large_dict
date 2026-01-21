import { get_config } from "../config";
import { get_data } from "../data";
import { qq } from "../utils/mini_query";

const key_selectors = {
  "hide_phonetic": ["header i"],
  "hide_stars": ["header [d-cls]"],
  "hide_freq": ["header .frq", "header .bnc"],
  "hide_exchange": [".info .exchange"],
  "hide_tags": [".info .tags"],
  "hide_pos_percent": [".content .main .percent ul.pos"],
  "hide_sense_percent": [".content .main .percent ul.sense"],
  "hide_explain": [".content .main .explain"],
};
export function hide_element() {
  for (let [k, s] of Object.entries(key_selectors)) {
    if (get_config(k)) {
      s.forEach((v) => {
        qq(v)?.classList.toggle("hidden");
      });
    }
  }

  // hide empty percent block
  const percent = qq(".content .main .percent");
  if (
    percent &&
    (percent.children.length == 0 ||
      (get_config("hide_pos_percent") && get_config("hide_sense_percent")))
  ) {
    percent.classList.toggle("hidden");
  }

  // hide normal exchanges
  const exchanges_el = qq(".info .exchange");
  if (exchanges_el && get_config("hide_normal_exchange")) {
    const { word, exchanges } = get_data();
    const hide = (f: string) =>
      exchanges_el.querySelector(`[d-e="${f}"]`)?.classList.toggle("hidden");
    if (exchanges["d"] || exchanges["p"]) {
      const with_ed = word[word.length - 1] == "e" ? word + "d" : word + "ed";
      if (exchanges["p"] === with_ed && exchanges["d"] === with_ed) {
        hide("p");
        hide("d");
      }
    }
    if (exchanges["i"]) {
      const with_ing =
        (word[word.length - 1] == "e" ? word.slice(0, word.length - 1) : word) +
        "ing";
      if (exchanges["i"] === with_ing) {
        hide("i");
      }
    }
    const with_s = word + "s";
    if (exchanges["s"] === with_s) {
      hide("s");
    }
    if (exchanges["3"] === with_s) {
      hide("3");
    }
    if (exchanges["r"] || exchanges["t"]) {
      const with_er = word[word.length - 1] == "e" ? word + "r" : word + "er";
      const with_est = word[word.length - 1] == "e"
        ? word + "st"
        : word + "est";
      if (exchanges["r"] === with_er) {
        hide("r");
      }
      if (exchanges["t"] === with_est) {
        hide("t");
      }
    }
  }
}
