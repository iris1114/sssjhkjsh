
import { connect } from "react-redux";
import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import LazyLoad from "react-lazyload";

import api from "../../../../assets/js/api/index.js";

import PosterBannerStyle from "../../../../assets/css/posterBanner/posterBannerStyle.jsx";
import Placeholder from "../../../placeholder/index.jsx";

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
    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
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

    return (
        <>
            <PosterBannerStyle />

            <section className="rule_episodes_section">
                <h2 className="ssr_only">劇集列表</h2>

                {   
                    props.episodes.map((element, index) => {
                        return (
                            <a className={`episode_btn ${getEpisodeBtnFocus(element)}`} href={`/${props.programInfo.content_type}/${element.content_id}`} onClick={(event) => episodeBtnClickHandler(event, element)} target="_self" title={element.title} key={index}>
                                <div className="poster_section">
                                    <div className="padding_box"></div>

                                    <LazyLoad placeholder={<Placeholder type="landscape" alt={element.title} />}>
                                        <img className="poster" src={`${cdnstatic}/${element.video_image}`} alt={element.title} />
                                    </LazyLoad>

                                    {
                                        (() => {
                                            if(element.original_date){
                                                return (
                                                    <span className="original_date">{element.original_date}</span>
                                                );
                                            }
                                        })()
                                    }

                                    {
                                        (() => {
                                            if(element.poster_banners){
                                                return element.poster_banners.map((_element, _index) => {
                                                    return (
                                                        <span className="poster_banner_poster_icon" data-poster-banner={_element} key={_index}></span>
                                                    );
                                                });
                                            }
                                        })()
                                    }
                                </div>

                                <h3 className="text">{element.title}</h3>
                            </a>
                        );
                    })
                }
            </section>

            <style jsx>
                {`
                    .rule_episodes_section{
                        margin-top: 10px;
                        overflow: hidden;

                        .episode_btn{
                            width: 15.66%;
                            margin-left: 0.5%;
                            margin-right: 0.5%;
                            margin-top: 10px;
                            margin-bottom: 10px;
                            float: left;
                            position: relative;
                            border-radius: 5px;

                            @media screen and (max-width: 1023px) {
                                width: 19%;
                            }

                            &.focus{
                                box-shadow: 0 0 0 3px #f60;
                            }

                            .poster_section{
                                position: relative;
                                border-radius: 5px;
                                overflow: hidden;
                                box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);

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
    episodes: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
