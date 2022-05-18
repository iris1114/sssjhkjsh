
import { connect } from "react-redux";
import { forwardRef, useCallback } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {
        focus: state.header.focus.main
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props, ref) => {
    const getLinkFocusClass = useCallback((element) => {
        if(element.highlight){
            return "highlight";
        }
        else{
            if(element.as == props.focus){
                return "focus";
            }
        }

        return "";
    }, [props.focus]);

    return (
        <>
            <div className="center_section" ref={ref}>
                <div className="container">
                    {
                        props.menu.map((elements, index) => {
                            return (
                                <div className="links_section" key={index}>
                                    {
                                        elements.map((element, _index) => {
                                            if(element.target == "_blank"){
                                                return (
                                                    <a className={`link ${getLinkFocusClass(element)}`} href={element.as.pathname} target={element.target} title={element.description} key={_index}>
                                                        {
                                                            (() => {
                                                                if(element.tag){
                                                                    return (
                                                                        <img className="img" src={require("../../assets/image/header/menu/center/" + element.tag)} />
                                                                    );
                                                                }
                                                            })()
                                                        }
                                                        
                                                        <span className="text">{element.title}</span>
                                                    </a>
                                                );
                                            }
                                            else{
                                                return (
                                                    <Link href={element.href} as={element.as} key={_index}>
                                                        <a className={`link ${getLinkFocusClass(element)}`} target={element.target} title={element.description}>
                                                            {
                                                                (() => {
                                                                    if(element.tag){
                                                                        return (
                                                                            <img className="img" src={require("../../assets/image/header/menu/center/" + element.tag)} title="chargeMode" />
                                                                        );
                                                                    }
                                                                })()
                                                            }
                                                            
                                                            <span className="text">{element.title}</span>
                                                        </a>
                                                    </Link>
                                                );
                                            }
                                        })
                                    }

                                    {
                                        (() => {
                                            if(index < props.menu.length - 1){
                                                return (
                                                    <div className="segment" key={index}></div>
                                                );
                                            }
                                        })()
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .center_section{
                        height: 40px;
                        padding-left: 1%;
                        padding-right: 1%;
                        background-color: #5e0b75;

                        .container{
                            height: 100%;
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;

                            .links_section{
                                float: left;
                                height: 100%;
                                overflow: hidden;
                                position: relative;

                                .link{
                                    height: 100%;
                                    padding-left: 15px;
                                    padding-right: 15px;
                                    float: left;
                                    position: relative;

                                    &.focus{
                                        background-color: #9c27b0;
                                    }

                                    &.highlight{
                                        background: linear-gradient(180deg,#cb60b3,#a80077);
                                        font-weight: bold;
                                    }

                                    &:hover{
                                        .text{
                                            color: #f60;
                                        }

                                        &.focus, &.highlight{
                                            .text{
                                                color: #f1f1f1;
                                            }
                                        }
                                    }

                                    .img{
                                        position: absolute;
                                        top: 1px;
                                        right: 15px;
                                        width: 20px;
                                        height: 10px;
                                    }

                                    .text{
                                        display: block;
                                        color: #f1f1f1;
                                        line-height: 40px;
                                        font-size: 15px;
                                    }
                                }

                                .segment{
                                    float: left;
                                    width: 1px;
                                    background-color: #f1f1f1;
                                    height: 20px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    position: relative;
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};
//Warning: forwardRef render functions do not support propTypes or defaultProps.
/*
App.propTypes = {
    menu: PropTypes.array.isRequired
};
*/
export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(forwardRef(App));
