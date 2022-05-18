
const app = () => {
    let config = litv.config;
    let index = Math.floor(Math.random() * config.bsmServer.length);
    let url = config.bsmServer[index];

    return url;
};

export default app;
