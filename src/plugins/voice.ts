/**
 * @author unknown
 */

import { get_config } from "../config";
import { get_data } from "../data";
import { qq } from "../utils/mini_query";

const plugin: PluginType = {
  title: "音标语音",
  key: "voice",
  config_type: "switch",
  handle_apply() {
    const config = get_config("voice");
    if (!config) {
      return;
    }
    const el = qq("header i") as HTMLElement;
    if (el) {
      const { word } = get_data();
      const voice = new Audio(
        `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${word}--_gb_1.mp3`,
      );
      el.onclick = () => {
        voice.play();
      };
    }
  },
};
export default plugin;
