
const app = () => {
    let config = litv.config;
    let index = Math.floor(Math.random() * config.proxyServer.length);
    let url = config.proxyServer[index];

    return url;
};

export default app;
