
const app = (query) => {    
    return `https://m.litv.tv/search?query=${encodeURIComponent(query)}`;
};

export default app;
