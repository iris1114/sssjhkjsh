
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useState, useRef, useCallback } from "react";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchCategoriesTip: (value) => {
            dispatch({
                type: "channel/watch/categoriesTip",
                value: value
            });
        }
    };
};

const App = (props) => {
    const width = useRef("250px");

    const [pos, setPos] = useState({
        top: "0px",
        left: "0px",
        display: "none"
    });

    const scrollHandler = useCallback(() => {
        props.dispatchCategoriesTip(null);
    }, []);

    useEffect(() => {
        let top = props.meta.pos.top;
        let left = props.meta.pos.left - parseInt(width.current) / 2;

        top = top - scrollY + 10;

        setPos({
            top: `${top}px`,
            left: `${left}px`,
            display: "block"
        });
    }, [props.meta]);

    useEffect(() => {
        let top = props.meta.pos.top;
        let left = props.meta.pos.left - parseInt(width.current) / 2;

        top = top - scrollY + 10;

        setPos({
            top: `${top}px`,
            left: `${left}px`,
            display: "block"
        });
    }, [props.meta]);

    useEffect(() => {
        addEventListener("scroll", scrollHandler);

        return () => {
            removeEventListener("scroll", scrollHandler);
        };
    }, []);

    return (
        <>
            <div className="cateogries_tip">
                <div className="content">
                    <div className="title">{props.meta.title}</div>

                    {
                        (() => {
                            if(props.meta.subtitle){
                                return (
                                    <>
                                        <div className="segment"></div>
                                        <div className="subtitle">{props.meta.subtitle}</div>
                                    </>
                                );
                            }
                        })()
                    }

                    {
                        (() => {
                            if(props.meta.desc){
                                return (
                                    <>
                                        <div className="segment"></div>
                                        <div className="desc">{props.meta.desc}</div>
                                    </>
                                );
                            }
                        })()
                    }
                </div>

                <div className="triangle"></div>
            </div>

            <style jsx>
                {`
                    .cateogries_tip{
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
                                font-weight: bold;
                            }

                            .segment{
                                background-color: #dbdbdb;
                                height: 1px;
                                margin-top: 5px;
                            }

                            .subtitle{
                                margin-top: 5px;
                                font-size: 13px;
                                line-height: 25px;
                            }

                            .desc{
                                margin-top: 5px;
                                font-size: 13px;
                                line-height: 25px;
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
    meta: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);