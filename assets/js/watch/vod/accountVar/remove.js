
const app = (accountVar, targets) => {
    if(!accountVar){
        return;
    }
    
    let items = accountVar.data;

    accountVar.data = items.filter((element) => {
        for(let i = 0; i < targets.length; i ++){
            let target = targets[i];

            if(element.series_id == target.series_id){
                return false;
            }
        }

        return true;
    });

    return accountVar;
};

export default app;
