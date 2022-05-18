
import format from "./format.js";
import limit from "./limit.js";

const app = (accountVar, args) => {
    if(!accountVar){
        return;
    }
    
    let programInfo = args.programInfo;
    let time = args.time;
    let items = accountVar.data;

    accountVar.data = items.filter((element) => {
        if(element.series_id == programInfo.series_id){
            return false;
        }

        return true;
    });

    programInfo = format(programInfo, time);

    accountVar.data.unshift(programInfo);

    return limit(accountVar);
};

export default app;
