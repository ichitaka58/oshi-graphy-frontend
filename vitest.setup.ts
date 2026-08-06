import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdomにはResizeObserverが実装されていないが、radix-ui/base-uiの
// 一部コンポーネント（Switch, Comboboxなど）がマウント時に参照するため、
// テスト実行を通すための最小限のスタブを用意する。
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub;

// jsdomにはwindow.matchMediaが実装されていないが、vaul(Drawer)が
// マウント時に参照するため、テスト実行を通すための最小限のスタブを用意する。
window.matchMedia ??= (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// jsdomにはPointer Capture系のAPIが実装されていないが、vaul(Drawer)や
// base-ui系コンポーネントがポインタ操作時に参照するため、
// テスト実行を通すための最小限のスタブを用意する。
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.hasPointerCapture ??= () => false;

afterEach(() => {
  cleanup();
});
