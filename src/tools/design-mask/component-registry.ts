export const componentRegistry = new WeakMap<object, string>();

export const registerDesignComponent = (name: string, component: unknown) => {
  if (
    !component ||
    (typeof component !== "function" && typeof component !== "object")
  )
    return;

  componentRegistry.set(component, name);
  for (const [key, value] of Object.entries(component)) {
    if (!/^[A-Z]/.test(key)) continue;
    registerDesignComponent(
      `${name}${name === "App" ? "-" : "."}${key}`,
      value,
    );
  }
};
