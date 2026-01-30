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
  ((console as any)[type === "warning" ? "warn" : type] ?? console.log)(s);
}
