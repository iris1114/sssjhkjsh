
const app = () => {
    try{
        if(history.scrollRestoration){
            history.scrollRestoration = "manual";
        }

        addEventListener("popstate", () => {
            scroll({
                top: 0,
                left: 0
            });
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
