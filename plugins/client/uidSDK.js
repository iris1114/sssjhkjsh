
import tools from "../../assets/js/tools/index.js";

const app = () => {
    try{
        let url = "https://integ.uidapi.com/static/js/uid2-sdk-0.0.1a.js";

        tools.importScript(url).then(() => {});
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
