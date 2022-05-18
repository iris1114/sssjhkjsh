
import getMidnight from "./getMidnight.js";

const oneDay = 1000 * 60 * 60 * 24;

const app = (date) => {
    const midnightTonight = getMidnight();
    const midnightTomorrow = new Date(midnightTonight.getTime() + oneDay);

    return date > midnightTonight && date < midnightTomorrow;
};

export default app;
