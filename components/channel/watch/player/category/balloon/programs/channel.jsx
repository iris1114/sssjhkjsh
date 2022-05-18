
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createRef, useEffect, useState, useMemo, useRef, useCallback } from "react";
import _ from "lodash";

import tools from "../../../../../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const headerRef = useRef(null);

    const [headerText, setHeaderText] = useState("");

    const schedules = useMemo(() => {
        let schedules = props.channel.Schedule;
        let result = {
            date: [],
            schedule: []
        };
        
        for(let i = 0; i < schedules.length; i ++){
            let schedule = schedules[i];
            let airDateTime = schedule.AirDateTime;
            let now = new Date();

            airDateTime = new Date(airDateTime);

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
        if(!props.channel.Schedule || !props.channel.Schedule.length){
            return;
        }

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

    useEffect(() => {
        scrollHandler();
    }, [dateRefs]);

    return (
        <>
            <div className="schedules">
                <div className="scroll_section" onScroll={scrollHandler}>
                    {
                        (() => {
                            if(props.channel.Schedule && props.channel.Schedule.length){
                                return schedules.date.map((element, index) => {
                                    return (
                                        <div className="date_block" key={index}>
                                            <div className="date" data-text={element} ref={dateRefs[index]}>
                                                <div className="text">{element}</div>
                                                <div className="border_bottom"></div>
                                            </div>

                                            {
                                                schedules.schedule[index].map((_element, _index) => {
                                                    return (
                                                        <div className="schedule" key={_index}>
                                                            <div className="time">{getAirDateTime(_element.AirDateTime)}</div>
                                                            <div className="title">{_element.program.Title}</div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    );
                                });
                            }
                            else{
                                return (
                                    <div className="empty">無節目資訊</div>
                                );
                            }
                        })()
                    }
                </div>
                
                {
                    (() => {
                        if(props.channel.Schedule && props.channel.Schedule.length){
                            return (
                                <div className="header" ref={headerRef}>
                                    <div className="text">{headerText}</div>
                                    <div className="border_bottom"></div>
                                </div>
                            );
                        }
                    })()
                }
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
    
                                &:first-of-type{
                                    .schedule:nth-child(2){
                                        color: #8711aa;
                                    }
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
    
                                    &:hover{
                                        color: #8711aa;
    
                                        .title{
                                            text-overflow: clip;
                                            white-space: normal;
                                        }
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

                            .empty{
                                color: #fff;
                                font-size: 15px;
                                line-height: 30px;
                                font-weight: bold;
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
