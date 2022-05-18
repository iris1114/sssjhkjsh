
const app = () => {
    let arr = new Array();
    let month = 12

    for(let i = 1; i <= month; i ++){
        let text = "";

        if(i < 10){
            text = `0${i}`;
        }
        else{
            text = i;
        }

        text = text.toString();

        arr.push({
            text: text,
            value: text
        });
    }

    return arr;
};

export default app;