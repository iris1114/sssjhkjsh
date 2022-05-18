
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useRef, useEffect, useCallback, useState } from "react";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const iconRef = useRef(null);

    const [key, setKey] = useState("v" + new Date().getTime());

    const againstTheWall = useCallback(() => {
        let iconParentRect = iconRef.current.parentNode.getBoundingClientRect();
        let topGap = iconParentRect.top;
        let leftGap = iconParentRect.left;
        let rightGap = props.resize.width - (iconParentRect.left + iconParentRect.width);
        let bottomGap = props.resize.height - (iconParentRect.top + iconParentRect.height);

        if(topGap != 0 && leftGap != 0 && rightGap != 0 && bottomGap != 0){
            if(topGap <= leftGap && topGap <= rightGap && topGap <= bottomGap){
                props.setPosition({
                    top: "0px",
                    left: iconParentRect.left + "px",
                    transitionProperty: "top, left"
                });
            }
            else if(leftGap <= topGap && leftGap <= rightGap && leftGap <= bottomGap){
                props.setPosition({
                    top: iconParentRect.top + "px",
                    left: "0px",
                    transitionProperty: "top, left"
                });
            }
            else if(rightGap <= topGap && rightGap <= leftGap && rightGap <= bottomGap){
                props.setPosition({
                    top: iconParentRect.top + "px",
                    left: (props.resize.width - iconParentRect.width) + "px",
                    transitionProperty: "top, left"
                });
            }
            else if(bottomGap <= topGap && bottomGap <= leftGap && bottomGap <= rightGap){
                props.setPosition({
                    top: (props.resize.height - iconParentRect.height) + "px",
                    left: iconParentRect.left + "px",
                    transitionProperty: "top, left"
                });
            }
        }
    }, [props.resize]);

    useEffect(() => {
        let startPos = null;
        let endPos = null;
        let startTime = 0;
        let endTime = 0;

        let dragMouseDown = (e) => {
            e = e || window.event;
            e.preventDefault();

            let iconParentRect = iconRef.current.parentNode.getBoundingClientRect();
            
            startPos = {
                top: iconParentRect.top,
                left: iconParentRect.left
            };

            startTime = new Date().getTime();

            document.removeEventListener("mouseup", closeDragElement);
            document.addEventListener("mouseup", closeDragElement);
            // call a function whenever the cursor moves:
            document.removeEventListener("mousemove", elementDrag);
            document.addEventListener("mousemove", elementDrag);
        };

        let elementDrag = (e) => {
            e = e || window.event;
            e.preventDefault();
            // set the element's new position:
            let iconParentRect = iconRef.current.parentNode.getBoundingClientRect();
            let top = e.clientY - iconParentRect.height / 2;
            let left = e.clientX - iconParentRect.width / 2;
            let right = left + iconParentRect.width;
            let bottom = top + iconParentRect.height;

            if(top < 0){
                top = 0;
            }

            if(left < 0){
                left = 0;
            }

            if(right > props.resize.width){
                left = props.resize.width - iconParentRect.width;
            }

            if(bottom > props.resize.height){
                top = props.resize.height - iconParentRect.height;
            }
            
            props.setPosition({
                top: top + "px",
                left: left + "px"
            });
        };

        let closeDragElement = () => {
            // stop moving when mouse button is released:
            document.removeEventListener("mouseup", closeDragElement);
            document.removeEventListener("mousemove", elementDrag);

            let iconParentRect = iconRef.current.parentNode.getBoundingClientRect();

            endPos = {
                top: iconParentRect.top,
                left: iconParentRect.left
            };

            endTime = new Date().getTime();

            let moveLength = Math.pow(startPos.left - endPos.left, 2) + Math.pow(startPos.top - endPos.top, 2);
            
            moveLength = Math.sqrt(moveLength);

            againstTheWall();

            if(moveLength < 10 && (endTime - startTime) <= 300){
                props.setView("control");
            }
        };

        iconRef.current.removeEventListener("mousedown", dragMouseDown);
        iconRef.current.addEventListener("mousedown", dragMouseDown);

        return () => {
            if(iconRef.current){
                iconRef.current.removeEventListener("mousedown", dragMouseDown);
            }
        };
    }, [props.resize]);
    
    useEffect(() => {
        let set = () => {
            setKey("v" + new Date().getTime());
        };

        document.addEventListener("mousemove", set);

        return () => {
            document.removeEventListener("mousemove", set);
        };
    }, []);
    
    /*
    useEffect(() => {
        againstTheWall();
    }, []);
    */
    return (
        <>
            <div className={`icon ${key}`} ref={iconRef}>
                <img className="img" src={require("../../../../assets/image/channel/remote/icon.png")} />
            </div>

            <style jsx>
                {`
                    .icon{
                        width: 60px;
                        height: 60px;
                        background-color: #444;
                        border-radius: 50%;
                        position: relative;
                        cursor: pointer;
                        box-shadow: 0 0 15px #000;

                        &.${key}{
                            animation: fade_out 5s forwards;
                        }

                        @keyframes fade_out{
                            0%{ 
                                opacity: 1;
                            }
                            75%{ 
                                opacity: 1;
                            }
                            100%{ 
                                opacity: 0;
                            }
                        }

                        &:hover{
                            background-color: #408ed6;
                        }

                        &:active, &:hover:active{
                            cursor: move;
                        }

                        .img{
                            display: block;
                            width: 18px;
                            height: 24px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translateX(-50%) translateY(-50%);
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    setView: PropTypes.func.isRequired,
    setPosition: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);