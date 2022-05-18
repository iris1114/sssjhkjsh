
import Router from "next/router";

import tools from "../../assets/js/tools/index.js";
import beacon from "../../assets/js/beacon/index.js";

const app = () => {
    try{
        let url = "https://sb.scorecardresearch.com/beacon.js";

        tools.importScript(url).then(() => {
            beacon();

            Router.events.on("routeChangeComplete", (url) => {
                beacon();
            });
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
