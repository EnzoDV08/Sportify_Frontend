import { app as n, BrowserWindow as t } from "electron";
import { fileURLToPath as r } from "node:url";
import o from "node:path";
const s = o.dirname(r(import.meta.url));
process.env.APP_ROOT = o.join(s, "..");
const c = process.env.VITE_DEV_SERVER_URL, R = o.join(process.env.APP_ROOT, "dist-electron"), l = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = c ? o.join(process.env.APP_ROOT, "public") : l;
let e;
function i() {
  e = new t({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(s, "../dist-electron/preload.js")
    }
  }), e.maximize(), e.webContents.openDevTools(), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.loadURL("http://localhost:5173");
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  t.getAllWindows().length === 0 && i();
});
n.whenReady().then(i);
export {
  R as MAIN_DIST,
  l as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
