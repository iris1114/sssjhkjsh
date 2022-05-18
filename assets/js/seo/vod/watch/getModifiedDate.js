
import seo from "../../index.js";

const app = (programInfo) => {
    let uploadDate = seo.vod.watch.getUploadDate(programInfo);
    let now = new Date().getTime();

    uploadDate = new Date(uploadDate).getTime();

    let modifiedDate = (uploadDate + now) / 2;

    return new Date(modifiedDate).toISOString();
};

export default app;
