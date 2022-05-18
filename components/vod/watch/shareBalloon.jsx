
import { connect } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";

import tools from "../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        shareBalloonTrigger: state.vod.watch.shareBalloonTrigger,
        scroll: state.scroll
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchShareBalloonTrigger: (element) => {
            dispatch({
                type: "vod/watch/shareBalloonTrigger",
                value: element
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
    const shareBalloonSectionRef = useRef(null);
    const [shareBalloonSectionStyle, setShareBalloonSectionStyle] = useState({});

    const preScroll = tools.hook.usePrevious(props.scroll);

    const mouseoverHandler = useCallback((event) => {
        if(!tools.isElement(event.target, props.shareBalloonTrigger) && !tools.isElement(event.target, shareBalloonSectionRef.current)){
            props.dispatchShareBalloonTrigger(null);
        }
    }, [props.shareBalloonTrigger, shareBalloonSectionRef.current]);

    const fbShareBtnClickHandler = useCallback((event) => {
        if(typeof FB == "undefined"){
            return;
        }

        FB.ui({
            method: "share",
            href: location.href,
        }, (response) => {
            console.log(response);
        });

        props.dispatchShareBalloonTrigger(null);
    }, []);

    const copyBtnClickHandler = useCallback((event) => {
        const el = document.createElement("textarea");

        el.value = location.href;
        el.style.position = "absolute";
        el.style.left = "-9999px";

        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        props.dispatchShareBalloonTrigger(null);
        props.dispatchToast("已複製到剪貼簿");
    }, []);

    useEffect(() => {
        let triggerElement = props.shareBalloonTrigger;
        let shareBalloonSection = shareBalloonSectionRef.current;
        let triggerElementBoundingClientRect = triggerElement.getBoundingClientRect();
        let shareBalloonSectionBoundingClientRect = shareBalloonSection.getBoundingClientRect();
        let top = triggerElementBoundingClientRect.top + triggerElementBoundingClientRect.height;
        let left = triggerElementBoundingClientRect.left - (shareBalloonSectionBoundingClientRect.width - triggerElementBoundingClientRect.width) / 2;

        setShareBalloonSectionStyle({
            top: parseInt(top),
            left: parseInt(left),
            opacity: 1
        });
    }, [props.shareBalloonTrigger]);

    useEffect(() => {
        removeEventListener("mouseover", mouseoverHandler);

        if(props.shareBalloonTrigger){
            addEventListener("mouseover", mouseoverHandler);
        }

        return () => {
            removeEventListener("mouseover", mouseoverHandler);
        };
    }, [props.shareBalloonTrigger]);

    useEffect(() => {
        if(preScroll == props.scroll){
            return;
        }

        props.dispatchShareBalloonTrigger(null);
    }, [props.scroll]);

    return (
        <>
            <section className="share_balloon_section" style={shareBalloonSectionStyle} ref={shareBalloonSectionRef}>
                <div className="content_section">
                    <button className="fb_share_btn" onClick={fbShareBtnClickHandler}>
                        <span className="icon"></span>
                        <span className="text">分享至facebook</span>
                    </button>

                    <button className="copy_btn" onClick={copyBtnClickHandler}>
                        <span className="icon"></span>
                        <span className="text">複製到剪貼簿</span>
                    </button>
                </div>

                <div className="triangle"></div>
            </section>

            <style jsx>
                {`
                    .share_balloon_section{
                        display: block;
                        position: fixed;
                        width: 200px;
                        opacity: 0;
                        z-index: 1;

                        .content_section{
                            margin-top: 10px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 20px rgba(0,0,0,.5);
                            overflow: hidden;
                            padding: 10px;

                            .fb_share_btn{
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                width: 100%;

                                .icon{
                                    display: block;
                                    width: 40px;
                                    height: 40px;
                                    background-size: cover;
                                    background-image: url(${require("../../../assets/image/icon/fb.png")});
                                }

                                .text{
                                    display: block;
                                    flex-grow: 1;
                                    font-size: 15px;
                                    line-height: 30px;
                                    text-align: left;
                                    padding-left: 5px;
                                }
                            }

                            .copy_btn{
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                width: 100%;
                                margin-top: 10px;

                                .icon{
                                    display: block;
                                    width: 40px;
                                    height: 40px;
                                    background-size: cover;
                                    background-image: url(${require("../../../assets/image/icon/copy.png")});
                                }

                                .text{
                                    display: block;
                                    flex-grow: 1;
                                    font-size: 15px;
                                    line-height: 30px;
                                    text-align: left;
                                    padding-left: 5px;
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
    programInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
