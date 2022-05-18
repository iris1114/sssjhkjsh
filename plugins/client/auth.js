
import api from "../../assets/js/api/index.js";
import store from "../../redux/store.js";

const app = () => {
    try{
        api.account.auth.getFetch().then((response) => {
            store.dispatch({
                type: "login", 
                value: response.result
            });
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
