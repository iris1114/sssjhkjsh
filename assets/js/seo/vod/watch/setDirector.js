
const app = (structuredObject, programInfo) => {
    let credits = programInfo.credits;
    let directors = new Array();

    for(let i = 0; i < credits.length; i ++){
        let credit = credits[i];
        
        if(credit.type == "director"){
            let list = credit.list;

            for(let j = 0; j < list.length; j ++){
                let item = list[j];

                directors.push(item.name);
            }
        }
    }

    if(directors.length > 0){
        structuredObject.director = new Array();

        for(let i = 0; i < directors.length; i ++){
            let director = directors[i];

            structuredObject.director.push({
                "@type": "Person",
                "name": director
            });
        }
    }
};

export default app;
