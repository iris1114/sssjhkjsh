
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { createRef, useEffect, useState, useMemo, useRef, useCallback } from "react";
import _ from "lodash";

import watch from "../../../../../assets/js/watch/index.js";
import tools from "../../../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        episodeDialog : state.channel.watch.player.episodeDialog
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
        dispatchChannelsTip: (value) => {
            dispatch({
                type: "channel/watch/player/tabs/channelsTip",
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
};

const App = (props) => {
    const cdnstatic = useRef(litv.config.cdnstatic);

    const [listShowIndexes, setListShowIndexes] = useState(new Array());

    const prePropsProgramInfo = tools.hook.usePrevious(props.programInfo);

    const list = useMemo(() => {
        return watch.channel.meta.getChannelList(props.meta);
    }, [props.meta]);

    const listRefs = useMemo(() => {
        let arr = new Array();

        for(let i = 0; i < list.length; i ++){
            arr.push(createRef());
        }

        return arr;
    }, [list]);

    const linkClickHandler = useCallback((event, element) => {
        event.preventDefault();
        
        let channel = _.cloneDeep(element);

        channel = watch.channel.meta.getPrograms(channel);

        props.dispatchProgramInfo(channel);
    }, []);

    const getChannelBtnFocus = useCallback((element) => {
        if(props.programInfo && element.content_id == props.programInfo.content_id){
            return "focus";
        }

        return "";
    }, [props.programInfo]);

    const getProgramEPG = useCallback((channel) => {
        if(channel.content_type == "vod-channel" || channel.content_type == "playout-channel"){
            let vodChannelSchedule = channel.vod_channel_schedule;
            let program = vodChannelSchedule.focus_program;

            if(program.title && program.subtitle){
                return program.title + " - " + program.subtitle;
            }
            else if(program.title){
                return program.title;
            }
            else if(program.subtitle){
                return program.subtitle;
            }
        }
        else if(channel.content_type == "channel"){
            let schedules = channel.Schedule;
            let schedule = schedules[0];

            if(schedule){
                let program = schedule.program;

                return program.Title;
            }
            else{
                return "無節目資訊";
            }
        }
    }, [list]);

    const mouseOverHandler = useCallback((event, channel) => {
        let pos = tools.getCursorPosition(event);

        props.dispatchChannelsTip({
            pos: pos,
            channel: channel
        })
    }, [list]);

    const mouseLeaveHandler = useCallback((event, channel) => {
        props.dispatchChannelsTip(null)
    }, []);

    const scrollHandler = useCallback(() => {
        props.dispatchChannelsTip(null);
    }, []);

    const episodeIconStyle = useCallback((element) => {
        let contentType = element.content_type;

        if(contentType == "channel"){
            return "channel_episode_icon";
        }
        else if(contentType == "vod-channel" || contentType == "playout-channel"){
            return "vod_episode_icon";
        }
    },[list]);

    const episodeIconClickHandler = useCallback((event, element) => {
        event.preventDefault();
        props.dispatchEpisodeDialog(element);
    },[list]);

    useEffect(() => {
        setListShowIndexes(new Array());
    }, [props.bsmPackageCategory]);

    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            for(let i = 0; i < entries.length; i ++){
                let entry = entries[i];

                if(entry.isIntersecting){
                    let target = entry.target;
                    let index = target.getAttribute("data-list-index");

                    index = parseInt(index);
                    
                    setListShowIndexes((elements) => {
                        if(elements.indexOf(index) == -1){
                            elements.push(index);

                            return _.cloneDeep(elements);
                        }
        
                        return elements;
                    });
                }
            }
        });

        for(let i = 0; i < listRefs.length; i ++){
            let listRef = listRefs[i];
            
            if(listRef.current){
                observer.observe(listRef.current);
            }
        }

        return () => {
            observer.disconnect();
        };
    }, [listRefs]);

    useEffect(() => {
        if(!prePropsProgramInfo && props.programInfo){
            let index = -1;
            
            for(let i = 0; i < list.length; i ++){
                let item = list[i];
                
                if(item.content_id == props.programInfo.content_id){
                    index = i;

                    break;
                }
            }

            if(index != -1){
                let element = listRefs[index];
                let boundingClientRect = element.current.getBoundingClientRect();
                let elementTop = boundingClientRect.top;
                let elementHeight = boundingClientRect.height;

                let parentElement = element.current.parentNode;
                let parentBoundingClientRect = parentElement.getBoundingClientRect();
                let parentElementTop = parentBoundingClientRect.top;
                let parentElementHeight = parentBoundingClientRect.height;
                
                elementTop = elementTop + parentElement.scrollTop;

                let top = (elementTop - parentElementTop) - (parentElementHeight - elementHeight) / 2;
                
                parentElement.scroll({
                    top: top,
                    left: 0
                });
            }
        }
    }, [props.programInfo]);

    useEffect(() => {
        addEventListener("scroll", scrollHandler);

        return () => {
            removeEventListener("scroll", scrollHandler);
        };
    }, []);

    return (
        <>
            <section className="channel_list_section" onWheel={scrollHandler}>
                <h2 className="ssr_only">全部頻道</h2>
                {
                    list.map((element, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className={`channel_block ${getChannelBtnFocus(element)}`} data-list-index={index} ref={listRefs[index]} title={element.title}>
                                    <a className="channel_btn" href={`/channel/watch?contentId=${element.content_id}`} onClick={(event) => linkClickHandler(event, element)} >
                                        {
                                            (() => {
                                                if(listShowIndexes.indexOf(index) != -1){
                                                    return (
                                                        <>
                                                            <span className="poster_section">
                                                                <img className="poster" src={`${cdnstatic.current}\\${element.picture}`} alt={element.title} />
                                                            </span>
                        
                                                            <span className="text_section">
                                                                <div className="title_no" onMouseMove={(e) => mouseOverHandler(e, element)} onMouseLeave={mouseLeaveHandler}>
                                                                    <span className="no">{element.no}</span>
                                                                    <h3 className="title">{element.title}</h3>
                                                                </div>
                        
                                                                <div className="hd_program">
                                                                    {
                                                                        (() => {
                                                                            if(element.IsHD || element.quality == "HD"){
                                                                                return (
                                                                                    <div className="hd_icon"></div>
                                                                                );
                                                                            }
                                                                        })()
                                                                    }
                                                                    
                                                                    <h4 className="program_epg">{getProgramEPG(element)}</h4>
                                                                </div>
                                                            </span>
                                                        </>
                                                    );
                                                }
                                            })()
                                        }
                                    </a>
                                    {
                                        (() => {
                                            if(listShowIndexes.indexOf(index) != -1){
                                                return(
                                                    <div className={`episode_icon ${episodeIconStyle(element)}`} onClick={(event) => episodeIconClickHandler(event, element)}></div>
                                                );
                                            }
                                        })()
                                    }
                                </div>
                                <div className="border_bottom"></div>
                            </React.Fragment>
                        );
                    })
                }
            </section>

            <style jsx>
                {`
                    .channel_list_section{
                        overflow: hidden;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        right: 0px;
                        bottom: 0px;
                        overflow-y: scroll;
                        padding-left: 10px;
                        padding-right: 10px;

                        .channel_block{
                            display: flex;
                            align-items: center;
                            justify-content: space-around;
                            
                            .channel_btn{
                                width: 87%;
                                height: 80px;
                                overflow: hidden;
                                display: block;
                                padding-top: 10px;
                                padding-bottom: 10px;
                                box-sizing: border-box;
    
                          
    
                                .poster_section{
                                    width: 25%;
                                    height: 100%;
                                    position: relative;
                                    display: block;
                                    float: left;
                
                                    .poster{
                                        display: block;
                                        position: absolute;
                                        width: 80px;
                                        height: 45px;
                                        top: 50%;
                                        left: 50%;
                                        transform: translateX(-50%) translateY(-50%);
                                    }
                                }
    
                                .text_section{
                                    overflow: hidden;
                                    height: 100%;
                                    padding-left: 10px;
                                    box-sizing: border-box;
                                    display: block;
                
                                    .title_no{
                                        height: 30px;
                                        overflow: hidden;
                                        color: #f1f1f1;
                
                                        .no{
                                            display: block;
                                            float: left;
                                            width: 30px;
                                            overflow: hidden;
                                            text-align: right;
                                            line-height: 30px;
                                            font-size: 18px;
                                            
                                        }
                
                                        .title{
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            padding-left: 12px;
                                            padding-right: 5px;
                                            line-height: 30px;
                                            font-size: 18px;
                                            font-weight: normal;
                                        }
                                    }
                
                                    .hd_program{
                                        height: 30px;
                                        overflow: hidden;
                                        position: relative;
                
                                        .hd_icon{
                                            width: 30px;
                                            height: 30px;
                                            background-image: url(${require("../../../../../assets/image/channel/hd_icon.png")});
                                            background-repeat: no-repeat;
                                            background-position-x: 100%;
                                            background-position-y: center;
                                        }
                
                                        .program_epg{
                                            height: 30px;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            line-height: 30px;
                                            font-size: 14px;
                                            color: #8f8f8f;
                                            position: absolute;
                                            top: 0px;
                                            left: 30px;
                                            right: 0px;
                                            padding-left: 12px;
                                            padding-right: 5px;
                                            font-weight: normal;
                                        }
                                    }
                                }
                            }

                            &.focus, &.focus:hover{
                                .channel_btn{
                                    .text_section{
                                        .title_no{
                                            color: #c872e1;
                                        }
                                    }
                                }
                            }

                            .episode_icon{
                                background-size: cover;
                                width: 48px;
                                height: 48px;
                                display: block;
                                cursor: pointer;

                                &.channel_episode_icon{
                                    background-image: url(${require("../../../../../assets/image/channel/icon_btn_collection_channel.svg")});
                                }

                                &.vod_episode_icon{
                                    background-image: url(${require("../../../../../assets/image/channel/icon_btn_collection_vod.svg")});
                                }
                            }

                            &:hover{
                                .channel_btn{
                                    .text_section{
                                        .title_no{
                                            color: #c872e1;
                                        }
                                    }
                                }

                                .episode_icon{
                                    &.channel_episode_icon{
                                        background-image: url(${require("../../../../../assets/image/channel/icon_btn_collection_channel_hover.svg")});
                                    } 
                                    &.vod_episode_icon{
                                        background-image: url(${require("../../../../../assets/image/channel/icon_btn_collection_vod_hover.svg")});
                                    }
                                }
                            }
                        }

                        .border_bottom{
                            height: 1px;
                            background-color: #5a5658;

                            &:last-of-type{
                                display: none;
                            }
                        }

                        &::-webkit-scrollbar-thumb{
                            background: rgba(250, 250, 250, 0.5);
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