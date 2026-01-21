import { get_config } from "../config";
import { qq, root_el } from "../utils/mini_query";

export function apply_theme() {
  const theme_color = get_config("theme");
  if (theme_color && theme_color[0] == "#" && theme_color?.length == 7) {
    root_el.style.setProperty("--theme-color", theme_color);
  }

  const theme_tag = get_config("theme_tag");
  if (theme_tag == "theme") {
    qq(".info .tags")?.classList.add("theme");
  } else if (theme_tag == "plain") {
    qq(".info .tags")?.classList.add("plain");
  }
}
