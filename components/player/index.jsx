
import { connect } from "react-redux";
import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import _ from "lodash";

import pageTypes from "../../assets/json/content/pageTypes.json";

import api from "../../assets/js/api/index.js";
import watch from "../../assets/js/watch/index.js";
import tools from "../../assets/js/tools/index.js";

import Mask from "./mask.jsx";

const App = connect((state) => {
    return {
        ratingPass: state.ratingPass,
        purchasePass: state.purchasePass,
        tvodPass: state.tvodPass,
        login: state.login,
        visibilityState: state.visibilityState,
        dialog: state.dialog,
        beforeUnload: state.beforeUnload
    };
}, (dispatch) => {
    return {
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        },
        dispatchAccountVarUpdate: (value) => {
            dispatch({
                type: "player/accountVarUpdate",
                value: value
            });
        },
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        },
        dispatchPurchasePass: (value) => {
            dispatch({
                type: "purchasePass",
                value: value
            });
        },
        dispatchTvodPass: (value) => {
            dispatch({
                type: "tvodPass",
                value: value
            });
        },
        dispatchEpisodeDialog: (value) => {
            dispatch({
                type: "channel/watch/player/episodeDialog",
                value: value
            });
        }
    };
})((props) => {
    const player = useRef(null);
    const element = useRef(null);
    const vmx = useRef(null);
    const streamingPromise = useRef(Promise.resolve());
    const time = useRef(0);
    const timeMark = useRef(0);
    const ended = useRef(false);
    const urls = useRef(null);
    const streamingTimeout = useRef(null);
    const idleTimeout = useRef(null);
    const currentTimeInterval = useRef(null);

    const [errorCode, setErrorCode] = useState("");
    const [playerCallback, setPlayerCallback] = useState({});
    const [mask, setMask] = useState("");
    const [maskClick, setMaskClick] = useState(null);

    const preMask = tools.hook.usePrevious(mask);

    const playerCallbacks = useMemo(() => {
        return {
            impression: () => {
                setPlayerCallback({
                    type: "impression"
                });
            },
            ended: () => {
                setPlayerCallback({
                    type: "ended"
                });
            },
            pause: () => {
                setPlayerCallback({
                    type: "pause"
                });
            },
            mute: (event) => {
                setPlayerCallback({
                    type: "mute",
                    value: event
                });
            },
            clickSkip: (event) => {
                setPlayerCallback({
                    type: "clickSkip",
                    value: event
                });
            },
            fullscreen: () => {
                setPlayerCallback({
                    type: "fullscreen"
                });
            },
            fullscreenExit: () => {
                setPlayerCallback({
                    type: "fullscreenExit"
                });
            },
            linearAdMediaStart: (event, duration) => {
                setPlayerCallback({
                    type: "linearAdMediaStart",
                    value: {
                        event: event,
                        duration: duration
                    }
                });
            },
            linearAdMediaComplete: (event) => {
                setPlayerCallback({
                    type: "linearAdMediaComplete",
                    value: event
                });
            },
            pauseForAd: () => {
                setPlayerCallback({
                    type: "pauseForAd"
                });
            },
            resumeForAd: () => {
                setPlayerCallback({
                    type: "resumeForAd"
                });
            },
            clickPauseBanner: (banner) => {
                setPlayerCallback({
                    type: "clickPauseBanner",
                    value: banner
                });
            },
            clickLogo: (logo) => {
                setPlayerCallback({
                    type: "clickLogo",
                    value: logo
                });
            },
            publishCompanionAd: (event) => {
                setPlayerCallback({
                    type: "publishCompanionAd",
                    value: event
                });
            },
            collapseCompanionAd: (event) => {
                setPlayerCallback({
                    type: "collapseCompanionAd",
                    value: event
                });
            }
        }
    }, []);

    const pageType = useMemo(() => {
        return pageTypes[props.programInfo.content_type];
    }, [props.programInfo]);

    const streaming = useMemo(() => {
        return {
            startCheck: () => {
                clearTimeout(streamingTimeout.current);

                if(urls.current.result.PlayAds){
                    return;
                }

                let sessionId = urls.current.result.SessionId;

                if(props.login){
                    api.loadService.continueStreaming.getFetch(sessionId).then((data) => {
                        let result = data.result;

                        if(result){
                            if(result.Continue){
                                streamingTimeout.current = setTimeout(() => {
                                    streaming.startCheck();
                                }, result.MinRecheck * 1000);
                            }
                            else{
                                setMask("multipleStream");
                            }
                        }
                        else{
                            streamingTimeout.current = setTimeout(() => {
                                streaming.startCheck();
                            }, 60 * 1000);
                        }
                    }).catch((ex) => {
                        streamingTimeout.current = setTimeout(() => {
                            streaming.startCheck();
                        }, 60 * 1000);
                    });
                }
            },
            stopStreaming: (resolve) => {
                clearTimeout(streamingTimeout.current);

                if(mask || !props.login || !urls.current || !urls.current.result){
                    if(resolve){
                        resolve();
                    }

                    return;
                }

                let sessionId = urls.current.result.SessionId;
                
                api.loadService.stopStreaming.getFetch(sessionId).then((res) => {
                    if(resolve){
                        resolve();
                    }
                }).catch((ex) => {
                    if(resolve){
                        resolve();
                    }
                });
            }
        };
    }, [props.programInfo]);

    const idleOverHours = useMemo(() => {
        return {
            start: () => {
                let idleTime = 4 * 60 * 60 * 1000;

                if(pageType == "channel" && props.programInfo.content_type != "channel"){
                    idleTime = 8 * 60 * 60 * 1000;
                }

                clearTimeout(idleTimeout.current);

                idleTimeout.current = setTimeout(() => {
                    setMask("idleOverHours");
                }, idleTime);
            },
            stop: () => {
                clearTimeout(idleTimeout.current);
            }
        };
    }, [pageType, props.programInfo]);

    const currentTime = useMemo(() => {
        return {
            start: () => {
                clearInterval(currentTimeInterval.current);

                currentTimeInterval.current = setInterval(() => {
                    let _time = player.current.currentTime;
                    
                    if(_time < 0){
                        _time = 0;
                    }

                    time.current = _time;
                }, 1000);
            },
            stop: () => {
                clearInterval(currentTimeInterval.current);
            }
        }
    }, []);

    const reportTimeMark = useCallback(() => {
        //todo
    }, [props.programInfo]);

    const start = useCallback(() => {
        if(pageType == "vod"){
            if(props.programInfo.charge_mode == "X"){
                setMask("shelves");
            }
            else{
                if(props.programInfo.rating.age >= 18 && !props.ratingPass){
                    setMask("pcParental");
        
                    props.dispatchDialog({
                        component: "rating",
                        exitIcon: false
                    });
                }
                else{
                    getUrl();
                }
            }
        }
        else if(pageType == "channel"){
            getUrl();
        }
    }, [props.programInfo, props.ratingPass]);

    const getUrl = useCallback(() => {
        let getUrlAuth = (assetId, mediaType) => {
            props.dispatchLoading(true);

            streamingPromise.current = streamingPromise.current.then(() => {
                return new Promise((resolve, reject) => {
                    streaming.stopStreaming(resolve);
                });
            });

            streamingPromise.current = streamingPromise.current.then(() => {
                return new Promise((resolve, reject) => {
                    api.loadService.urls.getFetch(assetId, mediaType).then((data) => {
                        props.dispatchLoading(false);
                        
                        urls.current = data;

                        urlHandler();
                        resolve();
                    }).catch((ex) => {
                        resolve();
                    });
                });
            });
        };

        let getUrlNoAuth = (assetId, mediaType) => {
            props.dispatchLoading(true);

            api.loadService.urlsNoAuth.getFetch(assetId, mediaType).then((data) => {
                props.dispatchLoading(false);
                
                urls.current = data;

                urlHandler();
            });
        };

        if(pageType == "vod"){
            let assetId = props.programInfo.assets[0].asset_id;

            if(props.programInfo.charge_mode == "F"){
                if(props.login){
                    getUrlAuth(assetId, "vod");
                }
                else{
                    getUrlNoAuth(assetId, "vod");
                }
            }
            else{
                if(props.login){
                    getUrlAuth(assetId ,"vod");
                }
                else{
                    setMask("vodLogin");
                }
            }
        }
        else if(pageType == "channel"){
            let assetId = null;
            let mediaType = props.programInfo.content_type;
            
            if(props.programInfo.content_type == "channel"){
                assetId = props.programInfo.content_id;
            }
            else{
                assetId = props.programInfo.content_id + "#" + props.programInfo.vod_channel_schedule.focus_program.asset_id;
            }
            
            if(props.programInfo.charge_mode == "F"){
                if(props.login){
                    getUrlAuth(assetId, mediaType);
                }
                else{
                    getUrlNoAuth(assetId, mediaType);
                }
            }
            else{
                if(props.login){
                    getUrlAuth(assetId, mediaType);
                }
                else{
                    setMask("channelLogin");
                }
            }
        }
    }, [props.programInfo]);

    const urlHandler = useCallback(() => {
        if(!player.current){
            return;
        }

        props.setPlayerEvent({
            type: "urls",
            value: urls.current
        });

        ended.current = false;
        
        if(pageType == "vod"){
            if(urls.current.result){
                vmx.current = new watch.Vmx();

                setMask("");
                
                let remoteIp = litv.publicIp;
                let setting = watch.vod.getVodSetting(props.programInfo, urls.current.result, remoteIp, element.current);
                
                player.current.setSrc(setting);
                idleOverHours.start();
                currentTime.start();
                streaming.startCheck();
                timeMark.current = new Date().getTime();
            }
            else if(urls.current.error){
                if(urls.current.error.code == 42000075){
                    if(!props.login){
                        setMask("vodLogin");
                    }
                    else{
                        startPurchase();
                    }
                }
                else if(urls.current.error.code == -1){
                    if(!props.login){
                        setMask("vodLogin");
                    }
                    else{
                        setMask("playerError");
                        setErrorCode(String(urls.current.error.code));
                    }
                }
                else if(urls.current.error.code == 42000087){
                    setMask("outsideRegion");
                }
                else{
                    setMask("playerError");
                    setErrorCode(String(urls.current.error.code));
                }
            }
        }
        else if(pageType == "channel"){
            if(urls.current.result){
                vmx.current = new watch.Vmx();

                setMask("");
                
                let remoteIp = litv.publicIp;
                let setting = watch.channel.getChannelSetting(props.programInfo, urls.current.result, remoteIp, element.current);
                
                player.current.setSrc(setting);
                idleOverHours.start();
                currentTime.start();
                streaming.startCheck();
                timeMark.current = new Date().getTime();
            }
            else if(urls.current.error){
                if(urls.current.error.code == 42000075){
                    if(!props.login){
                        setMask("channelLogin");
                    }
                    else if(props.programInfo.trial){
                        api.account.promoEligible.getFetch(props.programInfo.trial).then((res) => {
                            let result = res.result;
                            let eligible = result.Eligible;

                            if(eligible){
                                setMask("channelTrial");
                            }
                            else{
                                startPurchase();
                            }
                        });
                    }
                    else{
                        startPurchase();
                    }
                }
            }
        }
    }, [props.programInfo]);

    const startPurchase = useCallback(() => {
        let isFind = false;
        let bsmPkgCategories = props.programInfo.package_info.bsm_pkg_categories;

        for(let i = 0; i < bsmPkgCategories.length; i ++){
            let bsmPkgCategory = bsmPkgCategories[i];
            let purchaseType = bsmPkgCategory.purchase_type

            if(purchaseType && purchaseType != "X"){
                isFind = true;

                setMask(bsmPkgCategory.image_key);

                break;
            }
        }

        if(!isFind){
            setMask("notAvailable");
        }
    }, [props.programInfo]);

    const addAccountVar = useCallback(() => {
        if(!props.login){
            return;
        }

        if(time.current <= 0){
            return;
        }

        if(pageType == "vod" && props.programInfo.content_type != "ent"){
            let promise = Promise.resolve();

            promise = promise.then(() => {
                return watch.vod.accountVar.init();
            });

            promise = promise.then((_accountVar) => {
                if(ended.current){
                    return watch.vod.accountVar.add(_accountVar, {
                        programInfo: props.programInfo,
                        time: 0
                    });
                }
                else{
                    return watch.vod.accountVar.add(_accountVar, {
                        programInfo: props.programInfo,
                        time: time.current
                    });
                }
            });

            promise = promise.then((_accountVar) => {
                return watch.vod.accountVar.update(_accountVar);
            });

            promise = promise.then(() => {
                props.dispatchAccountVarUpdate(new Date().getTime());
            });
        }
    }, [props.programInfo]);

    useEffect(() => {
        player.current = LiTVPlayer.create(element.current, {
            displayClickToUnMute: true
        });

        player.current.on(player.current.EVENT.IMPRESSION, playerCallbacks.impression);
        player.current.on(player.current.EVENT.ENDED, playerCallbacks.ended);
        player.current.on(player.current.EVENT.PAUSE, playerCallbacks.pause);
        player.current.on(player.current.EVENT.MUTE, playerCallbacks.mute);
        player.current.on(player.current.EVENT.CLICK_SKIP, playerCallbacks.clickSkip);
        player.current.on(player.current.EVENT.FULLSCREEN, playerCallbacks.fullscreen);
        player.current.on(player.current.EVENT.FULLSCREEN_EXIT, playerCallbacks.fullscreenExit);
        player.current.on(player.current.EVENT.LINEAR_AD_MEDIA_START, playerCallbacks.linearAdMediaStart);
        player.current.on(player.current.EVENT.LINEAR_AD_MEDIA_COMPLETE, playerCallbacks.linearAdMediaComplete);
        player.current.on(player.current.EVENT.PAUSE_FOR_AD, playerCallbacks.pauseForAd);
        player.current.on(player.current.EVENT.RESUM_FOR_AD, playerCallbacks.resumeForAd);
        player.current.on(player.current.EVENT.CLICK_PAUSE_BANNER, playerCallbacks.clickPauseBanner);
        player.current.on(player.current.EVENT.PAUSE_BANNER_IMPRESSION, playerCallbacks.pauseBannerImpression);
        player.current.on(player.current.EVENT.CLICK_LOGO, playerCallbacks.clickLogo);
        player.current.on(player.current.EVENT.PUBLISH_COMPANION_AD, playerCallbacks.publishCompanionAd);
        player.current.on(player.current.EVENT.COLLAPSE_COMPANION_AD, playerCallbacks.collapseCompanionAd);

        return () => {
            player.current.stop();
            player.current.destroy();
            player.current = null;
            idleOverHours.stop();
            currentTime.stop();
            reportTimeMark();
        };
    }, []);

    useEffect(() => {
        let encodeHref = encodeURIComponent(location.href);
        let src = `https://sb.scorecardresearch.com/p?c1=8&c2=18986219&c3=1&c4=${encodeHref}&rn=${new Date().getTime()}&cj=1`;

        tools.importImage(src);
    }, []);

    useEffect(() => {
        start();

        return () => {
            if(player.current){
                reportTimeMark();
            }
            else{
                streaming.stopStreaming();
                addAccountVar();
            }
        };
    }, [props.programInfo]);

    useEffect(() => {
        if(props.ratingPass && mask == "pcParental"){
            start();
        }
    }, [props.ratingPass]);

    useEffect(() => {
        if(props.purchasePass && (mask == "vodPurchase" || mask == "deluxPurchase" || mask == "channelPurchase")){
            props.dispatchPurchasePass(false);
            start();
        }
    }, [props.purchasePass]);

    useEffect(() => {
        if(props.tvodPass && mask == "tvodPurchase"){
            props.dispatchTvodPass(false);
            start();
        }
    }, [props.tvodPass]);

    useEffect(() => {
        if(props.login && (mask == "vodLogin" || mask == "channelLogin")){
            start();
        }
    }, [props.login]);

    useEffect(() => {
        if(!maskClick){
            return;
        }

        if(maskClick.component == "pcParental"){
            props.dispatchDialog({
                component: "rating",
                exitIcon: false
            });
        }
        else if(maskClick.component == "vodLogin"){
            props.dispatchDialog({
                component: "login"
            });
        }
        else if(maskClick.component == "idleOverHours"){
            let programInfo = _.cloneDeep(props.programInfo);

            if(pageType == "vod"){
                if(ended.current){
                    delete programInfo.time;
                }
                else if(time.current){
                    programInfo.time = time.current;
                }
            }
            
            props.setPlayerEvent({
                type: "programInfo",
                value: programInfo
            });
        }
        else if(maskClick.component == "channelLogin"){
            props.dispatchDialog({
                component: "login"
            });
        }
        else if(maskClick.component == "channelTrial"){
            props.dispatchDialog({
                component: "channelTrial",
                information: {
                    callback: () => {
                        props.setPlayerEvent({
                            type: "trial",
                            value: props.programInfo
                        });
                    }
                }
            });
        }
        else if(maskClick.component == "tvodPurchase"){
            props.dispatchDialog({
                component: "tvod",
                information: props.programInfo
            });
        }
        else if(maskClick.component == "vodPurchase"){
            props.dispatchDialog({
                component: "packageInfo",
                information: "ALL"
            });
        }
        else if(maskClick.component == "channelPurchase"){
            props.dispatchDialog({
                component: "packageInfo",
                information: "CHANNEL_A"
            });
        }
        else if(maskClick.component == "deluxPurchase"){
            props.dispatchDialog({
                component: "packageInfo",
                information: "VOD_CHANNEL_DELUX"
            });
        }
    }, [maskClick]);

    useEffect(() => {
        if(mask == "idleOverHours"){
            addAccountVar();
        }

        if(!preMask && mask){
            player.current.stop();
            player.current.fullscreen(false);
            idleOverHours.stop();
            currentTime.stop();
            streaming.stopStreaming();
            reportTimeMark();
        }
    }, [mask]);

    useEffect(() => {
        if(props.visibilityState == "hidden"){
            addAccountVar();
        }
    }, [props.visibilityState]);

    useEffect(() => {
        if(props.dialog){
            player.current.fullscreen(false);
        }
    }, [props.dialog]);

    useEffect(() => {
        if(props.beforeUnload){
            addAccountVar();
        }
    }, [props.beforeUnload]);

    useEffect(() => {
        if(props.seek){
            player.current.seek(props.seek.position);
        }
    }, [props.seek]);

    useEffect(() => {
        if(playerCallback.type == "impression"){
            props.setPlayerEvent({
                type: "impression",
                value: new Date().getTime()
            });

            if(pageType == "vod"){
                vmx.current.onContentVod(props.programInfo);
            }
            else if(pageType == "channel"){
                vmx.current.onContentLive(props.programInfo);
            }
        }
        else if(playerCallback.type == "ended"){
            vmx.current.onStop();
            ended.current = true;

            if(pageType == "vod"){
                addAccountVar();
            }

            props.setPlayerEvent({
                type: "ended",
                value: new Date().getTime()
            });
        }
        else if(playerCallback.type == "pause"){
            addAccountVar();
        }
        else if(playerCallback.type == "mute"){
            let event = playerCallback.value;

            if(!event.muted){
                //todo
            }
        }
        else if(playerCallback.type == "clickSkip"){
            let title = props.programInfo.title;
            //todo
            props.dispatchDialog({
                component: "skipAd",
                information: {
                    href: playerCallback.value.href,
                    title: title
                }
            });
        }
        else if(playerCallback.type == "fullscreen"){
            props.setPlayerEvent({
                type: "fullscreen"
            });
        }
        else if(playerCallback.type == "fullscreenExit"){
            props.setPlayerEvent({
                type: "fullscreenExit"
            });
        }
        else if(playerCallback.type == "linearAdMediaStart"){
            let event = playerCallback.value.event;
            let duration = playerCallback.value.duration;
            
            if(event.trunkType != "jingle"){
                if(event.partType == "house_ad" || event.partType == "comm_ad"){
                    props.setPlayerEvent({
                        type: "companionAd",
                        value: null
                    });
                }
            }

            if(pageType == "vod"){
                if(event.trunkType == "prerolls"){
                    vmx.current.onPrerollAd(duration);
                }
                else if(event.trunkType == "midrolls"){
                    vmx.current.onMidrollAd(duration);
                }
                else if(event.trunkType == "postrolls"){
                    vmx.current.onPostrollAd(duration);
                }
            }
            else if(pageType == "channel"){
                if(event.trunkType != "jingle"){
                    vmx.current.onLiveAd(duration);
                }
            }
        }
        else if(playerCallback.type == "linearAdMediaComplete"){
            let event = playerCallback.value;

            if(event.trunkType != "jingle"){
                vmx.current.onStop();
            }
        }
        else if(playerCallback.type == "pauseForAd"){
            vmx.current.onStop();
        }
        else if(playerCallback.type == "resumeForAd"){
            if(pageType == "vod"){
                vmx.current.onContentVod(props.programInfo);
            }
            else if(pageType == "channel"){
                vmx.current.onContentLive(props.programInfo);
            }
        }
        else if(playerCallback.type == "clickPauseBanner"){
            //todo
        }
        else if(playerCallback.type == "clickLogo"){
            //todo
        }
        else if(playerCallback.type == "publishCompanionAd"){
            let event = playerCallback.value;

            if(event.adType == "companionAd"){
                props.setPlayerEvent({
                    type: "companionAd",
                    value: event.meta
                });
            }
        }
        else if(playerCallback.type == "collapseCompanionAd"){
            let event = playerCallback.value;

            if(event.adType == "companionAd"){
                props.setPlayerEvent({
                    type: "companionAd",
                    value: null
                });
            }
        }
    }, [playerCallback]);

    useEffect(() => {
        if(props.displayEndAd){
            player.current.displayEndAd();
        }
    }, [props.displayEndAd]);

    const episodeType = useMemo(() => {
        if(props.programInfo.content_type == "channel"){
            return "channel_btn";
        }
        else if(props.programInfo.content_type == "vod-channel" || props.programInfo.content_type == "playout-channel"){
            if(props.programInfo.selectable == 0){
                return "channel_btn";
            }
            return "vod_btn";
        }
    }, [props.programInfo])

    const episodeBtnClickHandler = useCallback((event, programInfo) => {
        event.preventDefault();
        props.dispatchEpisodeDialog(programInfo);
    },[props.programInfo])

    return (
        <>  
            <div className="screen_display_section">
                <div className="player_element" ref={element}></div>

                {
                    (() => {
                        if(mask){
                            return (
                                <Mask programInfo={props.programInfo} mask={mask} time={time} errorCode={errorCode} setMaskClick={setMaskClick} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(props.programInfo && !mask){
                            return(
                                <div className={`episode_btn ${episodeType}`} onClick={(event) => episodeBtnClickHandler(event, props.programInfo)}></div>
                            )
                        }
                    })()
                }
            </div >

            <style jsx>
                {`
                    .screen_display_section{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;

                        .player_element{
                            position: relative;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }

                        &:hover .episode_btn{
                            position: absolute;
                            top: 50%;
			                right: 0px;
                            transform: translateY(-50%);
                            width: 40px;
			                height: 72px;
                            cursor: pointer;
                            background-size: cover;

                            &.channel_btn{
                                background-image: url(${require("../../assets/image/channel/player/player_btn_live_normal.svg")});
                
                                &:hover{
                                    background-image: url(${require("../../assets/image/channel/player/player_btn_live_hover.svg")});
                                }
                            }

                            &.vod_btn{
                                background-image: url(${require("../../assets/image/channel/player/player_btn_episode_normal.svg")});
                
                                &:hover{
                                    background-image: url(${require("../../assets/image/channel/player/player_btn_episode_hover.svg")});
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
});

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {};
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {};
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            return (
                <>
                    {
                        (() => {
                            if(props.programInfo && props.setPlayerEvent){
                                return (
                                    <App programInfo={props.programInfo} setPlayerEvent={props.setPlayerEvent} seek={props.seek} displayEndAd={props.displayEndAd} />
                                );
                            }
                        })()
                    }
                </>
            );
        }));
    })
}, {
    ssr: false
});
/*
const mapStateToProps = (state) => {
    return {
        ratingPass: state.ratingPass,
        purchasePass: state.purchasePass,
        tvodPass: state.tvodPass,
        login: state.login,
        visibilityState: state.visibilityState,
        dialog: state.dialog,
        beforeUnload: state.beforeUnload
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
        dispatchAccountVarUpdate: (value) => {
            dispatch({
                type: "player/accountVarUpdate",
                value: value
            });
        },
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        },
        dispatchPurchasePass: (value) => {
            dispatch({
                type: "purchasePass",
                value: value
            });
        },
        dispatchTvodPass: (value) => {
            dispatch({
                type: "tvodPass",
                value: value
            });
        }
    };
};

const App = (props) => {
    const player = useRef(null);
    const element = useRef(null);
    const vmx = useRef(null);
    const streamingPromise = useRef(Promise.resolve());
    const time = useRef(0);
    const timeMark = useRef(0);
    const ended = useRef(false);
    const urls = useRef(null);
    const streamingTimeout = useRef(null);
    const idleTimeout = useRef(null);
    const currentTimeInterval = useRef(null);

    const [errorCode, setErrorCode] = useState("");
    const [playerCallback, setPlayerCallback] = useState({});
    const [mask, setMask] = useState("");
    const [maskClick, setMaskClick] = useState(null);

    const preMask = tools.hook.usePrevious(mask);

    const playerCallbacks = useMemo(() => {
        return {
            impression: () => {
                setPlayerCallback({
                    type: "impression"
                });
            },
            ended: () => {
                setPlayerCallback({
                    type: "ended"
                });
            },
            pause: () => {
                setPlayerCallback({
                    type: "pause"
                });
            },
            mute: (event) => {
                setPlayerCallback({
                    type: "mute",
                    value: event
                });
            },
            clickSkip: (event) => {
                setPlayerCallback({
                    type: "clickSkip",
                    value: event
                });
            },
            fullscreen: () => {
                setPlayerCallback({
                    type: "fullscreen"
                });
            },
            linearAdMediaStart: (event, duration) => {
                setPlayerCallback({
                    type: "linearAdMediaStart",
                    value: {
                        event: event,
                        duration: duration
                    }
                });
            },
            linearAdMediaComplete: (event) => {
                setPlayerCallback({
                    type: "linearAdMediaComplete",
                    value: event
                });
            },
            pauseForAd: () => {
                setPlayerCallback({
                    type: "pauseForAd"
                });
            },
            resumeForAd: () => {
                setPlayerCallback({
                    type: "resumeForAd"
                });
            },
            clickPauseBanner: (banner) => {
                setPlayerCallback({
                    type: "clickPauseBanner",
                    value: banner
                });
            },
            clickLogo: (logo) => {
                setPlayerCallback({
                    type: "clickLogo",
                    value: logo
                });
            },
            publishCompanionAd: (event) => {
                setPlayerCallback({
                    type: "publishCompanionAd",
                    value: event
                });
            },
            collapseCompanionAd: (event) => {
                setPlayerCallback({
                    type: "collapseCompanionAd",
                    value: event
                });
            }
        }
    }, []);

    const pageType = useMemo(() => {
        return pageTypes[props.programInfo.content_type];
    }, [props.programInfo]);

    const streaming = useMemo(() => {
        return {
            startCheck: () => {
                clearTimeout(streamingTimeout.current);

                if(urls.current.result.PlayAds){
                    return;
                }

                let sessionId = urls.current.result.SessionId;

                if(props.login){
                    api.loadService.continueStreaming.getFetch(sessionId).then((data) => {
                        let result = data.result;

                        if(result){
                            if(result.Continue){
                                streamingTimeout.current = setTimeout(() => {
                                    streaming.startCheck();
                                }, result.MinRecheck * 1000);
                            }
                            else{
                                setMask("multipleStream");
                            }
                        }
                        else{
                            streamingTimeout.current = setTimeout(() => {
                                streaming.startCheck();
                            }, 60 * 1000);
                        }
                    }).catch((ex) => {
                        streamingTimeout.current = setTimeout(() => {
                            streaming.startCheck();
                        }, 60 * 1000);
                    });
                }
            },
            stopStreaming: (resolve) => {
                clearTimeout(streamingTimeout.current);

                if(mask || !props.login || !urls.current || !urls.current.result){
                    if(resolve){
                        resolve();
                    }

                    return;
                }

                let sessionId = urls.current.result.SessionId;
                
                api.loadService.stopStreaming.getFetch(sessionId).then((res) => {
                    if(resolve){
                        resolve();
                    }
                }).catch((ex) => {
                    if(resolve){
                        resolve();
                    }
                });
            }
        };
    }, [props.programInfo]);

    const idleOverHours = useMemo(() => {
        return {
            start: () => {
                clearTimeout(idleTimeout.current);

                idleTimeout.current = setTimeout(() => {
                    setMask("idleOverHours");
                }, 4 * 60 * 60 * 1000);
            },
            stop: () => {
                clearTimeout(idleTimeout.current);
            }
        };
    }, []);

    const currentTime = useMemo(() => {
        return {
            start: () => {
                clearInterval(currentTimeInterval.current);

                currentTimeInterval.current = setInterval(() => {
                    let _time = player.current.currentTime;
                    
                    if(_time < 0){
                        _time = 0;
                    }

                    time.current = _time;
                }, 1000);
            },
            stop: () => {
                clearInterval(currentTimeInterval.current);
            }
        }
    }, []);

    const reportTimeMark = useCallback(() => {
        //todo
    }, [props.programInfo]);

    const start = useCallback(() => {
        if(pageType == "vod"){
            if(props.programInfo.charge_mode == "X"){
                setMask("shelves");
            }
            else{
                if(props.programInfo.rating.age >= 18 && !props.ratingPass){
                    setMask("pcParental");
        
                    props.dispatchDialog({
                        component: "rating",
                        exitIcon: false
                    });
                }
                else{
                    getUrl();
                }
            }
        }
        else if(pageType == "channel"){
            //todo
        }
    }, [props.programInfo, props.ratingPass]);

    const getUrl = useCallback(() => {
        let getUrlAuth = (assetId, mediaType) => {
            props.dispatchLoading(true);

            streamingPromise.current = streamingPromise.current.then(() => {
                return new Promise((resolve, reject) => {
                    streaming.stopStreaming(resolve);
                });
            });

            streamingPromise.current = streamingPromise.current.then(() => {
                return new Promise((resolve, reject) => {
                    api.loadService.urls.getFetch(assetId, mediaType).then((data) => {
                        props.dispatchLoading(false);
                        
                        urls.current = data;

                        urlHandler();
                        resolve();
                    }).catch((ex) => {
                        resolve();
                    });
                });
            });
        };

        let getUrlNoAuth = (assetId, mediaType) => {
            props.dispatchLoading(true);

            api.loadService.urlsNoAuth.getFetch(assetId, mediaType).then((data) => {
                props.dispatchLoading(false);
                
                urls.current = data;

                urlHandler();
            });
        };

        if(pageType == "vod"){
            let assetId = props.programInfo.assets[0].asset_id;

            if(props.programInfo.charge_mode == "F"){
                if(props.login){
                    getUrlAuth(assetId, "vod");
                }
                else{
                    getUrlNoAuth(assetId, "vod");
                }
            }
            else{
                if(props.login){
                    getUrlAuth(assetId ,"vod");
                }
                else{
                    setMask("vodLogin");
                }
            }
        }
        else if(pageType == "channel"){
            //todo
        }
    }, [props.programInfo]);

    const urlHandler = useCallback(() => {
        if(!player.current){
            return;
        }

        props.setPlayerEvent({
            type: "urls",
            value: urls.current
        });

        ended.current = false;

        if(pageType == "vod"){
            if(urls.current.result){
                vmx.current = new watch.Vmx();

                setMask("");
                
                let remoteIp = litv.publicIp;
                let setting = watch.vod.getVodSetting(props.programInfo, urls.current.result, remoteIp);
                
                player.current.setSrc(setting);
                idleOverHours.start();
                currentTime.start();
                streaming.startCheck();
                timeMark.current = new Date().getTime();
            }
            else if(urls.current.error){
                if(urls.current.error.code == 42000075){
                    if(!props.login){
                        setMask("vodLogin");
                    }
                    else{
                        startPurchase();
                    }
                }
                else if(urls.current.error.code == -1){
                    if(!props.login){
                        setMask("vodLogin");
                    }
                    else{
                        setMask("playerError");
                        setErrorCode(String(urls.current.error.code));
                    }
                }
                else if(urls.current.error.code == 42000087){
                    setMask("outsideRegion");
                }
                else{
                    setMask("playerError");
                    setErrorCode(String(urls.current.error.code));
                }
            }
        }
        else if(pageType == "channel"){
            //todo
        }
    }, [props.programInfo]);

    const startPurchase = useCallback(() => {
        let isFind = false;
        let bsmPkgCategories = props.programInfo.package_info.bsm_pkg_categories;

        for(let i = 0; i < bsmPkgCategories.length; i ++){
            let bsmPkgCategory = bsmPkgCategories[i];
            let purchaseType = bsmPkgCategory.purchase_type

            if(purchaseType && purchaseType != "X"){
                isFind = true;

                setMask(bsmPkgCategory.image_key);

                break;
            }
        }

        if(!isFind){
            setMask("notAvailable");
        }
    }, [props.programInfo]);

    const addAccountVar = useCallback(() => {
        if(!props.login){
            return;
        }

        if(time.current <= 0){
            return;
        }

        if(pageType == "vod" && props.programInfo.content_type != "ent"){
            let promise = Promise.resolve();

            promise = promise.then(() => {
                return watch.vod.accountVar.init();
            });

            promise = promise.then((_accountVar) => {
                if(ended.current){
                    return watch.vod.accountVar.add(_accountVar, {
                        programInfo: props.programInfo,
                        time: 0
                    });
                }
                else{
                    return watch.vod.accountVar.add(_accountVar, {
                        programInfo: props.programInfo,
                        time: time.current
                    });
                }
            });

            promise = promise.then((_accountVar) => {
                return watch.vod.accountVar.update(_accountVar);
            });

            promise = promise.then(() => {
                props.dispatchAccountVarUpdate(new Date().getTime());
            });
        }
    }, [props.programInfo]);

    useEffect(() => {
        player.current = LiTVPlayer.create(element.current, {
            displayClickToUnMute: true
        });

        player.current.on(player.current.EVENT.IMPRESSION, playerCallbacks.impression);
        player.current.on(player.current.EVENT.ENDED, playerCallbacks.ended);
        player.current.on(player.current.EVENT.PAUSE, playerCallbacks.pause);
        player.current.on(player.current.EVENT.MUTE, playerCallbacks.mute);
        player.current.on(player.current.EVENT.CLICK_SKIP, playerCallbacks.clickSkip);
        player.current.on(player.current.EVENT.FULLSCREEN, playerCallbacks.fullscreen);
        player.current.on(player.current.EVENT.LINEAR_AD_MEDIA_START, playerCallbacks.linearAdMediaStart);
        player.current.on(player.current.EVENT.LINEAR_AD_MEDIA_COMPLETE, playerCallbacks.linearAdMediaComplete);
        player.current.on(player.current.EVENT.PAUSE_FOR_AD, playerCallbacks.pauseForAd);
        player.current.on(player.current.EVENT.RESUM_FOR_AD, playerCallbacks.resumeForAd);
        player.current.on(player.current.EVENT.CLICK_PAUSE_BANNER, playerCallbacks.clickPauseBanner);
        player.current.on(player.current.EVENT.PAUSE_BANNER_IMPRESSION, playerCallbacks.pauseBannerImpression);
        player.current.on(player.current.EVENT.CLICK_LOGO, playerCallbacks.clickLogo);
        player.current.on(player.current.EVENT.PUBLISH_COMPANION_AD, playerCallbacks.publishCompanionAd);
        player.current.on(player.current.EVENT.COLLAPSE_COMPANION_AD, playerCallbacks.collapseCompanionAd);

        return () => {
            player.current.stop();
            player.current.destroy();
            player.current = null;
            idleOverHours.stop();
            currentTime.stop();
            reportTimeMark();
        };
    }, []);

    useEffect(() => {
        start();

        return () => {
            if(player.current){
                reportTimeMark();
            }
            else{
                streaming.stopStreaming();
                addAccountVar();
            }
        };
    }, [props.programInfo]);

    useEffect(() => {
        if(props.ratingPass && mask == "pcParental"){
            start();
        }
    }, [props.ratingPass]);

    useEffect(() => {
        if(props.purchasePass && (mask == "vodPurchase" || mask == "deluxPurchase" || mask == "channelPurchase")){
            props.dispatchPurchasePass(false);
            start();
        }
    }, [props.purchasePass]);

    useEffect(() => {
        if(props.tvodPass && mask == "tvodPurchase"){
            props.dispatchTvodPass(false);
            start();
        }
    }, [props.tvodPass]);

    useEffect(() => {
        if(props.login && (mask == "vodLogin" || mask == "channelLogin")){
            start();
        }
    }, [props.login]);

    useEffect(() => {
        if(!maskClick){
            return;
        }

        if(maskClick.component == "pcParental"){
            props.dispatchDialog({
                component: "rating",
                exitIcon: false
            });
        }
        else if(maskClick.component == "vodLogin"){
            props.dispatchDialog({
                component: "login"
            });
        }
        else if(maskClick.component == "idleOverHours"){
            let programInfo = _.cloneDeep(props.programInfo);

            if(pageType == "vod"){
                if(ended.current){
                    delete programInfo.time;
                }
                else if(time.current){
                    programInfo.time = time.current;
                }
            }
            
            props.setPlayerEvent({
                type: "programInfo",
                value: programInfo
            });
        }
        else if(maskClick.component == "channelLogin"){
            
        }
        else if(maskClick.component == "channelTrial"){
            
        }
        else if(maskClick.component == "tvodPurchase"){
            props.dispatchDialog({
                component: "tvod",
                information: props.programInfo
            });
        }
        else if(maskClick.component == "vodPurchase"){
            props.dispatchDialog({
                component: "packageInfo",
                information: "ALL"
            });
        }
        else if(maskClick.component == "channelPurchase"){
            props.dispatchDialog({
                component: "packageInfo",
                information: "CHANNEL_A"
            });
        }
        else if(maskClick.component == "deluxPurchase"){
            props.dispatchDialog({
                component: "packageInfo",
                information: "VOD_CHANNEL_DELUX"
            });
        }
    }, [maskClick]);

    useEffect(() => {
        if(mask == "idleOverHours"){
            addAccountVar();
        }

        if(!preMask && mask){
            player.current.stop();
            player.current.fullscreen(false);
            idleOverHours.stop();
            currentTime.stop();
            streaming.stopStreaming();
            reportTimeMark();
        }
    }, [mask]);

    useEffect(() => {
        if(props.visibilityState == "hidden"){
            addAccountVar();
        }
    }, [props.visibilityState]);

    useEffect(() => {
        if(props.dialog){
            player.current.fullscreen(false);
        }
    }, [props.dialog]);

    useEffect(() => {
        if(props.beforeUnload){
            addAccountVar();
        }
    }, [props.beforeUnload]);

    useEffect(() => {
        if(props.seek){
            player.current.seek(props.seek.position);
        }
    }, [props.seek]);

    useEffect(() => {
        if(playerCallback.type == "impression"){
            props.setPlayerEvent({
                type: "impression",
                value: new Date().getTime()
            });

            if(pageType == "vod"){
                vmx.current.onContentVod(props.programInfo);
            }
            else if(pageType == "channel"){
                vmx.current.onContentLive(props.programInfo);
            }
        }
        else if(playerCallback.type == "ended"){
            vmx.current.onStop();
            ended.current = true;

            if(pageType == "vod"){
                addAccountVar();

                props.setPlayerEvent({
                    type: "ended",
                    value: new Date().getTime()
                });
            }
            else if(_this.pageType == "channel"){
                //todo
            }
        }
        else if(playerCallback.type == "pause"){
            addAccountVar();
        }
        else if(playerCallback.type == "mute"){
            let event = playerCallback.value;

            if(!event.muted){
                //todo
            }
        }
        else if(playerCallback.type == "clickSkip"){
            let title = props.programInfo.title;
            //todo
            props.dispatchDialog({
                component: "skipAd",
                information: {
                    href: event.href,
                    title: title
                }
            });
        }
        else if(playerCallback.type == "fullscreen"){
            //todo
        }
        else if(playerCallback.type == "linearAdMediaStart"){
            let event = playerCallback.value.event;
            let duration = playerCallback.value.duration;
            
            if(event.trunkType != "jingle"){
                if(event.partType == "house_ad" || event.partType == "comm_ad"){
                    props.setPlayerEvent({
                        type: "companionAd",
                        value: null
                    });
                }
            }

            if(pageType == "vod"){
                if(event.trunkType == "prerolls"){
                    vmx.current.onPrerollAd(duration);
                }
                else if(event.trunkType == "midrolls"){
                    vmx.current.onMidrollAd(duration);
                }
                else if(event.trunkType == "postrolls"){
                    vmx.current.onPostrollAd(duration);
                }
            }
            else if(_this.pageType == "channel"){
                if(event.trunkType != "jingle"){
                    vmx.current.onLiveAd(duration);
                }
            }
        }
        else if(playerCallback.type == "linearAdMediaComplete"){
            let event = playerCallback.value;

            if(event.trunkType != "jingle"){
                vmx.current.onStop();
            }
        }
        else if(playerCallback.type == "pauseForAd"){
            vmx.current.onStop();
        }
        else if(playerCallback.type == "resumeForAd"){
            if(pageType == "vod"){
                vmx.current.onContentVod(props.programInfo);
            }
            else if(pageType == "channel"){
                vmx.current.onContentLive(props.programInfo);
            }
        }
        else if(playerCallback.type == "clickPauseBanner"){
            //todo
        }
        else if(playerCallback.type == "clickLogo"){
            //todo
        }
        else if(playerCallback.type == "publishCompanionAd"){
            let event = playerCallback.value;

            if(event.adType == "companionAd"){
                props.setPlayerEvent({
                    type: "companionAd",
                    value: event.meta
                });
            }
        }
        else if(playerCallback.type == "collapseCompanionAd"){
            let event = playerCallback.value;

            if(event.adType == "companionAd"){
                props.setPlayerEvent({
                    type: "companionAd",
                    value: null
                });
            }
        }
    }, [playerCallback]);

    useEffect(() => {
        if(props.displayEndAd){
            player.current.displayEndAd();
        }
    }, [props.displayEndAd]);

    return (
        <>  
            <section className="screen_display_section">
                <div className="player_element" ref={element}></div>

                {
                    (() => {
                        if(mask){
                            return (
                                <Mask programInfo={props.programInfo} mask={mask} time={time} errorCode={errorCode} setMaskClick={setMaskClick} />
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .screen_display_section{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;

                        .player_element{
                            position: relative;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    programInfo: PropTypes.object.isRequired,
    setPlayerEvent: PropTypes.func.isRequired,
    seek: PropTypes.object,
    displayEndAd: PropTypes.number
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
*/