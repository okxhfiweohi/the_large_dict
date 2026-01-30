import { Snackbar } from "sober";

export function show_msg(opts: Parameters<(typeof Snackbar)["builder"]>[0]) {
  return Snackbar.builder(opts);
}
