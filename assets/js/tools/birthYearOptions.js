
const app = () => {
    let arr = new Array();
    let lastYear = new Date().getFullYear();
    let firstYeaar = lastYear - 100;

    arr.push({
        text: "",
        value: 0
    });

    for(let i = firstYeaar; i < lastYear; i ++){
        let text = "";

        if(i <= firstYeaar){
            text = `${i}及更早`;
        }
        else{
            text = i;
        }

        arr.push({
            text: text,
            value: i
        });
    }

    return arr;
};

export default app;
