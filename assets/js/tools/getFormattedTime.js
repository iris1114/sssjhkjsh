
const app = (seconds) => {
    let date = new Date(null);

    date.setSeconds(seconds);

    let timeString = date.toISOString().substr(11, 8);

    return timeString;
};

export default app;