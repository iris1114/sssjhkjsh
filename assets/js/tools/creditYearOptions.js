
const app = () => {
    let arr = new Array();
    let firstYeaar = new Date().getFullYear();
    let lastYear = firstYeaar + 16;

    for(let i = firstYeaar; i < lastYear; i++){
        let text = i;

        text = text.toString();

        arr.push({
            text: text,
            value: text
        });
    }

    return arr;
};

export default app;
