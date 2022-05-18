
const app = (programInfo) => {    
    let keywords = new Array();

    keywords.push(programInfo.title);

    if(programInfo.season_name){
        keywords.push(programInfo.season_name);
    }
    
    if(programInfo.secondary_mark){
        keywords.push(programInfo.secondary_mark);
    }

    if(programInfo.credits){
        let credits = programInfo.credits;

        for(let i = 0; i < credits.length; i ++){
            let credit = credits[i];
            let list = credit.list;

            for(let j = 0; j < list.length; j ++){
                let item = list[j];

                keywords.push(item.name);
            }
        }
    }
    
    if(programInfo.genres){
        let genres = programInfo.genres;

        for(let i = 0; i < genres.length; i ++){
            let genre = genres[i];

            if(keywords.indexOf(genre.name) == -1){
                keywords.push(genre.name);
            }
        }
    }
    
    return keywords.join(",");
};

export default app;
