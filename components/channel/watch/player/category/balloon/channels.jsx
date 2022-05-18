
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createRef, useState, useMemo, useCallback, useEffect } from "react";
import _ from "lodash";

import watch from "../../../../../../assets/js/watch/index.js";

import Programs from "./programs/index.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchProgramInfo: (value) => {
            dispatch({
                type: "channel/watch/programInfo",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [hoverMeta, setHoverMeta] = useState(null);
    const [mouseMoveIndex, setMouseMoveIndex] = useState(-1);

    const channel = useMemo(() => {
        return props.channels[mouseMoveIndex];
    }, [mouseMoveIndex, props.channels]);

    const channelRefs = useMemo(() => {
        let refs = new Array();

        for(let i = 0; i < props.channels.length; i ++){
            refs.push(createRef());
        }

        return refs;
    }, []);

    const getFocus = useCallback((channel) => {
        if(props.programInfo && props.programInfo.content_id == channel.content_id){
            return "focus";
        }

        return "";
    }, [props.programInfo]);

    const getHover = useCallback((channel) => {
        if(hoverMeta && hoverMeta.channel == channel){
            return "hover";
        }

        return "";
    }, [hoverMeta]);

    const clickHandler = useCallback((event, element) => {
        let channel = _.cloneDeep(element);

        channel = watch.channel.meta.getPrograms(channel);

        props.dispatchProgramInfo(channel);
    }, []);

    const mouseMoveHandler = useCallback((event, index) => {
        setMouseMoveIndex(index);

        setHoverMeta({
            target: event.currentTarget,
            leaveCallback: () => {
                setHoverMeta(null);
            }
        });
    }, []);

    const getLiveChannelEPG = useCallback((channel) => {
        let schedules = channel.Schedule;
        let schedule = schedules[0];

        if(schedule){
            return schedule.program.Title;
        }
        else{
            return "無節目資訊";
        }
    }, []);

    const getVodChannelEPG = useCallback((channel) => {
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
    }, []);

    const getNextLiveChannelEPG = useCallback((channel) => {
        let schedules = channel.Schedule;
        let schedule = schedules[1];

        if(schedule){
            return schedule.program.Title;
        }
        else{
            return "無節目資訊";
        }
    }, []);

    const getNextVodChannelEPG = useCallback((channel) => {
        let vodChannelSchedule = channel.vod_channel_schedule;
        let index = vodChannelSchedule.next_index;
        let program = vodChannelSchedule.programs[index];

        if(program.title && program.subtitle){
            return program.title + " - " + program.subtitle;
        }
        else if(program.title){
            return program.title;
        }
        else if(program.subtitle){
            return program.subtitle;
        }
    }, []);

    useEffect(() => {
        let index = -1;
            
        for(let i = 0; i < props.channels.length; i ++){
            let item = props.channels[i];
            
            if(item.content_id == props.programInfo.content_id){
                index = i;

                break;
            }
        }

        if(index != -1){
            let element = channelRefs[index];
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
    }, []);

    return (
        <>
            <div className="channels_section">
                <div className="header">
                    <div className="item left">
                        <div className="icon"></div>
                        <div className="text">滑鼠移至頻道切換節目表</div>
                    </div>
                    <div className="item center">現正播出</div>
                    <div className="item right">即將播出</div>
                </div>

                <div className="body">
                    {
                        props.channels.map((element, index) => {
                            return (
                                <div className={`channel ${getFocus(element)} ${getHover(element)}`} onClick={(event) => clickHandler(event, element)} ref={channelRefs[index]} key={index}>
                                    <div className="item left" onMouseMove={(event) => mouseMoveHandler(event, index)}>
                                        <div className="status">
                                            {
                                                (() => {
                                                    if(props.programInfo && props.programInfo.content_id == element.content_id){
                                                        return (
                                                            <div className="text">播放中</div>
                                                        );
                                                    }
                                                    else{
                                                        return (
                                                            <div className="text">播放</div>
                                                        );
                                                    }
                                                })()
                                            }
                                        </div>

                                        {
                                            (() => {
                                                if(element.content_type == "vod-channel" ||element.content_type == "playout-channel"){
                                                    return (
                                                        <div className="select"></div>
                                                    );
                                                }
                                            })()
                                        }

                                        <div className="title" title={element.title}>
                                            <div className="no">{element.no} </div>
                                            <div className="text">{element.title} </div>
                                        </div>
                                    </div>

                                    <div className="item center">
                                        {
                                            (() => {
                                                if(element.content_type == "vod-channel" ||element.content_type == "playout-channel"){
                                                    return getVodChannelEPG(element);
                                                }
                                                else{
                                                    return getNextLiveChannelEPG(element);
                                                }
                                            })()
                                        }
                                    </div>

                                    <div className="item right">
                                        {
                                            (() => {
                                                if(element.content_type == "vod-channel" ||element.content_type == "playout-channel"){
                                                    return getNextVodChannelEPG(element);
                                                }
                                                else{
                                                    return getLiveChannelEPG(element);
                                                }
                                            })()
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                {
                    (() => {
                        if(hoverMeta && channel && mouseMoveIndex >= 0){
                            return (
                                <Programs meta={hoverMeta} channel={channel} />
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .channels_section{
                        height: 100%;

                        .header{
                            height: 30px;
                            overflow: hidden;

                            .item{
                                width: 33.33%;
                                height: 100%;
                                float: left;
                                overflow: hidden;
                                position: relative;
                                font-size: 13px;
                                line-height: 30px;
                                text-align: center;

                                &.left{
                                    padding-left: 50px;

                                    .icon{
                                        position: relative;
                                        width: 15px;
                                        height: 15px;
                                        float: left;
                                        background-image: url(${require("../../../../../../assets/image/channel/category/balloon/arrow.svg")});
                                        background-size: 10px 10px;
                                        background-position: center center;
                                        background-repeat: no-repeat;
                                        top: 50%;
                                        transform: translateY(-50%) rotate(-90deg);
                                    }

                                    .text{
                                        overflow: hidden;
                                        color: #8711aa;
                                        text-align: left;
                                    }
                                }

                                &.right{
                                    color: #8f8f8f;
                                }
                            }
                        }

                        .body{
                            height: 300px;
                            overflow: auto;

                            .channel{
                                height: 30px;
                                line-height: 30px;
                                font-size: 15px;
                                overflow: hidden;

                                &:nth-of-type(odd){
                                    background-color: #efefef;
                                }

                                &.focus, &.focus.hover{
                                    .item{
                                        &.left{
                                            .title{
                                                color: #8711aa;
                                            }

                                            .status{
                                                .text{
                                                    display: block;
                                                    background-color: #f60;
                                                }
                                            }
                                        }
                                    }
                                }

                                &.hover{
                                    background-color: #888;

                                    .item{
                                        color: #f1f1f1;

                                        &.left{
                                            .select{
                                                background-image: url(${require("../../../../../../assets/image/channel/category/balloon/select_hover.png")});
                                            }

                                            .status{
                                                .text{
                                                    display: block;
                                                }
                                            }
                                        }

                                        &.right{
                                            color: #f1f1f1;
                                        }
                                    }
                                }

                                .item{
                                    width: 33.33%;
                                    height: 100%;
                                    float: left;
                                    overflow: hidden;
                                   
                                    &.left{
                                        cursor: pointer;

                                        .status{
                                            width: 50px;
                                            height: 100%;
                                            float: left;
                                            position: relative;

                                            .text{
                                                width: 40px;
                                                height: 20px;
                                                font-size: 12px;
                                                line-height: 20px;
                                                background-color: #f60;
                                                border-radius: 3px;
                                                overflow: hidden;
                                                text-align: center;
                                                color: #f1f1f1;
                                                top: 50%;
                                                left: 50%;
                                                transform: translateX(-50%) translateY(-50%);
                                                position: relative;
                                                display: none;
                                            }
                                        }

                                        .select{
                                            width: 30px;
                                            height: 30px;
                                            float: right;
                                            background-image: url(${require("../../../../../../assets/image/channel/category/balloon/select.png")});
                                            background-size: 20px 20px;
                                            background-position: center center;
                                            background-repeat: no-repeat;
                                        }

                                        .title{
                                            overflow: hidden;

                                            .no{
                                                float: left;
                                                width: 35px;
                                            }

                                            .text{
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                            }
                                        }
                                    }

                                    &.center, &.right{
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        padding-left: 5px;
                                        padding-right: 5px;
                                    }

                                    &.right{
                                        color: #8f8f8f;
                                    }
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
    channels: PropTypes.array.isRequired,
    programInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
