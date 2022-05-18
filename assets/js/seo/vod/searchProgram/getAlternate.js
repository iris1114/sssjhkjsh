
const app = (searchProgram, request) => {
    let contentType = searchProgram.content_type;

    for(let key in request){
        if(request[key]){
            if(key == "categoryId"){
                return `https://m.litv.tv/${contentType}/searchProgram?categoryId=${request[key]}`;
            }
            else if(key == "releaseYear"){
                return `https://m.litv.tv/${contentType}/searchProgram?releaseYear=${request[key]}`;
            }
            else if(key == "countryId"){
                return `https://m.litv.tv/${contentType}/searchProgram?countryId=${request[key]}`;
            }
            else if(key == "genreId"){
                return `https://m.litv.tv/${contentType}/searchProgram?genreId=${request[key]}`;
            }
        }
    }

    return "https://m.litv.tv";
};

export default app;
