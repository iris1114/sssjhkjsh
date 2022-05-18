
const app = () => {
    let date = new Date();

    date.setDate(24);
    date.setFullYear(2019);
    date.setHours(0);
    date.setMilliseconds(0);
    date.setMinutes(0);
    date.setMonth(9);
    date.setSeconds(0);
    
    return date.toISOString();
};

export default app;
