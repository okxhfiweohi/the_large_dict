import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("tlgd-icon-img")
export class IconImg extends LitElement {
  static styles = css`
    :host {
      width: 1.5em;
      display: inline-flex;
      vertical-align: middle;
      justify-content: center;
      aspect-ratio: 1;
      -webkit-aspect-ratio: 1;
      fill: currentColor;
      box-sizing: border-box;
    }
    :host:empty {
      visibility: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
  `;

  @property()
  src = "";

  constructor(src: string = "") {
    super();
    this.src = src;
  }

  render() {
    if (!this.src) {
      return nothing;
    }
    return html`
      <img src="${this.src}" alt="icon" />
    `;
  }
}
