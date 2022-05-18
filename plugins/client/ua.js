
const app = () => {
    try{
        window.litv = window.litv || {};

        litv.ua = __NEXT_DATA__.props.ua;
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
