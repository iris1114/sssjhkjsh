
import descriptionMap from "../../../../json/content/descriptionMap.json";

const app = (contentType) => {
    return descriptionMap[contentType];
};

export default app;
