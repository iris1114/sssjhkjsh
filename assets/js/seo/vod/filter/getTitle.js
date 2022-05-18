
import titleMap from "../../../../json/content/titleMap.json";
import pkg from "../../../../../package.json";

const app = (contentType, filterData) => {
    if(filterData[contentType]){
        return `進階篩選-${titleMap[contentType]}｜${pkg.siteName}`;
    }
    else{
        return `全部-${titleMap[contentType]}｜${pkg.siteName}`;
    }
};

export default app;
