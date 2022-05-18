
const app = () => {
    gtag("config", litv.config.gtagIdMkt, {
        "send_page_view": false,
        "groups": "mktGroup"
    });
};

export default app;
