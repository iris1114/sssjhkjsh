
import Meta from "./meta.js";

export default class{
    constructor (){
        this.streamingTag = new ns_.StreamingTag({
            customerC2: litv.config.comscoreId
        });
    }

    onPrerollAd (dur = 30){
        dur = dur * 1000;

        this.streamingTag.playVideoAdvertisement({
            ns_st_cl: dur
        }, ns_.StreamingTag.AdType.LinearOnDemandPreRoll);
    }

    onMidrollAd (dur = 30){
        dur = dur * 1000;

        this.streamingTag.playVideoAdvertisement({
            ns_st_cl: dur
        }, ns_.StreamingTag.AdType.LinearOnDemandMidRoll);
    }

    onPostrollAd (dur = 30){
        dur = dur * 1000;

        this.streamingTag.playVideoAdvertisement({
            ns_st_cl: dur
        }, ns_.StreamingTag.AdType.LinearOnDemandPostRoll);
    }

    onLiveAd (dur = 30){
        dur = dur * 1000;

        this.streamingTag.playVideoAdvertisement({
            ns_st_cl: dur
        }, ns_.StreamingTag.AdType.LinearLive);
    }

    onOtherAd (dur = 30){
        dur = dur * 1000;

        this.streamingTag.playVideoAdvertisement({
            ns_st_cl: dur
        }, ns_.StreamingTag.AdType.Other);
    }

    onLive (meta){
        this.streamingTag.playVideoContentPart({
            ns_st_st: meta.station,
			ns_st_pu: meta.publisher,
			ns_st_pr: meta.program,
			ns_st_ep: meta.episodeTitle,
			ns_st_sn: meta.season,
			ns_st_en: meta.episode,
			ns_st_ge: meta.genre,
			ns_st_ti: meta.tmsId,
			ns_st_ddt: meta.digitalAirDate,
			ns_st_tdt: meta.tvAirDate,
			ns_st_ci: meta.assetId,
			ns_st_cl: meta.clipLength,
			ns_st_ia: meta.adFlag,
			ns_st_ce: meta.completeEpisode,
			c3: meta.c3,
			c4: meta.c4,
			c6: meta.c6	
        }, ns_.StreamingTag.ContentType.Live);
    }

    onVOD (meta){
        this.streamingTag.playVideoContentPart({
            ns_st_st: meta.station,
			ns_st_pu: meta.publisher,
			ns_st_pr: meta.program,
			ns_st_ep: meta.episodeTitle,
			ns_st_sn: meta.season,
			ns_st_en: meta.episode,
			ns_st_ge: meta.genre,
			ns_st_ti: meta.tmsId,
			ns_st_ddt: meta.digitalAirDate,
			ns_st_tdt: meta.tvAirDate,
			ns_st_ci: meta.assetId,
			ns_st_cl: meta.clipLength,
			ns_st_ia: meta.adFlag,
			ns_st_ce: meta.completeEpisode,
			c3: meta.c3,
			c4: meta.c4,
			c6: meta.c6	
        }, ns_.StreamingTag.ContentType.LongFormOnDemand)
    }

    onBumper (meta){
        this.streamingTag.playVideoContentPart({
            ns_st_st: meta.station,
			ns_st_pu: meta.publisher,
			ns_st_pr: meta.program,
			ns_st_ep: meta.episodeTitle,
			ns_st_sn: meta.season,
			ns_st_en: meta.episode,
			ns_st_ge: meta.genre,
			ns_st_ti: meta.tmsId,
			ns_st_ddt: meta.digitalAirDate,
			ns_st_tdt: meta.tvAirDate,
			ns_st_ci: meta.assetId,
			ns_st_cl: meta.clipLength,
			ns_st_ia: meta.adFlag,
			ns_st_ce: meta.completeEpisode,
			c3: meta.c3,
			c4: meta.c4,
			c6: meta.c6	
        }, ns_.StreamingTag.ContentType.Bumper);
    }

    onOther (meta){
        this.streamingTag.playVideoContentPart({
            ns_st_st: meta.station,
			ns_st_pu: meta.publisher,
			ns_st_pr: meta.program,
			ns_st_ep: meta.episodeTitle,
			ns_st_sn: meta.season,
			ns_st_en: meta.episode,
			ns_st_ge: meta.genre,
			ns_st_ti: meta.tmsId,
			ns_st_ddt: meta.digitalAirDate,
			ns_st_tdt: meta.tvAirDate,
			ns_st_ci: meta.assetId,
			ns_st_cl: meta.clipLength,
			ns_st_ia: meta.adFlag,
			ns_st_ce: meta.completeEpisode,
			c3: meta.c3,
			c4: meta.c4,
			c6: meta.c6	
        }, ns_.StreamingTag.ContentType.Other);
    }

    onStop (){
        this.streamingTag.stop();
    }

    onContentLive (programInfo){
        let meta = new Meta();

        if(programInfo.content_type == "channel"){
            meta.station = "litv";
            
            if(programInfo.title){
                meta.publisher = programInfo.title;
            }
            /*
            if(Array.isArray(programInfo.provider) && programInfo.provider[0]){
                if(programInfo.provider[0].name){
					meta.publisher = programInfo.provider[0].name;
				}
            }
            */
            if(Array.isArray(programInfo.Schedule) && programInfo.Schedule[0]){
                if(programInfo.Schedule[0].program){
                    if(programInfo.Schedule[0].program.Title){
                        meta.program = programInfo.Schedule[0].program.Title;
                    }

                    if(programInfo.Schedule[0].program.SubTitle){
                        meta.episodeTitle = programInfo.Schedule[0].program.SubTitle;
                    }
                }
            }

            if(Array.isArray(programInfo.Categoryies) && programInfo.Categories[0]){
                if(programInfo.Categories[0].Name){
                    meta.genre = programInfo.Categories[0].Name;
                }
            }

            meta.assetId = programInfo.content_id;
            meta.completeEpisode = "1";
            meta.c3 = programInfo.content_type;
        }
        else if(programInfo.content_type == "vod-channel" || programInfo.content_type == "playout-channel"){
            meta.station = "litv";
            //meta.publisher = programInfo.title;
            
            if(Array.isArray(programInfo.provider) && programInfo.provider[0]){
                if(programInfo.provider[0].name){
					meta.publisher = programInfo.provider[0].name;
				}
            }
            
            let vodChannelSchedule = programInfo.vod_channel_schedule;

            meta.program = vodChannelSchedule.focus_program.title;
            meta.episodeTitle = vodChannelSchedule.focus_program.subtitle;
            meta.genre = programInfo.genres[0].name;
            meta.assetId = vodChannelSchedule.focus_program.content_id;
            meta.completeEpisode = "1";
            meta.c3 = programInfo.content_type;
        }
        
        this.onLive(meta);
    }

    onContentVod (programInfo){
        let meta = new Meta();

        if(programInfo.content_id){
            let videoMillisecond = programInfo.length * 60 * 1000;

			if(!videoMillisecond || isNaN(videoMillisecond)){
				videoMillisecond = 30000;
			}

            meta.clipLength = videoMillisecond;
			meta.station = "litv";

			if(programInfo.provider && programInfo.provider.name){
				meta.publisher = programInfo.provider.name;
			}

			meta.program = programInfo.title;

			if(programInfo.secondary_mark){
				meta.episodeTitle = programInfo.secondary_mark;
			}

			if(programInfo.season){
				meta.season = programInfo.season;
			}

			meta.episode = programInfo.episode;

			if(programInfo.genres && programInfo.genres[0]){
                if(programInfo.genres[0].name){
                    meta.genre = programInfo.genres[0].name;
                }
			}

			meta.assetId = programInfo.content_id;

			if(programInfo.video_type == "F"){
				meta.completeEpisode = "1";
			}

			meta.c3 = programInfo.content_type;
        }
        else if(programInfo.asset_id){
            meta.station 			= "LiTV";
			meta.publisher 			= "LiTV";
			meta.assetId 			= programInfo.asset_id;
			meta.clipLength 		= 0;
        }
        
        this.onVOD(meta);
    }
};