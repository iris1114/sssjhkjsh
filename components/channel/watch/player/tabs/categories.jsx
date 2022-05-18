
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useState, useRef, useCallback } from "react";
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
    const [showList, setShowList] = useState([]);

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
    }, [props.meta]);

    const mouseOverHandler = useCallback((event, channel) => {
        let pos = tools.getCursorPosition(event);

        props.dispatchChannelsTip({
            pos: pos,
            channel: channel
        })
    }, [props.meta]);

    const mouseLeaveHandler = useCallback((event, channel) => {
        props.dispatchChannelsTip(null)
    }, []);

    const titleClickHandler = useCallback((event, index) => {
        let arr = [];

        for(let i = 0; i < props.meta.length; i ++){
            if(i == index){
                if(showList[index]){
                    arr.push(false);
                }
                else{
                    arr.push(true);
                }
            }
            else{
                arr.push(false);
            }
        }

        setShowList(arr);

    },[ props.meta, showList])

    const episodeIconStyle = useCallback((element) => {
        let contentType = element.content_type;

        if(contentType == "channel"){
            return "channel_episode_icon";
        }
        else if(contentType == "vod-channel" || contentType == "playout-channel"){
            return "vod_episode_icon";
        }
    },[props.meta])

    const episodeIconClickHandler = useCallback((event, element) => {
        event.preventDefault();
        props.dispatchEpisodeDialog(element);
    },[props.meta])

    const getArrowType = useCallback((index) => {
        if(showList[index]){
            return "up";
        }
        else{
            return "down";
        }
    }, [showList])

    const getTitleFocus = useCallback((element) => {
        let categories = props.programInfo.station_categories;

        for(let i = 0; i < categories.length; i++){
            let category = categories[i];

            if(category.MenuOrder == element.MenuOrder){
                return "focus";
            }
        }

        return "";
    },[props.programInfo])

    const linkClickHandler = useCallback((event, element) => {
        event.preventDefault();
        
        let channel = _.cloneDeep(element);

        channel = watch.channel.meta.getPrograms(channel);

        props.dispatchProgramInfo(channel);
    }, []);

    return (
        <>
            <section className="categories_list_section">
                <h2 className="ssr_only">頻道分類</h2>
                {
                   props.meta.map((element, index) => {
                        return(
                            <div className="category_container" key={index}>
                                <div className={`title_section ${getTitleFocus(element)}`} onClick={(event) => titleClickHandler(event, index)}>
                                    <h3 className="title">{element.Name}</h3>
                                    <div className={`arrow ${getArrowType(index)}`}></div>
                                </div>

                                <div className="category_wrap">
                                    {
                                        
                                        (() => {
                                            if(showList[index]){
                                                return(
                                                    element.channels.map((_element, _index) => {
                                                        return (
                                                            <React.Fragment key={_index}>
                                                                <div className="channel_block" data-list-index={_index} title={_element.title}>
                                                                    <a className={`channel_btn ${getChannelBtnFocus(_element)}`} href={`/channel/watch?contentId=${_element.content_id}`} onClick={(event) => linkClickHandler(event, _element)}>
                                                                        {
                                                                            (() => {
                                                                                    return (
                                                                                        <>
                                                                                            <span className="poster_section">
                                                                                                <img className="poster" src={`${cdnstatic.current}\\${_element.picture}`} alt={_element.title} />
                                                                                            </span>
                                                        
                                                                                            <span className="text_section">
                                                                                                <div className="title_no" onMouseMove={(e) => mouseOverHandler(e, _element)} onMouseLeave={mouseLeaveHandler}>
                                                                                                    <span className="no">{_element.no}</span>
                                                                                                    <h4 className="title">{_element.title}</h4>
                                                                                                </div>
                                                        
                                                                                                <div className="hd_program">
                                                                                                    {
                                                                                                        (() => {
                                                                                                            if(_element.IsHD || _element.quality == "HD"){
                                                                                                                return (
                                                                                                                    <div className="hd_icon"></div>
                                                                                                                );
                                                                                                            }
                                                                                                        })()
                                                                                                    }
                                                                                                    
                                                                                                    <h5 className="program_epg">{getProgramEPG(_element)}</h5>
                                                                                                </div>
                                                                                            </span>
                                                                                        </>
                                                                                    );
                                                                            })()
                                                                        }
                                                                    </a>
                                                                  
                                                                    <div className={`episode_icon ${episodeIconStyle(_element)}`} onClick={(event) => episodeIconClickHandler(event, _element)}></div>
                                                                </div>
                                                                <div className="border_bottom"></div>
                                                            </React.Fragment>
                                                        );
                                                    })
                                                );
                                            }
                                        })()
                                    }
                                </div>
                            </div>
                        );
                   })
                }
            </section>

            <style jsx>
                {`
                    .categories_list_section{
                        overflow: hidden;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        right: 0px;
                        bottom: 0px;
                        overflow-y: scroll;
                        padding-left: 10px;
                        padding-right: 10px;

                        .category_container{
                            .title_section{
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                border-bottom: 1px solid #5a5658;
                                padding-left: 12px;
                                cursor: pointer;
                                position: sticky;
                                top: 0px;
                                z-index: 1;
                                background-color: #343434;

                                .title{
                                    line-height: 43px;
                                    color: #f1f1f1;
                                    font-size: 18px;
                                }
                               
                                .arrow{
                                    width: 24px;
                                    height: 24px;

                                    &.down{
                                        background-image: url(${require("../../../../../assets/image/channel/icon_arrow_down.svg")});
                                    }

                                    &.up{
                                        background-image: url(${require("../../../../../assets/image/channel/icon_arrow_up.svg")});
                                    }
                                }

                                &.focus{
                                    .title{
                                        color: #c872e1;
                                    }
                                }
                            }
                        }

                        .category_wrap{
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
        
                                    &.focus, &.focus:hover{
                                        .text_section{
                                            .title_no{
                                                color: #c872e1;
                                            }
                                        }
                                    }
        
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
    meta: PropTypes.array.isRequired,
    bsmPackageCategory: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);