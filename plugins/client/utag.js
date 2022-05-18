
import tools from "../../assets/js/tools/index.js";

const app = () => {
    try{
        let url = "//t.ssp.hinet.net/utag.js";

        tools.importScript(url).then(() => {
            let partnerId = "3d711f";

            window.__hitagCmdQueue = window.__hitagCmdQueue || [];

            function hiball(){
                __hitagCmdQueue.push(arguments);
            };

            hiball("fire", partnerId);
            hiball("cm", partnerId, litv.puid);
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
