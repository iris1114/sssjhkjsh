
import seo from "../../index.js";

const app = (programInfo) => {
    if(programInfo.release_year){
        return programInfo.release_year;
    }
    else{
        let uploadDate = seo.vod.watch.getUploadDate(programInfo);
        let date = new Date(uploadDate);
        let year = date.getFullYear();

        return year;
    }
};

export default app;
