
const app = (programInfo, episodes) => {
    let target = null;
    let programList = episodes.program_list;

    for(let i = 0; i < programList.length; i ++){
        let item = programList[i];

        if(item.content_id == programInfo.content_id){
            target = programList[i + 1];

            break;
        }
    }

    if(target){
        return target;
    }

    return null;
};

export default app;