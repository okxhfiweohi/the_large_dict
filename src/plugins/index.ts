import voice from "./voice.ts";
import images from "./images.ts";
import pos_pie_chart from "./pos_pie_chart.ts";
import sense_wordcloud from "./sense_wordcloud.ts";
import check_input_word from "./check_input_word.ts";
import web_debug_console from "./web_debug_console.ts";
export const plugin_list: PluginType[] = [
  voice,
  images,
  pos_pie_chart,
  sense_wordcloud,
  check_input_word,
  web_debug_console,
];
