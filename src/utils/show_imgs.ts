import { ImageViewer } from "../component/ImageViewer";
type ImageItem = Parameters<ImageViewer["open"]>[0][0];
export function show_imgs(images: ImageItem[], startIndex = 0) {
  const existingModal = document.querySelector("tlgd-image-viewer-modal");
  if (existingModal) existingModal.remove();

  const modal = new ImageViewer();
  document.body.appendChild(modal);
  modal.open(images, startIndex);
  return modal;
}
