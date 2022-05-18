
import { connect } from "react-redux";
import { useMemo, useEffect, useCallback, useState, useRef } from "react";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide";

import api from "../../../../assets/js/api/index.js";
import watch from "../../../../assets/js/watch/index.js";

import PosterBannerStyle from "../../../../assets/css/posterBanner/posterBannerStyle.jsx";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
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
    const glide = useRef(null);

    const perView = useMemo(() => {
        if(props.resize.width <= 1023){
            return 5;
        }

        return 7;
    }, [props.resize]);
    
    const group = useMemo(() => {
        return watch.vod.episodes.group.normal(props.episodes);
    }, [props.episodes]);

    const arrowDisplayClass = useMemo(() => {
        if(group.tabList.length <= perView){
            return "none";
        }
        else{
            return "";
        }
    }, [group, perView]);

    const computedListFocus = useMemo(() => {
        let index = -1;
        let tabPane = group.tabPane;

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
    
    const arrowClickHandler = useCallback((event, dir) => {
        if(!glide.current){
            return;
        }

        glide.current.go(dir);
    }, []);

    const getListBtnFocus = useCallback((index) => {
        if(index == listFocus){
            return "focus";
        }

        return "";
    }, [listFocus]);

    const listBtnClickHandler = useCallback((event, index) => {
        setListFocus(index);
    }, []);

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

    useEffect(() => {
        glide.current = new Glide(".normal_episodes_tab_list", {
            perView: perView,
            bound: true,
            dragThreshold: false,
            animationDuration: 100,
            rewindDuration: 100
        });

        glide.current.mount();

        return () => {
            glide.current.destroy();
        };
    }, [group]);

    useEffect(() => {
        mounted.current = false;
    }, [group]);

    useEffect(() => {
        if(mounted.current){
            return;
        }
        
        setListFocus(computedListFocus);

        let perView = glide.current.settings.perView;
        let max = group.tabList.length - glide.current.settings.perView;
        let startAt = Math.floor(computedListFocus - perView / 2 + 1);
        
        if(startAt >= max){
            startAt = max;
        }

        if(startAt <= 0){
            startAt = 0;
        }
        
        glide.current.go(`=${startAt}`);

        mounted.current = true;
    }, [props.programInfo, group]);

    return (
        <>
            <PosterBannerStyle />

            <section className="normal_episodes_section">
                <div className="glide_section">
                    <button className={`glide_arrow left ${arrowDisplayClass}`} data-glide-dir="<" onClick={(event) => arrowClickHandler(event, "<")}>
                        <img className="icon" src={`${require("../../../../assets/image/icon/arrow_point_gray.svg")}`} alt="arrow" />
                    </button>

                    <button className={`glide_arrow right ${arrowDisplayClass}`} data-glide-dir=">" onClick={(event) => arrowClickHandler(event, ">")}>
                        <img className="icon" src={`${require("../../../../assets/image/icon/arrow_point_gray.svg")}`} alt="arrow" />
                    </button>

                    <div className="normal_episodes_tab_list">
                        <div className="glide__track" data-glide-el="track">
                            <div className="glide__slides">
                                {
                                    group.tabList.map((element, index) => {
                                        return (
                                            <button className={`glide__slide ${getListBtnFocus(index)}`} onClick={(event) => listBtnClickHandler(event, index)} title={element} key={index}>{element}</button>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="normal_episodes_tab_pane">
                    <h2 className="ssr_only">劇集列表</h2>
                    {   
                        (() => {
                            if(group.tabPane[listFocus]){
                                return group.tabPane[listFocus].map((element, index) => {
                                    return (
                                        <a className={`episode_btn ${getEpisodeBtnFocus(element)}`} href={`/${props.programInfo.content_type}/${element.content_id}`} onClick={(event) => episodeBtnClickHandler(event, element)} target="_self" title={`${element.title}${element.secondary_mark}`} key={index}>
                                            <h3 className="ssr_only">{element.title + element.secondary_mark}</h3>
                                            <div className="text">{element.episode_name}</div>
                                            
                                            {
                                                element.poster_banners.map((_element, _index) => {
                                                    return (
                                                        <span className="poster_banner_episode_icon" data-poster-banner={_element} data-charge-mode={element.charge_mode} key={_index}></span>
                                                    );
                                                })
                                            }
                                        </a>
                                    );
                                });
                            }
                        })()
                    }
                </div>
            </section>

            <style jsx>
                {`
                    .normal_episodes_section{
                        margin-top: 10px;

                        .glide_section{
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                            user-select: none;

                            .glide_arrow{
                                width: 35px;
                                height: 35px;
                                position: relative;
    
                                &.left{
                                    float: left;
    
                                    .icon{
                                        transform: translateX(-50%) translateY(-50%) rotate(180deg);
                                    }
                                }
    
                                &.right{
                                    float: right;
                                }
    
                                &.none{
                                    display: none;
                                }
    
                                .icon{
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translateX(-50%) translateY(-50%);
                                    width: 20px;
                                    height: 20px;
                                }
                            }
                        }

                        .normal_episodes_tab_list{
                            overflow: hidden;

                            .glide__track{
                                .glide__slides{
                                    white-space: nowrap;
                                    font-size: 0px;
                                    width: 100%;

                                    .glide__slide{
                                        background-color: #ccc;
                                        font-size: 15px;
                                        line-height: 35px;
                                        padding-left: 5px;
                                        padding-right: 5px;
                                        touch-action: none;
                                        display: inline-block;
                                        width: 16.66%;
                                        text-align: center;
                                        border-radius: 5px;
                                        overflow: hidden;
                                        cursor: pointer;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;

                                        &.focus{
                                            background-color: #f60;
                                            color: #fff;
                                        }
                                    }
                                }
                            }
                        }

                        .normal_episodes_tab_pane{
                            overflow: hidden;
                            margin-top: 10px;

                            .episode_btn{
                                width: 6.14%;
                                margin-left: 0.5%;
                                margin-right: 0.5%;
                                margin-top: 10px;
                                float: left;
                                border: 1px solid #ccc;
                                position: relative;

                                @media screen and (max-width: 1023px) {
                                    width: 9%;
                                }

                                &.focus{
                                    border: 1px solid #f60;

                                    .text{
                                        background-color: #f60;
                                        color: #fff;
                                    }
                                }

                                .text{
                                    font-size: 15px;
                                    text-align: center;
                                    line-height: 38px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
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
