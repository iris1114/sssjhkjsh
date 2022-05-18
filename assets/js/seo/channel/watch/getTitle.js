
import pkg from "../../../../../package.json";

const app = (programInfo, seoDictionary) => {
    let title = programInfo.title;

    let dictionary = seoDictionary.channel;

    if(dictionary && dictionary.default){
        title = title + "-" + dictionary.default;
    }

    title = `${title}線上看｜${pkg.siteName}`;

    return title;
};

export default app;
