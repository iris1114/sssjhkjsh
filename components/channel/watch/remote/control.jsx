
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useCallback, useRef, useState } from "react";

import _ from "lodash";
import watch from "../../../../assets/js/watch/index.js";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
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
        dispatchToast: (message) => {
            dispatch({
                type: "toast",
                value: message
            });
        }
    };
};

const App = (props) => {
    const controlRef = useRef(null);
    const channelIndex = useRef(0);
    const preChannelIndex = useRef(-1);
    const channelIndexInterval = useRef(null);
    const channelDispatchTimeout = useRef(null);

    const [text, setText] = useState("");

    const exitClickHandler = useCallback(() => {
        props.setView("icon");
    }, []);

    const btnClickHandler = useCallback((event, value) => {
        if(!isNaN(value)){
            if(text){
                setText(text + value);
            }
            else{
                if(value != "0"){
                    setText(text + value);
                }
            }
        }
        else{
            if(value == "clear"){
                if(text){
                    setText(text.substring(0, text.length - 1));
                }
            }
            else if(value == "back"){
                setText("");

                if(preChannelIndex.current > 0){
                    let channel = props.meta.channels[preChannelIndex.current];

                    props.dispatchToast(`${channel.no} ${channel.title}`);

                    let temp = channelIndex.current;

                    channelIndex.current = preChannelIndex.current;
                    preChannelIndex.current = temp;

                    clearTimeout(channelDispatchTimeout.current);

                    channelDispatchTimeout.current = setTimeout(() => {
                        channel = _.cloneDeep(channel);
                        channel = watch.channel.meta.getPrograms(channel);

                        props.dispatchProgramInfo(channel);

                        scroll({
                            top: 0,
                            left: 0
                        });
                    }, 300);
                }
                else{
                    props.dispatchToast("查無此台");
                }
            }
            else if(value == "enter"){
                if(text){
                    let result = null;

                    for(let i = 0; i < props.meta.channels.length; i ++){
                        let channel = props.meta.channels[i];

                        if(channel.no == parseInt(text)){
                            result = channel;
                        }
                    }

                    if(result){
                        result = _.cloneDeep(result);
                        result = watch.channel.meta.getPrograms(result);

                        props.dispatchToast(`${result.no} ${result.title}`);
                        props.dispatchProgramInfo(_.cloneDeep(result));

                        scroll({
                            top: 0,
                            left: 0
                        });
                    }
                    else{
                        props.dispatchToast("查無此台");
                    }

                    setText("");
                }
            }
        }
    }, [text, props.programInfo, props.meta]);

    const mouseDownHandler = useCallback((event, value) => {
        let add = () => {
            channelIndex.current ++;
            
            if(channelIndex.current >= props.meta.channels.length){
                channelIndex.current = 0;
            }
            
            let channel = props.meta.channels[channelIndex.current];

            props.dispatchToast(`${channel.no} ${channel.title}`);
        };

        let minus = () => {
            channelIndex.current --;

            if(channelIndex.current < 0){
                channelIndex.current = props.meta.channels.length - 1;
            }

            let channel = props.meta.channels[channelIndex.current];

            props.dispatchToast(`${channel.no} ${channel.title}`);
        };

        clearInterval(channelIndexInterval.current);
        clearTimeout(channelDispatchTimeout.current);
        event.target.addEventListener("mouseleave", mouseUpHandler);
        setText("");

        if(value == "add"){
            add();

            channelIndexInterval.current = setInterval(add, 300);
        }
        else if(value == "minus"){
            minus();

            channelIndexInterval.current = setInterval(minus, 300);
        }
    }, [props.programInfo, props.meta]);

    const mouseUpHandler = useCallback((event) => {
        clearInterval(channelIndexInterval.current);
        clearTimeout(channelDispatchTimeout.current);
        event.target.removeEventListener("mouseleave", mouseUpHandler);

        channelDispatchTimeout.current = setTimeout(() => {
            let channel = props.meta.channels[channelIndex.current];

            channel = _.cloneDeep(channel);
            channel = watch.channel.meta.getPrograms(channel);

            props.dispatchProgramInfo(channel);

            scroll({
                top: 0,
                left: 0
            });
        }, 300);
    }, [props.programInfo, props.meta]);

    useEffect(() => {
        let controlParentRect = controlRef.current.parentNode.getBoundingClientRect();
        let top = controlParentRect.top;
        let left = controlParentRect.left;
        let right = left + controlParentRect.width;
        let bottom = top + controlParentRect.height;
        let position = {};
        let bool = false;
        /*
        if(top < 0){
            position.top = 0;
            position.left = left;
            bool = true;
        }

        if(left < 0){
            position.top = top;
            position.left = 0;
            bool = true;
        }
        */
        if(right > props.resize.width){
            position.top = top;
            position.left = props.resize.width - controlParentRect.width;
            bool = true;
        }

        if(bottom > props.resize.height){
            position.top = props.resize.height - controlParentRect.height;
            position.left = position.left || left;
            bool = true;
        }
        
        if(bool){
            props.setPosition({
                top: position.top + "px",
                left: position.left + "px"
            });
        }
    }, [props.resize]);

    useEffect(() => {
        for(let i = 0; i < props.meta.channels.length; i ++){
            let channel = props.meta.channels[i];

            if(channel.content_id == props.programInfo.content_id){
                channelIndex.current = i;
            }
        }

        if(props.preProgramInfo){
            for(let i = 0; i < props.meta.channels.length; i ++){
                let channel = props.meta.channels[i];
    
                if(channel.content_id == props.preProgramInfo.content_id){
                    preChannelIndex.current = i;
                }
            }
        }
    }, [props.meta, props.programInfo, props.preProgramInfo]);

    return (
        <>
            <div className="control" ref={controlRef}>
                <div className="title">選台器</div>

                <div className="btn_section">
                    <div className="right_section">
                        <button className="btn small" onClick={(event) => btnClickHandler(event, "clear")}>清除</button>
                        <button className="btn large" onMouseDown={(event) => mouseDownHandler(event, "add")} onMouseUp={mouseUpHandler}>CH+</button>
                        <button className="btn large" onMouseDown={(event) => mouseDownHandler(event, "minus")} onMouseUp={mouseUpHandler}>CH-</button>
                    </div>

                    <div className="left_section">
                        <div className="text">{text}</div>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "1")}>1</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "2")}>2</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "3")}>3</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "4")}>4</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "5")}>5</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "6")}>6</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "7")}>7</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "8")}>8</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "9")}>9</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "back")}>往返</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "0")}>0</button>
                        <button className="btn" onClick={(event) => btnClickHandler(event, "enter")}>確定</button>
                    </div>
                </div>

                <button className="exit" onClick={exitClickHandler}>
                    <img className="icon" src={require("../../../../assets/image/channel/player/episodeDialog/btn_close.svg")} />
                </button>
            </div>

            <style jsx>
                {`
                    .control{
                        width: 300px;
                        background-color: #444;
                        border-radius: 5px;
                        position: relative;
                        box-shadow: 0 0 15px #000;
                        overflow: hidden;
                        padding: 10px;

                        .title{
                            line-height: 40px;
                            font-size: 20px;
                            color: #f1f1f1;
                            text-align: center;
                        }

                        .btn_section{
                            overflow: hidden;

                            .left_section{
                                overflow: hidden;

                                .text{
                                    width: calc(100% - 6px);
                                    height: 40px;
                                    margin: 3px;
                                    border: 1px solid #f1f1f1;
                                    border-radius: 20px;
                                    font-size: 20px;
                                    line-height: 40px;
                                    text-align: center;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    color: #f1f1f1;
                                }

                                .btn{
                                    display: block;
                                    float: left;
                                    width: calc(33.33% - 6px);
                                    height: 40px;
                                    margin: 3px;
                                    border: 1px solid #f1f1f1;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 15px;
                                    line-height: 38px;
                                    text-align: center;
                                    color: #f1f1f1;

                                    &:hover{
                                        color: #408ed6;
                                        border: 2px solid #408ed6;
                                        font-weight: bold;
                                        line-height: 36px;
                                    }
                                }
                            }

                            .right_section{
                                width: 25%;
                                float: right;

                                .btn{
                                    display: block;
                                    float: left;
                                    width: calc(100% - 6px);
                                    margin: 3px;
                                    border: 1px solid #f1f1f1;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 15px;
                                    text-align: center;
                                    color: #f1f1f1;

                                    &.small{
                                        height: 40px;
                                        line-height: 38px;

                                        &:hover{
                                            color: #408ed6;
                                            border: 2px solid #408ed6;
                                            font-weight: bold;
                                            line-height: 36px;
                                        }
                                    }

                                    &.large{
                                        height: 86px;
                                        line-height: 84px;

                                        &:hover{
                                            color: #408ed6;
                                            border: 2px solid #408ed6;
                                            font-weight: bold;
                                            line-height: 82px;
                                        }
                                    }
                                }
                            }
                        }

                        .exit{
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            width: 25px;
                            height: 25px;

                            .icon{
                                display: block;
                                width: 100%;
                                height: 100%;
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
    setView: PropTypes.func.isRequired,
    setPosition: PropTypes.func.isRequired,
    programInfo: PropTypes.object.isRequired,
    preProgramInfo: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);