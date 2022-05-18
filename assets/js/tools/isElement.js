
const app = (element, target) => {
    if(element == target){
        return true;
    }

    while(element && element.tagName != "HTML"){
        element = element.parentNode;
        
        if(element == target){
            return true;
        }
    }

    return false;
};

export default app;
