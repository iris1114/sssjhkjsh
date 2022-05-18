
import api from "../../../api/index.js";

const app = (accountVar) => {
    return new Promise((resolve, reject) => {
        api.clientVarService.globalVarNoAuth.getFetch().then((data) => {
            let result = data.result;
            let amount = parseInt(result);
            
            accountVar.data = accountVar.data.slice(0, amount);

            resolve(accountVar);
        });
    });
    /*
    accountVar.data = accountVar.data.slice(0, 35);

    return accountVar;
    */
};

export default app;
