
import Router from "next/router";

import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";
import store from "../../redux/store.js";

const app = () => {
    try{
        let unSubscribeDialogClose = null;

        let routeChangeComplete = {
            result: null,
            handler (){
                promptDialog(routeChangeComplete.result);
            }
        };

        let unSubscribeReady = store.subscribe(() => {
            if(store.getState().ready){
                unSubscribeReady();

                api.fino.mktDialog.getFetch().then((result) => {
                    if(result && result.title){
                        if(checkTime(result) && checkHref(result) && checkExpird(result)){
                            promptDialog(result);
                        }
                        else if(checkTime(result) && !checkHref(result) && checkExpird(result)){
                            routeChangeComplete.result = result;
                            
                            Router.events.off("routeChangeComplete", routeChangeComplete.handler);
                            Router.events.on("routeChangeComplete", routeChangeComplete.handler);
                        }
                    }
                });
            }
        });

        let checkTime = (result) => {
            let startTime = new Date(result.start_time).getTime();
            let endTime = new Date(result.end_time).getTime();
            let now = new Date().getTime();

            if(now >= startTime && now <= endTime){
                return true;
            }

            return false;
        };

        let checkHref = (result) => {
            let excludes = result.exclude;
            let router = store.getState().router;

            if(excludes.indexOf(router.pathname) != -1){
                return false;
            }

            return true;
        };

        let checkExpird = (result) => {
            let now = new Date().getTime();
            let time = tools.storage.local.getItem("mkt_dialog_time");
            let count = tools.storage.local.getItem("mkt_dialog_count");

            if(!time || !count){
                return true;
            }
            else{
                time = parseInt(time);
                count = parseInt(count);

                let _now = new Date(now);
                let _time = new Date(time);
                let interval = _now - _time;

                if(checkSameDay(_now, _time)){
                    if(interval >= result.interval){
                        if(count < result.count){
                            return true;
                        }
                    }
                }
                else{
                    if(interval >= result.interval){
                        tools.storage.local.setItem("mkt_dialog_count", 0);

                        return true;
                    }
                }

                return false;
            }
        };

        let checkSameDay = (now, time) => {
            if(now.getFullYear() == time.getFullYear()){
                if(now.getMonth() == time.getMonth()){
                    if(now.getDate() == time.getDate()){
                        return true;
                    }
                }
            }

            return false;
        };

        let saveTime = () => {
            let now = new Date().getTime();
            let count = tools.storage.local.getItem("mkt_dialog_count");

            if(!count){
                count = 0;
            }

            count = parseInt(count);
            count = count + 1;

            tools.storage.local.setItem("mkt_dialog_time", now);
            tools.storage.local.setItem("mkt_dialog_count", count);
        };

        let promptDialog = (result) => {
            store.dispatch({
                type: "dialog",
                value: {
                    component: "mkt",
                    information: result
                }
            });

            dialogCloseHandler(result);
        };

        let dialogCloseHandler = (result) => {
            if(unSubscribeDialogClose){
                unSubscribeDialogClose();
            }

            let oComponent = store.getState().dialog.component;

            unSubscribeDialogClose = store.subscribe(() => {
                let nComponent = store.getState().dialog.component

                if(oComponent != nComponent){
                    if(!nComponent && oComponent == "mkt"){
                        unSubscribeDialogClose();
                        Router.events.off("routeChangeComplete", routeChangeComplete.handler);
                        saveTime();
                    }
                    else if(nComponent && oComponent == "mkt"){
                        unSubscribeDialogClose();

                        routeChangeComplete.result = result;

                        Router.events.off("routeChangeComplete", routeChangeComplete.handler);
                        Router.events.on("routeChangeComplete", routeChangeComplete.handler);
                    }

                    oComponent = nComponent;
                }
            });
        };
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
