
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useState, useMemo, useRef } from "react";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const width = useRef("250px");

    const liveChannelEPG = useMemo(() => {
        if(props.channel.content_type == "vod-channel" || props.channel.content_type == "playout-channel"){
            return null;
        }

        let schedules = props.channel.Schedule;
        let schedule = schedules[0];

        if(schedule){
            let program = schedule.program;
            let time = new Date(schedule.AirDateTime).toString().substring(16, 21);

            return {
                time: time,
                title: program.Title,
                desc: program.Description
            };
        }
        else{
            return {
                time: "--:--",
                title: "無節目資訊",
                desc: ""
            };
        }
    }, [props.channel]);

    const vodChannelEPG = useMemo(() => {
        if(props.channel.content_type != "vod-channel" && props.channel.content_type != "playout-channel"){
            return null;
        }

        let vodChannelSchedule = props.channel.vod_channel_schedule;
        let program = vodChannelSchedule.focus_program;
        let title = "";

        if(program.title && program.subtitle){
            title = program.title + " - " + program.subtitle;
        }
        else if(program.title){
            title = program.title;
        }
        else if(program.subtitle){
            title = program.subtitle;
        }

        return {
            title: title,
            desc: program.vod_channel_description
        }
    }, [props.channel]);

    const nextLiveChannelEPG = useMemo(() => {
        if(props.channel.content_type == "vod-channel" || props.channel.content_type == "playout-channel"){
            return null;
        }

        let schedules = props.channel.Schedule;
        let schedule = schedules[1];

        if(schedule){
            let program = schedule.program;
            let time = new Date(schedule.AirDateTime).toString().substring(16, 21);

            return {
                time: time,
                title: program.Title,
                desc: program.Description
            };
        }
        else{
            return {
                time: "--:--",
                title: "無節目資訊",
                desc: ""
            };
        }
    }, [props.channel]);

    const nextVodChannelEPG = useMemo(() => {
        if(props.channel.content_type != "vod-channel" && props.channel.content_type != "playout-channel"){
            return null;
        }

        let vodChannelSchedule = props.channel.vod_channel_schedule;
        let index = vodChannelSchedule.next_index;
        let program = vodChannelSchedule.programs[index];
        let title = "";

        if(program.title && program.subtitle){
            title = program.title + " - " + program.subtitle;
        }
        else if(program.title){
            title = program.title;
        }
        else if(program.subtitle){
            title = program.subtitle;
        }

        return {
            title: title,
            desc: program.vod_channel_description
        }
    }, [props.channel]);

    const [pos, setPos] = useState({
        top: "0px",
        left: "0px",
        display: "none"
    });

    useEffect(() => {
        let top = props.pos.top;
        let left = props.pos.left - parseInt(width.current) / 2;

        top = top - scrollY + 10;

        setPos({
            top: `${top}px`,
            left: `${left}px`,
            display: "block"
        });
    }, [props.pos]);

    return (
        <>
            <div className="channels_tip">
                <div className="content">
                    <div className="title">{`${props.channel.no} ${props.channel.title}`}</div>
                    <div className="segment"></div>

                    <div className="now epg">
                        <div className="header">現正播出</div>
                        
                        {
                            (() => {
                                if(props.channel.content_type == "vod-channel" || props.channel.content_type == "playout-channel"){
                                    return (
                                        <div className="text">
                                            <div className="epg_title">{vodChannelEPG.title}</div>
                                        </div>
                                    );
                                }
                                else{
                                    return (
                                        <div className="text">
                                            <div className="time">{liveChannelEPG.time}</div>
                                            <div className="epg_title">{liveChannelEPG.title}</div>
                                        </div>
                                    );
                                }
                            })()
                        }

                        {               
                            (() => {
                                if(props.channel.content_type == "vod-channel" || props.channel.content_type == "playout-channel"){
                                    if(vodChannelEPG.desc){
                                        return (
                                            <div className="desc">{vodChannelEPG.desc}</div>
                                        );
                                    }
                                }
                                else{
                                    if(liveChannelEPG.desc){
                                        return (
                                            <div className="desc">{liveChannelEPG.desc}</div>
                                        );
                                    }
                                }
                            })()
                        }
                    </div>

                    <div className="segment"></div>

                    <div className="next epg">
                        <div className="header">即將播出</div>
                        
                        {
                            (() => {
                                if(props.channel.content_type == "vod-channel" || props.channel.content_type == "playout-channel"){
                                    return (
                                        <div className="text">
                                            <div className="epg_title">{nextVodChannelEPG.title}</div>
                                        </div>
                                    );
                                }
                                else{
                                    return (
                                        <div className="text">
                                            <div className="time">{nextLiveChannelEPG.time}</div>
                                            <div className="epg_title">{nextLiveChannelEPG.title}</div>
                                        </div>
                                    );
                                }
                            })()
                        }

                        {               
                            (() => {
                                if(props.channel.content_type == "vod-channel" || props.channel.content_type == "playout-channel"){
                                    if(nextVodChannelEPG.desc){
                                        return (
                                            <div className="desc">{nextVodChannelEPG.desc}</div>
                                        );
                                    }
                                }
                                else{
                                    if(nextLiveChannelEPG.desc){
                                        return (
                                            <div className="desc">{nextLiveChannelEPG.desc}</div>
                                        );
                                    }
                                }
                            })()
                        }
                    </div>
                </div>

                <div className="triangle"></div>
            </div>

            <style jsx>
                {`
                    .channels_tip{
                        display: block;
                        position: fixed;
                        width: ${width.current};
                        top: ${pos.top};
                        left: ${pos.left};
                        display: ${pos.display};

                        .content{
                            margin-top: 10px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 20px rgba(0,0,0,.5);
                            overflow: hidden;
                            padding: 10px;

                            .title{
                                font-size: 15px;
                                line-height: 25px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-weight: bold;
                            }

                            .segment{
                                background-color: #dbdbdb;
                                height: 1px;
                                margin-top: 5px;
                            }

                            .epg{
                                margin-top: 5px;
                                
                                .header{
                                    font-size: 15px;
                                    line-height: 25px;
                                    font-weight: bold;
                                    color: #8711aa;
                                }

                                .text{
                                    overflow: hidden;

                                    .time{
                                        padding-right: 10px;
                                        font-size: 15px;
                                        line-height: 25px;
                                        float: left;
                                    }

                                    .epg_title{
                                        font-size: 15px;
                                        line-height: 25px;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                    }
                                }

                                .desc{
                                    font-size: 13px;
                                    line-height: 25px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }

                        .triangle{
                            position: absolute;
                            width: 20px;
                            height: 10px;
                            border-style: solid;
                            border-width: 0 10px 10px;
                            border-color: transparent transparent #fff;
                            top: 0px;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    channel: PropTypes.object.isRequired,
    pos: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);