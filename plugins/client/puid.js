
import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";

const app = () => {
    try{
        window.litv = window.litv || {};

        let init = () => {
            let puid = tools.storage.local.getItem("puid");

            if(!puid){
                getPuid("");
            }
            else{
                puid = JSON.parse(puid);

                let time = puid.time + 2 * 60 * 60 * 1000;
                let now = new Date().getTime();

                if(time <= now){
                    getPuid(puid.id);
                }
                else{
                    litv.puid = puid.id;

                    trackCustom();
                    fetPixel(puid.id);
                    api.taiwanmedia.luid.getFetch(puid.id);
                }
            }
        };

        let getPuid = (puid) => {
            api.pusti.puid.getFetch(puid).then((res) => {
                let result = res.result;

                if(result && result.puid){
                    let obj = {
                        id: result.puid,
                        time: new Date().getTime()
                    };

                    litv.puid = obj.id;
                    
                    trackCustom();
                    fetPixel(obj.id);
                    api.taiwanmedia.luid.getFetch(obj.id);
                    tools.storage.local.setItem("puid", JSON.stringify(obj));
                }
            });
        };

        let trackCustom = () => {
            api.pusti.queryAds.getFetch().then((res) => {
                if(Array.isArray(res) && res.length){
                    for(let i = 0; i < res.length; i ++){
                        fbq("trackCustom", "ViewAd", {
                            "campaign": res[i].campaign,
                            "ad_event": res[i].ad_event
                        });
                    }
                }
            });
        };

        let fetPixel = (puid) => {
            let src = `https://e2elog.fetnet.net/CM/ce?ad_id=${puid}&chnl=litv`;
            let style = "width:1px; height:1px; display:none;";

            tools.importImage(src, style);
        };

        init();
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
