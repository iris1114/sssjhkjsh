
import api from "../../../api/index.js";
import def from "./default.js";

const app = () => {
    return new Promise((resolve, reject) => {
        api.clientVarService.getAccountVar.getFetch().then((data) => {
            let result = data.result;
            
            result = decodeURIComponent(result);
            result = JSON.parse(result);
            
            if(result && result.data){
                result.data = result.data.sort((a, b) => {
                    return parseInt(b.save) - parseInt(a.save);
                });

                resolve(result);
            }
            else{
                resolve(def);
            }
        }).catch((ex) => {
            console.log(ex.stack);

            resolve(def);
        });
    });
};

export default app;
