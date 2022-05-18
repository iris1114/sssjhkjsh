
import { connect } from "react-redux";
import { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

import Summary from "./summary.jsx";
import Category from "./category.jsx";

import tools from "../../../assets/js/tools/index.js";

import purchases from "../../../assets/json/channel/list/purchase.json";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchfooterShow: (value) => {
            dispatch({
                type: "footer/show",
                value: value
            });
        }
    }
};

const App = (props) => {
    const router = useRouter();

    const defaultListFocus = useMemo(() => {
        let tab = "";

        if(process.title == "node"){
            tab = router.query.tab;
        }
        else{
            tab = tools.url.getQuery(location.href, "tab");
        }

        if(tab){
            return tab;
        }
        else{
            return "summary";
        }
    }, [props.list]);

    const [focusTab, setFocusTab] = useState(defaultListFocus);

    const getLinkFocusClass = useCallback((category) => {
        if(category == focusTab){
            return "focus";
        }

        return "";
    }, [focusTab]);

    const tabListClick = useCallback((event, category) => {
        event.preventDefault();

        setFocusTab(category);
    }, []);

    const getPuruchaseBtnColor = useCallback((element) => {
        return {
            backgroundColor: element.color
        };
    }, []);

    useEffect(() => {
        let href = tools.url.replaceQuery(location.href, "tab", encodeURIComponent(focusTab));

        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, document.title, href);
    }, [focusTab]);

    useEffect(() => {
        setFocusTab(defaultListFocus);
    }, [props.list]);

    useEffect(() => {
        props.dispatchfooterShow(false);

        return () => {
            props.dispatchfooterShow(true);
        };
    }, []);

    return (
        <>
            <div className="channel_list_section">
                <h1 className="ssr_only">LiTV-頻道列表</h1>
                <div className="tab_section">
                    <div className="tab_list_section">
                        <div className="absolute_section">
                            <a className={`category_name_btn ${getLinkFocusClass("summary")}`} href="/channel/list?tab=summary" onClick={(event)=>tabListClick(event, "summary")}>{props.list.summary_table.title}</a>
                            <a className={`category_name_btn ${getLinkFocusClass("category")}`} href="/channel/list?tab=category" onClick={(event)=>tabListClick(event, "category")} >{props.list.category_table.title}</a>
                        </div>
                    </div>

                    <div className="tab_pane_section">
                        {
                            (() => {
                                if(focusTab == "summary"){
                                    return (
                                        <Summary list={props.list}></Summary>
                                    );
                                }
                                else{
                                    return (
                                        <Category list={props.list}></Category>
                                    );
                                }
                            })()
                        }

                        <div className="intimates_section">
                            <div className="title">貼心叮嚀</div>
                            <div className="segment"></div>

                            {
                                props.list.intimates.map((element, index) => {
                                    return (
                                        <div className="intimate" key={index}>{element}</div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="purchases_section">
                    <div className="links_section">
                        {
                            purchases.list.map((element, index) => {
                                return (
                                    <a className="link" href={element.href} target={element.target} title={element.title} key={index}>
                                        <div className="border" style={getPuruchaseBtnColor(element)}></div>
                                        <div className="title">{element.title}</div>

                                        <div className="description">
                                            <div className="channel">{element.desc_channel}</div>
                                            <div className="detail">{element.desc_detial}</div>
                                        </div>

                                        <div className="btn">購買</div>
                                    </a>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

             <style jsx>
                 {`
                    .channel_list_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        margin-top: 20px;
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                        margin-top: 20px;

                        .tab_section{
                            .tab_list_section{
                                position: relative;
                                height: 36px;
                                z-index: 1;

                                .absolute_section{
                                    white-space: nowrap;
                                    overflow: hidden;
                                    border-top: 1px solid #ccc;
                                    border-left: 1px solid #ccc;
                                    border-right: 1px solid #ccc;
                                    border-top-left-radius: 4px;
                                    border-top-right-radius: 4px;
                                    position: absolute;
                                    max-width: 100%;
                                    font-size: 0px;

                                    .category_name_btn{
                                        font-size: 15px;
                                        line-height: 35px;
                                        padding-left: 30px;
                                        padding-right: 30px;
                                        display: inline-block;
                                        border-left: 1px solid #ccc;
                                        border-bottom: 1px solid #ccc;
                                        background-image: -webkit-linear-gradient(90deg,#e6e6e6,#f6f6f6);
                                        font-weight: bold;
                
                                        &:nth-of-type(1){
                                            border-left: none;
                                        }
                
                                        &.focus{
                                            background-image: none;
                                            background-color: #fff;
                                            color: #408ed6;
                                            border-bottom: 1px solid #fff;
                                        }
                                    }
                                }
                            }

                            .tab_pane_section{
                                border-left: 1px solid #ccc;
                                border-top: 1px solid #ccc;
                                border-right: 1px solid #ccc;
                                border-bottom: 1px solid #ccc;
                                border-bottom-left-radius: 4px;
                                border-bottom-right-radius: 4px;
                                overflow: hidden;

                                .intimates_section{
                                    margin-top: 10px;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    line-height: 30px;
                                    font-size: 15px;
                                    padding-bottom: 10px;

                                    .title{
                                        padding-left: 0.5%;
                                        padding-right: 0.5%;
                                    }

                                    .segment{
                                        width: 99%;
                                        height: 1px;
                                        margin-left: auto;
                                        margin-right: auto;
                                        background-color: #ccc;
                                        margin-top: 10px;
                                        margin-bottom: 10px;
                                    }

                                    .intimate{
                                        padding-left: 0.5%;
                                        padding-right: 0.5%;
                                    }
                                }
                            }
                        }

                        .purchases_section{
                            height: 125px;
                            margin-top: 20px;

                            .links_section{
                                position: fixed;
                                width: 100%;
                                left: 0px;
                                bottom: 0px;
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                background-color: #ffffff;
                                box-shadow: 0 -2px 38px 0 rgba(150, 150, 150, 0.5);

                                .link{
                                    width: 20%;
                                    padding-bottom: 5px;
                                    border-left: 1px solid #ccc;

                                    &:last-of-type{
                                        border-right: 1px solid #ccc;
                                    }

                                    .border{
                                        height: 5px;
                                    }

                                    .title{
                                        font-size: 20px;
                                        line-height: 35px;
                                        text-align: center;
                                    }

                                    .description{
                                        display: table;
                                        margin-left: auto;
                                        margin-right: auto;
                                        overflow: hidden;
                                        font-size: 18px;
                                        line-height: 35px;

                                        .channel{
                                            float: left;
                                            padding-right: 5px;
                                        }

                                        .detail{
                                            float: left;
                                            padding-left: 5px;
                                            color: #666;
                                        }
                                    }

                                    .btn{
                                        display: table;
                                        line-height: 35px;
                                        font-size: 16px;
                                        padding-left: 10px;
                                        padding-right: 10px;
                                        background-color: #f60;
                                        color: #fff;
                                        border-radius: 4px;
                                        margin-top: 10px;
                                        margin-left: auto;
                                        margin-right: auto;
                                    }
                                }
                            }
                        }
                    }
                 `}
             </style>
        </>
    );
};


App.propTypes = {
    list: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
