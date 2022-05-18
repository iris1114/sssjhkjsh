
const app = () => {
    gtag("config", litv.config.gtagId, {
        "page_location": location.href
    });
};

export default app;
