
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createRef, useCallback, useEffect, useMemo} from "react";
import _ from "lodash";

import channelTool from "../../../../../../assets/js/channel/index.js";

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
    const subtitle = useMemo(() => {
        let vodChannelSchedule = null;

        if(props.programInfo.content_id == props.channel.content_id){
            vodChannelSchedule = props.programInfo.vod_channel_schedule;
        }
        else{
            vodChannelSchedule = props.channel.vod_channel_schedule;
        }

        let program = vodChannelSchedule.focus_program;
        let subtitle = channelTool.getVodChannelProgramSubtitle(program);

        return subtitle;
    }, [props.programInfo, props.channel]);

    const getFocusClass = useCallback((index) => {
        if(props.programInfo.content_id == props.channel.content_id){
            if(index == props.programInfo.vod_channel_schedule.focus_index){
                return "focus";
            }
        }
        else{
            if(index == props.channel.vod_channel_schedule.focus_index){
                return "focus";
            }
        }

        return "";
    }, [props.programInfo]);

    const scheduleClickHandler = useCallback((index) => {
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

    }, [props.channel, props.programInfo]);


    const listRefs = useMemo(() => {
        let programs = props.channel.vod_channel_schedule.programs;
        let arr = new Array();

        for(let i = 0; i < programs.length; i ++){
            arr.push(createRef());
        }

        return arr;
    }, [props.channel]);

    useEffect(() => {
        let index = props.channel.vod_channel_schedule.focus_index;
        let element = listRefs[index];
        let boundingClientRect = element.current.getBoundingClientRect();
        let elementTop = boundingClientRect.top; 
        let elementHeight = boundingClientRect.height; 

        let parentElement = element.current.parentNode.parentNode;
        let parentBoundingClientRect = parentElement.getBoundingClientRect();
        let parentElementTop = parentBoundingClientRect.top; 
        let parentElementHeight = parentBoundingClientRect.height;
    
        let top = (elementTop - parentElementTop) - (parentElementHeight - elementHeight) / 2;
        
        parentElement.scroll({
            top: top,
            left: 0
        });
    },[]);

    return (
        <>
            <div className="vod_channel_secondary_mark">
                <div className="head_section">
                    <div className="title_wrap">
                        <div className="no">{props.channel.no}</div>
                        <div className="title">{props.channel.title}</div>
                    </div>
                    <div className="subtitle">{`現正播放 ${subtitle}`}</div>
                </div>

                <div className="schedules_section">
                    {
                        props.channel.vod_channel_schedule.programs.map((element, index) => {
                            return(
                                <div className={`schedule ${getFocusClass(index)}`} onClick={() => scheduleClickHandler(index)} ref={listRefs[index]} key={index} >
                                    <div className="on_air_icon_padding"><div className="on_air_icon"></div></div>
                                    <div className="program_wrap">
                                        <div className="program">
                                            <div className="name">{channelTool.getVodChannelProgramSubtitle(element)}</div>
                                            <div className="description">{element.vod_channel_description}</div>
                                        </div>   
                                    </div>
                                    <div className="play_icon_padding"><div className="play_icon"></div></div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .vod_channel_secondary_mark{
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
                           .schedule{
                                width: 100%;
                                height: 80px;
                                display: flex;
                                align-items: center;
                                border-bottom: 1px solid #5a5658 ;
                                cursor: pointer;

                                .on_air_icon_padding{
                                    width: 15%;
                                    display: flex;
                                    align-items: center;
                                }

                                .program_wrap{
                                    display: flex;
                                    align-items: flex-start;
                                    width: 75%;

                                    .program{
                                        width: 100%;
                                        .name{
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
                                }

                                &:first-child{
                                    border-top: 1px solid #5a5658 ;
                                }

                                .play_icon_padding{
                                    width: 10%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;

                                    .play_icon{
                                        width: 24px;
                                        height: 24px;
                                        background-image: url(${require("../../../../../../assets/image/channel/player/episodeDialog/icon_play.svg")});
                                    }
                                }

                                &.focus{
                                    .on_air_icon{
                                        background-image: url(${require("../../../../../../assets/image/channel/player/episodeDialog/tag_on_air.svg")});
                                        width: 44px;
                                        height: 24px;
                                    } 

                                    .play_icon_padding{
                                        .play_icon{
                                            background-image: url(${require("../../../../../../assets/image/channel/player/episodeDialog/icon_replay.svg")});  
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
    channel: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
