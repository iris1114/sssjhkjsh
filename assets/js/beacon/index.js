
let count = 0;
let retryTimeout = null;

const app = () => {
    try{
        COMSCORE.beacon({
            c1: 2,
            c2: litv.config.comscoreId
        });
    }
    catch(ex){
        console.log(ex.stack);

        if(typeof COMSCORE == "undefined" && count <= 5){
            count ++;
            clearTimeout(retryTimeout);

            retryTimeout = setTimeout(() => {
                app();
            }, 500);
        }
    }
};

export default app;
