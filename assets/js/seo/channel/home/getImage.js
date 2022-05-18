
const app = (banner) => {
    let items = new Array();

    if(banner){
        for(let i = 0; i < banner.length; i ++){
            let picture = banner[i].picture_s;
    
            items.push(picture);
        }
    }
    
    return items;
};

export default app;
