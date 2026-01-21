import "./style.css";
import "./dark.css";
import "./result_v1.521.css";
import { make_tooltips } from "./feature/tooltips";
import { hide_element } from "./feature/hide";
import { apply_theme } from "./feature/theme";
import { prepare_structure } from "./feature/structure";
import { show_error } from "./utils/show_error";
import { apply_plugins } from "./feature/plugins";
import { set_root } from "./utils/mini_query";
import { add_config_btn } from "./feature/config_btn";

function run() {
  prepare_structure();
  hide_element();
  apply_theme();
  apply_plugins();
  make_tooltips();
}

try {
  const entries = document.querySelectorAll(".t_lg_d");
  if (entries.length) {
    entries.forEach((el) => {
      set_root(el as HTMLElement);
      run();
    });
  } else {
    run();
  }

  add_config_btn();
} catch (e) {
  show_error(String(e));
}
