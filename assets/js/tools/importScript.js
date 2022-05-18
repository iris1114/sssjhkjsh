
const app = (url) => {
    return new Promise((resolve, reject) => {
        let timeout = null;
        let body = document.getElementsByTagName("body")[0];
        let js = document.createElement("script");

        js.type = "text/javascript";
        js.src = url;

        js.onreadystatechange = () => {
            clearTimeout(timeout);
            resolve(true);
        };

        js.onload = () => {
            clearTimeout(timeout);
            resolve(true);
        };

        js.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
        };

        timeout = setTimeout(() => {
            resolve(false);
        }, 5000);

        body.appendChild(js);
    });
};

export default app;
