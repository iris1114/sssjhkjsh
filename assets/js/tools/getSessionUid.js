
const app = () => {
    let sessionUid = "";
    let dateISO = new Date().toISOString().replace(/[-:.TZ]/g, "");
    let random = Math.random().toString(36).substring(2);

    sessionUid = dateISO + random;

    return sessionUid;
};

export default app;
