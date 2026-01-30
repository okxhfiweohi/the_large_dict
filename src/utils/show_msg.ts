import { Snackbar } from "../component/sober.js";

export function show_msg(opts: Parameters<(typeof Snackbar)["builder"]>[0]) {
  return Snackbar.builder(opts);
}
