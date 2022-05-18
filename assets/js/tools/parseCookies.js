
const app = (req) => {
    let list = {};
    let rc = req.headers.cookie;

    if(rc){
        rc.split(";").forEach((cookie) => {
            let parts = cookie.split("=");

            list[parts.shift().trim()] = decodeURI(parts.join("="));
        });
    }

    return list;
};

export default app;
