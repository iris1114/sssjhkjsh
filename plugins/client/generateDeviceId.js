
const app = () => {
    try{
        window.litv = window.litv || {};

        litv.deviceId = __NEXT_DATA__.props.deviceId;
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
