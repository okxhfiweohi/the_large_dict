import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("tlgd-modal-box")
export class ModalBox extends LitElement {
  static styles = css`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .close-button {
      background: rgba(128, 128, 128, 0.2);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.5rem;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: rgba(128, 128, 128, 0.3);
      transform: rotate(90deg);
    }

    .modal-content {
      padding: 24px;
      overflow-y: auto;
      flex-grow: 1;
      color: #374151;
      line-height: 1.6;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 640px) {
      .modal-container {
        width: 95%;
        max-height: 85vh;
      }

      .modal-header {
        padding: 16px 20px;
      }

      .modal-content {
        padding: 20px;
      }
    }
  `;

  static properties = {
    title: { type: String },
  };

  constructor() {
    super();
    this.title = "";
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleEscape);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._handleEscape);
    super.disconnectedCallback();
  }

  _handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.close();
    }
  };

  close() {
    this.dispatchEvent(new CustomEvent("modal-close"));
    this.remove();
  }

  render() {
    return html`
      <div class="modal-overlay" @click="${(e: any) => {
        if (e.target.classList.contains("modal-overlay")) this.close();
      }}">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">${this.title}</h2>
            <button
              class="close-button"
              @click="${this.close}"
              aria-label="关闭"
            >
              ×
            </button>
          </div>
          <div class="modal-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

