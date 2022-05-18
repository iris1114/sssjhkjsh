
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { useRouter } from "next/router";

import api from "../../../assets/js/api/index.js";
import watch from "../../../assets/js/watch/index.js";
import tools from "../../../assets/js/tools/index.js";
import seo from "../../../assets/js/seo/index.js";
import beacon from "../../../assets/js/beacon/index.js";
import gtag from "../../../assets/js/gtag/index.js";

import Player from "./player/index.jsx";
import Category from "./category.jsx";
import CategoriesTips from "./categoriesTip.jsx";
import RemoteControl from "./remote/index.jsx";
import PlayerBottomCategory from "./player/category/index.jsx";

const mapStateToProps = (state) => {
    return {
        mask: state.channel.watch.mask,
        categoriesTip: state.channel.watch.categoriesTip
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        },
        dispatchProgramInfo: (value) => {
            dispatch({
                type: "channel/watch/programInfo",
                value: value
            });
        }
    }
};

const App = (props) => {
    const router = useRouter();

    const [meta, setMeta] = useState(null);
    const [playerProgramInfo, setPlayerProgramInfo] = useState(null);
    const [scheduleAllWithMediumPrograms, setScheduleAllWithMediumPrograms] = useState(null);
    const [stationCategories, setStationCategories] = useState(null);
    const [remotePreProgramInfo, setRemotePreProgramInfo] = useState(null);

    const prePropsProgramInfo = tools.hook.usePrevious(props.programInfo);
    const prePlayerProgramInfo = tools.hook.usePrevious(playerProgramInfo);

    useEffect(() => {
        setTimeout(() => {
            props.dispatchLoading(true);
        }, 10);

        let unmounted = false;

        let getMeta = async () => {
            let _meta = null;
            let vodChannelSchedule = await api.fino.vodChannelSchedule.getFetch(props.lineup.schedule_hash);
            let vodChannelDescription = await api.fino.vodChannelDescription.getFetch(props.lineup.description_hash);
            
            let _scheduleAllWithMediumPrograms = await api.fino.scheduleAllWithMediumPrograms.getFetch();
            let _stationCategories = await api.fino.stationCategories.getFetch();
            
            _meta = watch.channel.meta.setVodChannelSchedule(props.lineup, vodChannelSchedule);
            _meta = watch.channel.meta.setLiad(_meta);
            _meta = watch.channel.meta.setLogo(_meta);
            _meta = watch.channel.meta.setPackageInfo(_meta);
            _meta = watch.channel.meta.setTimeToMillisecond(_meta);
            _meta = watch.channel.meta.setVodChannelDescription(_meta, vodChannelDescription);
            _meta = watch.channel.meta.mergeChannel(_meta, _scheduleAllWithMediumPrograms);
            _meta = watch.channel.meta.setStationCategories(_meta, _stationCategories);
            
            if(!unmounted){
                setScheduleAllWithMediumPrograms(_scheduleAllWithMediumPrograms);
                setStationCategories(_stationCategories);

                setMeta(() => {
                    return watch.channel.meta.setPrograms(_meta, _scheduleAllWithMediumPrograms, null);
                });
            }

            props.dispatchLoading(false);
        };

        getMeta();

        return () => {
            unmounted = true;
        };
    }, [props.lineup]);

    useEffect(() => {
        if(!meta){
            return;
        }
        
        let timeout = null;

        timeout = setTimeout(() => {
            setMeta((_meta) => {
                _meta = _.cloneDeep(_meta);

                if(!props.mask){
                    _meta = watch.channel.meta.setPrograms(_meta, scheduleAllWithMediumPrograms, null);
                }
                else{
                    _meta = watch.channel.meta.setPrograms(_meta, scheduleAllWithMediumPrograms, playerProgramInfo);
                }

                return _meta;
            });
        }, 60 * 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [meta]);

    useEffect(() => {
        setPlayerProgramInfo(null);
    }, [props.lineup]);

    useEffect(() => {
        if(!meta){
            return;
        }

        if(playerProgramInfo){
            return;
        }

        let contentId = tools.url.getQuery(location.href, "contentId");

        if(!contentId){
            let bsmPackageCategory = props.bsmPackageCategory;
            let key = "channel_watch_record";
            
            if(bsmPackageCategory){
                key = key + "(" + bsmPackageCategory + ")";
            }

            contentId = tools.storage.local.getItem(key);  
        }

        let programInfo = null;
        
        if(contentId){
            let map = watch.channel.meta.getChannelMap(meta);
            
            programInfo = map[contentId];
        }

        if(!programInfo){
            let list = watch.channel.meta.getChannelList(meta);

            programInfo = list[0];
        }

        programInfo = _.cloneDeep(programInfo);
        
        props.dispatchProgramInfo(programInfo);
    }, [meta]);

    useEffect(() => {
        if(props.programInfo == prePropsProgramInfo){
            return;
        }
        
        let contentId = props.programInfo.content_id;
        let bsmPackageCategory = props.bsmPackageCategory;
        let key = "channel_watch_record";

        if(bsmPackageCategory){
            key = key + "(" + bsmPackageCategory + ")";
        }

        tools.storage.local.setItem(key, contentId);
        
        setPlayerProgramInfo(props.programInfo);

        setMeta((_meta) => {
            _meta = _.cloneDeep(meta);
            _meta = watch.channel.meta.setPrograms(_meta, scheduleAllWithMediumPrograms, props.programInfo);

            return _meta;
        });

        let href = tools.url.replaceQuery(location.href, "contentId", contentId);

        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, seo.vod.watch.getTitle(props.programInfo, props.seoDictionary), href);

        beacon();
        gtag.pageview();
    }, [props.programInfo]);

    const categories = useMemo(() => {
        if(meta && stationCategories){
            return watch.channel.meta.getChannelCategories(meta, stationCategories);
        }
    }, [meta, stationCategories]);

    useEffect(() => {
        if(!playerProgramInfo){
            setRemotePreProgramInfo(null);
        }
        else if(prePlayerProgramInfo && prePlayerProgramInfo.content_id != playerProgramInfo.content_id){
            setRemotePreProgramInfo(prePlayerProgramInfo);
        }
    }, [playerProgramInfo]);

    return (
        <>
            <div className="channel_watch_section">
                {
                    (() => {
                        if(meta && stationCategories){
                            return (
                                <Player meta={meta} stationCategories={stationCategories} programInfo={playerProgramInfo} introduction={props.introduction} bsmPackageCategory={props.bsmPackageCategory} categories={categories} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(meta && stationCategories){
                            return (
                                <PlayerBottomCategory categories={categories}  programInfo={playerProgramInfo} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(meta && stationCategories){
                            return (
                                <Category meta={meta} stationCategories={stationCategories} programInfo={playerProgramInfo} bsmPackageCategory={props.bsmPackageCategory} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(props.categoriesTip){
                            return (
                                <CategoriesTips meta={props.categoriesTip} />
                            );
                        }
                    })()
                }
            </div>
            
            {
                (() => {
                    if(meta && playerProgramInfo){
                        return (
                            <RemoteControl meta={meta} programInfo={playerProgramInfo} preProgramInfo={remotePreProgramInfo} />
                        );
                    }
                })()
            }
        </>
    );
};


App.propTypes = {
    lineup: PropTypes.object.isRequired,
    introduction: PropTypes.object.isRequired,
    programInfo: PropTypes.object.isRequired,
    bsmPackageCategory: PropTypes.string,
    seoDictionary: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);