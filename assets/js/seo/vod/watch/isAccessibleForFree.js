
const app = (programInfo) => {
    if(programInfo.charge_mode == "F"){
        return true;
    }

    return false;
};

export default app;
