
const app = {
    local: {
        setItem (key, value){
            try{
                localStorage.setItem(key, value);
            }
            catch(ex){
                console.log(ex.stack);
            }
        },
        getItem (key){
            try{
                return localStorage.getItem(key);
            }
            catch(ex){
                console.log(ex.stack);
            }

            return null;
        },
        removeItem (key){
            try{
                return localStorage.removeItem(key);
            }
            catch(ex){
                console.log(ex.stack);
            }
        }
    },
    session: {
        setItem (key, value){
            try{
                sessionStorage.setItem(key, value);
            }
            catch(ex){
                console.log(ex.stack);
            }
        },
        getItem (key){
            try{
                return sessionStorage.getItem(key);
            }
            catch(ex){
                console.log(ex.stack);
            }

            return null;
        },
        removeItem (key){
            try{
                return sessionStorage.removeItem(key);
            }
            catch(ex){
                console.log(ex.stack);
            }
        }
    }
};

export default app;
