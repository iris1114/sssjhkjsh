
import extend from "extend";
import _ from "lodash";

import entryPoint from "../entryPoint.js";
import api from "../../../api/index.js";

const app = (accountVar, programInfo) => {
    return new Promise((resolve, reject) => {
        if(accountVar){
            let target = null;
            let items = _.cloneDeep(accountVar.data);

            if(entryPoint(programInfo)){
                for(let i = 0; i < items.length; i ++){
                    let item = items[i];
    
                    if(item.series_id == programInfo.series_id){
                        target = item;

                        break;
                    }
                }
            }
            else{
                for(let i = 0; i < items.length; i ++){
                    let item = items[i];
    
                    if(item.series_id == programInfo.series_id && item.season == programInfo.season && item.episode == programInfo.episode && item.video_type == programInfo.video_type && item.group_id == programInfo.group_id){
                        target = item;

                        break;
                    }
                }
            }
            
            if(target){
                api.ccc.simpleProgramBySeries.getFetch(target).then((data) => {
                    let result = data.result;

                    result = result.data;
                    
                    extend(target, result);
                    resolve(target);
                });
            }
            else{
                resolve(null);
            }
        }
        else{
            resolve(null);
        }
    });
};

export default app;
