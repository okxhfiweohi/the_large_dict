import "../component/sober.js";
import { root_el } from "./mini_query";
import "../component/sober.js";
export function show_error(
  s: string,
  type: "info" | "success" | "warning" | "error" = "error",
) {
  const el = document.createElement("s-alert");
  el.style.margin = "0.5em";
  el.setAttribute("type", type);
  el.innerText = s;
  root_el.append(el);
  switch (type) {
    case "info":
      console.info(s);
      break;
    case "warning":
      console.warn(s);
      break;
    case "error":
      console.error(s);
      break;
    default:
      console.log(s);
      break;
  }
}
