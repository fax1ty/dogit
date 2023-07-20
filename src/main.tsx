import "./fonts/roboto/font.scss";
import "./index.scss";
import "keen-slider/keen-slider.min.css";

import { getAnalytics, setUserProperties } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import ReactDOM from "react-dom/client";

import { version } from "../package.json";
import { App } from "./app";
import firebaseConfig from "./firebase.json";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
setUserProperties(analytics, {
  env: import.meta.env.DEV ? "dev" : "production",
  version,
});
