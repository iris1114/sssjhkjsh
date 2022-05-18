
const app = (programInfo) => {
    let duration = programInfo.film_length;

    if(!duration || duration == "0"){
        duration = "PT30S";
    }
    else{
        duration = `PT${duration}M`;
    }

    return duration;
};

export default app;
