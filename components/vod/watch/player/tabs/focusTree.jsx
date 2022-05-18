
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";

import tools from "../../../../../assets/js/tools/index.js";
import watch from "../../../../../assets/js/watch/index.js";
import api from "../../../../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchPlayerSeek: (value) => {
            dispatch({
                type: "vod/watch/videoSeek",
                value: value
            });
        },
        dispatchProgramInfo: (programInfo) => {
            dispatch({
                type: "vod/watch/programInfo",
                value: programInfo
            });
        },
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const mounted = useRef(false);

    const group = useMemo(() => {
        if(props.focusTree.has_seasons){
            return watch.vod.episodes.group.season(props.focusTree);
        }
        else{
            if(props.programInfo.is_event){
                return watch.vod.episodes.group.show(props.focusTree);
            }
            else{
                return watch.vod.episodes.group.normal(props.focusTree);
            }
        }
    }, [props.focusTree]);

    const computedListFocus = useMemo(() => {
        let index = -1;
        let tabPane = group.tabPane;

        if(tabPane.length <= 1){
            return 0;
        }

        for(let i = 0; i < tabPane.length; i ++){
            let items = tabPane[i];

            for(let j = 0; j < items.length; j ++){
                let item = items[j];

                if(item.content_id == props.programInfo.content_id){
                    index = i;

                    break;
                }
            }

            if(index != -1){
                break;
            }
        }
        
        if(index == -1){
            return 0;
        }
        else{
            return index;
        }
    }, [props.programInfo, group]);

    const [listFocus, setListFocus] = useState(computedListFocus);

    const getGroupSectionFocus = useCallback((index) => {
        if(index == listFocus){
            return "focus";
        }

        return "";
    }, [listFocus]);

    const listBtnClickHandler = useCallback((event, index) => {
        if(index == listFocus){
            index = -1;
        }

        setListFocus(index);
    }, [listFocus]);

    const getTitleFocus = useCallback((element) => {
        if(props.programInfo.content_id == element.content_id){
            return "focus";
        }
        else{
            return "";
        }
    }, [props.programInfo]);

    const focusElementClickHandler = useCallback((event, element, _element) => {
        if(element.content_id && _element.start_time){
            if(element.content_id == props.programInfo.content_id){
                props.dispatchPlayerSeek({
                    position: _element.start_time * 1000
                });
            }
            else{
                props.dispatchLoading(true);

                api.ccc.programInfo.getFetch(element.content_id).then((res) => {
                    props.dispatchLoading(false);

                    let programInfo = res.result.data;

                    if(props.programInfo.accountVar){
                        programInfo.accountVar = props.programInfo.accountVar;
                    }

                    programInfo.time = _element.start_time * 1000;

                    props.dispatchProgramInfo(programInfo);

                    scroll({
                        top: 0,
                        left: 0
                    });
                });
            }
        }
    }, [props.programInfo]);

    useEffect(() => {
        mounted.current = false;
    }, [props.episodes]);

    useEffect(() => {
        if(mounted.current){
            return;
        }
        
        setListFocus(computedListFocus);

        mounted.current = true;
    }, [props.programInfo, props.focusTree]);
    
    return (
        <>
            <div className="focus_tree_section">
                {
                    group.tabList.map((element, index) => {
                        return (
                            <div className={`tab_section ${getGroupSectionFocus(index)}`} key={index}>
                                {
                                    (() => {
                                        if(group.tabList.length > 1){
                                            return (
                                                <button className="tab_list_btn" onClick={(event) => listBtnClickHandler(event, index)}>
                                                    <span className="icon"></span>
                                                    <div className="title">{element}</div>
                                                    <div className="segment"></div>
                                                </button>
                                            );
                                        }
                                    })()
                                }

                                {
                                    (() => {
                                        if(index == listFocus){
                                            return (
                                                <div className="tab_pane_section">
                                                    {
                                                        group.tabPane[index].map((_element, _index) => {
                                                            return (
                                                                <div className="tab_pane_element" key={_index}>
                                                                    <div className={`title ${getTitleFocus(_element)}`}>{_element.secondary_mark}</div>

                                                                    <div className="focus_Section">
                                                                        {
                                                                            _element.focus.map((__element, __index) => {
                                                                                return (
                                                                                    <button className="focus_element" onClick={(event) => focusElementClickHandler(event, _element, __element)} title={__element.description} key={__index}>
                                                                                        <span className="icon"></span>
                                                                                        <span className="focus_time">{tools.formattedTime(__element.start_time)}</span>
                                                                                        <span className="desc">{__element.description}</span>
                                                                                    </button>
                                                                                );
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            );
                                        }
                                    })()
                                }
                            </div>
                        );
                    })
                }
            </div>

            <style jsx>
                {`
                    .focus_tree_section{
                        .tab_section{
                            &.focus{
                                .tab_list_btn{
                                    .icon{
                                        background-image: url(${require("../../../../../assets/image/episodes/icon/expand_up.png")});
                                    }

                                    .title{
                                        color: #f60;
                                    }
                                }
                            }

                            &:not(.focus){
                                .tab_list_btn:hover{
                                    .icon{
                                        background-image: url(${require("../../../../../assets/image/episodes/icon/expand_down_hover.png")});
                                    }

                                    .title{
                                        color: #408de6;
                                    }
                                }
                            }

                            .tab_list_btn{
                                overflow: hidden;
                                padding-left: 0.5%;
                                padding-right: 0.5%;
                                display: block;
                                width: 100%;
                                position: relative;

                                .icon{
                                    display: block;
                                    width: 40px;
                                    height: 40px;
                                    float: right;
                                    background-image: url(${require("../../../../../assets/image/episodes/icon/expand_down.png")});
                                    background-size: 20px 20px;
                                    background-repeat: no-repeat;
                                    background-position: center center;
                                }

                                .title{
                                    display: block;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 20px;
                                    font-weight: normal;
                                    line-height: 40px;
                                    color: #f1f1f1;
                                    text-align: left;
                                }

                                .segment{
                                    position: absolute;
                                    height: 1px;
                                    left: 0px;
                                    right: 0px;
                                    bottom: 0px;
                                    background-color: #333;
                                }
                            }

                            .tab_pane_section{
                                background-color: #4f4f4f;
                                overflow: hidden;
                                padding: 10px;

                                .tab_pane_element{
                                    &:nth-of-type(n + 2){
                                        margin-top: 10px;
                                    }

                                    .title{
                                        display: block;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        font-size: 18px;
                                        font-weight: normal;
                                        line-height: 40px;
                                        color: #ccc;
                                        text-align: left;

                                        &.focus{
                                            color: #f60;
                                        }
                                    }

                                    .focus_Section{
                                        .focus_element{
                                            overflow: hidden;
                                            width: 100%;
                                            height: 30px;
                                            display: block;

                                            &:hover{
                                                .focus_time{
                                                    color: #408de6;
                                                }

                                                .desc{
                                                    color: #408de6;
                                                }
                                            }

                                            .icon{
                                                width: 20px;
                                                height: 30px;
                                                background-image: url(${require("../../../../../assets/image/focusTree/play.png")});
                                                background-size: 20px 15px;
                                                background-position: center center;
                                                float: left;
                                                background-repeat: no-repeat;
                                            }

                                            .focus_time{
                                                display: block;
                                                font-size: 15px;
                                                line-height: 30px;
                                                color: #f1f1f1;
                                                text-align: left;
                                                float: left;
                                                padding-left: 10px;
                                                padding-right: 10px;
                                            }

                                            .desc{
                                                display: block;
                                                font-size: 15px;
                                                line-height: 30px;
                                                color: #f1f1f1;
                                                text-align: left;
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                            }
                                        }
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
    focusTree: PropTypes.object.isRequired,
    programInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
