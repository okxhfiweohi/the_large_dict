const LS_KEY = "the_large_dict_config" as const;
function load_config() {
  try {
    const s = localStorage.getItem(LS_KEY)!;
    const res = JSON.parse(s);
    if (typeof res === "object" && !Array.isArray(res)) {
      return res || {};
    }
    return {};
  } catch {
    return {};
  }
}

let config: Record<string, any> = load_config();

function save_config() {
  localStorage.setItem(LS_KEY, JSON.stringify(config));
}

export function get_config(key: string) {
  return config[key];
}

export function set_config(key: string, v: any) {
  config[key] = v;
  save_config();
}
