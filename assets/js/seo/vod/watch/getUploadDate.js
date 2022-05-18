
const app = (programInfo) => {
    let firstEnabledDate = programInfo.first_enabled_date;
    let dateObject = null;

    if(!firstEnabledDate){
        //設定為當月1號
        let dateObject = new Date();

        dateObject.setDate(1);
        dateObject.setHours(0);
        dateObject.setMinutes(0);
        dateObject.setSeconds(0);
        dateObject.setMilliseconds(0);
        
        return dateObject.toISOString();
    }
    
    dateObject = firstEnabledDate.replace(/-/g, "/");
    dateObject = new Date(dateObject).toISOString();
    
    return dateObject;
};

export default app;
