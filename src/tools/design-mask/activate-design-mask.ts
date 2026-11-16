import { componentRegistry } from "./component-registry";

const MASK_CSS = `
[data-design-mask-layer] {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
  overflow: hidden;
}
[data-design-mask-box] {
  position: absolute;
  box-sizing: border-box;
  border: 1px solid var(--mask-colour);
  overflow: hidden;
}
[data-design-mask-box][data-mask-fill] {
  background-image: repeating-linear-gradient(
    -45deg,
    var(--mask-stripe) 0 1px,
    transparent 1px 8px
  );
}
[data-design-mask-label] {
  position: absolute;
  padding: 0 4px;
  font: 600 10px/14px ui-monospace, monospace;
  color: white;
  background: var(--mask-colour);
  white-space: nowrap;
}
`;

type FiberLike = {
  type?: object;
  elementType?: object;
  stateNode?: unknown;
  return?: FiberLike | null;
  _debugOwner?: FiberLike | null;
  alternate?: FiberLike | null;
};

const getFiber = (element: Element) => {
  const key = Object.keys(element).find((name) =>
    name.startsWith("__reactFiber$"),
  );
  return key
    ? (element as unknown as Record<string, FiberLike>)[key]
    : undefined;
};

const getComponentName = (fiber: FiberLike) => {
  return (
    (fiber.type && componentRegistry.get(fiber.type)) ||
    (fiber.elementType && componentRegistry.get(fiber.elementType))
  );
};

const hasComponentOwner = (fiber: FiberLike) => {
  let owner = fiber._debugOwner;
  while (owner) {
    if (getComponentName(owner)) return true;
    owner = owner._debugOwner;
  }
  return false;
};

const markRoots = () => {
  for (const element of document.querySelectorAll("[data-ui-component-root]")) {
    element.removeAttribute("data-ui-component-root");
    element.removeAttribute("data-ui-component");
  }
  for (const element of document.querySelectorAll("body *")) {
    let fiber = getFiber(element)?.return;
    while (fiber && !(fiber.stateNode instanceof Element)) {
      const name = getComponentName(fiber);
      if (name && !hasComponentOwner(fiber)) {
        element.setAttribute("data-ui-component", name);
        element.setAttribute("data-ui-component-root", "");
      }
      fiber = fiber.return;
    }
  }
};

export const activateDesignMask = () => {
  if (typeof window === "undefined") return;

  let deactivate: (() => void) | undefined;

  (
    window as unknown as {
      debugDesignSystem: () => string;
    }
  ).debugDesignSystem = () => {
    if (deactivate) {
      deactivate();
      deactivate = undefined;
      return "design mask off";
    }

    const style = document.createElement("style");
    style.textContent = MASK_CSS;
    document.head.appendChild(style);
    const layer = document.createElement("div");
    layer.setAttribute("data-design-mask-layer", "");
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    document.documentElement.setAttribute("data-design-mask", "");

    let dirty = true;
    let frame = 0;
    let overlays: {
      element: Element;
      box: HTMLDivElement;
      label: HTMLSpanElement;
    }[] = [];

    const observer = new MutationObserver((mutations) => {
      if (mutations.some(({ target }) => !layer.contains(target))) dirty = true;
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const render = () => {
      if (dirty) {
        dirty = false;
        markRoots();
        layer.replaceChildren();
        overlays = Array.from(
          document.querySelectorAll("[data-ui-component-root]"),
          (element) => {
            const name = element.getAttribute("data-ui-component") ?? "";
            const hue = Array.from(name).reduce(
              (hash, character) => (hash * 31 + character.charCodeAt(0)) % 360,
              0,
            );
            const box = document.createElement("div");
            box.setAttribute("data-design-mask-box", name);
            box.style.setProperty("--mask-colour", `hsl(${hue} 75% 40%)`);
            box.style.setProperty("--mask-stripe", `hsl(${hue} 85% 55% / .5)`);
            box.toggleAttribute(
              "data-mask-fill",
              !element.querySelector("[data-ui-component-root]"),
            );
            const label = document.createElement("span");
            label.setAttribute("data-design-mask-label", "");
            label.textContent = name;
            box.appendChild(label);
            layer.appendChild(box);
            return { element, box, label };
          },
        );
      }

      const labels: DOMRect[] = [];
      for (const { element, box, label } of overlays) {
        const rect = element.getBoundingClientRect();
        let top = Math.max(0, rect.top);
        let left = Math.max(0, rect.left);
        let right = Math.min(window.innerWidth, rect.right);
        let bottom = Math.min(window.innerHeight, rect.bottom);
        let ancestor = element.parentElement;
        while (ancestor && ancestor !== document.body) {
          const computed = getComputedStyle(ancestor);
          const bounds = ancestor.getBoundingClientRect();
          if (/auto|scroll|hidden|clip/.test(computed.overflowX)) {
            left = Math.max(left, bounds.left + ancestor.clientLeft);
            right = Math.min(
              right,
              bounds.left + ancestor.clientLeft + ancestor.clientWidth,
            );
          }
          if (/auto|scroll|hidden|clip/.test(computed.overflowY)) {
            top = Math.max(top, bounds.top + ancestor.clientTop);
            bottom = Math.min(
              bottom,
              bounds.top + ancestor.clientTop + ancestor.clientHeight,
            );
          }
          ancestor = ancestor.parentElement;
        }
        const visible =
          right > left &&
          bottom > top &&
          getComputedStyle(element).visibility !== "hidden";
        box.hidden = !visible;
        if (!visible) continue;
        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
        box.style.width = `${right - left}px`;
        box.style.height = `${bottom - top}px`;
        box.style.backgroundPosition = `${rect.left - left}px ${rect.top - top}px`;
        let labelTop = top;
        const width = label.getBoundingClientRect().width;
        while (
          labels.some(
            (bounds) =>
              left < bounds.right &&
              left + width > bounds.left &&
              labelTop < bounds.bottom &&
              labelTop + 14 > bounds.top,
          )
        ) {
          labelTop += 14;
        }
        label.style.top = `${labelTop - top}px`;
        labels.push(new DOMRect(left, labelTop, width, 14));
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    deactivate = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      layer.remove();
      style.remove();
      document.documentElement.removeAttribute("data-design-mask");
      for (const element of document.querySelectorAll(
        "[data-ui-component-root]",
      )) {
        element.removeAttribute("data-ui-component-root");
        element.removeAttribute("data-ui-component");
      }
    };
    return "design mask on";
  };
};
