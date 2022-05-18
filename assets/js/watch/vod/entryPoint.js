
const app = (programInfo) => {
    if((!programInfo.group_id || programInfo.group_id == "0") && !programInfo.video_type){
        return true;
    }
    
    return false;
};

export default app;
