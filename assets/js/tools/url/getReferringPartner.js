
import tools from "../index.js";

const app = () => {
    let referringPartner = "";

    try{
        if(process.title == "browser"){
            referringPartner = tools.storage.session.getItem("referringPartner");
        }

        if(referringPartner){
            referringPartner = Buffer.from(referringPartner, "base64");
            referringPartner = referringPartner.toString("utf8");
        }

        return referringPartner;
    }
    catch(ex){
        console.log(ex.stack);
    }

    return referringPartner;
};

export default app;
