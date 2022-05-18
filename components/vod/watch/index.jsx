
import { connect } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import watch from "../../../assets/js/watch/index.js";
import tools from "../../../assets/js/tools/index.js";
import api from "../../../assets/js/api/index.js";
import getTitleWithSecondaryMark from "../../../assets/js/seo/vod/watch/getTitleWithSecondaryMark"

import Detail from "./detail.jsx";
import Episodes from "./episodes/index.jsx";
import RelatedProgram from "./relatedProgram/index.jsx";
import PlayerSection from "./player/index.jsx";
import PromoReview from "./promoReview/index.jsx";
import PromoContent from "./promoContent/index.jsx";
import PromoRecommand from "./promoRecommand.jsx";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        programInfoByRelatedProgram: state.vod.watch.programInfoByRelatedProgram
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const router = useRouter();

    const prePropsEpisodesInfo = tools.hook.usePrevious(props.episodesInfo);

    const [playerProgramInfo, setPlayerProgramInfo] = useState(null);
    const [promoReviewList, setPromoReviewList] = useState([]);
    const [promoContentList, setPromoContentList] = useState([]);
    const [promoRecommandList, setPromoRecommandList] = useState([]);

    const playerDisplay = useMemo(() => {
        if(!playerProgramInfo && watch.vod.entryPoint(props.episodesInfo.programInfo)){
            return false;
        }

        let scheduleInfo = props.episodesInfo.programInfo.schedule_info;
        let startTime = scheduleInfo.start_time;
        
        if(startTime){
            let now = new Date().getTime();

            if(now < startTime * 1000){
                return false;
            }
        }
        
        return true;
    }, [props.episodesInfo, playerProgramInfo]);

    useEffect(() => {
        if(prePropsEpisodesInfo == props.episodesInfo){
            return;
        }

        if(watch.vod.entryPoint(props.episodesInfo.programInfo)){
            return;
        }
        
        if(props.episodesInfo.programInfo.accountVar && typeof props.episodesInfo.programInfo.time != "number"){
            if(props.episodesInfo.programInfo.accountVar.content_id == props.episodesInfo.programInfo.content_id){
                let programInfo = _.cloneDeep(props.episodesInfo.programInfo);

                programInfo.time = props.episodesInfo.programInfo.accountVar.time;
                
                setPlayerProgramInfo(programInfo);
            }
            else{
                setPlayerProgramInfo(props.episodesInfo.programInfo);
            }
        }
        else{
            setPlayerProgramInfo(props.episodesInfo.programInfo);
        }
    }, [props.episodesInfo]);

    useEffect(() => {
        if(!props.programInfoByRelatedProgram){
            return;
        }

        let href = `/${props.programInfoByRelatedProgram.content_type}/${props.programInfoByRelatedProgram.content_id}`;

        router.push("/[contentType]/[contentId]", href);

        scroll({
            top: 0,
            left: 0
        });
    }, [props.programInfoByRelatedProgram]);

    useEffect(() => {
        let unmounted = false;

        api.fino.promoReviewList.getFetch().then((res) => {
            if(!unmounted){
                setPromoReviewList(res.list);
            }
        });

        api.fino.promoContentList.getFetch().then((res) => {
            if(!unmounted){
                setPromoContentList(res.list);
            }
        });

        api.fino.promoRecommandList.getFetch().then((res) => {
            if(!unmounted){
                setPromoRecommandList(res.list);
            }
        });

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <>
            <div className="vod_watch_section">
             
                <h1 className="ssr_only">{getTitleWithSecondaryMark(props.programInfo)}</h1>
                {
                    (() => {
                        if(playerDisplay){
                            return (
                                <PlayerSection playerProgramInfo={playerProgramInfo} programInfo={props.episodesInfo.programInfo} relatedProgram={props.relatedProgram} episodes={props.episodesInfo.episodes} focusTree={props.episodesInfo.focusTree} rank={props.rank} />
                            );
                        }   
                    })()
                }

                <Detail programInfo={props.programInfo} seoDictionary={props.seoDictionary} />

                {
                    (() => {
                        if(props.episodesInfo){
                            return (
                                <Episodes episodes={props.episodesInfo.episodes} programInfo={props.episodesInfo.programInfo} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(promoReviewList.indexOf(props.programInfo.series_id) != -1){
                            return (
                                <PromoReview seriesId={props.programInfo.series_id} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(promoContentList.indexOf(props.programInfo.series_id) != -1){
                            return (
                                <PromoContent seriesId={props.programInfo.series_id}/>
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(promoRecommandList.indexOf(props.programInfo.series_id) != -1){
                            return (
                                <PromoRecommand seriesId={props.programInfo.series_id}/>
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(props.relatedProgram && props.relatedProgram.data && props.relatedProgram.data.length){
                            return (
                                <RelatedProgram relatedProgram={props.relatedProgram} rank={props.rank} />
                            );
                        }
                    })()
                }
            </div>
        </>
    );
};

App.propTypes = {
    programInfo: PropTypes.object.isRequired,
    seoDictionary: PropTypes.object.isRequired,
    relatedProgram: PropTypes.object,
    episodesInfo: PropTypes.object.isRequired,
    rank: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
