export let root_el: HTMLElement = document.querySelector(".t_lg_d")!;
type Param = Parameters<Document["querySelector"]>[0];
export const qq = (s: Param) => root_el.querySelector(s);
export const qa = (s: Param) => root_el.querySelectorAll(s);
export function set_root(el: HTMLElement){
  root_el = el;
}
