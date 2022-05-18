
const getRequest = (GroupId) => {
    return {
        url: "/api/packageInfo",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                GroupId: GroupId
            })
        }
    };
};

const getFetch = (GroupId) => {
    let request = getRequest(GroupId);

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
