
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useMemo, useCallback } from "react";
import _ from "lodash";

import tools from "../../../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        programInfo: state.channel.watch.programInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const subtitle = useMemo(() => {
        if(props.channel.Schedule && props.channel.Schedule.length > 0){
            let program = props.channel.Schedule[0].program;
            if (!program.SubTitle) {
                return `現正播放 ${program.Title}`;
            }
            else{
                return `現正播放 ${program.Title} - ${program.SubTitle}`
            }
        }
    }, [props.channel]);

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

    const getAirDateTime = useCallback((airDateTime) => {
        airDateTime = new Date(airDateTime);
        airDateTime = airDateTime.toString().substring(16, 21);

        return airDateTime;
    }, []);

    const getFocusClass = useCallback((index, _index) => {
        if(index <= 0 && _index <= 0){
            return "focus";
        }

        return "";
    }, [props.programInfo, props.channel]);

    return (
        <>
            <div className="channel_episodes">
                <div className="head_section">
                    <div className="title_wrap">
                        <div className="no">{props.channel.no}</div>
                        <div className="title">{props.channel.title}</div>
                    </div>
                    <div className="subtitle">{subtitle}</div>
                </div>

                <div className="schedules_section">
                    <div className="schedules_wrap">
                        {   
                            (() => {
                                if(props.channel.Schedule && props.channel.Schedule.length){
                                    return(
                                        schedules.date.map((element, index) => {
                                            return(
                                                <React.Fragment key={index}>
                                                    <div className="date">{element}</div>
                                                    {
                                                        schedules.schedule[index].map((_element, _index) => {
                                                            return(
                                                                <div className={`schedule ${getFocusClass(index, _index)}`} key={_index}>
                                                                    <div className="on_air_icon_padding">
                                                                        <div className="on_air_icon"></div>
                                                                    </div>
                                                                    <div className="program">
                                                                        <div className="time">{getAirDateTime(_element.p_start)}</div>
                                                                        <div className="title">{_element.program.Title}</div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </React.Fragment>
                                            );
                                        })
                                    );
                                }
                                else{
                                    return (
                                        <div className="empty">無節目資訊</div>
                                    ); 
                                }
                            })()
                        }
                    </div>
                </div>
            </div>
     

            <style jsx>
                {`
                 .channel_episodes{
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
                                line-height: 24px;
                                padding: 10px 0;
                                display: flex;
                                align-items: center;
                                border-bottom: 1px solid #5a5658 ;
                                cursor: pointer;

                                .on_air_icon_padding{
                                    width: 20%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                .program{
                                    width: 80%; 
                                    
                                    .time{
                                        font-size: 14px;
                                        line-height: 19px;
                                        color:#b0b0b0;
                                    }
                                    
                                    .title{
                                        font-size: 18px;
                                        line-height: 24px;
                                        color: #b0b0b0;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;

                                      
                                    }
                                }

                                &.focus{
                                    .on_air_icon_padding{
                                        .on_air_icon{
                                            background-image: url(${require("../../../../../assets/image/channel/player/episodeDialog/tag_live.svg")});
                                            width: 44px;
                                            height: 24px;
                                        }
                                    }
                                }
                                &.focus{
                                    .program{
                                        .title{
                                            color: #fff;  
                                        }
                                    }
                                }
                            }
                            
                            .empty{
                                color: #b7b7b7;
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
