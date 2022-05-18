
const app = () => {
    let config = litv.config;
    let index = Math.floor(Math.random() * config.bsmApiServer.length);
    let url = config.bsmApiServer[index];

    return url;
};

export default app;
