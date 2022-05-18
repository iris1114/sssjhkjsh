
const app = () => {
    gtag("config", litv.config.gtagIdMkt, {
        "linker": {
            "domains": ["www.litv.tv"],
            "accept_incoming": true
        }
    });
};

export default app;
