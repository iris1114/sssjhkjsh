
//設定為當月1號
const app = () => {
    let dateObject = new Date();

    dateObject.setDate(1);
    dateObject.setHours(0);
    dateObject.setMinutes(0);
    dateObject.setSeconds(0);
    dateObject.setMilliseconds(0);
    
    return dateObject.toISOString();
};

export default app;
