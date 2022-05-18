
const app = (query) => {
    return `https://www.litv.tv/search?query=${encodeURIComponent(query)}`;
};

export default app;
