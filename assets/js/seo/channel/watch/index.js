
import getThumbnailUrl from "./getThumbnailUrl.js";
import getUploadDate from "./getUploadDate.js";
import isAccessibleForFree from "./isAccessibleForFree.js";
import getTitle from "./getTitle.js";
import getDescription from "./getDescription.js";
import getKeywords from "./getKeywords.js";
import getUrl from "./getUrl.js";
import getAlternate from "./getAlternate.js";
import getVideoObject from "./getVideoObject.js";
import getItemList from "./getItemList.js";
import getBreadcrumbList from "./getBreadcrumbList.js";

const app = {
    getThumbnailUrl: getThumbnailUrl,
    getUploadDate: getUploadDate,
    isAccessibleForFree: isAccessibleForFree,
    getTitle: getTitle,
    getDescription: getDescription,
    getKeywords: getKeywords,
    getUrl: getUrl,
    getAlternate: getAlternate,
    getVideoObject: getVideoObject,
    getItemList: getItemList,
    getBreadcrumbList: getBreadcrumbList
};

export default app;
