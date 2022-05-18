
const app = (permission) => {
    gtag("event", "permission", {
        "event_category": "oneSignal",
        "event_label": permission
    }); 
};

export default app;
