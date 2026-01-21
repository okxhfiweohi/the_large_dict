interface PluginType {
  title: string;
  description?: string;
  key: string;
  config_type:
    | "switch" // boolean
    | string[] // choice buttons
    | "input-text" // <input type="text">
    | "input-number"
    | (() => DocumentFragment);
  handle_apply?();
}
