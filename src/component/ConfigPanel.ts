import { css, type CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import "./sober.js";
import { get_config, set_config } from "../config.js";
import { plugin_list } from "../plugins/index.js";

@customElement("tlgd-config-panel")
export class ConfigPanel extends LitElement {
  static styles?: CSSResultGroup = css`
    h4 {
      margin: 1.5em 0 0.125em;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h4 > :laat-child {
      margin-left: auto;
    }
    p {
      margin: 0 0 1em;
      opacity: 70%;
    }
    h3:not(:first-of-type) {
      margin-top: 2em;
    }
    h3:first-of-type {
      margin-block-start: 0;
      margin-block-end: 0;
    }
  `;
  constructor() {
    super();
  }
  handle_change(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.dataset.custom) {
      return;
    }
    const value = target.value ?? target.checked;
    const key = target.dataset.ck;
    if (key) {
      set_config(key, value);
    }
  }
  protected render() {
    const list = plugin_list.map((plugin) => {
      let config_frag;
      const v = get_config(plugin.key);
      if (plugin.config_type == "switch") {
        config_frag = html`
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="${plugin.key}"
            checked="${v}"
          ></s-switch>
        `;
      } else if (
        plugin.config_type == "input-text" ||
        plugin.config_type == "input-number"
      ) {
        const tmp = plugin.config_type.split("-");
        const type = tmp.length > 1 ? tmp[tmp.length - 1] : "text";
        config_frag = html`
          <s-text-field
            label="请输入"
            @change="${this
              .handle_change}"
            data-ck="${plugin.key}"
            value="${v}"
            type="${type}"
          ></s-text-field>
        `;
      } else if (Array.isArray(plugin.config_type)) {
        const content = plugin.config_type.map((v) =>
          html`
            <s-segmented-button-item value="${v}">
              ${v}
            </s-segmented-button-item>
          `
        );
        config_frag = html`
          <s-segmented-button
            @change="${this.handle_change}"
            data-ck="${plugin.key}"
            value="${v}"
          >
            ${content}
          </s-segmented-button>
        `;
      } else {
        config_frag = html`
          <div data-ck="${plugin.key}" data-custom="true">
            ${plugin.config_type()}
          </div>
        `;
      }
      const desc = plugin.description
        ? html`
          <p>${plugin.description}</p>
        `
        : nothing;
      return html`
        <h4>
          ${plugin.title} ${config_frag}
        </h4>
        ${desc}
      `;
    });
    return html`
      <div>
        <h3>主题</h3>
        <h4>
          主题颜色
          <label>
            <input
              type="color"
              autocomplete
              list="color-presets"
              @change="${this.handle_change}"
              data-ck="theme"
              name="theme"
              value="${get_config("theme") ?? "#1A8CFF"}"
            />
          </label>
          <datalist id="color-presets">
            <option>#00D4FF</option>
            <option>#1A8CFF</option>
            <option>#FF5533</option>
            <option>#FFBF00</option>
            <option>#00D90B</option>
            <option>#00BFA5</option>
            <option>#B836FF</option>
            <option>#FF4D79</option>
          </datalist>
        </h4>
        <h4>
          标签颜色
          <s-segmented-button
            @change="${this.handle_change}"
            data-ck="theme_tag"
            value="${get_config("theme_tag") ?? "colorful"}"
          >
            <s-segmented-button-item value="plain">
              朴素
            </s-segmented-button-item>
            <s-segmented-button-item value="theme">
              主题色
            </s-segmented-button-item>
            <s-segmented-button-item value="colorful">
              全彩
            </s-segmented-button-item>
          </s-segmented-button>
        </h4>

        <h3>隐藏内容</h3>
        <h4>
          隐藏音标
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_phonetic"
            checked="${get_config("hide_phonetic")}"
          ></s-switch>
        </h4>
        <p>隐藏单词旁的音标</p>
        <h4>
          隐藏星级
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_stars"
            checked="${get_config("hide_stars")}"
          ></s-switch>
        </h4>
        <p>隐藏柯林斯星级⭐</p>
        <h4>
          隐藏词频
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_freq"
            checked="${get_config("hide_freq")}"
          ></s-switch>
        </h4>
        <p>隐藏 BNC 或 COCA 词频排名</p>
        <h4>
          隐藏词形变化
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_exchange"
            checked="${get_config("hide_exchange")}"
          ></s-switch>
        </h4>
        <p>过去式, 过去分词, 现在分词, 等等</p>
        <h4>
          隐藏规则的词形变化
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_normal_exchange"
            checked="${get_config("hide_normal_exchange")}"
          ></s-switch>
        </h4>
        <p>按规则词形变化, 如:ed/ing/s 结尾</p>
        <h4>
          隐藏标签
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_tags"
            checked="${get_config("hide_tags")}"
          ></s-switch>
        </h4>
        <p>四级, 六级, 托福, 等等</p>
        <h4>
          隐藏词性分布
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_pos_percent"
            checked="${get_config("hide_pos_percent")}"
          ></s-switch>
        </h4>
        <p>动词 38%, 名词 42% ...</p>
        <h4>
          隐藏词义分布
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_sense_percent"
            checked="${get_config("hide_sense_percent")}"
          ></s-switch>
        </h4>
        <p>解释一 80%, 解释二 12%...</p>
        <h4>
          隐藏简明释义
          <s-switch
            @change="${this
              .handle_change}"
            data-ck="hide_explain"
            checked="${get_config("hide_sense_explain")}"
          ></s-switch>
        </h4>
        <h3>插件</h3>
        <p>由其他开发者开发, 集成更多功能</p>
        ${list}
      </div>
    `;
  }
}
