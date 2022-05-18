
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useState, useRef, useCallback } from "react";

import Channels from "./channels.jsx";

import tools from "../../../../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchCategoriesBalloon: (value) => {
            dispatch({
                type: "channel/watch/player/categoriesBalloon",
                value: value
            });
        }
    }
};

const App = (props) => {
    const categoryBalloonRef = useRef(null);

    const [width, setWidth] = useState("650px");

    const [categoryBalloonStyle, setCategoryBalloonStyle] = useState({
        top: "0px",
        left: "0px",
        visibility: "hidden"
    });

    const [categoryBalloonArrowStyle, setCategoryBalloonArrowStyle] = useState({
        left: "50%"
    });

    const mouseoverHandler = useCallback((event) => {
        if(!tools.isElement(event.target, props.meta.target) && !tools.isElement(event.target, categoryBalloonRef.current)){
            props.dispatchCategoriesBalloon(null);
        }
    }, []);

    useEffect(() => {
        let triggerElement = props.meta.target;
        let categoryBalloon = categoryBalloonRef.current;
        let triggerElementBoundingClientRect = triggerElement.getBoundingClientRect();
        let categoryBalloonBoundingClientRect = categoryBalloon.getBoundingClientRect();
        let top = triggerElementBoundingClientRect.top + triggerElementBoundingClientRect.height;
        let left = triggerElementBoundingClientRect.left - (categoryBalloonBoundingClientRect.width - triggerElementBoundingClientRect.width) / 2;
        
        setCategoryBalloonStyle({
            top: `${parseInt(top)}px`,
            left: `${parseInt(left)}px`,
            visibility: "hidden"
        });
    }, []);

    useEffect(() => {
        let categoryBalloon = categoryBalloonRef.current;
        let categoryBalloonBoundingClientRect = categoryBalloon.getBoundingClientRect();
        
        if(categoryBalloonBoundingClientRect.top <= 0 && categoryBalloonBoundingClientRect.left <= 0){
            return;
        }

        if(categoryBalloonStyle.visibility == "visible"){
            return;
        }

        let categoryBalloonLeft = categoryBalloonBoundingClientRect.left;
        let categoryBalloonRight = categoryBalloonBoundingClientRect.left + categoryBalloonBoundingClientRect.width;
        
        if(categoryBalloonLeft < 0 || categoryBalloonRight > document.body.clientWidth){
            let triggerElement = props.meta.target;
            let triggerElementBoundingClientRect = triggerElement.getBoundingClientRect();
            let top = triggerElementBoundingClientRect.top + triggerElementBoundingClientRect.height;

            if(categoryBalloonLeft < 0){
                setCategoryBalloonStyle({
                    top: `${parseInt(top)}px`,
                    left: `${parseInt(triggerElementBoundingClientRect.left)}px`,
                    visibility: "visible"
                });

                setCategoryBalloonArrowStyle({
                    left: "5%"
                });
            }
            else{
                let right = triggerElementBoundingClientRect.left + triggerElementBoundingClientRect.width;
                let left = right - categoryBalloonBoundingClientRect.width;

                setCategoryBalloonStyle({
                    top: `${parseInt(top)}px`,
                    left: `${parseInt(left)}px`,
                    visibility: "visible"
                });

                setCategoryBalloonArrowStyle({
                    left: "95%"
                });
            }
        }
        else{
            setCategoryBalloonStyle((value) => {
                return {
                    top: value.top,
                    left: value.left,
                    visibility: "visible"
                }
            });
        }
    }, [categoryBalloonStyle]);

    useEffect(() => {
        removeEventListener("mouseover", mouseoverHandler);
        addEventListener("mouseover", mouseoverHandler);

        return () => {
            removeEventListener("mouseover", mouseoverHandler);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        if(document.body.clientWidth <= 1023){
            setWidth("600px");
        }
    }, []);

    return (
        <>
            <div className="categories_balloon" ref={categoryBalloonRef}>
                <div className="content_section">
                    <Channels channels={props.category.channels} programInfo={props.programInfo} />
                </div>

                <div className="triangle"></div>
            </div>

            <style jsx>
                {`
                    .categories_balloon{
                        display: block;
                        position: fixed;
                        width: ${width};
                        top: ${categoryBalloonStyle.top};
                        left: ${categoryBalloonStyle.left};
                        visibility: ${categoryBalloonStyle.visibility};
                        z-index: 100;

                        .content_section{
                            margin-top: 10px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 20px rgba(0,0,0,.5);
                            overflow: hidden;
                            padding-bottom: 5px;
                            position: relative;
                        }

                        .triangle{
                            position: absolute;
                            width: 20px;
                            height: 10px;
                            border-style: solid;
                            border-width: 0 10px 10px;
                            border-color: transparent transparent #fff;
                            top: 0px;
                            left: ${categoryBalloonArrowStyle.left};
                            transform: translateX(-50%);
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    meta: PropTypes.object.isRequired,
    programInfo: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
