
const app = (obj, programInfo) => {
    if(programInfo.off_shelf_date){
        let expires = programInfo.off_shelf_date;

        expires = expires.replace(/-/g, "/");
        expires = new Date(expires).toISOString();

        obj.expires = expires;
    }
};

export default app;
