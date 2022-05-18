
import { connect } from "react-redux";
import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import watch from "../../../../assets/js/watch/index.js";
import seo from "../../../../assets/js/seo/index.js";
import api from "../../../../assets/js/api/index.js";
import store from "../../../../redux/store.js";
import tools from "../../../../assets/js/tools/index.js";

import promoMap from "../../../../assets/json/player/promo.json";

import Player from "../../../player/index.jsx";
import Tabs from "../player/tabs/index.jsx";
import BreadCrumb from "../../../breadCrumb/index.jsx";
import Remote from "../remote/index.jsx";
import Toast from "../../../toast/index.jsx";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        fullscreen: state.fullscreen
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchProgramInfo: (value) => {
            dispatch({
                type: "channel/watch/programInfo",
                value: value
            });
        },
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [playerEvent, setPlayerEvent] = useState(null);
    const [displayEndAd, setDisplayEndAd] = useState(0);
    const [remotePreProgramInfo, setRemotePreProgramInfo] = useState(null);

    const prePropsProgramInfo = tools.hook.usePrevious(props.programInfo);

    const breadCrumb = useMemo(() => {
        if(!props.programInfo){
            return null;
        }

        let _breadCrumb = new Array();

        _breadCrumb.push({
            name: "首頁",
            href: "/",
            as: "/"
        });

        if(props.bsmPackageCategory){
            _breadCrumb.push({
                name: "整套看頻道",
                href: "/channel/watch/[bsmPackageCategory]",
                as:  "/channel/watch/VOD-CHANNEL"
            })
        }
        else{
            _breadCrumb.push({
                name: "觀看頻道",
                href: "/channel/watch",
                as:  "/channel/watch"
            }) 
        }

        _breadCrumb.push({
            name:  `${props.programInfo.no} ${props.programInfo.title}`
        });

        return _breadCrumb;
        
    },[props.programInfo]);

    const promote = useMemo(() => {
        if(!props.programInfo){
            return null;
        }

        let contentType = props.programInfo.content_type;
        
        return promoMap[contentType];
    }, [props.programInfo]);

    const title = useMemo(() => {
        if(!props.programInfo){
            return null;
        }

        return `${props.programInfo.no} ${props.programInfo.title}`;
    }, [props.programInfo]);

    const secondaryMark = useMemo(() => {
        if(!props.programInfo){
            return null;
        }

        let contentId = props.programInfo.content_id;
        let map = watch.channel.meta.getChannelMap(props.meta);
        let programInfo = map[contentId];

        if(programInfo.content_type == "channel"){
            let schedules = programInfo.Schedule;
            let schedule = schedules[0];

            if(schedule){
                let program = schedule.program;

                if(program.Title && program.SubTitle){
                    return `${program.Title} - ${program.SubTitle}`;
                }
                else if(program.Title){
                    return program.Title;
                }
                else if(program.SubTitle){
                    return program.SubTitle;
                }
            }
        }
        else if(programInfo.content_type == "vod-channel" || programInfo.content_type == "playout-channel"){
            let schedule = programInfo.vod_channel_schedule;
            let program = schedule.focus_program;

            if(program.title && program.subtitle){
                return `${program.title} - ${program.subtitle}`;
            }
            else if(program.title){
                return program.title;
            }
            else if(program.subtitle){
                return program.subtitle;
            }
        }

        return null;
    }, [props.programInfo, props.meta]);

    const description = useMemo(() => {
        if(!props.programInfo){
            return null;
        }

        let contentId = props.programInfo.content_id;
        let map = watch.channel.meta.getChannelMap(props.meta);
        let programInfo = map[contentId];

        if(programInfo.content_type == "channel"){
            let schedules = programInfo.Schedule;
            let schedule = schedules[0];

            if(schedule){
                let program = schedule.program;

                if (program.Description) {
                     return program.Description;
                }
            }
        }
        else if(programInfo.content_type == "vod-channel" || programInfo.content_type == "playout-channel"){
   
            let schedule = programInfo.vod_channel_schedule;
            let program = schedule.focus_program;

        	if(program.vod_channel_description){
                return program.vod_channel_description;
            }
        }

        return null;
    }, [props.programInfo, props.meta]);

    const imgSrc = useMemo(() => {
        if(!props.programInfo){
            return null;
        }

        let imgs = seo.channel.watch.getThumbnailUrl(props.programInfo, props.introduction);

        return imgs[0];
    }, [props.programInfo]);

    useEffect(() => {
        if(!playerEvent){
            return;
        }
        
        if(playerEvent.type == "impression"){
            
        }
        else if(playerEvent.type == "companionAd"){
            
        }
        else if(playerEvent.type == "urls"){
            
        }
        else if(playerEvent.type == "programInfo"){
            let programInfo = playerEvent.value;

            programInfo = watch.channel.meta.getPrograms(programInfo);

            props.dispatchProgramInfo(programInfo);
        }
        else if(playerEvent.type == "ended"){
            let programInfo = _.cloneDeep(props.programInfo);

            programInfo = watch.channel.meta.getNextProgram(programInfo);

            props.dispatchProgramInfo(programInfo);
        }
        else if(playerEvent.type == "trial"){
            props.dispatchLoading(true);

            let programInfo = playerEvent.value;

            api.account.promoUse.getFetch(programInfo.trial).then((res) => {
                let result = res.result;
                let success = result.Success;

                if(success){
                    programInfo = _.cloneDeep(programInfo);
                    programInfo = watch.channel.meta.getPrograms(programInfo);

                    props.dispatchProgramInfo(programInfo);
                }

                props.dispatchLoading(false);
            });
        }
        else if(playerEvent.type == "fullscreen"){
            let remote = document.createElement("div");

            remote.id = "player_remote_section";

            document.fullscreenElement.appendChild(remote);
            
            ReactDOM.render((
                <Provider store={store}>
                    <Remote meta={props.meta} programInfo={props.programInfo} preProgramInfo={remotePreProgramInfo} />
                    <Toast />
                </Provider>
            ), remote);
        }
    }, [playerEvent]);

    useEffect(() => {
        if(props.fullscreen){
            return;
        }

        let target = document.getElementById("player_remote_section");

        if(target){
            target.remove();
        }
    }, [props.fullscreen]);

    useEffect(() => {
        if(!props.programInfo){
            setRemotePreProgramInfo(null);
        }
        else if(prePropsProgramInfo && prePropsProgramInfo.content_id != props.programInfo.content_id){
            setRemotePreProgramInfo(prePropsProgramInfo);
        }
    }, [props.programInfo]);
   
    return (
        <>
            <div className="player_section">
                <div className="center_section">
                    <div className="left_section">
                        <div className="top_section">
                            {
                                (() => {
                                    if(promote){
                                        return (
                                            <a className="promo" href={promote.href} target={promote.target}>{promote.text}</a>
                                        );
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if(breadCrumb){
                                        return(
                                            <BreadCrumb breadCrumb={breadCrumb} color="#ccc" marginTop="0px" paddingLeft="0px" paddingRight="0px" height="35px" />
                                        );
                                    }
                                })()
                            }
                        </div>

                        <div className="screen_section">
                            {
                                (() => {
                                    if(imgSrc){
                                        return (
                                            <>  
                                                <img className="img" src={imgSrc} alt={props.programInfo.title} />
                                            </>
                                        );
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if(props.programInfo && props.login != null){
                                        return (
                                            <Player setPlayerEvent={setPlayerEvent} programInfo={props.programInfo} displayEndAd={displayEndAd} seek={props.seek} />
                                        );
                                    }
                                })()
                            }
                        </div>

                        <div className="info_section">
                            {
                                (() => {
                                    if(title || secondaryMark){
                                        return(
                                            <>
                                                <h1 className="ssr_only">{title} - {secondaryMark}</h1>
                                                <div className="title">{title}</div>
                                                <div className="secondary_mark">{secondaryMark}</div>
                                            </>
                                        );
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if(description){  
                                        return(
                                            <>
                                                <h2 className="ssr_only">影片資訊</h2>
                                                <h3 className="ssr_only">簡介</h3>
                                                <h4 className="description">{description}</h4>
                                            </>
                                        );
                                    }
                                })()
                            }
                        </div>
                    </div>

                    <div className="right_section">
                        <Tabs meta={props.meta} programInfo={props.programInfo} bsmPackageCategory={props.bsmPackageCategory} categories={props.categories}/>
                    </div>
                </div>
                <div className="line"></div>
            </div>
          
            <style jsx>
                {`
                    .player_section{
                        background-color: #1b1b1b;;

                        .center_section{
                            position: relative;
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                            padding-top: 10px;
                            padding-bottom: 10px;

                            .left_section{
                                width: 65%;

                                .top_section{
                                    overflow: hidden;
                                    height: 35px;
                                    position: relative;
                                    margin-bottom: 10px;
        
                                    .promo{
                                        position: relative;
                                        float: right;
                                        top: 0px;
                                        height: 25px;
                                        line-height: 25px;
                                        color: #ffd119;
                                        font-size: 15px;
                                        background-color: #666;
                                        padding-left: 5px;
                                        padding-right: 5px;
                                        margin-top: 5px;
                                    }
                                }

                                .screen_section{
                                    padding-bottom: 56.25%;
                                    position: relative;
                                    overflow: hidden;
                                    background-color: #000;
                                    margin-bottom: 32px;

                                    .img{
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translateX(-50%) translateY(-50%);
                                        max-width: 100%;
                                        max-height: 100%;
                                        display: block;
                                        overflow: hidden;
                                    }
                                }

                                .info_section{
                                    .title{
                                        font-size: 24px;
                                        line-height: 30px;
                                        color: #f1f1f1;
                                        margin-bottom: 8px;
                                    }

                                    .secondary_mark{
                                        font-size: 16px;
                                        line-height: 24px;
                                        color: #b7b7b7;
                                        padding-bottom: 16px;
                                    }

                                    .description{
                                        font-size: 15px;
                                        line-height: 24px;
                                        color: #8f8f8f;
                                        padding-bottom: 16px;
                                    }

                                }
                            }

                            .right_section{
                                position: absolute;
                                top: 55px;
                                bottom: 10px;
                                left: 65.5%;
                                right: 0.5%;

                                @media screen and (max-width: 1023px) {
                                    position: relative;
                                    top: auto;
                                    bottom: auto;
                                    left: auto;
                                    right: auto;
                                    height: 340px;
                                    margin-top: 10px;
                                }
                            }
                        }
                        .line{
                            height: 1px;
                            max-width: 1150px;
                            background-color: #444;
                            margin-left: auto;
                            margin-right: auto;
                            margin-top: 48px;
                        }
                    }
                `}
            </style>
        </>
    );
};


App.propTypes = {
    meta: PropTypes.object.isRequired,
    stationCategories: PropTypes.object.isRequired,
    introduction: PropTypes.object.isRequired,
    programInfo: PropTypes.object,
    bsmPackageCategory: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);