import {
  css,
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  type PropertyValues,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import "./sober.js";

interface Item {
  classes?: string;
  style?: string;
  content?: any;
  value?: any;
  onclick?: (e: MouseEvent) => unknown;
}

@customElement("tlgd-sweeper")
export class Sweeper extends LitElement {
  static styles?: CSSResultGroup = css`
    s-carousel {
      height: 100px;
      width: 100px;
    }
    s-carousel-item, .container {
      height: 100px;
      width: 100px;
      overflow: auto;
    }
    .sweeper-img-item {
      background-color: gray;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }
  `;
  constructor() {
    super();
  }
  @state()
  list: Item[] = [];
  add_item(item: Item) {
    this.list.push(item);
    this.render();
  }
  add_img_item(url: string, value: any, onclick: (e: MouseEvent) => unknown) {
    this.add_item({
      classes: "sweeper-img-item",
      style: `background-image: url("${url}")`,
      content: html`
        <img
          src="${url}"
          width="0"
          height="0"
          style="visibility: hidden;"
          referrerpolicy="no-referrer"
        ></img>
      `,
      value,
      onclick,
    });
  }

  protected render() {
    if (this.list.length === 0) {
      return nothing;
    }
    const items = this.list.map((item, idx) =>
      html`
        <s-carousel-item
          selected="${idx === 0 ? true : false}"
          class="${item.classes}"
          style="${item.style}"
          value="${item.value}"
          @click="${item.onclick ?? nothing}"
        >${item.content}</s-carousel-item>
      `
    );
    return html`
      <div class="container">
        <s-carousel
          class="carousel"
          autoplay="false"
        >${items}</s-carousel>
      </div>
    `;
  }
  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    const track = this.renderRoot.querySelector(".carousel")?.shadowRoot
      ?.querySelector(".track") as HTMLElement;
    if (track) {
      track.style.scale = "0.5";
    }
  }
}
