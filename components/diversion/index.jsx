
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import pageTypes from "../../assets/json/content/pageTypes.json";

import tools from "../../assets/js/tools/index.js";
import api from "../../assets/js/api/index.js";
import watch from "../../assets/js/watch/index.js";
import channel from "../../assets/js/channel/index.js";
import beacon from "../../assets/js/beacon/index.js";
import gtag from "../../assets/js/gtag/index.js";

import Player from "./player.jsx";
import Banner from "./banner.jsx";
import Featured from "./featured/index.jsx";
import Rank from "./rank/index.jsx";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        mask: state.channel.watch.mask,
        featured: state.diversion.featured,
        rank: state.diversion.rank,
        vodProgramInfo: state.vod.watch.programInfo,
        channelProgramInfo: state.channel.watch.programInfo,
        vodProgramInfoByRelatedProgram: state.vod.watch.programInfoByRelatedProgram
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const [playerProgramInfo, setPlayerProgramInfo] = useState(null);
    const [relatedProgram, setRelatedProgram] = useState(null);
    const [episodes, setEpisodes] = useState(null);
    const [channelMeta, setChannelMeta] = useState(null);
    const [channelIntroduction, setChannelIntroduction] = useState(null);
    const [scheduleAllWithMediumPrograms, setScheduleAllWithMediumPrograms] = useState(null);
    const [stationCategories, setStationCategories] = useState(null);
    const [refreshChannelMetaInterval, setRefreshChannelMetaInterval] = useState(null);

    const prePlayerProgramInfo = tools.hook.usePrevious(playerProgramInfo);

    const playerDisplay = useMemo(() => {
        if(pageType == "vod" && playerProgramInfo){
            let scheduleInfo = playerProgramInfo.schedule_info;
            let startTime = scheduleInfo.start_time;

            if(startTime){
                let now = new Date().getTime();

                if(now < startTime * 1000){
                    return false;
                }
            }
        }

        return true;
    }, [pageType, playerProgramInfo]);

    const pageType = useMemo(() => {
        if(playerProgramInfo){
            let contentType = playerProgramInfo.content_type;
            let _pageType = pageTypes[contentType];

            return _pageType;
        }

        return null;
    }, [playerProgramInfo]);

    const startByDefault = useCallback(() => {
        let contents = props.diversionMeta.content;
        
        for(let i = 0; i < contents.length; i ++){
            let content = contents[i];

            if(content.type == "featured"){
                let metas = content.meta;

                for(let j = 0; j < metas.length; j ++){
                    let meta = metas[j];
                    let lists = meta.list;

                    for(let k = 0; k < lists.length; k ++){
                        let list = lists[k];
                        let _pageType = pageTypes[list.content_type];

                        if(_pageType == "vod"){
                            startByVod(list.content_id);
                        }
                        else if(_pageType == "channel"){
                            startByChannel(list.content_id);
                        }
                        else{
                            redirectToHome();
                        }

                        return;
                    }
                }
            }
        }
    }, [props.diversionMeta]);

    const redirectToHome = useCallback(() => {
        router.push("/");
    }, []);

    const startByVod = useCallback((contentId) => {
        props.dispatchLoading(true);

        api.ccc.programInfo.getFetch(contentId).then((res) => {
            let result = res.result;
            let data = result.data;

            startByProgramInfo(data);
            setRelatedProgramByCallback(data);
            setEpisodesByCallback(data);
        });
    }, []);

    const startByProgramInfo = useCallback((programInfo) => {
        if(props.login){
            if(watch.vod.entryPoint(programInfo)){
                startByAccountVar(programInfo);
            }
            else{
                startByQuery(programInfo);
            }
        }
        else{
            if(watch.vod.entryPoint(programInfo)){
                startBySeriesInformation(programInfo);
            }
            else{
                startByQuery(programInfo);
            }
        }
    }, [props.login]);

    const startByAccountVar = useCallback((programInfo) => {
        let promise = Promise.resolve();

        promise = promise.then(() => {
            return watch.vod.accountVar.init();
        });

        promise = promise.then((accountVar) => {
            return watch.vod.accountVar.get(accountVar, programInfo);
        });

        promise = promise.then((simpleProgram) => {
            if(simpleProgram){
                api.ccc.programInfo.getFetch(simpleProgram.content_id).then((res) => {
                    let result = res.result;
                    let data = result.data;

                    data.time = simpleProgram.time;

                    setPlayerProgramInfo(data);
                    props.dispatchLoading(false);
                });
            }
            else{
                startBySeriesInformation(programInfo);
            }
        });
    }, []);

    const startByQuery = useCallback((programInfo) => {
        let href = location.href;
        let time = tools.url.getQuery(href, "time");

        if(time){
            time = parseInt(time);
            programInfo.time = time;
        }

        setPlayerProgramInfo(programInfo);

        href = tools.url.removeQuery(href, "time");

        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, document.title, href);

        props.dispatchLoading(false);
    }, []);

    const startBySeriesInformation = useCallback((programInfo) => {
        api.ccc.seriesInfo.getFetch(programInfo.content_id).then((res) => {
            let result = res.result;
            let data = result.data;

            if(data.content_id != data.recommend_id){
                api.ccc.programInfo.getFetch(data.recommend_id).then((res) => {
                    let result = res.result;
                    let data = result.data;

                    setPlayerProgramInfo(data);
                    props.dispatchLoading(false);
                });
            }
            else{
                props.dispatchLoading(false);
            }
        });
    }, []);

    const setRelatedProgramByCallback = useCallback((programInfo) => {
        api.ccc.relatedProgram.getFetch(programInfo.content_id).then((res) => {
            let result = res.result;

            setRelatedProgram(result);
        });
    }, []);

    const setEpisodesByCallback = useCallback((programInfo) => {
        if(programInfo.is_series){
            api.ccc.seriesTree.getFetch(programInfo.series_id).then((res) => {
                let result = res.result;
                let data = result.data;

                setEpisodes(data);
            });
        }
        else if(programInfo.rule_id){
            api.ccc.playList.getFetch(programInfo.rule_id).then((res) => {
                let result = res.result;
                let data = result.data;
                let contentIds = data.play_list;

                contentIds = watch.vod.playListShuffle(programInfo.content_id, contentIds);

                api.ccc.bulkSimpleProgram.getFetch(contentIds).then((_res) => {
                    let _result = _res.result;
                    let _data = _result.data;

                    _data.series_id = programInfo.rule_id;

                    setEpisodes(_data);
                });
            });
        }
        else{
            setEpisodes(null);
        }
    }, []);

    const startByChannel = useCallback((contentId) => {
        if(channelMeta){
            refreshChannelMeta(channelMeta, scheduleAllWithMediumPrograms);

            let map = watch.channel.meta.getChannelMap(channelMeta);

            setPlayerProgramInfo(map[contentId]);
        }
        else{
            setChannelMetaByCallback((_channelMeta) => {
                let map = watch.channel.meta.getChannelMap(_channelMeta);

                setPlayerProgramInfo(map[contentId]);
            });
        }
    }, [channelMeta]);

    const setChannelMetaByCallback = useCallback((callback) => {
        props.dispatchLoading(true);

        let referringPartner = tools.url.getReferringPartner();
        let introduction = api.fino.channelIntroduction.getFetch();
        let lineup = api.fino.lineup.getFetch(referringPartner); // 每個導流頁都有自己的lineup

        Promise.all([introduction, lineup]).then((results) => {
            setChannelIntroduction(channel.introduction(results[0]));

            let _channelMeta = null;
            let _lineup = results[1].result.data;
            let _vodChannelSchedule = api.fino.vodChannelSchedule.getFetch(_lineup.schedule_hash);
            let _vodChannelDescription = api.fino.vodChannelDescription.getFetch(_lineup.description_hash);
            let _scheduleAllWithMediumPrograms = api.fino.scheduleAllWithMediumPrograms.getFetch();
            let _stationCategories = api.fino.stationCategories.getFetch();

            Promise.all([_vodChannelSchedule, _vodChannelDescription, _scheduleAllWithMediumPrograms, _stationCategories]).then((_results) => {
                _channelMeta = watch.channel.meta.setVodChannelSchedule(_lineup, _results[0]);
                _channelMeta = watch.channel.meta.setLiad(_channelMeta);
                _channelMeta = watch.channel.meta.setPackageInfo(_channelMeta);
                _channelMeta = watch.channel.meta.setTimeToMillisecond(_channelMeta);
                _channelMeta = watch.channel.meta.setVodChannelDescription(_channelMeta, _results[1]);
                _channelMeta = watch.channel.meta.mergeChannel(_channelMeta, _results[2]);
                _channelMeta = watch.channel.meta.setStationCategories(_channelMeta, _results[3]);

                setChannelMeta(_channelMeta);
                setScheduleAllWithMediumPrograms(_results[2]);
                setStationCategories(_results[3]);
                refreshChannelMeta(_channelMeta, _results[2]);
                callback(_channelMeta);
                props.dispatchLoading(false);
            });
        });
    }, [channelMeta]);

    const refreshChannelMeta = useCallback((_channelMeta, _scheduleAllWithMediumPrograms) => {
        let execute = () => {
            if(!props.mask){
                _channelMeta = watch.channel.meta.setPrograms(_channelMeta, _scheduleAllWithMediumPrograms, null);
            }
            else{
                _channelMeta = watch.channel.meta.setPrograms(_channelMeta, _scheduleAllWithMediumPrograms, playerProgramInfo);
            }

            setChannelMeta(Object.assign({}, _channelMeta));
        };

        execute();
        clearInterval(refreshChannelMetaInterval);

        setRefreshChannelMetaInterval(setInterval(() => {
            execute();
        }, 60 * 1000));
    }, [props.mask, playerProgramInfo, refreshChannelMetaInterval]);

    useEffect(() => {
        let contentId = tools.url.getQuery(location.href, "contentId");
        let contentType = tools.url.getQuery(location.href, "contentType");

        if(contentId && contentType){
            let _pageType = pageTypes[contentType];

            if(_pageType){
                if(_pageType == "vod"){
                    startByVod(contentId);
                }
                else{
                    startByChannel(contentId);
                }
            }
            else{
                redirectToHome();
            }
        }
        else{
            startByDefault();
        }

        return () => {
            clearInterval(refreshChannelMetaInterval);
        };
    }, []);
    
    useEffect(() => {
        if(!playerProgramInfo){
            return;
        }

        if(pageType == "vod"){
            clearInterval(refreshChannelMetaInterval);
        }

        if(prePlayerProgramInfo){
            if(playerProgramInfo.content_id != prePlayerProgramInfo.content_id){
                beacon();
                gtag.pageview();
            }
        }

        let href = location.href;

        href = tools.url.replaceQuery(href, "contentId", playerProgramInfo.content_id);
        href = tools.url.replaceQuery(href, "contentType", playerProgramInfo.content_type);

        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, document.title, href);

        scroll({
            top: 0,
            left: 0
        });
    }, [playerProgramInfo]);

    useEffect(() => {
        if(!props.featured){
            return;
        }

        startByVod(props.featured.content_id);
    }, [props.featured]);

    useEffect(() => {
        if(!props.rank){
            return;
        }

        startByVod(props.rank.content_id);
    }, [props.rank]);

    useEffect(() => {
        if(!props.vodProgramInfoByRelatedProgram){
            return;
        }

        startByVod(props.vodProgramInfoByRelatedProgram.content_id);
    }, [props.vodProgramInfoByRelatedProgram]);

    useEffect(() => {
        if(!props.vodProgramInfo){
            return;
        }

        startByProgramInfo(props.vodProgramInfo);
    }, [props.vodProgramInfo]);

    useEffect(() => {
        if(!props.channelProgramInfo){
            return;
        }

        startByChannel(props.channelProgramInfo.content_id);
    }, [props.channelProgramInfo]);

    return (
        <>
            <div className="diversion_section">
                <div className="diversion_container">
                    <img className="theme_picture" src={props.diversionMeta.pics.top.pc} alt="themePicture" />

                    {
                        (() => {
                            if(playerDisplay && playerProgramInfo){
                                return (
                                    <Player programInfo={playerProgramInfo} episodes={episodes} relatedProgram={relatedProgram} stationCategories={stationCategories} pageType={pageType} channelMeta={channelMeta} channelIntroduction={channelIntroduction} />
                                );
                            }
                        })()
                    }

                    {
                        props.diversionMeta.content.map((item, index) => {
                            if(item.type == "banner"){
                                return (
                                    <Banner meta={item.meta} key={index} />
                                );
                            }
                            else if(item.type == "featured"){
                                return (
                                    <Featured meta={item.meta} key={index} />
                                );
                            }
                            else if(item.type == "rank"){
                                return (
                                    <Rank meta={item.meta} key={index} />
                                );
                            }
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .diversion_section{
                        background-image: url(${props.diversionMeta.pics.bg});
                        background-size: cover;
                        background-position: center center;
                        background-color: #000;
                        padding-bottom: 60px;

                        .diversion_container{
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;

                            .theme_picture{
                                display: block;
                                width: 100%;
                            }
                        }                        
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    diversionMeta: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
