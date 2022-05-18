
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

import Icon from "./icon.jsx";
import Control from "./control.jsx";

import _ from "lodash";

import tools from "../../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const prePosition = useRef(null);

    const [view, setView] = useState("icon");

    const preView = tools.hook.usePrevious(view);
    
    const [position, setPosition] = useState({
        top: "0px",
        left: "0px",
        transform: "none"
    });

    useEffect(() => {
        let pos = {
            top: "50%",
            left: "100%",
            transform: "translateX(-100%) translateY(-50%)"
        };

        prePosition.current = pos;

        setPosition(pos);
    }, [props.resize]);

    useEffect(() => {
        if(view != "icon" && preView == "icon"){
            prePosition.current = position;

            delete prePosition.current.transitionProperty;
        }
        else if(view == "icon"){
            setPosition(prePosition.current);
        }
    }, [view]);

    return (
        <>
            <div className="channel_remote_control">
                {
                    (() => {
                        if(view == "icon"){
                            return (
                                <Icon setView={setView} setPosition={setPosition} />
                            );
                        }
                        else if(view == "control"){
                            return (
                                <Control meta={props.meta} setView={setView} setPosition={setPosition} programInfo={props.programInfo} preProgramInfo={props.preProgramInfo} />
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .channel_remote_control{
                        padding: 15px;
                        position: fixed;
                        top: ${position.top};
                        left: ${position.left};
                        transform: ${position.transform || "none"};
                        z-index: 100;
                        transition-property: ${position.transitionProperty || "none"};
                        transition-duration: 0.3s;
                        transition-timing-function: ease;
                    }
                `}
            </style>
        </>
    );
};


App.propTypes = {
    meta: PropTypes.object.isRequired,
    programInfo: PropTypes.object.isRequired,
    preProgramInfo: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);