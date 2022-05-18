
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import contentTypeMap from "../../assets/json/content/contentTypeMap.json";
import promoMap from "../../assets/json/player/promo.json";
import promoAd from "../../assets/json/player/promoAd.json";

import tools from "../../assets/js/tools/index.js";
import api from "../../assets/js/api/index.js";
import watch from "../../assets/js/watch/index.js";

import Player from "../player/index.jsx";
import BreadCrumb from "../breadCrumb/index.jsx";
import VodTabs from "../vod/watch/player/tabs/index.jsx";
import ChannelTabs from "../channel/watch/player/tabs/index.jsx";

const mapStateToProps = (state) => {
    return {
        vodSeek: state.vod.watch.videoSeek,
        fbReady: state.fbReady
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
        dispatchToast: (message) => {
            dispatch({
                type: "toast",
                value: message
            });
        },
        dispatchVodVideoImpression: (value) => {
            dispatch({
                type: "vod/watch/videoImpression",
                value: value
            });
        },
        dispatchVodVideoCompanionAd: (value) => {
            dispatch({
                type: "vod/watch/videoCompanionAd",
                value: value
            });
        },
        dispatchVodVideoUrls: (value) => {
            dispatch({
                type: "vod/watch/videoUrls",
                value: value
            });
        },
        dispatchVodVideoSeek: (value) => {
            dispatch({
                type: "vod/watch/videoSeek",
                value: value
            });
        },
        dispatchVodProgramInfo: (programInfo) => {
            dispatch({
                type: "vod/watch/programInfo",
                value: programInfo
            });
        },
        dispatchChannelProgramInfo: (programInfo) => {
            dispatch({
                type: "channel/watch/programInfo",
                value: programInfo
            });
        }
    };
};

const App = (props) => {
    const [playerEvent, setPlayerEvent] = useState(null);
    const [displayEndAd, setDisplayEndAd] = useState(0);

    const seek = useMemo(() => {
        if(props.pageType == "vod"){
            return props.vodSeek;
        }
        else{
            return null;
        }
    }, [props.pageType, props.vodSeek]);

    const cdnStatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const videoImage = useMemo(() => {
        if(props.pageType == "vod"){
            let video = props.programInfo.video_image;
            let poster = props.programInfo.picture;
            let src = "";
            let alt = props.programInfo.title + props.programInfo.secondary_mark;

            if(video){
                src = `${cdnStatic}/${video.replace("-S", "")}`;
            }
            else{
                src = `${cdnStatic}/${poster}`;
            }

            return {
                src: src,
                alt: alt
            };
        }
        else{
            if(props.programInfo){
                let contentId = props.programInfo.content_id;
                let channels = props.channelIntroduction.channels;
                let src = "";
                let alt = props.programInfo.title;

                for(let i = 0; i < channels.length; i ++){
                    let _channel = channels[i];

                    if(_channel.cdn_code == contentId){
                        src = _channel.picture;

                        break;
                    }
                }

                if(!src){
                    src = `${cdnStatic}/${props.programInfo.picture}`;
                }

                return {
                    src: src,
                    alt: alt
                };
            }

            return null;
        }
    }, [props.pageType, props.programInfo, cdnStatic]);

    const breadCrumb = useMemo(() => {
        let _breadCrumb = [];

        if(props.pageType == "vod"){
            _breadCrumb.push({
                name: "首頁",
                href: "/",
                as: "/"
            });

            if(props.programInfo.rule_id){
                _breadCrumb.push({
                    name: contentTypeMap[props.programInfo.content_type],
                    href: "/[contentType]/searchProgram",
                    as: "/ent/searchProgram?categoryId=113"
                });
            }
            else{
                _breadCrumb.push({
                    name: contentTypeMap[props.programInfo.content_type],
                    href: "/[contentType]",
                    as: `/${props.programInfo.content_type}`
                });
            }

            _breadCrumb.push({
                name: props.programInfo.title,
                href: "/[contentType]/[contentId]",
                as: `/${props.programInfo.content_type}/${props.programInfo.content_id}`
            });

            return _breadCrumb;
        }
        else{
            _breadCrumb.push({
                name: "首頁",
                href: "/",
                as: "/"
            });

            if(props.programInfo){
                _breadCrumb.push({
                    name: "電視頻道",
                    href: "/channel/watch",
                    as: "/channel/watch"
                });

                _breadCrumb.push({
                    name: props.programInfo.title,
                    href: "/channel/watch",
                    as: `/channel/watch?contentId=${props.programInfo.content_id}`
                });
            }
        }

        return _breadCrumb;
    }, [props.pageType, props.programInfo]);

    const promote = useMemo(() => {
        return promoMap[props.programInfo.content_type];
    }, [props.programInfo]);

    const title = useMemo(() => {
        let _title = null;

        if(props.pageType == "vod"){
            _title = props.programInfo.title;
        }
        else{
            if(props.programInfo){
                _title = `${props.programInfo.no} ${props.programInfo.title}`;
            }
        }
        
        return _title;
    }, [props.pageType, props.programInfo]);

    const secondaryMark = useMemo(() => {
        let _secondaryMark = null;

        if(props.pageType == "vod"){
            _secondaryMark = props.programInfo.secondary_mark;
        }
        else{
            if(props.programInfo){
                let contentId = props.programInfo.content_id;
                let map = watch.channel.meta.getChannelMap(props.channelMeta);
                let programInfo = map[contentId];

                if(programInfo.content_type == "channel"){
                    let schedules = programInfo.Schedule;
                    let schedule = schedules[0];

                    if(schedule){
                        let program = schedule.program;

                        if(program.Title && program.SubTitle){
                            _secondaryMark = `${program.Title} - ${program.SubTitle}`;
                        }
                        else if(program.Title){
                            _secondaryMark = program.Title;
                        }
                        else if(program.SubTitle){
                            _secondaryMark = program.SubTitle;
                        }
                    }
                }
                else if(programInfo.content_type == "vod-channel" || programInfo.content_type == "playout-channel"){
                    let schedule = programInfo.vod_channel_schedule;
                    let program = schedule.focus_program;

                    if(program.title && program.subtitle){
                        _secondaryMark = `${program.title} - ${program.subtitle}`;
                    }
                    else if(program.title){
                        _secondaryMark = program.title;
                    }
                    else if(program.subtitle){
                        _secondaryMark = program.subtitle;
                    }
                }
            }
        }

        return _secondaryMark;
    }, [props.pageType, props.programInfo, props.channelMeta]);

    const fbShareBtnClickHandler = useCallback((event) => {
        if(typeof FB == "undefined"){
            return;
        }

        FB.ui({
            method: "share",
            href: location.href,
        }, (response) => {
            console.log(response);
        });
    }, []);

    const copyBtnClickHandler = useCallback((event) => {
        const el = document.createElement("textarea");

        el.value = location.href;
        el.style.position = "absolute";
        el.style.left = "-9999px";

        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        props.dispatchToast("已複製到剪貼簿");
    }, []);

    useEffect(() => {
        if(!playerEvent){
            return;
        }
        
        if(playerEvent.type == "impression"){
            if(props.pageType == "vod"){
                props.dispatchVodVideoImpression(playerEvent.value);
            }
            else{
                //
            }
        }
        else if(playerEvent.type == "companionAd"){
            if(props.pageType == "vod"){
                props.dispatchVodVideoCompanionAd({
                    value: playerEvent.value
                });
            }
            else{
                //
            }
        }
        else if(playerEvent.type == "urls"){
            if(props.pageType == "vod"){
                props.dispatchVodVideoUrls(playerEvent.value);
            }
            else{
                //
            }
        }
        else if(playerEvent.type == "programInfo"){
            let programInfo = playerEvent.value;

            if(props.pageType == "vod"){
                props.dispatchVodProgramInfo(programInfo);
            }
            else{
                programInfo = watch.channel.meta.getPrograms(programInfo);

                props.dispatchChannelProgramInfo(programInfo);
            }
        }
        else if(playerEvent.type == "ended"){
            if(props.pageType == "vod"){
                let next = watch.vod.nextEpisode(props.programInfo, props.episodes);

                if(!next){
                    setDisplayEndAd(new Date().getTime());
                }
                else{
                    props.dispatchLoading(true);
    
                    api.ccc.programInfo.getFetch(next.content_id).then((res) => {
                        props.dispatchLoading(false);
    
                        let programInfo = res.result.data;
    
                        if(props.programInfo.accountVar){
                            programInfo.accountVar = props.programInfo.accountVar;
                        }
    
                        props.dispatchVodProgramInfo(programInfo);
                    });
                }
            }
            else{
                let programInfo = _.cloneDeep(props.programInfo);

                programInfo = watch.channel.meta.getNextProgram(programInfo);

                props.dispatchChannelProgramInfo(programInfo);
            }
        }
        else if(playerEvent.type == "trial"){
            if(props.pageType == "vod"){
                //
            }
            else{
                props.dispatchLoading(true);

                let programInfo = playerEvent.value;

                api.account.promoUse.getFetch(programInfo.trial).then((res) => {
                    let result = res.result;
                    let success = result.Success;

                    if(success){
                        programInfo = _.cloneDeep(programInfo);
                        programInfo = watch.channel.meta.getPrograms(programInfo);

                        props.dispatchChannelProgramInfo(programInfo);
                    }

                    props.dispatchLoading(false);
                });
            }
        }
    }, [playerEvent]);

    useEffect(() => {
        if(props.fbReady){
            FB.XFBML.parse();
        }
    }, [props.fbReady]);

    useEffect(() => {
        return () => {
            props.dispatchVodVideoImpression(0);
            props.dispatchVodVideoCompanionAd(null);
            props.dispatchVodVideoUrls(null);
            props.dispatchVodVideoSeek(null);
        };
    }, []);

    return (
        <>
            <div className="player_section">
                <div className="title_section">
                    <img className="icon" width="25" height="24" src={require("../../assets/image/diversion/star.png")} alt="star" />
                    <div className="text">現正播放</div>
                </div>

                <div className="center_section">
                    <div className="left_section">
                        {
                            (() => {
                                if(breadCrumb.length || promote){
                                    return (
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
                                                    if(breadCrumb.length){
                                                        return (
                                                            <BreadCrumb breadCrumb={breadCrumb} color="#ccc" marginTop="0px" paddingLeft="0px" paddingRight="0px" height="35px" />
                                                        );
                                                    }
                                                })()
                                            }
                                        </div>
                                    );
                                }
                            })()
                        }

                        {
                            (() => {
                                if(title || secondaryMark){
                                    return (
                                        <div className="title_section">
                                            {
                                                (() => {
                                                    if(title){
                                                        return (
                                                            <div className="title">{title}</div>
                                                        );
                                                    }
                                                })()
                                            }

                                            {
                                                (() => {
                                                    if(secondaryMark){
                                                        return (
                                                            <div className="secondary_mark">{secondaryMark}</div>
                                                        );
                                                    }
                                                })()
                                            }
                                        </div>
                                    );
                                }   
                            })()
                        }

                        <div className="screen_section">
                            {
                                (() => {
                                    if(videoImage){
                                        return (
                                            <>  
                                                <img className="background_img" src={videoImage.src} alt="background" />
                                                <img className="img" src={videoImage.src} alt={videoImage.alt} />
                                            </>
                                        );
                                    }
                                })()
                            }

                            {
                                (() => {
                                    if(props.programInfo){
                                        return (
                                            <Player setPlayerEvent={setPlayerEvent} programInfo={props.programInfo} displayEndAd={displayEndAd} seek={seek} />
                                        );
                                    }
                                })()
                            }
                        </div>

                        <div className="bottom_section">
                            <button className="fb_share_btn" onClick={(event) => fbShareBtnClickHandler(event)}></button>
                            <button className="url_share_btn" onClick={(event) => copyBtnClickHandler(event)}></button>
                            <div className="fb-like" data-href="https://www.facebook.com/LiTVfans?fref=ts" data-send="false" data-width="150" data-show-faces="false" data-layout="button_count"></div>
                            <a className="line_btn" href="http://bit.ly/2ROGn0C" target="_blank" title="加入Line好友"></a>
                            <a className="download_app_btn" href="http://hyperurl.co/litvwebplayer" target="_blank" title="LiTV App下載"></a>
                        </div>

                        {
                            (() => {
                                if(props.programInfo && props.programInfo.description){
                                    return (
                                        <div className="detail_section">{props.programInfo.description}</div>
                                    );
                                }
                            })()
                        }

                        {
                            (() => {
                                if(promoAd.data && promoAd.exclude.indexOf(props.programInfo.content_type) == -1){
                                    return (
                                        <a className="promo_ad" href={promoAd.data.href} title={promoAd.data.title} target={promoAd.data.target}>
                                            <img className="ad_img" src={require("../../assets/image/player/promote/" + promoAd.data.src)} alt={promoAd.data.title} />
                                        </a>
                                    );
                                }
                            })()
                        }
                    </div>

                    <div className="right_section">
                        {
                            (() => {
                                if(props.pageType == "vod" && props.programInfo){
                                    return (
                                        <VodTabs programInfo={props.programInfo} episodes={props.episodes} relatedProgram={props.relatedProgram} />
                                    );
                                }
                                else if(props.pageType.indexOf("channel") != -1 && props.channelMeta){
                                    return (
                                        <ChannelTabs meta={props.channelMeta} programInfo={props.programInfo} bsmPackageCategory={tools.url.getReferringPartner()} />
                                    );
                                }
                            })()
                        }
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .player_section{
                        position: relative;

                        .title_section{
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            align-items: center;
                            height: 40px;

                            .icon{
                                display: block;
                                width: 25px;
                            }

                            .text{
                                color: #fff;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 22px;
                                line-height: 30px;
                                margin-left: 5px;
                            }
                        }

                        .center_section{
                            position: relative;
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            padding-left: 1%;
                            padding-right: 1%;
                            padding-top: 10px;
                            padding-bottom: 10px;
                            background-color: #333;
                            
                            .left_section{
                                width: 65%;

                                @media screen and (max-width: 1023px) {
                                    width: 100%;
                                }

                                .top_section{
                                    overflow: hidden;
                                    height: 35px;
                                    position: relative;
        
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
                                    }
                                }
        
                                .title_section{
                                    overflow: hidden;
                                    height: 35px;
                                    position: relative;
        
                                    .title{
                                        float: left;
                                        max-width: 100%;
                                        color: #f60;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        font-size: 20px;
                                        font-weight: normal;
                                        line-height: 35px;
                                        margin-right: 10px;
                                    }
        
                                    .secondary_mark{
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        font-size: 15px;
                                        font-weight: normal;
                                        line-height: 35px;
                                        color: #ccc;
                                    }
                                }

                                .screen_section{
                                    padding-bottom: 56.25%;
                                    position: relative;
                                    overflow: hidden;
                                    background-color: #000;

                                    .background_img{
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translateX(-50%) translateY(-50%);
                                        width: calc(100% - 2px);
                                        height: calc(100% - 2px);
                                        display: block;
                                        overflow: hidden;
                                    }

                                    .img{
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translateX(-50%) translateY(-50%);
                                        width: calc(100% - 2px);
                                        height: calc(100% - 2px);
                                        display: block;
                                        overflow: hidden;
                                    }
                                }

                                .bottom_section{
                                    position: relative;
                                    height: 40px;
                                    overflow: hidden;

                                    .fb_share_btn{
                                        display: block;
                                        float: left;
                                        width: 30px;
                                        height: 30px;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        background-image: url(${require("../../assets/image/icon/fb.png")});
                                        background-size: cover;
                                    }

                                    .url_share_btn{
                                        display: block;
                                        float: left;
                                        width: 30px;
                                        height: 30px;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        background-image: url(${require("../../assets/image/icon/copy.png")});
                                        background-size: cover;
                                    }

                                    .fb-like{
                                        display: block;
                                        height: 20px;
                                        overflow: hidden;
                                        float: right;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        margin-left: 5px;
                                    }

                                    .line_btn{
                                        display: block;
                                        float: right;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        width: 85px;
                                        height: 20px;
                                        background-image: url(${require("../../assets/image/footer/line/add.png")});
                                        background-size: 100% 100%;
                                        margin-left: 5px;
                                    }

                                    .download_app_btn{
                                        display: block;
                                        float: right;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        width: 85px;
                                        height: 20px;
                                        background-image: url(${require("../../assets/image/player/download_app.png")});
                                        background-size: 100% 100%;
                                    }
                                }

                                .detail_section{
                                    color: #ccc;
                                    line-height: 25px;
                                    font-size: 15px;
                                    margin-bottom: 10px;
                                }

                                .promo_ad{
                                    width: 100%;
                                    display: block;

                                    .ad_img{
                                        width: 100%;
                                        display: block;
                                    }
                                }
                            }

                            .right_section{
                                position: absolute;
                                top: 10px;
                                bottom: 10px;
                                left: 65.5%;
                                right: 0.5%;

                                @media screen and (max-width: 1023px) {
                                    position: relative;
                                    top: auto;
                                    bottom: auto;
                                    left: auto;
                                    right: auto;
                                    margin-top: 10px;
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    programInfo: PropTypes.object,
    episodes: PropTypes.object,
    relatedProgram: PropTypes.object,
    stationCategories: PropTypes.object,
    pageType: PropTypes.string,
    channelMeta: PropTypes.object,
    channelIntroduction: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
