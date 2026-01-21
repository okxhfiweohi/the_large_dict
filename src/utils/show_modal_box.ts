import { ModalBox } from "../component/ModalBox";
interface Opts {
  title?: string;
  content: string | HTMLElement | any;
}
export function show_modal_box(options: Opts) {
  const modal = new ModalBox();

  // 设置标题
  if (options.title) {
    modal.title = options.title;
  }

  // 处理内容
  if (typeof options.content === "string") {
    modal.innerHTML = options.content;
  } else if (options.content instanceof HTMLElement) {
    modal.append(options.content);
  } else if (options.content && options.content.template) {
    // 如果传入的是 Lit 模板
    modal.append(options.content);
  }

  // 监听关闭事件
  modal.addEventListener("modal-close", () => {
    modal.remove();
  });

  // 添加到页面
  document.body.append(modal);

  return modal;
}
