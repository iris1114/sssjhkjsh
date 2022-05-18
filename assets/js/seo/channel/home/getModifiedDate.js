
//設定為星期五00:00:00
const app = () => {
    let dateObject = new Date();

    dateObject.setHours(0);
    dateObject.setMinutes(0);
    dateObject.setSeconds(0);
    dateObject.setMilliseconds(0);

    let day = dateObject.getDay();
    
    if(day > 5){
        let gap = day - 5;
        let minus = gap * 24 * 60 * 60 * 1000;
        let time = dateObject.getTime() - minus;

        dateObject = new Date(time);
    }
    else if(day < 5){
        let gap = 7 - 5 + day;
        let minus = gap * 24 * 60 * 60 * 1000;
        let time = dateObject.getTime() - minus;

        dateObject = new Date(time);
    }
    
    return dateObject.toISOString()
};

export default app;
