
import descriptionMap from "../../../../json/content/descriptionMap.json";

const app = (searchProgram) => {
    let contentType = searchProgram.content_type;

    let desc = `${searchProgram.result_type_name}｜`;

    if(searchProgram.description){
        desc += `${searchProgram.description}｜`;
    }

    desc += descriptionMap[contentType];

    return desc;
};

export default app;
