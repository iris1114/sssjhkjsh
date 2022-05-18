
const app = (src, style) => {
    let body = document.getElementsByTagName("body")[0];
    let img = document.createElement("img");

    img.src = src;

    if(style){
        img.style = style;
    }

    body.appendChild(img);
};

export default app;
