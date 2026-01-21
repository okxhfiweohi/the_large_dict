import { plugin_list } from "../plugins";
import { show_error } from "../utils/show_error";

export function apply_plugins(){
  for(const plugin of plugin_list){
    try{
      plugin.handle_apply?.()
    } catch(e){
      show_error(`插件(${plugin.title}): \n${e}`)
    }
  }
}
