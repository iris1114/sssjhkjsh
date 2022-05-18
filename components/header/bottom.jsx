
import { connect } from "react-redux";
import { createRef, forwardRef, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import _ from "lodash";

import BottomOverflowMenu from "./bottomOverflowMenu.jsx";

const mapStateToProps = (state) => {
    return {
        focus: state.header.focus,
        bottomOverflowItems: state.header.bottomOverflowItems,
        bottomOverflowMenuTrigger: state.header.bottomOverflowMenuTrigger
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchBottomOverflowItems: (items) => {
            dispatch({
                type: "header/bottomOverflowItems",
                value: items
            });
        },
        dispatchBottomOverflowMenuTrigger: (element) => {
            dispatch({
                type: "header/bottomOverflowMenuTrigger",
                value: element
            });
        }
    };
};

const App = (props, ref) => {
    const containerRef = useRef(null);
    const overflowBtnRef = useRef(null);

    const linkRefs = useMemo(() => {
        let len = props.submenu.length;
        let arr = new Array();

        for(let i = 0; i < len; i ++){
            arr.push(createRef());
        }

        return arr;
    }, [props.submenu]);

    const overflowBtnClass = useMemo(() => {
        if(props.bottomOverflowMenuTrigger){
            return "hover";
        }

        return "";
    }, [props.bottomOverflowMenuTrigger]);

    const getLinkFocusClass = useCallback((element) => {
        if(element.as == props.focus.sub){
            return "focus";
        }

        return "";
    }, [props.focus.sub]);

    const overflowBtnMouseOverHandler = useCallback(() => {
        props.dispatchBottomOverflowMenuTrigger(overflowBtnRef.current);
    }, []);
    
    useEffect(() => {
        let sWidth = 0;
        let overflowItems = new Array();
        let containerBoundingClientRect = containerRef.current.getBoundingClientRect();

        for(let i = 0; i < linkRefs.length; i ++){
            let linkBoundingClientRect = linkRefs[i].current.getBoundingClientRect();
            
            sWidth += linkBoundingClientRect.width;

            if(sWidth > containerBoundingClientRect.width){
                if(overflowItems.length <= 0){
                    overflowItems.push(props.submenu[i - 1]);
                }

                overflowItems.push(props.submenu[i]);
            }
        }

        props.dispatchBottomOverflowItems(overflowItems);
    }, [props.submenu]);

    return (
        <>
            <div className="bottom_section" ref={ref}>
                <div className="container" ref={containerRef}>
                    {
                        (() => {
                            if(props.bottomOverflowItems.length > 0){
                                return (
                                    <div className={`overflow_btn ${overflowBtnClass}`} onMouseOver={overflowBtnMouseOverHandler} ref={overflowBtnRef}>
                                        <span className="text">更多</span>
                                        <div className="icon"></div>
                                        <div className="border-left"></div>
                                        <div className="border-right"></div>
                                    </div>
                                );
                            }
                        })()
                    }

                    {
                        props.submenu.map((element, index) => {
                            if(element.target == "_blank"){
                                return (
                                    <a className={`link ${getLinkFocusClass(element)}`} href={element.as.pathname} target={element.target} ref={linkRefs[index]} title={element.description} key={index}>
                                        <span className="text">{element.title}</span>
                                        <div className="under_line"></div>
                                    </a>
                                );
                            }
                            else{
                                return (
                                    <Link href={element.href} as={element.as} key={index}>
                                        <a className={`link ${getLinkFocusClass(element)}`} target={element.target} ref={linkRefs[index]} title={element.description}>
                                            <span className="text">{element.title}</span>
                                            <div className="under_line"></div>
                                        </a>
                                    </Link>
                                );
                            }
                        })
                    }
                </div>
            </div>

            {
                (() => {
                    if(props.bottomOverflowMenuTrigger){
                        return (
                            <BottomOverflowMenu />
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .bottom_section{
                        height: 35px;
                        padding-left: 1%;
                        padding-right: 1%;
                        background-color: #f1f1f1;
                        border-bottom: 1px solid #ccc;
                        background-color: #fafafa;

                        .container{
                            height: 100%;
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;

                            .overflow_btn{
                                float: right;
                                height: 100%;
                                padding-left: 5px;
                                padding-right: 5px;
                                overflow: hidden;
                                position: relative;
                                cursor: pointer;

                                &:hover{
                                    .text{
                                        color: #f60;
                                    }

                                    .icon{
                                        border-color: #f60 transparent transparent transparent;
                                    }
                                }

                                &.hover{
                                    .border-left{
                                        display: block;
                                    }

                                    .border-right{
                                        display: block;
                                    }
                                }

                                .text{
                                    display: block;
                                    font-size: 14px;
                                    line-height: 35px;
                                    color: #5e0b75;
                                    float: left;
                                    margin-right: 5px;
                                }

                                .icon{
                                    width: 0;
                                    height: 0;
                                    border-style: solid;
                                    border-width: 5px 5px 0 5px;
                                    border-color: #5e0b75 transparent transparent transparent;
                                    float: left;
                                    display: block;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                }

                                .border-left{
                                    display: none;
                                    position: absolute;
                                    top: 0px;
                                    left: 0px;
                                    width: 1px;
                                    background-color: #ccc;
                                    height: 100%;
                                }

                                .border-right{
                                    display: none;
                                    position: absolute;
                                    top: 0px;
                                    right: 0px;
                                    width: 1px;
                                    background-color: #ccc;
                                    height: 100%;
                                }
                            }

                            .link{
                                height: 100%;
                                padding-left: 15px;
                                padding-right: 15px;
                                float: left;
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

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(forwardRef(App));
