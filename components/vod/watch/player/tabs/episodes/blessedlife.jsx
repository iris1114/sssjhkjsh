
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import PropTypes from "prop-types";

import watch from "../../../../../../assets/js/watch/index.js";
import api from "../../../../../../assets/js/api/index.js";

import PosterBannerStyle from "../../../../../../assets/css/posterBanner/posterBannerStyle.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
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
        return watch.vod.episodes.group.season(props.episodes);
    }, [props.episodes]);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);
    
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

    const getEpisodeBtnFocus = useCallback((element) => {
        if(props.programInfo.content_id == element.content_id){
            return "focus";
        }
        else{
            return "";
        }
    }, [props.programInfo]);

    const episodeBtnClickHandler = useCallback((event, element) => {
        event.preventDefault();
        
        if(element.content_id){
            props.dispatchLoading(true);

            api.ccc.programInfo.getFetch(element.content_id).then((res) => {
                props.dispatchLoading(false);

                let programInfo = res.result.data;

                if(props.programInfo.accountVar){
                    programInfo.accountVar = props.programInfo.accountVar;
                }

                props.dispatchProgramInfo(programInfo);

                scroll({
                    top: 0,
                    left: 0
                });
            });
        }
    }, [props.programInfo]);

    const listBtnClickHandler = useCallback((event, index) => {
        if(index == listFocus){
            index = -1;
        }

        setListFocus(index);
    }, [listFocus]);

    const getTabSectionFocus = useCallback((index) => {
        if(index == listFocus){
            return "focus";
        }

        return "";
    }, [listFocus]);

    useEffect(() => {
        mounted.current = false;
    }, [props.episodes]);

    useEffect(() => {
        if(mounted.current){
            return;
        }
        
        setListFocus(computedListFocus);

        mounted.current = true;
    }, [props.programInfo, props.episodes]);

    return (
        <>
            <PosterBannerStyle />

            <div className="blessedlife_episodes_section">
                <div className="title_section">
                    <div className="title">{props.programInfo.title}</div>

                    {
                        props.episodes.poster_banners.map((element, index) => {
                            return (
                                <span className="poster_banner poster_banner_episode_tag" data-poster-banner={element} key={index}></span>
                            );
                        })
                    }
                </div>

                <div className="episodes_section">
                    {
                        group.tabList.map((element, index) => {
                            return (
                                <div className={`tab_section ${getTabSectionFocus(index)}`} key={index}>
                                    {
                                        (() => {
                                            if(group.tabList.length > 1){
                                                return (
                                                    <button className="tab_list_btn" onClick={(event) => listBtnClickHandler(event, index)}>
                                                        <span className="icon"></span>
                                                        <div className="name">{`${element.season_name} (${element.secondary_mark})`}</div>
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
                                                                    <a className={`episode_btn ${getEpisodeBtnFocus(_element)}`} href={`/${props.programInfo.content_type}/${_element.content_id}`} onClick={(event) => episodeBtnClickHandler(event, _element)} target="_self" title={`${_element.title}${_element.secondary_mark}`} key={_index}>
                                                                        <div className="poster_section">
                                                                            <div className="padding_box"></div>
                                                                            <img className="poster" src={`${cdnstatic}/${_element.video_image}`} alt={`${_element.title}${_element.secondary_mark}`} />

                                                                            {
                                                                                (() => {
                                                                                    if(_element.original_date){
                                                                                        return (
                                                                                            <span className="original_date">{_element.original_date}</span>
                                                                                        );
                                                                                    }
                                                                                })()
                                                                            }

                                                                            {
                                                                                _element.poster_banners.map((__element, __index) => {
                                                                                    return (
                                                                                        <span className="poster_banner_poster_icon" data-poster-banner={__element} key={__index}></span>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>

                                                                        <div className="text">{_element.secondary_mark}</div>
                                                                    </a>
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
            </div>

            <style jsx>
                {`
                    .blessedlife_episodes_section{
                        .title_section{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: wrap;
                            justify-content: flex-start;
                            align-items: center;

                            .title{
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 20px;
                                font-weight: normal;
                                line-height: 40px;
                                color: #f1f1f1;
                                margin-left: 0.5%;
                                margin-right: 0.5%;
                            }

                            .poster_banner{
                                height: 35px;
                                margin-left: 0.5%;
                                margin-right: 0.5%;
                            }
                        }

                        .episodes_section{
                            .tab_section{
                                &.focus{
                                    .tab_list_btn{
                                        .icon{
                                            background-image: url(${require("../../../../../../assets/image/episodes/icon/expand_up.png")});
                                        }

                                        .name{
                                            color: #f60;
                                        }
                                    }
                                }

                                &:hover:not(.focus){
                                    .tab_list_btn{
                                        .icon{
                                            background-image: url(${require("../../../../../../assets/image/episodes/icon/expand_down_hover.png")});
                                        }

                                        .name{
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
                                        background-image: url(${require("../../../../../../assets/image/episodes/icon/expand_down.png")});
                                        background-size: 20px 20px;
                                        background-repeat: no-repeat;
                                        background-position: center center;
                                    }

                                    .name{
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
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                    background-color: #4f4f4f;
                                    overflow: hidden;

                                    .episode_btn{
                                        width: 47%;
                                        margin-left: 1.5%;
                                        margin-right: 1.5%;
                                        margin-top: 10px;
                                        margin-bottom: 10px;
                                        float: left;
                                        position: relative;
                                        border-radius: 5px;

                                        @media screen and (max-width: 1023px) {
                                            width: 17%;
                                        }
        
                                        &.focus{
                                            box-shadow: 0 0 0 3px #f60;
                                        }
        
                                        .poster_section{
                                            position: relative;
                                            border-radius: 5px;
                                            overflow: hidden;
        
                                            .padding_box{
                                                padding-bottom: 56.25%;
                                            }
        
                                            .poster{
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                display: block;
                                                width: 100%;
                                                height: 100%;
                                            }
        
                                            .original_date{
                                                border-radius: 2px;
                                                font-size: 13px;
                                                padding-left: 5px;
                                                padding-right: 5px;
                                                background: rgba(0, 0, 0, 0.5);
                                                bottom: 5px;
                                                right: 5px;
                                                position: absolute;
                                                color: #f1f1f1;
                                                line-height: 20px;
                                            }
                                        }
        
                                        .text{
                                            font-weight: normal;
                                            line-height: 30px;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            overflow: hidden;
                                            font-size: 15px;
                                            padding-left: 5px;
                                            padding-right: 5px;
                                            color: #ccc;
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
    programInfo: PropTypes.object.isRequired,
    episodes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
