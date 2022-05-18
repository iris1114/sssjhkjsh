
const app = (event) => {
    let posX = 0;
    let posY = 0;
    
    if(!event){
        event = window.event || window.Event;
    } 
    
    if (event.pageX || event.pageY){
        posX = event.pageX;
        posY = event.pageY;
    }
    else if(event.clientX || event.clientY){//for fucking IE
        posX = event.clientX + document.documentElement.scrollLeft;
        posY = event.clientY + document.documentElement.scrollTop;
    }

    return {left: posX, top: posY};//posx posy就是游標的X,Y值了
};

export default app;