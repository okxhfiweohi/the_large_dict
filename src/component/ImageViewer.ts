import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface ImageItem {
  url: string;
  alt?: string;
  description?: string | any;
}

@customElement("tlgd-image-viewer-modal")
export class ImageViewer extends LitElement {
  static styles = css`
    :host {
      --bg-color: rgba(0, 0, 0, 0.9);
      --text-color: #fff;
      --control-bg: rgba(0, 0, 0, 0.5);
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-color);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .overlay.active {
      opacity: 1;
    }

    .header {
      width: 100%;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      box-sizing: border-box;
      color: var(--text-color);
    }

    .alt-info {
      overflow: auto;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    button {
      background: var(--control-bg);
      opacity: 0.7;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    button:hover:not(:disabled) {
      opacity: 1;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .close-btn {
      margin-left: 1em;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .icon {
      width: 1.5rem;
      height: 1.5rem;
      fill: currentColor;
    }

    .image-area {
      flex: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
      touch-action: none;
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .preview-image {
      display: block;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.1s ease-out;
    }

    .description {
      color: var(--text-color);
      text-align: center;
      padding: 0.5rem 1rem 0;
      max-width: 100%;
      max-height: max(1em, min(30vh, 4em));
      margin: 0 auto;
      flex-shrink: 0;
      overflow: auto;
    }

    .controls {
      width: 100%;
      padding-inline: 1rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .control-btn {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    .nav-btn {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
    }

    .nav-btn.prev {
      left: min(1vw, 1rem);
    }
    .nav-btn.next {
      right: min(1vw, 1rem);
    }

    .zoom-level {
      color: var(--text-color);
      min-width: 5rem;
      text-align: center;
    }

    .loading {
      color: var(--text-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 48px;
      height: 48px;
      animation: spin 1s linear infinite;
    }

    .spinner circle {
      fill: none;
      stroke: currentColor;
      stroke-width: 3;
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -35px;
      }
      100% {
        stroke-dashoffset: -124px;
      }
    }

    /* 切换动画 */
    .slide-out-left {
      animation: slideOutLeft 0.3s ease forwards;
    }
    .slide-out-right {
      animation: slideOutRight 0.3s ease forwards;
    }

    @keyframes slideOutLeft {
      from {
        opacity: 1;
      }
      to {
        transform: translateX(-100%);
        opacity: 0;
      }
    }

    @keyframes slideOutRight {
      from {
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;

  // SVG图标定义
  static get icons() {
    return {
      close: html`
        <svg class="icon" viewBox="0 0 24 24">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      `,
      prev: html`
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      `,
      next: html`
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      `,
      zoomIn: html`
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      `,
      zoomOut: html`
        <svg class="icon" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z" /></svg>
      `,
      reset: html`
        <svg class="icon" viewBox="0 0 24 24">
          <path
            d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
          />
        </svg>
      `,
    };
  }

  @property({ type: Array })
  images: ImageItem[] = [];
  @property({ type: Number })
  currentIndex = 0;
  @property({ type: Boolean })
  isOpen = false;
  @property({ type: Number })
  scale = 1;
  @property({ type: Number })
  translateX = 0;
  @property({ type: Number })
  translateY = 0;
  @property({ type: String })
  slideDirection = "";
  @property({ type: Boolean })
  isLoading = false;

  @state()
  isAnimating = false;
  @state()
  minScale = 0.5;
  @state()
  maxScale = 5;
  @state()
  touchStartX = 0;
  @state()
  touchStartY = 0;
  @state()
  touchStartTime = 0;
  @state()
  isPinching = false;
  @state()
  pinchStartDistance = 0;
  @state()
  pinchStartScale = 1;
  @state()
  isTouchMoving = false;
  @state()
  imageDisplayWidth = 0;
  @state()
  imageDisplayHeight = 0;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._handleKeyDown);
    this._restoreScroll();
  }

  _handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isOpen) return;
    switch (e.key) {
      case "Escape":
        this.close();
        break;
      case "ArrowLeft":
        this.prevImage();
        break;
      case "ArrowRight":
        this.nextImage();
        break;
      case "+":
      case "=":
        e.preventDefault();
        this.zoomIn();
        break;
      case "-":
        e.preventDefault();
        this.zoomOut();
        break;
    }
  };

  _disableScroll() {
    document.body.style.overflow = "hidden";
  }

  _restoreScroll() {
    document.body.style.overflow = "";
  }

  _handleWheel = (e: WheelEvent) => {
    if (!this.isOpen) return;
    e.preventDefault();
    e.deltaY < 0 ? this.zoomIn() : this.zoomOut();
  };

  open(images: ImageItem[], startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.isOpen = true;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isLoading = true;
    this.isAnimating = false;
    this.isTouchMoving = false;
    this.isPinching = false;

    this._disableScroll();
    this._preloadImage(this.currentIndex);
    if (images.length > 1) {
      this._preloadImage(this.currentIndex - 1);
      this._preloadImage(this.currentIndex + 1);
    }
  }

  close() {
    this.isOpen = false;
    this._restoreScroll();
    setTimeout(() => this.parentNode?.removeChild(this), 300);
  }

  async nextImage() {
    if (this.isAnimating || this.images.length <= 1) return;
    this.isAnimating = true;
    this.slideDirection = "right";

    await new Promise((resolve) => setTimeout(resolve, 300));

    this.currentIndex = this.currentIndex < this.images.length - 1
      ? this.currentIndex + 1
      : 0;
    this._resetImage();
  }

  async prevImage() {
    if (this.isAnimating || this.images.length <= 1) return;
    this.isAnimating = true;
    this.slideDirection = "left";

    await new Promise((resolve) => setTimeout(resolve, 300));

    this.currentIndex = this.currentIndex > 0
      ? this.currentIndex - 1
      : this.images.length - 1;
    this._resetImage();
  }

  _resetImage() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isLoading = true;
    this.slideDirection = "";
    this.isAnimating = false;

    this._preloadImage(this.currentIndex);
    if (this.images.length > 1) {
      this._preloadImage(this.currentIndex - 1);
      this._preloadImage(this.currentIndex + 1);
    }
  }

  zoomIn() {
    this.scale = Math.min(this.scale + 0.5, this.maxScale);
    this._clampTranslation();
  }

  zoomOut() {
    this.scale = Math.max(this.scale - 0.5, this.minScale);
    this._clampTranslation();
  }

  resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  _preloadImage(index: number) {
    if (index < 0 || index >= this.images.length) return;
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    // img.crossOrigin = "anonymous"
    img.src = this.images[index].url;
    img.onload = () => {
      if (index === this.currentIndex) {
        this.isLoading = false;
        this.requestUpdate();
        this._updateImageDisplaySizeDebounced();
      }
    };
  }

  update_display_size_timeout: number | null = null;
  _updateImageDisplaySizeDebounced(timeout = 100) {
    if (this.update_display_size_timeout !== null) {
      clearTimeout(this.update_display_size_timeout);
    }
    this.update_display_size_timeout = setTimeout(
      () => {
        this._updateImageDisplaySize();
        this.update_display_size_timeout = null;
      },
      timeout,
    );
  }

  _updateImageDisplaySize() {
    const imageElement = this.shadowRoot?.querySelector(
      ".preview-image",
    ) as HTMLImageElement;
    const containerElement = this.shadowRoot?.querySelector(
      ".image-area",
    ) as HTMLElement;

    if (imageElement && containerElement) {
      const naturalWidth = imageElement.naturalWidth || imageElement.width;
      const naturalHeight = imageElement.naturalHeight || imageElement.height;
      const containerWidth = containerElement.clientWidth;
      const containerHeight = containerElement.clientHeight;
      const containerRatio = containerWidth / containerHeight;
      const imageRatio = naturalWidth / naturalHeight;

      if (imageRatio > containerRatio) {
        this.imageDisplayWidth = containerWidth;
        this.imageDisplayHeight = containerWidth / imageRatio;
      } else {
        this.imageDisplayHeight = containerHeight;
        this.imageDisplayWidth = containerHeight * imageRatio;
      }

      this._clampTranslation();
    }
  }

  _clampTranslation() {
    if (this.scale <= 1.1) {
      this.translateX = 0;
      this.translateY = 0;
      return;
    }

    const maxTranslateX = this.imageDisplayWidth / 2;
    const maxTranslateY = this.imageDisplayHeight / 2;
    this.translateX = Math.max(
      -maxTranslateX,
      Math.min(maxTranslateX, this.translateX),
    );
    this.translateY = Math.max(
      -maxTranslateY,
      Math.min(maxTranslateY, this.translateY),
    );
  }

  _getDistance(touches: TouchList) {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[touches.length - 1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  _handleModalTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" || target.closest("button") ||
      !this._checkEvent(e)
    ) return;
    e.preventDefault();

    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
      this.isTouchMoving = false;
    } else if (e.touches.length === 2) {
      this.isPinching = true;
      this.pinchStartDistance = this._getDistance(e.touches);
      this.pinchStartScale = this.scale;
    }
  };

  _handleModalTouchMove = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" || target.closest("button") ||
      !this._checkEvent(e)
    ) return;
    e.preventDefault();

    if (e.touches.length === 2 && this.isPinching) {
      this.isTouchMoving = true;
      const currentDistance = this._getDistance(e.touches);
      if (this.pinchStartDistance > 0) {
        const scaleFactor = currentDistance / this.pinchStartDistance;
        this.scale = Math.max(
          this.minScale,
          Math.min(this.pinchStartScale * scaleFactor, this.maxScale),
        );
        this._clampTranslation();
      }
    } else if (e.touches.length === 1 && this.scale > 1.1) {
      this.isTouchMoving = true;
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      this.translateX += deltaX;
      this.translateY += deltaY;
      this._clampTranslation();
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    } else if (e.touches.length === 1) {
      this.isTouchMoving = true;
    }
  };

  _handleModalTouchEnd = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" || target.closest("button") ||
      !this._checkEvent(e)
    ) return;
    e.preventDefault();

    // 如果是双指缩放，不进行滑动切换/点击判断
    if (this.isPinching) {
      this.isPinching = false;
      this.isTouchMoving = false;
      return;
    }

    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      const deltaTime = Date.now() - this.touchStartTime;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (
        this.scale <= 1.1 && Math.abs(deltaX) > 50 && deltaTime < 500 &&
        !this.isAnimating && this.isTouchMoving
      ) {
        deltaX > 0 ? this.prevImage() : this.nextImage();
      } else if (distance < 1 && deltaTime < 100) {
        this._handleClickClose(e);
      }
    }
    this.isTouchMoving = false;
  };

  _handleModalMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" || target.closest("button") ||
      !this._checkEvent(e)
    ) return;
    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
  };

  _handleModalMouseUp = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" || target.closest("button") ||
      !this._checkEvent(e)
    ) return;
    const deltaX = e.clientX - this.touchStartX;
    const deltaY = e.clientY - this.touchStartY;
    this.translateX += deltaX;
    this.translateY += deltaY;
    this._clampTranslation();
  };

  _checkEvent(e: Event) {
    const target = e.target as HTMLElement;
    const forbidden = target.closest(
      ".header, .controls, .nav-btn, .description, .loading",
    );
    if (
      !forbidden &&
      (target.tagName === "IMG" || target.classList.contains("preview-image") ||
        target.classList.contains("image-wrapper") ||
        target.classList.contains("image-area") ||
        target.classList.contains("overlay"))
    ) {
      return true;
    }
    return false;
  }
  _handleClickClose(e: Event) {
    if (this._checkEvent(e)) {
      this.close();
    }
  }

  render() {
    if (!this.isOpen) {
      return nothing;
    }

    const currentImage = this.images[this.currentIndex];
    const imageTransform =
      `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
    const slideClass = this.slideDirection === "left"
      ? "slide-out-right"
      : this.slideDirection === "right"
      ? "slide-out-left"
      : "";

    return html`
      <div
        class="overlay active"
        @touchstart="${this._handleModalTouchStart}"
        @touchmove="${this._handleModalTouchMove}"
        @touchend="${this._handleModalTouchEnd}"
        @mousedown="${this._handleModalMouseDown}"
        @mouseup="${this._handleModalMouseUp}"
        @wheel="${this._handleWheel}"
      >
        <div class="header">
          <div class="alt-info">
            ${currentImage.alt}
          </div>
          <div class="header-right">
            <div class="counter">${this.currentIndex + 1} / ${this.images
              .length}</div>
            <button class="close-btn" @click="${this.close}" aria-label="关闭">
              ${ImageViewer.icons.close}
            </button>
          </div>
        </div>

        <div class="image-area">
          <button
            class="nav-btn prev"
            @click="${this.prevImage}"
            ?disabled="${this.images.length <= 1 || this.isAnimating}"
            aria-label="上一张"
          >
            ${ImageViewer.icons.prev}
          </button>

          <div class="image-wrapper">
            ${this.isLoading
              ? html`
                <div class="loading">
                  <svg class="spinner" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" stroke-width="4"></circle>
                  </svg>
                </div>
              `
              : html`
                <img
                  class="preview-image ${slideClass}"
                  src="${currentImage.url}"
                  alt="${currentImage.alt || "预览图片"}"
                  style="transform: ${imageTransform};"
                  @load="${() => {
                    this.isLoading = false;
                    this._updateImageDisplaySizeDebounced();
                  }}"
                >
              `}
          </div>

          <button
            class="nav-btn next"
            @click="${this.nextImage}"
            ?disabled="${this.images.length <= 1 || this.isAnimating}"
            aria-label="下一张"
          >
            ${ImageViewer.icons.next}
          </button>
        </div>

        <div class="description">${currentImage.description || ""}</div>

        <div class="controls">
          <button
            class="control-btn"
            @click="${this.zoomOut}"
            ?disabled="${this.scale <= this.minScale}"
            aria-label="缩小"
          >
            ${ImageViewer.icons.zoomOut}
          </button>
          <div class="zoom-level">${Math.round(this.scale * 100)}%</div>
          <button
            class="control-btn"
            @click="${this.zoomIn}"
            ?disabled="${this.scale >= this.maxScale}"
            aria-label="放大"
          >
            ${ImageViewer.icons.zoomIn}
          </button>
          <button class="control-btn" @click="${this
            .resetZoom}" aria-label="重置缩放">
            ${ImageViewer.icons.reset}
          </button>
        </div>
      </div>
    `;
  }
}
