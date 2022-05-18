
import pkg from "../../../../../package.json";
import titleMap from "../../../../json/content/titleMap.json";

const app = (searchProgram) => {
    let resultTypeName = searchProgram.result_type_name;
    let contentType = searchProgram.content_type;

    return `${resultTypeName}-${titleMap[contentType]}｜${pkg.siteName}`;
};

export default app;
