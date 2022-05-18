
import api from "../../assets/js/api/index.js";
import store from "../../redux/store.js";

const app = () => {
    try{
        let login = store.getState().login;

        store.subscribe(() => {
            let _login = store.getState().login;
            
            if(login != _login){
                login = _login;

                if(login){
                    store.dispatch({
                        type: "loading", 
                        value: true
                    });

                    api.account.info.getFetch().then((response) => {
                        store.dispatch({
                            type: "accountInfo", 
                            value: response.result
                        });

                        store.dispatch({
                            type: "loading", 
                            value: false
                        });
                    }).then(() => {
                        api.pusti.uid.getFetch().then((response) => {
                            if(response.result){
                                let result = response.result;

                                result.advertisement_token = result.advertising_token;

                                if(typeof __uid2 != "undefined"){
                                    __uid2.init({
                                        identity: result
                                    });
                                }                                
                            }
                        });
                    });
                }
                else{
                    store.dispatch({
                        type: "accountInfo", 
                        value: null
                    });

                    store.dispatch({
                        type: "loading", 
                        value: true
                    });

                    api.account.logout.getFetch().then((response) => {
                        store.dispatch({
                            type: "loading", 
                            value: false
                        });
                    });

                    if(typeof __uid2 != "undefined"){
                        __uid2.disconnect();
                    }
                }
            }
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
