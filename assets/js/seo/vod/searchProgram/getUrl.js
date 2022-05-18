
const app = (searchProgram, request) => {
    let contentType = searchProgram.content_type;
    let queries = new Array();

    for(let key in request){
        if(request[key]){
            let query = `${key}=${request[key]}`;

            queries.push(query);
        }
    }

    queries = queries.join("&");

    return `https://www.litv.tv/${contentType}/searchProgram?${queries}`;
};

export default app;
