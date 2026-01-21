import { qq, root_el } from "../utils/mini_query";
import { Sweeper } from "../component/Sweeper";

export function prepare_structure() {
  let header = qq("header");
  if (!header) {
    header = document.createElement("header");
    root_el.prepend(header);
  }
  if (!qq("header>b")) {
    const w = document.createElement("b");
    w.innerText = "[unknown entry]";
    header.prepend(w);
  }
  let content = qq(".content");
  if (!content) {
    const main = document.createElement("div");
    main.classList.add("main");
    content = document.createElement("div");
    content.classList.add("conntent");
    content.append(main);
    root_el.append(content);
  }
  let side = qq(".content>.side");
  if (!side) {
    side = document.createElement("div");
    side.classList.add("side");
    content.append(side);
  }
  if (!qq(".content>.side tlgd-sweeper")) {
    const sweeper = new Sweeper();
    side.append(sweeper);
  }
  if (!qq("footer")) {
    const footer = document.createElement("footer");
    root_el.append(footer);
  }
  if (!qq(".float-footer")) {
    const float_footer = document.createElement("div");
    float_footer.classList.add("float-footer");
    root_el.append(float_footer);
  }
}
