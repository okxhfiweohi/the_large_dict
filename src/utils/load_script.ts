import { qq } from "./mini_query";
import { show_msg } from "./show_msg";

const loaded = new Set();
interface SourceOpts {
  root?: Element | null;
  url: string;
  key?: string;
  module?: boolean; // true
  on_load?: (ev: Event) => any;
  on_error?: OnErrorEventHandler;
}
async function load_one_script(src: SourceOpts): Promise<null> {
  const key = src.key || src.url;
  const script = document.createElement("script");
  if (src.module !== false) {
    script.type = "module";
  }
  script.src = src.url;
  if (key && loaded.has(key)) {
    return null;
  }
  return new Promise((res, rej) => {
    script.onerror = () => {
      rej();
    };
    script.onload = (ev) => {
      if (key) {
        loaded.add(key);
      }
      script.onload = null;
      script.onerror = src.on_error ?? null;
      src.on_load?.(ev);
      res(null);
    };
    src.root?.append(script);
  });
}
export async function load_script(
  source: string | SourceOpts | (SourceOpts | string)[],
  opts: {
    sequential?: boolean; // false
    root?: Element | null;
    key?: string;
    module?: boolean; // true
    loading?: string | null; // "loading..."
  } = {},
) {
  let key = opts.key;
  if (!Array.isArray(source)) {
    source = [source];
  } else {
    source = source.flat(0);
  }
  let sources = source.map((v) => typeof v === "string" ? { url: v } : v);
  key ??= sources.map((v) => v.url).join(",");
  if (key && loaded.has(key)) {
    return;
  }
  let { module, root } = opts;
  if (!root) {
    root = qq("footer");
  }
  sources = sources.map(
    (v) => ({ module, root, ...v }),
  );
  const loading_handle = opts.loading !== null
    ? show_msg({
      text: opts.loading || "加载中...",
      duration: 0,
    })
    : null;
  try {
    if (opts.sequential) {
      const loaded_idx = new Map<number, Event>();
      await Promise.all(sources.map((v, idx) => {
        v.on_load = (ev) => {
          loaded_idx.set(idx, ev);
        };
        return load_one_script(v);
      }));
      loaded.add(key);
      sources.forEach((src, idx) => {
        const ev = loaded_idx.get(idx);
        if (ev) {
          src.on_load?.(ev);
        }
      });
    } else {
      for (const src of sources) {
        await load_one_script(src);
      }
    }
  } catch (e) {
    setTimeout(() => {
      show_msg({
        type: "error",
        text: "加载失败",
      });
    });
    throw e;
  } finally {
    loading_handle?.close();
  }
}
