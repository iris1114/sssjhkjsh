
const app = () => {
    try{
        window.litv = window.litv || {};

        litv.config = __NEXT_DATA__.props.config;
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
