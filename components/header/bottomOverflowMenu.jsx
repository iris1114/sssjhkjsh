
import { connect } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import tools from "../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        focus: state.header.focus,
        bottomOverflowItems: state.header.bottomOverflowItems,
        bottomOverflowMenuTrigger: state.header.bottomOverflowMenuTrigger,
        scroll: state.scroll
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchBottomOverflowMenuTrigger: (element) => {
            dispatch({
                type: "header/bottomOverflowMenuTrigger",
                value: element
            });
        }
    };
};

const App = (props) => {
    const [bottomOverflowMenuSectionStyle, setBottomOverflowMenuSectionStyle] = useState({});
    const [borderTopStyle, setBorderTopStyle] = useState({});
    const [scroll, setScroll] = useState(null);

    const bottomOverflowMenuSectionRef = useRef(null);

    const router = useRouter();

    const getLinkFocusClass = useCallback((element) => {
        if(element.as == props.focus.sub){
            return "focus";
        }

        return "";
    }, [props.focus.sub]);

    const mouseoverHandler = useCallback((event) => {
        if(!tools.isElement(event.target, props.bottomOverflowMenuTrigger) && !tools.isElement(event.target, bottomOverflowMenuSectionRef.current)){
            props.dispatchBottomOverflowMenuTrigger(null);
        }
    }, [props.bottomOverflowMenuTrigger]);

    useEffect(() => {
        let triggerElement = props.bottomOverflowMenuTrigger;
        let bottomOverflowMenuSection = bottomOverflowMenuSectionRef.current;
        let triggerElementBoundingClientRect = triggerElement.getBoundingClientRect();
        let bottomOverflowMenuSectionBoundingClientRect = bottomOverflowMenuSection.getBoundingClientRect();
        let top = triggerElementBoundingClientRect.top + triggerElementBoundingClientRect.height;
        let left = triggerElementBoundingClientRect.left - (bottomOverflowMenuSectionBoundingClientRect.width - triggerElementBoundingClientRect.width);

        setBottomOverflowMenuSectionStyle({
            top: parseInt(top),
            left: parseInt(left),
            opacity: 1
        });
    }, [props.bottomOverflowMenuTrigger]);

    useEffect(() => {
        let triggerElement = props.bottomOverflowMenuTrigger;
        let bottomOverflowMenuSection = bottomOverflowMenuSectionRef.current;
        let triggerElementBoundingClientRect = triggerElement.getBoundingClientRect();
        let bottomOverflowMenuSectionBoundingClientRect = bottomOverflowMenuSection.getBoundingClientRect();
        let width = bottomOverflowMenuSectionBoundingClientRect.width - triggerElementBoundingClientRect.width;

        setBorderTopStyle({
            width: width,
            opacity: 1
        });
    }, [props.bottomOverflowMenuTrigger]);

    useEffect(() => {
        removeEventListener("mouseover", mouseoverHandler);

        if(props.bottomOverflowMenuTrigger){
            addEventListener("mouseover", mouseoverHandler);
        }

        return () => {
            removeEventListener("mouseover", mouseoverHandler);
        };
    }, [props.bottomOverflowMenuTrigger]);

    useEffect(() => {
        const handleRouteChange = () => {
            props.dispatchBottomOverflowMenuTrigger(null);
        };
        
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.on("routeChangeStart", handleRouteChange);
    
        return () => {
          router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);

    useEffect(() => {
        if(!scroll){
            setScroll(props.scroll);
        }
        else{
            if(props.scroll != scroll){
                props.dispatchBottomOverflowMenuTrigger(null);
            }
        }
    }, [props.scroll, scroll]);

    return (
        <>
            <div className="bottom_overflow_menu_section" style={bottomOverflowMenuSectionStyle} ref={bottomOverflowMenuSectionRef}>
                <div className="border_top" style={borderTopStyle}></div>

                <div className="container">
                    {
                        props.bottomOverflowItems.map((element, index) => {
                            return (
                                <Link href={element.href} as={element.as} key={index}>
                                    <a className={`link ${getLinkFocusClass(element)}`} target={element.target} title={element.description}>
                                        <span className="text">{element.title}</span>
                                        <div className="under_line"></div>
                                    </a>
                                </Link>
                            );
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .bottom_overflow_menu_section{
                        display: block;
                        position: fixed;
                        opacity: 0;
                        overflow: hidden;

                        .border_top{
                            top: 0px;
                            left: 0px;
                            position: absolute;
                            height: 1px;
                            background-color: #ccc;
                            opacity: 0;
                        }

                        .container{
                            width: 222px;
                            background-color: #fafafa;
                            border-left: 1px solid #ccc;
                            border-right: 1px solid #ccc;
                            border-bottom: 1px solid #ccc;
                            padding: 10px;
                            column-width: 100px;
                            column-gap: 0px;
                            column-count: 2;
                            font-size: 0px;

                            .link{
                                display: inline-block;
                                max-width: 100px;
                                height: 35px;
                                padding-left: 15px;
                                padding-right: 15px;
                                position: relative;

                                &.focus{
                                    &:hover{
                                        .text{
                                            color: #5e0b75;
                                        }
                                    }
                                    
                                    .under_line{
                                        display: block;
                                    }
                                }

                                &:hover{
                                    .text{
                                        color: #f60;
                                    }
                                }

                                .text{
                                    display: block;
                                    font-size: 14px;
                                    line-height: 35px;
                                    color: #5e0b75;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }

                                .under_line{
                                    display: none;
                                    position: absolute;
                                    height: 4px;
                                    left: 15px;
                                    right: 15px;
                                    bottom: 1px;
                                    background-color: #5e0b75;
                                    border-radius: 2px;
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
