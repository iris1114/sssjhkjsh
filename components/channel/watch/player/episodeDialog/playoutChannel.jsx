
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { createRef, useCallback, useEffect, useMemo, useRef } from "react";
import _ from "lodash";

import tools from "../../../../../assets/js/tools/index.js";
import channelTool from "../../../../../assets/js/channel/index.js";

const mapStateToProps = (state) => {
    return {
        programInfo: state.channel.watch.programInfo
    };
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
    const dateRef = useRef(null);

    const subtitle = useMemo(() => {
        let vodChannelSchedule = null;

        if(props.programInfo && props.programInfo.content_id == props.channel.content_id){
            vodChannelSchedule = props.programInfo.vod_channel_schedule;
        }
        else{
            vodChannelSchedule = props.channel.vod_channel_schedule;
        }

        let program = vodChannelSchedule.focus_program;
        let subtitle = channelTool.getVodChannelProgramSubtitle(program);

        return subtitle;
    }, [props.programInfo, props.channel])

    const schedules = useMemo(() => {
        let schedules = props.channel.vod_channel_schedule.programs;

        let result = {
            date: [],
            schedule: []
        };
        
        for(let i = 0; i < schedules.length; i ++){
            let schedule = schedules[i];
            let airDateTime = new Date(schedule.p_start);
            let now = new Date();
            let format = "";

            if(tools.date.isToday(airDateTime)){
                format = `今天/${airDateTime.getMonth() + 1}月${airDateTime.getDate()}日/${tools.date.chinese.day[airDateTime.getDay()]}`;
            }
            else if(tools.date.isTomorrow(airDateTime)){
                format = `明天/${airDateTime.getMonth() + 1}月${airDateTime.getDate()}日/${tools.date.chinese.day[airDateTime.getDay()]}`;
            }
            else{
                format = `${airDateTime.getMonth() + 1}月${airDateTime.getDate()}日/${tools.date.chinese.day[airDateTime.getDay()]}`;
            }

            if(result.date.indexOf(format) == -1){
                result.date.push(format);
                result.schedule.push([]);
            }

            result.schedule[result.schedule.length - 1].push(schedule);
        }

        return result;
    }, [props.channel]);

    const getAirDateTime = useCallback((airDateTime) => {
        airDateTime = new Date(airDateTime);
        airDateTime = airDateTime.toString().substring(16, 21);

        return airDateTime;
    }, [props.channel, schedules]);

    const getTitle = useCallback((program) => {
        let title = "";

        if(program.title){
            title = program.title;

            if(program.subtitle){
                title = title + " - " + program.subtitle;
            }
        }
        else{
            if(program.subtitle){
                title = program.subtitle;
            }
        }

        return title;
    }, [schedules]);
    
    const getFocusClass = useCallback((element) => {
        if(props.programInfo && props.programInfo.content_id == props.channel.content_id){
            if(props.programInfo.vod_channel_schedule.focus_program.p_start == element.p_start){
                return "focus";
            }
        }
        else{
            if(props.channel.vod_channel_schedule.focus_program.p_start == element.p_start){
                return "focus";
            }
        }

        return "";
    }, [props.programInfo, props.channel]);
 
    const scheduleClickHandler = useCallback((iIndex, jIndex) => {
        let index = 0;

        for(let i = 0; i < iIndex; i ++){
            index = index + schedules.schedule[i].length;
        }

        index = index + jIndex;

        let channel = _.cloneDeep(props.channel);
        let vodChannelSchedule = channel.vod_channel_schedule;
        let programs = vodChannelSchedule.programs;
        let program = programs[index];

        vodChannelSchedule.focus_index = index;
        
        let nextIndex = index + 1;

        if(nextIndex >= programs.length){
            nextIndex = 0;
        }

        vodChannelSchedule.next_index = nextIndex;
        vodChannelSchedule.focus_program = program;
        vodChannelSchedule.time = 0;

        if(channel.selectable == 1){
            props.dispatchProgramInfo(channel);
        }
       
    }, [schedules]);

    const scheduleRefs = useMemo(() => {
        let arr = new Array();
        
        for(let i = 0; i < schedules.schedule.length; i ++){
            let refs = new Array();

            for(let j = 0; j < schedules.schedule[i].length; j ++){
                refs.push(createRef());
            }

            arr.push(refs);
        }

        return arr;
    }, [schedules]);

    useEffect(() => {
        for(let i = 0; i < scheduleRefs.length; i ++){
            for(let j = 0; j < scheduleRefs[i].length; j ++){
                let element = scheduleRefs[i][j];
                
                if(element.current.classList.contains("focus")){
                    let boundingClientRect = element.current.getBoundingClientRect();
                    let elementTop = boundingClientRect.top;
                    let elementHeight = boundingClientRect.height;

                    let parentElement = element.current.parentNode.parentNode.parentNode;
                    let parentBoundingClientRect = parentElement.getBoundingClientRect();
                    let parentElementTop = parentBoundingClientRect.top;
                    let parentElementHeight = parentBoundingClientRect.height;

                    let dateElement = dateRef.current.getBoundingClientRect();
                    let dateElementHeight = dateElement.height;
                    
                    elementTop = elementTop - dateElementHeight;

                    let top = (elementTop - parentElementTop) - (parentElementHeight - elementHeight) / 2;
                    
                    parentElement.scroll({
                        top: top,
                        left: 0
                    });

                    return;
                }
            }
        }
    }, []);

    return (
        <>
            <div className="playout_episodes">
                <div className="head_section">
                    <div className="title_wrap">
                        <div className="no">{props.channel.no}</div>
                        <div className="title">{props.channel.title}</div>
                    </div>
                    <div className="subtitle">{`現正播放 ${subtitle}`}</div>
                </div>

                <div className="schedules_section">
                    <div className="schedules_wrap" data-seletable={props.channel.selectable}>
                        {
                            schedules.date.map((element, index) => {
                                return(
                                    <React.Fragment key={index}>
                                        <div className="date" ref={dateRef}>{element}</div>
                                        {
                                            schedules.schedule[index].map((_element, _index) => {
                                                return(
                                                    <div className={`schedule ${getFocusClass(_element)}`} onClick={() => scheduleClickHandler(index, _index)} ref={scheduleRefs[index][_index]} key={_index}>
                                                        <div className="program_wrap">
                                                            <div className="on_air_icon_padding">
                                                                <div className="on_air_icon"></div>
                                                                <div className="time">{getAirDateTime(_element.p_start)}</div>
                                                            </div>
                                                            <div className="program">
                                                                <div className="title">{getTitle(_element)}</div>
                                                                <div className="description">{_element.vod_channel_description}</div>
                                                            </div>
                                                            <div className="play_icon_padding">
                                                                <div className="play_icon"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </React.Fragment>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .playout_episodes{
                        padding: 0px 10px;
                        height: 100%;
                        overflow: hidden;
                        overflow-y: scroll;

                        &::-webkit-scrollbar-thumb{
                            background: rgba(250, 250, 250, 0.5);
                        }

                        .head_section{
                            padding: 16px 10px;
                            position: sticky;
                            top: 0px;
                            background-color: #343434;
                            z-index: 1;

                            .title_wrap{
                                font-size: 20px;
                                line-height: 30px;
                                color: #f1f1f1;
                                display: flex;
                                padding-right: 40px;
                                margin-bottom: 5px;

                                .no{
                                    padding-right: 5px;
                                }

                                .title{
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                }
                            }

                            .subtitle{
                                font-size: 16px;
                                line-height: 24px;
                                color: #b7b7b7;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                        }
                        .schedules_section{
                            .schedules_wrap{
                                padding: 0px 10px;
                                
                                .date{
                                    font-size: 14px;
                                    line-height: 19px;
                                    color: #f1f1f1; 
                                    padding: 15px 0px 20px;
                                    position: sticky;
                                    top: 91px;
                                    background-color: #343434;
                                    border-top: 1px solid #5a5658;
                                }

                                .schedule{
                                    width: 100%;
                                    height: 80px;
                                    display: flex;
                                    align-items: center;
                                    border-bottom: 1px solid #5a5658 ;
                                    cursor: pointer;

                                    .program_wrap{
                                        display: flex;
                                        align-items: center;
                                        width: 100%;

                                        .on_air_icon_padding{
                                            width: 15%;
                                            display: flex;
                                            flex-wrap: wrap;
                                            flex-direction: column;
                                            align-items: center;
                                            justify-content: center;

                                            .time{
                                                font-size: 14px;
                                                line-height: 19px;
                                                color:#b0b0b0;
                                            }
                                        }

                                        .program{
                                            width: 75%; 
                                            
                                            .title{
                                                font-size: 18px;
                                                line-height: 24px;
                                                color: #f1f1f1;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                overflow: hidden;
                                            }
            
                                            .description{
                                                font-size: 14px;
                                                line-height: 19px;
                                                color: #b0b0b0; 
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                overflow: hidden;
                                            }
                                        }

                                        .play_icon_padding{
                                            width: 10%;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;

                                            .play_icon{
                                                width: 24px;
                                                height: 24px;
                                                background-image: url(${require("../../../../../assets/image/channel/player/episodeDialog/icon_play.svg")});
                                            }
                                        }
                                    }

                                    &.focus{
                                        .program_wrap{
                                            .on_air_icon_padding{
                                                .on_air_icon{
                                                    background-image: url(${require("../../../../../assets/image/channel/player/episodeDialog/tag_on_air.svg")});
                                                    width: 44px;
                                                    height: 24px;
                                                }
                                            }
    
                                            .play_icon_padding{
                                                .play_icon{
                                                    background-image: url(${require("../../../../../assets/image/channel/player/episodeDialog/icon_replay.svg")});
                                                }
                                            }
                                        }
                                    }
                                }

                                &[data-seletable="0"]{
                                    .schedule{
                                        cursor: auto;

                                        .program_wrap{
                                            .program{
                                                width: 85%;
                                            }
                                            
                                            .play_icon_padding{
                                                width: 0%;
                                                
                                                .play_icon{
                                                    display: none;
                                                }
                                            }
                                        }
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
    channel: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
