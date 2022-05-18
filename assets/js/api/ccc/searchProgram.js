
import serverUrl from "../../server/index.js";

const getRequest = (req) => {
    let config = litv.config;

    let url = serverUrl.proxyServer();

    let obj = {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 8,
            "method": "CCCService.SearchProgram",
            "params": {
                "version": "2.0",
                "device_id": litv.deviceId,
                "content_type": "[movie]",
                "category_id": "[124 (optional)]",
                "release_year": "[2018 (optional)]",
                "country_id": "[US (optional)]",
                "genre_id": "[29 (optional)]",
                "group_id": "[root (option)]",
                "person_id": "[??? (option)]",
                "area_id": "[??? (option)]",
                "direction": "[??? (option)]",
                "board": "[top (optional)]",
                "limit": "[10 (optional)]",
                "column": "[on_shelf_date (optional)]",
                "project_num": config.projectNum,
                "swver": config.swver
            }
        })
    };

    let body = JSON.parse(obj.body);
    let params = body.params;

    params.content_type = req.contentType
    params.category_id = req.categoryId
    params.release_year = req.releaseYear
    params.country_id = req.countryId
    params.genre_id = req.genreId
    params.group_id = req.groupId
    params.board = req.board
    params.limit = req.limit

    delete params.person_id;
    delete params.area_id;
    delete params.direction;
    delete params.column;

    obj.body = JSON.stringify(body);

    return {
        url: url,
        obj: obj
    };
};

const getFetch = (req) => {
    let request = getRequest(req);
    
    return fetch(request.url, request.obj).then((response) => {
        return response.json();
    }).catch((err) => {
        throw err;
    });
};

const app = {
    getRequest: getRequest,
    getFetch: getFetch
};

export default app;
