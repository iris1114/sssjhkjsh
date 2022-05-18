
import api from "../../../api/index.js";

const app = (accountVar) => {
    let records = accountVar.data;

    if(records.length){
        let simplePrograms = new Array();

        for(let i = 0; i < records.length; i ++){
            let record = records[i];
            let simpleProgram = api.ccc.simpleProgramBySeries.getFetch(record);

            simplePrograms.push(simpleProgram);
        }

        return Promise.all(simplePrograms).then((results) => {
            let items = new Array();

            for(let i = 0; i < results.length; i ++){
                let simpleProgram = results[i];

                if(simpleProgram.result){
                    simpleProgram = simpleProgram.result.data;

                    let record = records[i];

                    for(let key in simpleProgram){
                        if(!record[key]){
                            record[key] = simpleProgram[key];
                        }
                    }

                    items.push(record);
                }
            }

            accountVar.data = items;

            return accountVar;
        });
    }
    else{
        return new Promise((resolve, reject) => {
            resolve(accountVar);
        });
    }
};

export default app;
