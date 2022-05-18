
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Glide from "@glidejs/glide";

import CompanionAd from "../../../../companionAd/index.jsx";
import Channels from "./channels.jsx";
import ChannelsTip from "./channelsTip.jsx";
import EpisodeDialog from "../episodeDialog/index.jsx";
import Categories from "./categories.jsx";

const mapStateToProps = (state) => {
    return {
        resize: state.resize,
        videoUrls: state.channel.watch.videoUrls,
        companionAd: state.companionAd.ad,
        videoImpression: state.channel.watch.videoImpression,
        videoCompanionAd: state.channel.watch.videoCompanionAd,
        channelsTip: state.channel.watch.player.tabs.channelsTip,
        episodeDialog: state.channel.watch.player.episodeDialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [listFocus, setListFocus] = useState(0);
    const [tabList, setTabList] = useState([]);

    const glide = useRef(null);

    const perView = useMemo(() => {
        return 4;
    }, [props.resize]);

    const arrowDisplayClass = useMemo(() => {
        if(tabList.length <= perView){
            return "none";
        }
        else{
            return "";
        }
    }, [tabList, perView]);

    const arrowClickHandler = useCallback((event, dir) => {
        if(!glide.current){
            return;
        }

        glide.current.go(dir);
    }, []);

    const getListBtnFocus = useCallback((index) => {
        if(index == listFocus){
            return "focus";
        }

        return "";
    }, [listFocus]);

    const listBtnClickHandler = useCallback((event, index) => {
        setListFocus(index);
    }, []); 

    useEffect(() => {
        let list = new Array();

        list.push({
            type: "lineup",
            value: props.meta
        });

        list.push({
            type: "category",
            value: props.categories
        });

        setTabList(list);
    }, [props.meta, props.stationCategories]);

    useEffect(() => {
        if(tabList.length <= 0){
            return;
        }
        
        glide.current = new Glide(".tabs_list", {
            perView: perView,
            bound: true,
            dragThreshold: false,
            animationDuration: 100,
            rewindDuration: 100,
            gap: 1
        });

        glide.current.mount();
        glide.current.go(`=0`);

        return () => {
            glide.current.destroy();
        };
    }, [tabList]);

    return (
        <>
            <div className="player_tabs_section">
                <div className="glide_section">
                    <button className={`glide_arrow left ${arrowDisplayClass}`} data-glide-dir="<" onClick={(event) => arrowClickHandler(event, "<")}>
                        <img className="icon" src={`${require("../../../../../assets/image/icon/arrow_white.svg")}`} alt="arrow" />
                    </button>

                    <button className={`glide_arrow right ${arrowDisplayClass}`} data-glide-dir=">" onClick={(event) => arrowClickHandler(event, ">")}>
                        <img className="icon" src={`${require("../../../../../assets/image/icon/arrow_white.svg")}`} alt="arrow" />
                    </button>

                    <div className="tabs_list">
                        <div className="glide__track" data-glide-el="track">
                            <div className="glide__slides">
                                {
                                    tabList.map((element, index) => {
                                        if(element.type == "lineup"){
                                            return (
                                                <div className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title="全部頻道" key={index}>全部頻道 <span className="bottom_border"></span></div>
                                            );
                                        }
                                        else if(element.type == "category"){
                                            return (
                                                <div className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title="頻道分類" key={index}>頻道分類 <span className="bottom_border"></span></div>
                                            );
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="tabs_pane">
                        {
                            (() => {
                                if(props.videoUrls && props.videoUrls.result){
                                    return (
                                        <>
                                            {
                                                (() => {
                                                    if(props.companionAd){
                                                        return (
                                                            <div className="padding_box"></div>
                                                        );
                                                    }
                                                })()
                                            }

                                            <CompanionAd impression={props.videoImpression} companionAd={props.videoCompanionAd} programInfo={props.programInfo} playAds={props.videoUrls.result.PlayAds} />
                                        </>
                                    );
                                }
                            })()
                        }

                        <div className="pane">
                            {
                                tabList.map((element, index) => {
                                    if(element.type == "lineup" && index == listFocus){
                                        return (
                                            <div className="content" key={index}>
                                                <Channels programInfo={props.programInfo} meta={element.value} bsmPackageCategory={props.bsmPackageCategory} />
                                            </div>
                                        );
                                    }
                                    else if(element.type == "category" && index == listFocus){
                                        return (
                                            <div className="content" key={index}>
                                                <Categories programInfo={props.programInfo} meta={element.value} bsmPackageCategory={props.bsmPackageCategory}/>
                                            </div>
                                        );
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>

                {
                    (() => {
                        if(props.channelsTip){
                            return (
                                <ChannelsTip channel={props.channelsTip.channel} pos={props.channelsTip.pos} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(props.episodeDialog){
                            return (
                               <EpisodeDialog channel={props.episodeDialog} channels={props.meta.channels}/>
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .player_tabs_section{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;

                        .glide_section{
                            user-select: none;

                            .glide_arrow{
                                width: 40px;
                                height: 40px;
                                position: relative;
                                background-color: #2a2a2a;
                                overflow: hidden;
                                border-top-left-radius: 2px;
                                border-top-right-radius: 2px;

                                &.left{
                                    float: left;
                                    margin-right: 1px;
    
                                    .icon{
                                        transform: translateX(-50%) translateY(-50%) rotate(180deg);
                                    }
                                }

                                &.right{
                                    float: right;
                                    margin-left: 1px;
                                }

                                &.none{
                                    display: none;
                                }

                                .icon{
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translateX(-50%) translateY(-50%);
                                    width: 20px;
                                    height: 20px;
                                }
                            }
                        }

                        .tabs_list{
                            overflow: hidden;

                            .glide__track{
                                .glide__slides{
                                    white-space: nowrap;
                                    font-size: 0px;
                                    width: 100%;

                                    .glide__slide{
                                        background-color: #343434;
                                        font-size: 15px;
                                        line-height: 40px;
                                        padding-left: 5px;
                                        padding-right: 5px;
                                        touch-action: none;
                                        display: inline-block;
                                        text-align: center;
                                        overflow: hidden;
                                        cursor: pointer;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        color: #b0b0b0;
                                        border-top-left-radius: 2px;
                                        border-top-right-radius: 2px;
                                        position: relative;

                                        .bottom_border{
                                            height: 4px;
                                            width: 80%; 
                                            position: absolute;
                                            bottom: 0;
                                            left: 50%;
                                            transform: translateX(-50%); 
                                        }

                                        &.focus{
                                            color: #f1f1f1;

                                            .bottom_border{
                                                background-color: #a415ce;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        .tabs_pane{
                            position: absolute;
                            top: 40px;
                            left: 0px;
                            right: 0px;
                            bottom: 0px;
                            background-color: #343434;
                            padding-bottom: 10px;
                            display: flex;
                            flex-direction: column;

                            .padding_box{
                                height: 30px;
                            }

                            .pane{
                                flex-grow: 1;
                                padding-top: 10px;
                                position: relative;

                                .content{
                                    position: absolute;
                                    top: 10px;
                                    left: 0px;
                                    right: 0px;
                                    bottom: 0px;
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
    meta: PropTypes.object.isRequired,
    bsmPackageCategory: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

/*
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide";

import watch from "../../../../../assets/js/watch/index.js";

import CompanionAd from "../../../../companionAd/index.jsx";
import Episodes from "./episodes/index.jsx";
import FocusTree from "./focusTree.jsx";
import Rank from "./rank/index.jsx";
import RelatedProgram from "./relatedProgram/index.jsx";
import Trailer from "./trailers.jsx";

const mapStateToProps = (state) => {
    return {
        videoImpression: state.vod.watch.videoImpression,
        videoCompanionAd: state.vod.watch.videoCompanionAd,
        videoUrls: state.vod.watch.videoUrls,
        companionAd: state.companionAd.ad,
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [listFocus, setListFocus] = useState(0);
    const [tabList, setTabList] = useState([]);

    const glide = useRef(null);

    const perView = useMemo(() => {
        return 4;
    }, [props.resize]);

    const arrowDisplayClass = useMemo(() => {
        if(tabList.length <= perView){
            return "none";
        }
        else{
            return "";
        }
    }, [tabList, perView]);

    const arrowClickHandler = useCallback((event, dir) => {
        if(!glide.current){
            return;
        }
        
        glide.current.go(dir);
    }, []);

    const getListBtnFocus = useCallback((index) => {
        if(index == listFocus){
            return "focus";
        }

        return "";
    }, [listFocus]);

    const listBtnClickHandler = useCallback((event, index) => {
        setListFocus(index);
    }, []);
        
    useEffect(() => {
        let list = new Array();

        if(props.episodes){
            let films = null;

            if(props.programInfo.rule_id){
                films = watch.vod.episodes.rulePlayList(props.episodes);
            }
            else{
                films = watch.vod.episodes.films(props.episodes);
            }

            if(films){
                list.push({
                    type: "episodes",
                    value: films
                });
            }
        }
        
        if(props.focusTree){
            let focusTree = watch.vod.episodes.focusTree(props.focusTree);
            
            if(focusTree){
                list.push({
                    type: "focusTree",
                    value: focusTree
                });
            }
        }

        if(props.episodes){
            let trailers = watch.vod.episodes.trailers(props.episodes);

            if(trailers){
                list.push({
                    type: "trailers",
                    value: trailers
                });
            }
        }

        if(props.relatedProgram){
            let items = props.relatedProgram.data;

            for(let i = 0; i < items.length; i ++){
                list.push({
                    type: "relatedProgram",
                    value: items[i]
                });
            }
        }

        if(props.rank){
            list.push({
                type: "rank",
                value: props.rank
            });
        }

        setTabList(list);
    }, [props.episodes, props.focusTree, props.relatedProgram, props.rank]);

    useEffect(() => {
        if(tabList.length <= 0){
            return;
        }
        
        glide.current = new Glide(".tabs_list", {
            perView: perView,
            bound: true,
            dragThreshold: false,
            animationDuration: 100,
            rewindDuration: 100,
            gap: 1
        });

        glide.current.mount();
        glide.current.go(`=0`);

        return () => {
            glide.current.destroy();
        };
    }, [tabList]);

    useEffect(() => {
        if(tabList.length <= 0){
            return;
        }

        let index = 0;

        for(let i = 0; i < tabList.length; i ++){
            let item = tabList[i];

            if(item.type == "relatedProgram"){
                index = i;

                break;
            }
        }

        setListFocus(index);
    }, [tabList]);

    return (
        <>
            <section className="player_tabs_section">
                {
                    (() => {
                        if(tabList.length){
                            return (
                                <div className="glide_section">
                                    <button className={`glide_arrow left ${arrowDisplayClass}`} data-glide-dir="<" onClick={(event) => arrowClickHandler(event, "<")}>
                                        <img className="icon" src={`${require("../../../../../assets/image/icon/arrow_white.svg")}`} alt="arrow" />
                                    </button>

                                    <button className={`glide_arrow right ${arrowDisplayClass}`} data-glide-dir=">" onClick={(event) => arrowClickHandler(event, ">")}>
                                        <img className="icon" src={`${require("../../../../../assets/image/icon/arrow_white.svg")}`} alt="arrow" />
                                    </button>

                                    <div className="tabs_list">
                                        <div className="glide__track" data-glide-el="track">
                                            <div className="glide__slides">
                                                {
                                                    tabList.map((element, index) => {
                                                        if(element.type == "episodes"){
                                                            return (
                                                                <button className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title="劇集列表" key={index}>劇集列表</button>
                                                            );
                                                        }
                                                        else if(element.type == "focusTree"){
                                                            return (
                                                                <button className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title="看點" key={index}>看點</button>
                                                            );
                                                        }
                                                        else if(element.type == "trailers"){
                                                            return (
                                                                <button className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title="預告花絮" key={index}>預告花絮</button>
                                                            );
                                                        }
                                                        else if(element.type == "relatedProgram"){
                                                            return (
                                                                <button className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title={element.value.result_type_name} key={index}>{element.value.result_type_name}</button>
                                                            );
                                                        }
                                                        else if(element.type == "rank"){
                                                            return (
                                                                <button className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title="排行榜" key={index}>排行榜</button>
                                                            );
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tabs_pane">
                                        {
                                            (() => {
                                                if(props.videoUrls && props.videoUrls.result){
                                                    return (
                                                        <>
                                                            {
                                                                (() => {
                                                                    if(props.companionAd){
                                                                        return (
                                                                            <div className="padding_box"></div>
                                                                        );
                                                                    }
                                                                })()
                                                            }

                                                            <CompanionAd impression={props.videoImpression} companionAd={props.videoCompanionAd} programInfo={props.programInfo} playAds={props.videoUrls.result.PlayAds} />
                                                        </>
                                                    );
                                                }
                                            })()
                                        }

                                        <div className="pane">
                                            {
                                                tabList.map((element, index) => {
                                                    if(element.type == "episodes" && index == listFocus){
                                                        return (
                                                            <div className={`content`} key={index}>
                                                                <Episodes programInfo={props.programInfo} episodes={element.value} />
                                                            </div>
                                                        );
                                                    }
                                                    else if(element.type == "focusTree" && index == listFocus){
                                                        return (
                                                            <div className={`content`} key={index}>
                                                                <FocusTree programInfo={props.programInfo} focusTree={element.value} />
                                                            </div>
                                                        );
                                                    }
                                                    else if(element.type == "trailers" && index == listFocus){
                                                        return (
                                                            <div className={`content`} key={index}>
                                                                <Trailer programInfo={props.programInfo} trailers={element.value} />
                                                            </div>
                                                        );
                                                    }
                                                    else if(element.type == "relatedProgram" && index == listFocus){
                                                        return (
                                                            <div className={`content`} key={index}>
                                                                <RelatedProgram relatedProgram={element.value} />
                                                            </div>
                                                        );
                                                    }
                                                    else if(element.type == "rank" && index == listFocus){
                                                        return (
                                                            <div className={`content`} key={index}>
                                                                <Rank rank={element.value} />
                                                            </div>
                                                        );
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .player_tabs_section{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;

                        .glide_section{
                            user-select: none;

                            .glide_arrow{
                                width: 40px;
                                height: 40px;
                                position: relative;
                                background-color: #2a2a2a;
                                overflow: hidden;
                                border-top-left-radius: 2px;
                                border-top-right-radius: 2px;

                                &.left{
                                    float: left;
                                    margin-right: 1px;
    
                                    .icon{
                                        transform: translateX(-50%) translateY(-50%) rotate(180deg);
                                    }
                                }

                                &.right{
                                    float: right;
                                    margin-left: 1px;
                                }

                                &.none{
                                    display: none;
                                }

                                .icon{
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translateX(-50%) translateY(-50%);
                                    width: 20px;
                                    height: 20px;
                                }
                            }
                        }

                        .tabs_list{
                            overflow: hidden;

                            .glide__track{
                                .glide__slides{
                                    white-space: nowrap;
                                    font-size: 0px;
                                    width: 100%;

                                    .glide__slide{
                                        background-color: #2a2a2a;
                                        font-size: 15px;
                                        line-height: 40px;
                                        padding-left: 5px;
                                        padding-right: 5px;
                                        touch-action: none;
                                        display: inline-block;
                                        text-align: center;
                                        overflow: hidden;
                                        cursor: pointer;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        color: #ccc;
                                        border-top-left-radius: 2px;
                                        border-top-right-radius: 2px;

                                        &.focus{
                                            background-color: #444;
                                            color: #f60;
                                        }
                                    }
                                }
                            }
                        }

                        .tabs_pane{
                            position: absolute;
                            top: 40px;
                            left: 0px;
                            right: 0px;
                            bottom: 0px;
                            background-color: #444;
                            padding-left: 10px;
                            padding-right: 10px;
                            padding-bottom: 10px;
                            display: flex;
                            flex-direction: column;

                            .padding_box{
                                height: 30px;
                            }

                            .pane{
                                flex-grow: 1;
                                padding-top: 10px;
                                position: relative;

                                .content{
                                    position: absolute;
                                    top: 10px;
                                    left: 0px;
                                    right: 0px;
                                    bottom: 0px;
                                    overflow-x: hidden;
                                    overflow-y: scroll;
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
    relatedProgram: PropTypes.object,
    episodes: PropTypes.object,
    focusTree: PropTypes.object,
    rank: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
*/