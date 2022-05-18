
import descriptionMap from "../../../../json/content/descriptionMap.json";

const app = (programInfo) => {
    let description = programInfo.seo_description;

    if(!description){
        description = programInfo.description;
    }

    if(!description){
        description = descriptionMap[programInfo.content_type];
    }

    return description;
};

export default app;
