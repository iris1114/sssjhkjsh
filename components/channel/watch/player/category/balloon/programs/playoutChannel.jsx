
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createRef, useEffect, useState, useMemo, useRef, useCallback } from "react";
import _ from "lodash";

import tools from "../../../../../../../assets/js/tools/index.js";

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
    const headerRef = useRef(null);

    const [headerText, setHeaderText] = useState("");

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

            if(now.getMonth() == airDateTime.getMonth() && now.getDate() == airDateTime.getDate()){
                format = `今天/${airDateTime.getMonth() + 1}月${airDateTime.getDate()}日/${tools.date.chinese.day[airDateTime.getDay()]}`;
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

    const scheduleRefs = useMemo(() => {
        let _schedules = new Array();
        
        for(let i = 0; i < schedules.schedule.length; i ++){
            let refs = new Array();

            for(let j = 0; j < schedules.schedule[i].length; j ++){
                refs.push(createRef());
            }

            _schedules.push(refs);
        }
        
        return _schedules;
    }, [schedules]);

    const dateRefs = useMemo(() => {
        let refs = new Array();

        for(let i = 0; i < schedules.date.length; i ++){
            refs.push(createRef());
        }

        return refs;
    }, [schedules]);

    const getAirDateTime = useCallback((airDateTime) => {
        airDateTime = new Date(airDateTime);
        airDateTime = airDateTime.toString().substring(16, 21);

        return airDateTime;
    }, []);

    const scrollHandler = useCallback(() => {
        let headerBoundingClientRect = headerRef.current.getBoundingClientRect();
        let headerBottom = headerBoundingClientRect.top + headerBoundingClientRect.height;
        let text = "";
        
        for(let i = 0; i < dateRefs.length; i ++){
            let dateRef = dateRefs[i];
            let dateBoundingClientRect = dateRef.current.getBoundingClientRect();
            let dateTop = dateBoundingClientRect.top;
            
            if(dateTop <= headerBottom){
                text = dateRef.current.getAttribute("data-text");
            }
        }
        
        setHeaderText(text);
    }, [dateRefs]);

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
        let focus = props.channel.vod_channel_schedule.focus_program;
        
        if(focus.p_start == element.p_start){
            return "focus";
        }

        return "";
    }, [schedules]);

    const clickHandler = useCallback((iIndex, jIndex) => {
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

        props.dispatchProgramInfo(channel);
    }, [schedules]);

    useEffect(() => {
        scrollHandler();
    }, [dateRefs]);

    useEffect(() => {
        for(let i = 0; i < scheduleRefs.length; i ++){
            for(let j = 0; j < scheduleRefs[i].length; j ++){
                let element = scheduleRefs[i][j];
                
                if(element.current.classList.contains("focus")){
                    let boundingClientRect = element.current.getBoundingClientRect();
                    let elementTop = boundingClientRect.top;
                    let elementHeight = boundingClientRect.height;

                    let parentElement = element.current.parentNode.parentNode;
                    let parentBoundingClientRect = parentElement.getBoundingClientRect();
                    let parentElementTop = parentBoundingClientRect.top;
                    let parentElementHeight = parentBoundingClientRect.height;
                    
                    elementTop = elementTop + parentElement.scrollTop;

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
            <div className="schedules">
                <div className="scroll_section" onScroll={scrollHandler}>
                    {
                        schedules.date.map((element, index) => {
                            return (
                                <div className="date_block" key={index}>
                                    <div className="date" data-text={element} ref={dateRefs[index]}>
                                        <div className="text">{element}</div>
                                        <div className="border_bottom"></div>
                                    </div>

                                    {
                                        schedules.schedule[index].map((_element, _index) => {
                                            return (
                                                <div className={`schedule ${getFocusClass(_element)}`} onClick={(event) => clickHandler(index, _index)} ref={scheduleRefs[index][_index]} key={_index}>
                                                    <div className="time">{getAirDateTime(_element.p_start)}</div>
                                                    <div className="title">{getTitle(_element)}</div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
                
                <div className="header" ref={headerRef}>
                    <div className="text">{headerText}</div>
                    <div className="border_bottom"></div>
                </div>
            </div>

            <style jsx>
                {`
                    .schedules{
                        position: absolute;
                        top: 30px;
                        left: 10px;
                        right: 0px;
                        bottom: 5px;

                        .scroll_section{
                            position: absolute;
                            top: 0px;
                            left: 0px;
                            right: 0px;
                            bottom: 0px;
                            overflow: auto;

                            .date_block{
                                margin-bottom: 30px;
    
                                &:last-of-type{
                                    margin-bottom: 0px;
                                }
    
                                .date{
                                    position: relative;
    
                                    .text{
                                        color: #fff;
                                        font-size: 15px;
                                        line-height: 30px;
                                        font-weight: bold;
                                    }
                                    
                                    .border_bottom{
                                        position: absolute;
                                        width: 100%;
                                        left: 0px;
                                        bottom: 0px;
                                        height: 1px;
                                        background-color: #999999;
                                    }
                                }
    
                                .schedule{
                                    overflow: hidden;
                                    color: #f1f1f1;
                                    line-height: 30px;
                                    font-size: 15px;
                                    cursor: pointer;
    
                                    &:hover{
                                        color: #8711aa;
    
                                        .title{
                                            text-overflow: clip;
                                            white-space: normal;
                                        }
                                    }

                                    &.focus, &.focus:hover{
                                        color: #8711aa;
                                    }
    
                                    .time{
                                        float: left;
                                        padding-right: 10px;
                                    }
    
                                    .title{
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    }
                                }
                            }
                        }

                        .header{
                            position: absolute;
                            top: 0px;
                            left: 0px;
                            width: 97.5%;
                            height: 30px;
                            background-color: #888;
                            overflow: hidden;

                            .text{
                                color: #fff;
                                font-size: 15px;
                                line-height: 30px;
                                font-weight: bold;
                            }
                            
                            .border_bottom{
                                position: absolute;
                                width: 100%;
                                left: 0px;
                                bottom: 0px;
                                height: 1px;
                                background-color: #999999;
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