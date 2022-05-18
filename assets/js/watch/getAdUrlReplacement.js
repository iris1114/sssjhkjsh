
const app = (programInfo, remoteIp, element) => {
    let result = new Array();
    let countries = new Array();
    let genres = new Array();

    if(programInfo.countries){
        for(let i = 0; i < programInfo.countries.length; i ++){
            let country = programInfo.countries[i];
            let group = country.group;

            if(group){
                countries.push(group);
            }
        }

        countries = countries.join(",");
    }
    
    if(programInfo.genres){
        for(let i = 0; i < programInfo.genres.length; i ++){
            let genre = programInfo.genres[i];
            let group = genre.group;

            if(group){
                genres.push(group);
            }
        }

        genres = genres.join(",");
    }

    result.push({target: new RegExp("%5Bcountries%5D", "ig"), newValue: encodeURIComponent(countries)});
    result.push({target: new RegExp("%5Bgenres%5D", "ig"), newValue: encodeURIComponent(genres)});
    result.push({target: new RegExp("\\[CONTENT_ID\\]", "ig"), newValue: encodeURIComponent(programInfo.content_id)});
    result.push({target: new RegExp("\\[device_make\\]", "ig"), newValue: encodeURIComponent(litv.config.projectNum)});
    result.push({target: new RegExp("\\[ifa\\]", "ig"), newValue: encodeURIComponent("")});
    result.push({target: new RegExp("\\[app_name\\]", "ig"), newValue: encodeURIComponent("")});
    result.push({target: new RegExp("\\[app_bundle\\]", "ig"), newValue: encodeURIComponent("")});

    if(element){
        let computedStyle = getComputedStyle(element);
        let width = parseInt(computedStyle.width);
        let height = parseInt(computedStyle.height);

        result.push({target: new RegExp("\\[player_width\\]", "ig"), newValue: encodeURIComponent(width)});
        result.push({target: new RegExp("\\[player_height\\]", "ig"), newValue: encodeURIComponent(height)});
    }

    if(litv.audienceId){
        result.push({target: new RegExp("\\[spotx_uid\\]", "ig"), newValue: encodeURIComponent(litv.audienceId)});
    }

    if(remoteIp){
        result.push({target: new RegExp("\\[IPADDRESS\\]", "ig"), newValue: encodeURIComponent(remoteIp)});
    }

    if(programInfo.content_type == "channel"){
        result.push({target: new RegExp("\\[CDN_CODE\\]", "ig"), newValue: encodeURIComponent(programInfo.CdnCode)});
    }
    else if(programInfo.content_type == "playout-channel"){
        let vodChannelSchedule = programInfo.vod_channel_schedule;
        let focusProgram = vodChannelSchedule.focus_program;

        result.push({target: new RegExp("\\[ASSET_ID\\]", "ig"), newValue: encodeURIComponent(focusProgram.asset_id)});
    }

    return result;
};

export default app;
