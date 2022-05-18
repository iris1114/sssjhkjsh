
import getMidnight from "./getMidnight.js";

const oneDay = 1000 * 60 * 60 * 24;

const app = (date) => {
    const midnightTonight = getMidnight();
    const midnightYesterday = new Date(midnightTonight.getTime() - oneDay);

    return date < midnightTonight && date > midnightYesterday;
};

export default app;
