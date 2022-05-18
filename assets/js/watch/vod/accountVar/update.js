
import api from "../../../api/index.js";

const app = (accountVar) => {
    return new Promise((resolve, reject) => {
        if(!accountVar){
            resolve(null);

            return;
        }
        
        let _accountVar = JSON.stringify(accountVar);

        _accountVar = encodeURIComponent(_accountVar);

        api.clientVarService.setAccountVar.getFetch(_accountVar).then((data) => {
            if(data.result){
                resolve(data.result);
            }
            else{
                resolve(null);
            }
        });
    });
};

export default app;
