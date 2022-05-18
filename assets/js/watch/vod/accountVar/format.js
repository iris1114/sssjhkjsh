
const app = (programInfo, time) => {
    let obj = {};

    obj.content_type = programInfo.content_type;
    obj.ed = false;

    if(!time){
        obj.ed = true;
    }

    obj.episode = programInfo.episode;
    obj.group_id = programInfo.group_id;
    obj.save = new Date().getTime();
    obj.season = programInfo.season;
    obj.series_id = programInfo.series_id;

    if(time){
        obj.time = parseInt(time);
    }
    else{
        obj.time = 0;
    }

    obj.video_type = programInfo.video_type;
    obj.content_id = programInfo.content_id;

    return obj;
};

export default app;
