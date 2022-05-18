
import titleMap from "../../../../json/content/titleMap.json";
import pkg from "../../../../../package.json";

const app = (contentType) => {
    return `${titleMap[contentType]}｜${pkg.siteName}`;
};

export default app;
