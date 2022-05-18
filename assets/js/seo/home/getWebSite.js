
const app = () => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://www.litv.tv",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.litv.tv/search?query={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
