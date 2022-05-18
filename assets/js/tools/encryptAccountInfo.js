
const app = (User) => {
    let str = "";

    for(let i = 0; i < User.length; i ++){
        if(i >= 4 && i <= 6){
            str += "*";
        }
        else{
            str += User[i];
        }
    }

    return str;
};

export default app;
