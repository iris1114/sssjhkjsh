
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useRef, useCallback } from "react";

import tools from "../../../../../../../assets/js/tools/index.js";

import Channel from "./channel.jsx";
import VodChannel from "./vodChannel.jsx";
import PlayoutChannel from "./playoutChannel.jsx";

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
    const programsSectionRef = useRef(null);

    const mouseoverHandler = useCallback((event) => {
        if(!tools.isElement(event.target, props.meta.target) && !tools.isElement(event.target, programsSectionRef.current)){
            props.meta.leaveCallback();
        }
    }, []);

    useEffect(() => {
        removeEventListener("mouseover", mouseoverHandler);
        addEventListener("mouseover", mouseoverHandler);

        return () => {
            removeEventListener("mouseover", mouseoverHandler);
        };
    }, []);

    return (
        <>
            <div className="programs_section" ref={programsSectionRef}>
                {
                    (() => {
                        if(props.channel.content_type == "channel"){
                            return (
                                <Channel channel={props.channel} />
                            );
                        }
                        else if(props.channel.content_type == "vod-channel"){
                            return (
                                <VodChannel channel={props.channel} />
                            );
                        }
                        else if(props.channel.content_type == "playout-channel"){
                            return (
                                <PlayoutChannel channel={props.channel} />
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .programs_section{
                        position: absolute;
                        top: 0px;
                        left: 33.33%;
                        right: 0px;
                        bottom: 0px;
                        background-color: #888888;
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    meta: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
