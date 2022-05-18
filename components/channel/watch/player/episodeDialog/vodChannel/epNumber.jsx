
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createRef, useCallback, useEffect, useMemo, useState } from "react";
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
    const [episodesProgram, setEpisodeProgram] = useState(props.channel.vod_channel_schedule.programs);
    const [sortStatus, setSortStatus] = useState("ascending");

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

    const sortBtnClickHandler = useCallback(() => {
        if(sortStatus == "ascending"){
            setSortStatus("descending");
        }
        else{
            setSortStatus("ascending");
        }
    }, [sortStatus]);

    const getFocusClass = useCallback((element) => {
        if(props.programInfo.content_id == props.channel.content_id){
            if(element.content_id == props.programInfo.vod_channel_schedule.focus_program.content_id){
                return "focus";
            }
        }
        else{
            if(element.content_id == props.channel.vod_channel_schedule.focus_program.content_id){
                return "focus";
            }
        }
        return "";
    }, [props.programInfo, props.channel]);

    const episodeClickHandler = useCallback((element) => {
        let channel = _.cloneDeep(props.channel);
        let vodChannelSchedule = channel.vod_channel_schedule;
        let programs = vodChannelSchedule.programs;
        let index = -1;

        for(let i = 0; i < programs.length; i ++){
            let program = programs[i];

            if(element.content_id == program.content_id){
                index = i;

                break;
            }
        }

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
    }, [props.channel, episodesProgram]);

    const listRefs = useMemo(() => {
        let programs = props.channel.vod_channel_schedule.programs;
        let arr = new Array();

        for(let i = 0; i < programs.length; i ++){
            arr.push(createRef());
        }

        return arr;
    }, [props.channel]);

    useEffect(() => {
        let programs = _.cloneDeep(props.channel.vod_channel_schedule.programs);

        if(sortStatus == "ascending"){
            setEpisodeProgram(programs);
        }
        else{
            setEpisodeProgram(programs.reverse());
        }
    }, [props.channel, sortStatus]);

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
            <div className="vod_channel_ep_number">
                <div className="head_section">
                    <div className="title_wrap">
                        <div className="no">{props.channel.no}</div>
                        <div className="title">{props.channel.title}</div>
                    </div>
                    <div className="subtitle">{`現正播放 ${subtitle}`}</div>
                    <div className={`sort_btn ${sortStatus}`} onClick={sortBtnClickHandler}></div>
                </div>

                <div className="episodes_section">
                    {
                        episodesProgram.map((element, index) => {
                            return(
                                <div className={`episode ${getFocusClass(element)}`} onClick={() => episodeClickHandler(element)} ref={listRefs[index]} key={index}>{element.ep_number}</div>
                            );
                        })
                    }
                </div>

            </div>

            <style jsx>
                {`
                    .vod_channel_ep_number{
                        padding: 0px 10px;
                        height: 100%;
                        overflow: hidden;
                        overflow-y: auto;

                        &::-webkit-scrollbar-thumb{
                            background: rgba(250, 250, 250, 0.5);
                        }

                        .head_section{
                            padding: 16px 0px 16px 14px;
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
                                margin-bottom: 16px;
                            }

                            .sort_btn{
                                width: 72px;
                                height: 26px;
                                background-size: cover;
                                background-repeat: no-repeat;
                                margin-left: auto;
                                cursor: pointer;
                                margin-right: 5px;

                                &.ascending{
                                    background-image: url(${require("../../../../../../assets/image/channel/player/episodeDialog/btn_ascending_normal.svg")});
                    
                                    &:hover{
                                        background-image: url(${require("../../../../../../assets/image/channel/player/episodeDialog/btn_ascending_hover.svg")});
                                    }
                                }

                                &.descending{
                                    background-image: url(${require("../../../../../../assets/image/channel/player/episodeDialog/btn_descending_normal.svg")});
                    
                                    &:hover{
                                        background-image: url(${require("../../../../../../assets/image/channel/player/episodeDialog/btn_descending_hover.svg")});
                                    }
                                }
                           
                            }
                        }
                        .episodes_section{
                            display: flex;
                            flex-wrap: wrap;
                            
                            .episode{
                                width: calc((100%/5) - 2%);
                                height: 36px;
                                margin: 5px 1%;
                                overflow: hidden;
                                color: #f1f1f1;
                                font-size: 18px;
                                line-height: 36px;
                                border: solid 1px #8f8f8f;
                                box-sizing: border-box;
                                opacity: 0.9;
                                text-align: center;
                                cursor: pointer;
            
                                &:hover{
                                    border-color: #8711aa;
                                }
            
                                &.focus{
                                    border-color: #8711aa;
                                    background-color: #8711aa;
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