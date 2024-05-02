import { getAnalytics, setUserProperties } from "firebase/analytics";
import { initializeApp } from "firebase/app";

import { version } from "../package.json";
import firebaseConfig from "./firebase.json";

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
setUserProperties(analytics, {
  env: import.meta.env.DEV ? "dev" : "production",
  version,
});
