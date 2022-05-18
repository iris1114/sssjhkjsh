
const app = (structuredObject, programInfo) => {
    let credits = programInfo.credits;
    let actors = new Array();

    for(let i = 0; i < credits.length; i ++){
        let credit = credits[i];
        
        if(credit.type == "actor" || credit.type == "hosts" || credit.type == "guest"){
            let list = credit.list;

            for(let j = 0; j < list.length; j ++){
                let item = list[j];

                actors.push(item.name);
            }
        }
    }

    if(actors.length > 0){
        structuredObject.actor = new Array();

        for(let i = 0; i < actors.length; i ++){
            let actor = actors[i];

            structuredObject.actor.push({
                "@type": "Person",
                "name": actor
            });
        }
    }
};

export default app;
