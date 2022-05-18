
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import contentTypeMap from "../../../../assets/json/content/contentTypeMap.json";
import promoMap from "../../../../assets/json/player/promo.json";
import promoAd from "../../../../assets/json/player/promoAd.json";

import Player from "../../../../components/player/index.jsx";
import Tabs from "../player/tabs/index.jsx";
import BreadCrumb from "../../../breadCrumb/index.jsx";

import watch from "../../../../assets/js/watch/index.js";
import api from "../../../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {
        seek: state.vod.watch.videoSeek,
        fbReady: state.fbReady
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchToast: (message) => {
            dispatch({
                type: "toast",
                value: message
            });
        },
        dispatchProgramInfo: (programInfo) => {
            dispatch({
                type: "vod/watch/programInfo",
                value: programInfo
            });
        },
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        },
        dispatchVideoImpression: (value) => {
            dispatch({
                type: "vod/watch/videoImpression",
                value: value
            });
        },
        dispatchVideoCompanionAd: (value) => {
            dispatch({
                type: "vod/watch/videoCompanionAd",
                value: value
            });
        },
        dispatchVideoUrls: (value) => {
            dispatch({
                type: "vod/watch/videoUrls",
                value: value
            });
        },
        dispatchVideoSeek: (value) => {
            dispatch({
                type: "vod/watch/videoSeek",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [playerEvent, setPlayerEvent] = useState(null);
    const [displayEndAd, setDisplayEndAd] = useState(0);

    const cdnStatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const breadCrumb = useMemo(() => {
        let _breadCrumb = new Array();

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
    }, [props.programInfo]);

    const promote = useMemo(() => {
        let contentType = props.programInfo.content_type;

        return promoMap[contentType];
    }, [props.programInfo]);

    const title = useMemo(() => {
        return props.programInfo.title;
    }, [props.programInfo]);

    const secondaryMark = useMemo(() => {
        return props.programInfo.secondary_mark;
    }, [props.programInfo]);

    const alt = useMemo(() => {
        let _alt = "";

        if(title){
            _alt += title;
        }

        if(secondaryMark){
            _alt += secondaryMark;
        }

        return _alt;
    }, [title, secondaryMark]);

    const imgSrc = useMemo(() => {
        let src = "";

        if(props.programInfo.video_image){
            src = `${cdnStatic}/${props.programInfo.video_image}`;
        }
        else if(props.programInfo.picture){
            src = `${cdnStatic}/${props.programInfo.picture}`;
        }

        src = src.replace("-S", "");

        return src;
    }, [props.programInfo]);

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
            props.dispatchVideoImpression(playerEvent.value);
        }
        else if(playerEvent.type == "companionAd"){
            props.dispatchVideoCompanionAd({
                value: playerEvent.value
            });
        }
        else if(playerEvent.type == "urls"){
            props.dispatchVideoUrls(playerEvent.value);
        }
        else if(playerEvent.type == "programInfo"){
            props.dispatchProgramInfo(playerEvent.value);
        }
        else if(playerEvent.type == "ended"){
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

                    props.dispatchProgramInfo(programInfo);
                });
            }
        }
    }, [playerEvent]);

    useEffect(() => {
        return () => {
            props.dispatchVideoImpression(0);
            props.dispatchVideoCompanionAd(null);
            props.dispatchVideoUrls(null);
            props.dispatchVideoSeek(null);
        };
    }, []);

    useEffect(() => {
        if(props.fbReady){
            FB.XFBML.parse();
        }
    }, [props.fbReady]);

    return (
        <>  
            <div className="player_section">
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
                                    if(imgSrc){
                                        return (
                                            <>  
                                                <img className="background_img" src={imgSrc} alt="background" />
                                                <img className="img" src={imgSrc} alt={alt} />
                                            </>
                                        );
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if(props.playerProgramInfo){
                                        return (
                                            <Player setPlayerEvent={setPlayerEvent} programInfo={props.playerProgramInfo} displayEndAd={displayEndAd} seek={props.seek} />
                                        );
                                    }
                                })()
                            }
                        </div>
                        
                        <div className="bottom_section">
                            <button className="fb_share_btn" onClick={fbShareBtnClickHandler}></button>
                            <button className="url_share_btn" onClick={copyBtnClickHandler}></button>
                            <div className="fb-like" data-href="https://www.facebook.com/LiTVfans?fref=ts" data-send="false" data-width="150" data-show-faces="false" data-layout="button_count"></div>
                            <a className="line_btn" href="http://bit.ly/2ROGn0C" target="_blank" title="加入Line好友"></a>
                            <a className="download_app_btn" href="http://hyperurl.co/litvwebplayer" target="_blank" title="LiTV App下載"></a>
                        </div>
                        
                        {
                            (() => {
                                if(promoAd.data && promoAd.exclude.indexOf(props.programInfo.content_type) == -1){
                                    return (
                                        <a className="promo_ad" href={promoAd.data.href} title={promoAd.data.title} target={promoAd.data.target}>
                                            <img className="ad_img" src={require("../../../../assets/image/player/promote/" + promoAd.data.src)} alt={promoAd.data.title} />
                                        </a>
                                    );
                                }
                            })()
                        }
                    </div>
                    
                    <div className="right_section">
                        <Tabs programInfo={props.programInfo} relatedProgram={props.relatedProgram} episodes={props.episodes} rank={props.rank} focusTree={props.focusTree} />
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .player_section{
                        background-color: #333;

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
                                        background-image: url(${require("../../../../assets/image/icon/fb.png")});
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
                                        background-image: url(${require("../../../../assets/image/icon/copy.png")});
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
                                        background-image: url(${require("../../../../assets/image/footer/line/add.png")});
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
                                        background-image: url(${require("../../../../assets/image/player/download_app.png")});
                                        background-size: 100% 100%;
                                    }
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
    programInfo: PropTypes.object.isRequired,
    playerProgramInfo: PropTypes.object,
    relatedProgram: PropTypes.object,
    episodes: PropTypes.object,
    focusTree: PropTypes.object,
    rank: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
/*
const App = connect((state) => {
    return {
        seek: state.vod.watch.videoSeek
    };
}, (dispatch) => {
    return {
        dispatchToast: (message) => {
            dispatch({
                type: "toast",
                value: message
            });
        },
        dispatchProgramInfo: (programInfo) => {
            dispatch({
                type: "vod/watch/programInfo",
                value: programInfo
            });
        },
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        },
        dispatchVideoImpression: (value) => {
            dispatch({
                type: "vod/watch/videoImpression",
                value: value
            });
        },
        dispatchVideoCompanionAd: (value) => {
            dispatch({
                type: "vod/watch/videoCompanionAd",
                value: value
            });
        },
        dispatchVideoUrls: (value) => {
            dispatch({
                type: "vod/watch/videoUrls",
                value: value
            });
        },
        dispatchVideoSeek: (value) => {
            dispatch({
                type: "vod/watch/videoSeek",
                value: value
            });
        }
    };
})((props) => {
    const [playerEvent, setPlayerEvent] = useState(null);
    const [displayEndAd, setDisplayEndAd] = useState(0);

    const cdnStatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const breadCrumb = useMemo(() => {
        let _breadCrumb = new Array();

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
    }, [props.programInfo]);

    const promote = useMemo(() => {
        let contentType = props.programInfo.content_type;

        return promoMap[contentType];
    }, [props.programInfo]);

    const title = useMemo(() => {
        return props.programInfo.title;
    }, [props.programInfo]);

    const secondaryMark = useMemo(() => {
        return props.programInfo.secondary_mark;
    }, [props.programInfo]);

    const alt = useMemo(() => {
        let _alt = "";

        if(title){
            _alt += title;
        }

        if(secondaryMark){
            _alt += secondaryMark;
        }

        return _alt;
    }, [title, secondaryMark]);

    const imgSrc = useMemo(() => {
        let src = "";

        if(props.programInfo.video_image){
            src = `${cdnStatic}/${props.programInfo.video_image}`;
        }
        else if(props.programInfo.picture){
            src = `${cdnStatic}/${props.programInfo.picture}`;
        }

        src = src.replace("-S", "");

        return src;
    }, [props.programInfo]);

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
            props.dispatchVideoImpression(playerEvent.value);
        }
        else if(playerEvent.type == "companionAd"){
            props.dispatchVideoCompanionAd({
                value: playerEvent.value
            });
        }
        else if(playerEvent.type == "urls"){
            props.dispatchVideoUrls(playerEvent.value);
        }
        else if(playerEvent.type == "programInfo"){
            props.dispatchProgramInfo(playerEvent.value);
        }
        else if(playerEvent.type == "ended"){
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

                    props.dispatchProgramInfo(programInfo);
                });
            }
        }
    }, [playerEvent]);

    useEffect(() => {
        return () => {
            props.dispatchVideoImpression(0);
            props.dispatchVideoCompanionAd(null);
            props.dispatchVideoUrls(null);
            props.dispatchVideoSeek(null);
        };
    }, []);

    return (
        <>  
            <section className="player_section">
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
                                                            <h2 className="title">{title}</h2>
                                                        );
                                                    }
                                                })()
                                            }

                                            {
                                                (() => {
                                                    if(secondaryMark){
                                                        return (
                                                            <h3 className="secondary_mark">{secondaryMark}</h3>
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
                                    if(imgSrc){
                                        return (
                                            <>  
                                                <img className="background_img" src={imgSrc} alt="background" />
                                                <img className="img" src={imgSrc} alt={alt} />
                                            </>
                                        );
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if(props.playerProgramInfo){
                                        return (
                                            <Player setPlayerEvent={setPlayerEvent} programInfo={props.playerProgramInfo} displayEndAd={displayEndAd} seek={props.seek} />
                                        );
                                    }
                                })()
                            }
                        </div>
                        
                        <div className="bottom_section">
                            <button className="fb_share_btn" onClick={fbShareBtnClickHandler}></button>
                            <button className="url_share_btn" onClick={copyBtnClickHandler}></button>
                            <div className="fb-like" data-href="https://www.facebook.com/LiTVfans?fref=ts" data-send="false" data-width="150" data-show-faces="false" data-layout="button_count"></div>
                            <a className="line_btn" href="http://bit.ly/2ROGn0C" target="_blank" title="加入Line好友"></a>
                            <a className="download_app_btn" href="http://hyperurl.co/litvwebplayer" target="_blank" title="LiTV App下載"></a>
                        </div>
                        
                        {
                            (() => {
                                if(promoAd.data && promoAd.exclude.indexOf(props.programInfo.content_type) == -1){
                                    return (
                                        <a className="promo_ad" href={promoAd.data.href} title={promoAd.data.title} target={promoAd.data.target}>
                                            <img className="ad_img" src={require("../../../../assets/image/player/promote/" + promoAd.data.src)} alt={promoAd.data.title} />
                                        </a>
                                    );
                                }
                            })()
                        }
                    </div>
                    
                    <div className="right_section">
                        <Tabs programInfo={props.programInfo} relatedProgram={props.relatedProgram} episodes={props.episodes} rank={props.rank} focusTree={props.focusTree} />
                    </div>
                </div>
            </section>

            <style jsx>
                {`
                    .player_section{
                        background-color: #333;

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
                                        max-width: calc(100% - 4px);
                                        max-height: calc(100% - 2px);
                                        display: block;
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
                                        background-image: url(${require("../../../../assets/image/icon/fb.png")});
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
                                        background-image: url(${require("../../../../assets/image/icon/copy.png")});
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
                                        background-image: url(${require("../../../../assets/image/footer/line/add.png")});
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
                                        background-image: url(${require("../../../../assets/image/player/download_app.png")});
                                        background-size: 100% 100%;
                                    }
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
                            if(props.programInfo){
                                return (
                                    <App playerProgramInfo={props.playerProgramInfo} programInfo={props.programInfo} relatedProgram={props.relatedProgram} episodes={props.episodes} focusTree={props.focusTree} rank={props.rank} />
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
*/