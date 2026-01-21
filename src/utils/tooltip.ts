import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  type Placement,
  shift,
} from "@floating-ui/dom";

const activeTooltips = new Set<HTMLElement>();

function createTooltipElement(
  text: string,
): { tooltip: HTMLElement; arrowEl: HTMLElement } {
  const tooltip = document.createElement("div");
  tooltip.className = "floating-tooltip";
  tooltip.textContent = text;
  tooltip.style.position = "absolute";
  tooltip.style.top = "0";
  tooltip.style.left = "0";
  tooltip.style.background = "black";
  tooltip.style.color = "white";
  tooltip.style.padding = "8px 12px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "14px";
  tooltip.style.zIndex = "9999";
  tooltip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  tooltip.style.maxWidth = "300px";
  tooltip.style.wordBreak = "break-word";
  tooltip.style.whiteSpace = "nowrap";
  tooltip.style.visibility = "hidden";

  const arrowEl = document.createElement("div");
  arrowEl.className = "floating-tooltip-arrow";
  arrowEl.style.position = "absolute";
  arrowEl.style.width = "8px";
  arrowEl.style.height = "8px";
  arrowEl.style.background = "inherit";
  arrowEl.style.transform = "rotate(45deg)";
  tooltip.appendChild(arrowEl);

  return { tooltip, arrowEl };
}

async function positionTooltip(
  referenceEl: HTMLElement,
  tooltip: HTMLElement,
  arrowEl: HTMLElement,
) {
  const middleware = [
    offset(10),
    flip(),
    shift({ padding: 5 }),
    arrow({ element: arrowEl }),
  ];

  const { x, y, placement, middlewareData } = await computePosition(
    referenceEl,
    tooltip,
    { middleware, placement: "top" as Placement },
  );

  Object.assign(tooltip.style, {
    left: `${x}px`,
    top: `${y}px`,
    visibility: "visible",
  });

  if (middlewareData.arrow) {
    const { x: arrowX, y: arrowY } = middlewareData.arrow;

    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[placement.split("-")[0]] || "bottom";

    Object.assign(arrowEl.style, {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      right: "",
      bottom: "",
      [staticSide]: "-4px",
    });
  }
}

export function tooltip(el: HTMLElement, text: string) {
  const handleClick = async () => {
    activeTooltips.forEach((tooltip) => {
      tooltip.remove();
    });
    activeTooltips.clear();

    const { tooltip: tooltipEl, arrowEl } = createTooltipElement(text);
    document.body.appendChild(tooltipEl);

    await positionTooltip(el, tooltipEl, arrowEl);

    const cleanupAutoUpdate = autoUpdate(el, tooltipEl, () => {
      positionTooltip(el, tooltipEl, arrowEl);
    });

    setTimeout(() => {
      activeTooltips.add(tooltipEl);

      (tooltipEl as any)._cleanup = cleanupAutoUpdate;
    }, 0);
  };

  if ((el as any)._tooltipClickHandler) {
    el.removeEventListener("click", (el as any)._tooltipClickHandler);
  }

  (el as any)._tooltipClickHandler = handleClick;
  el.addEventListener("click", handleClick);
}

window.addEventListener("click", () => {
  setTimeout(() => {
    activeTooltips.forEach((tooltip) => {
      if ((tooltip as any)._cleanup) {
        (tooltip as any)._cleanup();
      }
      tooltip.remove();
    });
    activeTooltips.clear();
  }, 0);
}, true);
