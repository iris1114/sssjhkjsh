
const app = () => {
    const date = new Date();

    date.setMilliseconds(999);
    date.setSeconds(59);
    date.setMinutes(59);
    date.setHours(23);

    return date;
};

export default app;