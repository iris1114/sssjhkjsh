
const app = () => {
    try{
        window.litv = window.litv || {};

        litv.publicIp = __NEXT_DATA__.props.publicIp;
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
