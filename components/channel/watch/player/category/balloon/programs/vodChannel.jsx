
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createRef, useEffect, useMemo, useCallback } from "react";
import _ from "lodash";

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
    const programs = useMemo(() => {
        return props.channel.vod_channel_schedule.programs;
    }, [props.channel]);

    const scheduleRefs = useMemo(() => {
        let refs = new Array();
    
        for(let i = 0; i < props.channel.vod_channel_schedule.programs.length; i ++){
            refs.push(createRef());
        }

        return refs;
    }, [props.channel]);

    const getFocusClass = useCallback((index) => {
        let focus = props.channel.vod_channel_schedule.focus_index;

        if(focus == index){
            return "focus";
        }

        return "";
    }, [props.channel]);

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
    }, [props.channel]);

    const clickHandler = useCallback((index) => {
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
    }, [props.channel]);

    useEffect(() => {
        let index = props.channel.vod_channel_schedule.focus_index;
        let element = scheduleRefs[index];
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
    }, []);

    return (
        <>
            <div className="schedules">
                {
                    programs.map((element, index) => {
                        return (
                            <div className={`schedule ${getFocusClass(index)}`} onClick={(event) => clickHandler(index)} ref={scheduleRefs[index]} key={index}>
                                <div className="text">{getTitle(element)}</div>
                                <div className="icon"></div>
                            </div>
                        );
                    })
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
                        overflow: auto;

                        .schedule{
                            position: relative;
                            padding-right: 30px;
                            cursor: pointer;

                            &.focus, &.focus:hover{
                                .icon{
                                    background-image: url(${require("../../../../../../../assets/image/channel/player/category/replay_button.svg")});
                                }

                                .text{
                                    color: #8711aa;
                                }
                            }

                            &:hover{
                                .text{
                                    color: #8711aa;
                                    text-overflow: clip;
                                    white-space: normal;
                                }
                            }

                            .icon{
                                position: absolute;
                                width: 30px;
                                height: 30px;
                                top: 50%;
                                right: 0px;
                                transform: translateY(-50%);
                                background-image: url(${require("../../../../../../../assets/image/channel/player/category/play_button.svg")});
                                background-size: 20px 20px;
                                background-position: center center;
                                background-repeat: no-repeat;
                            }

                            .text{
                                line-height: 30px;
                                font-size: 15px;
                                color: #f1f1f1;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
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
