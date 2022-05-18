
import pkg from "../../../../package.json";

const app = (query) => {
    return `關於 "${query}" 的搜尋結果｜${pkg.siteName}`
};

export default app;
