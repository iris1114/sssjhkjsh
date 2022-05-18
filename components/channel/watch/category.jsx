
import { connect } from "react-redux";
import { useMemo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import watch from "../../../assets/js/watch/index.js";
import tools from "../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {

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
        dispatchCategoriesTip: (value) => {
            dispatch({
                type: "channel/watch/categoriesTip",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [refreshTime, setRefreshTime] = useState("");
    const [categoryFocus, setCategoryFocus] = useState(null);

    const categories = useMemo(() => {
        return watch.channel.meta.getChannelCategories(props.meta, props.stationCategories);
    }, [props.meta, props.stationCategories]);

    const channels = useMemo(() => {
        for(let i = 0; i < categories.length; i ++){
            let category = categories[i];

            if(categoryFocus && categoryFocus.EngName == category.EngName){
                return category.channels;
            }
        }

        return null;
    }, [categoryFocus, categories]);

    const getCategorybtnClass = useCallback((element) => {
        if(categoryFocus && categoryFocus.EngName == element.EngName){
            return "focus";
        }

        return "";
    }, [categoryFocus]);

    const categoryBtnClickHandler = useCallback((event, element) => {
        setCategoryFocus(element);
    }, [channels]);

    const linkClickHandler = useCallback((event, element) => {
        event.preventDefault();
        
        let channel = _.cloneDeep(element);

        channel = watch.channel.meta.getPrograms(channel);

        props.dispatchProgramInfo(channel);

        scroll({
            top: 0,
            left: 0
        });
    }, []);

    const getChannelBtnFocus = useCallback((element) => {
        if(props.programInfo && element.content_id == props.programInfo.content_id){
            return "focus";
        }

        return "";
    }, [props.programInfo]);

    const getLiveChannelEPG = useCallback((channel) => {
        let schedules = channel.Schedule;
        let schedule = schedules[0];

        if(schedule){
            let program = schedule.program;
            let time = new Date(schedule.AirDateTime).toString().substring(16, 21);

            return {
                time: time,
                title: program.Title
            };
        }
        else{
            return {
                time: "--:--",
                title: "無節目資訊"
            };
        }
    }, [channels]);

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
    }, [channels]);

    const getNextLiveChannelEPG = useCallback((channel) => {
        let schedules = channel.Schedule;
        let schedule = schedules[1];

        if(schedule){
            let program = schedule.program;
            let time = new Date(schedule.AirDateTime).toString().substring(16, 21);

            return {
                time: time,
                title: program.Title
            };
        }
        else{
            return {
                time: "--:--",
                title: "無節目資訊"
            };
        }
    }, [channels]);

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
    }, [channels]);

    const nowMouseOverHandler = useCallback((event, channel) => {
        let pos = tools.getCursorPosition(event);

        if(channel.content_type == "vod-channel" || channel.content_type == "playout-channel"){
            let vodChannelSchedule = channel.vod_channel_schedule;
            let program = vodChannelSchedule.focus_program;

            let obj = {
                pos: pos
            };

            if(program.title){
                obj.title = program.title;

                if(program.subtitle){
                    obj.subtitle = program.subtitle;
                }
            }
            else{
                if(program.subtitle){
                    obj.title = program.subtitle;
                }
            }

            if(program.vod_channel_description){
                obj.desc = program.vod_channel_description;
            }

            props.dispatchCategoriesTip(obj);
        }
        else{
            let schedules = channel.Schedule;
            let schedule = schedules[0];

            if(schedule){
                let program = schedule.program;
                
                let obj = {
                    pos: pos
                };
    
                if(program.Title){
                    obj.title = program.Title;
                }
                
                if(program.SubTitle){
                    obj.subtitle = program.SubTitle;
                }

                if(program.Description){
                    obj.desc = program.Description;
                }

                props.dispatchCategoriesTip(obj);
            }
        }
    }, [channels]);

    const nextMouseOverHandler = useCallback((event, channel) => {
        let pos = tools.getCursorPosition(event);

        if(channel.content_type == "vod-channel" || channel.content_type == "playout-channel"){
            let vodChannelSchedule = channel.vod_channel_schedule;
            let index = vodChannelSchedule.next_index;
            let program = vodChannelSchedule.programs[index];

            let obj = {
                pos: pos
            };

            if(program.title){
                obj.title = program.title;

                if(program.subtitle){
                    obj.subtitle = program.subtitle;
                }
            }
            else{
                if(program.subtitle){
                    obj.title = program.subtitle;
                }
            }

            if(program.vod_channel_description){
                obj.desc = program.vod_channel_description;
            }

            props.dispatchCategoriesTip(obj);
        }
        else{
            let schedules = channel.Schedule;
            let schedule = schedules[1];

            if(schedule){
                let program = schedule.program;
                
                let obj = {
                    pos: pos
                };
    
                if(program.Title){
                    obj.title = program.Title;
                }
                
                if(program.SubTitle){
                    obj.subtitle = program.SubTitle;
                }

                if(program.Description){
                    obj.desc = program.Description;
                }

                props.dispatchCategoriesTip(obj);
            }
        }
    }, [channels]);

    const mouseLeaveHandler = useCallback(() => {
        props.dispatchCategoriesTip(null)
    }, []);

    useEffect(() => {
        let time = new Date().toString().substring(16, 21);

        setRefreshTime(time);
    }, [channels]);

    useEffect(() => {
        setCategoryFocus(null);
    }, [props.bsmPackageCategory]);

    useEffect(() => {
        if(!categoryFocus && props.programInfo){
            let stationCategories = props.programInfo.station_categories;
            
            setCategoryFocus(stationCategories[0]);
        }
    }, [props.programInfo]);


    return (
        <>
            <div className="category_section">
                <div className="header_section">
                    {
                        (() => {
                            if(refreshTime){
                                return (
                                    <div className="refresh_time">更新時間：{refreshTime}</div>
                                );
                            }
                        })()
                    }

                    <h2 className="title">現正播出</h2>
                    
                    {
                        (() => {
                            if(categoryFocus){
                                return (
                                    <h3 className="ssr_only">{categoryFocus.Name}</h3>
                                );
                            }
                        })()
                    }
                </div>

                <div className="category_btns">
                    {
                        categories.map((element, index) => {
                            return (
                                <button className={`category_btn ${getCategorybtnClass(element)}`} onClick={(event) => categoryBtnClickHandler(event, element)} key={index}>
                                    <span className="text">{element.Name}</span>
                                </button>
                            );
                        })
                    }
                </div>
                
                {
                    (() => {
                        if(channels){
                            return (
                                <div className="channel_btns">
                                    {
                                        channels.map((element, index) => {
                                            return (
                                                <a className={`channel_btn ${getChannelBtnFocus(element)}`} href={`/channel/watch?contentId=${element.content_id}`} onClick={(event) => linkClickHandler(event, element)} title={element.title} key={index} >
                                                    <div className="title_section">
                                                        <div className="no">{element.no}</div>
                                                        <div className="title">
                                                            <h4 className="text">{element.title}</h4>
                                                            
                                                            {
                                                                (() => {
                                                                    if(element.IsHD || element.quality == "HD"){
                                                                        return (
                                                                            <div className="hd_icon"></div>
                                                                        );
                                                                    }
                                                                })()
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="programs">
                                                        <div className="graph">
                                                            <div className="circle first"></div>
                                                            <div className="circle second"></div>
                                                        </div>

                                                        <div className="program now" onMouseMove={(e) => nowMouseOverHandler(e, element)} onMouseLeave={mouseLeaveHandler}>
                                                            {
                                                                (() => {
                                                                    if(element.content_type == "vod-channel" || element.content_type == "playout-channel"){
                                                                        return (
                                                                            <div className="text">
                                                                                <h5 className="title">{getVodChannelEPG(element)}</h5>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <div className="text">
                                                                                <h5 className="ssr_only">{getLiveChannelEPG(element).time} {getLiveChannelEPG(element).title}</h5>
                                                                                <div className="time">{getLiveChannelEPG(element).time}</div>
                                                                                <div className="title">{getLiveChannelEPG(element).title}</div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                })()
                                                            }
                                                        </div>

                                                        <div className="program next" onMouseMove={(e) => nextMouseOverHandler(e, element)} onMouseLeave={mouseLeaveHandler}>
                                                            {
                                                                (() => {
                                                                    if(element.content_type == "vod-channel" || element.content_type == "playout-channel"){
                                                                        return (
                                                                            <div className="text">
                                                                                <h5 className="title">{getNextVodChannelEPG(element)}</h5>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <div className="text">
                                                                                <h5 className="ssr_only">{getNextLiveChannelEPG(element).time} {getNextLiveChannelEPG(element).title}</h5>
                                                                                <div className="time">{getNextLiveChannelEPG(element).time}</div>
                                                                                <div className="title">{getNextLiveChannelEPG(element).title}</div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                })()
                                                            }
                                                        </div>
                                                    </div>
                                                </a>
                                            );
                                        })
                                    }
                                </div>
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .category_section{
                        padding-top: 40px;
                        padding-left: 0.5%;
                        padding-right: 0.5%;

                        .header_section{
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;
                            padding-left: 0.5%;
                            padding-right: 0.5%;

                            .refresh_time{
                                float: right;
                                line-height: 35px;
                                color: #666;
                                font-size: 15px;
                            }

                            .title{
                                overflow: hidden;
                                color: #5e0b75;
                                font-size: 25px;
                                line-height: 35px;
                                font-weight: bold;
                            }
                        }

                        .category_btns{
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;
    
                            .category_btn{
                                diplay: block;
                                float: left;
                                width: 13.28%;
                                margin-right: 1%;
                                margin-top: 10px;
                                margin-bottom: 10px;
                                padding-right: 5px;
                                overflow: hidden;
                                background-color: #666;
                                border-radius: 12.5px;

                                @media screen and (max-width: 1023px) {
                                    width: 19%;
                                }
    
                                &:hover{
                                    background-color: #8711aa;
                                }
    
                                &.focus, &.focus:hover{
                                    background-color: #8711aa;
                                }
    
                                .text{
                                    display: block;
                                    font-size: 15px;
                                    line-height: 30px;
                                    text-align: center;
                                    color: #f1f1f1;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    padding-left: 10px;
                                    padding-right: 5px;
                                }
                            }
                        }

                        .channel_btns{
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;

                            .channel_btn{
                                diplay: block;
                                float: left;
                                width: 19%;
                                margin-left: 0.5%;
                                margin-right: 0.5%;
                                margin-top: 10px;
                                margin-bottom: 10px;

                                @media screen and (max-width: 1023px) {
                                    width: 24%;
                                }

                                &.focus, &.focus:hover{
                                    .programs{
                                        background-color: #f3e7f6;
                                    }
                                }

                                &:hover{
                                    .programs{
                                        background-color: #f3e7f6;
                                    }
                                }

                                .title_section{
                                    position: relative;
                                    overflow: hidden;

                                    .no{
                                        position: absolute;
                                        font-size: 15px;
                                        line-height: 25px;
                                        top: 0px;
                                        left: 0px;
                                    }

                                    .title{
                                        float: left;
                                        position: relative;
                                        max-width: 100%;
                                        padding-left: 35px;
                                        padding-right: 25px;

                                        .text{
                                            font-size: 15px;
                                            line-height: 25px;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            overflow: hidden;
                                        }

                                        .hd_icon{
                                            position: absolute;
                                            top: 0px;
                                            right: 0px;
                                            width: 25px;
                                            height: 25px;
                                            background-image: url(${require("../../../assets/image/channel/hd_icon.png")});
                                            background-repeat: no-repeat;
                                            background-position-x: 100%;
                                            background-position-y: center;
                                        }
                                    }
                                }

                                .programs{
                                    border: 2px solid #dbdbdb;
                                    overflow: hidden;

                                    .graph{
                                        float: left;
                                        width: 25px;
                                        height: 80px;
                                        border-right: 2px solid #dbdbdb;
                                        position: relative;

                                        .circle{
                                            width: 15px;
                                            height: 15px;
                                            border: 2px solid #dbdbdb;
                                            border-radius: 50%;
                                            background-color: #f1f1f1;
                                            position: absolute;
                                            right: 0px;

                                            &.first{
                                                top: 25%;
                                                transform: translateX(50%) translateY(-50%);
                                            }

                                            &.second{
                                                top: 75%;
                                                transform: translateX(50%) translateY(-50%);
                                            }
                                        }
                                    }

                                    .program{
                                        overflow: hidden;
                                        padding-left: 10px;

                                        &.now{
                                            .text{
                                                .time, .title{
                                                    color: #8711aa;
                                                }
                                            }
                                        }
                                        
                                        .text{
                                            height: 40px;
                                            position: relative;

                                            .time{
                                                height: 20px;
                                                font-size: 15px;
                                                line-height: 20px;
                                                float: left;
                                                padding-right: 10px;
                                                top: 50%;
                                                transform: translateY(-50%);
                                                position: relative;
                                            }

                                            .title{
                                                height: 20px;
                                                font-size: 15px;
                                                line-height: 20px;
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                top: 50%;
                                                transform: translateY(-50%);
                                                position: relative;
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
    meta: PropTypes.object.isRequired,
    stationCategories: PropTypes.object.isRequired,
    programInfo: PropTypes.object,
    bsmPackageCategory: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);