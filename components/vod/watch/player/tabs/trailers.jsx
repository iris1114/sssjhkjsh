
import { connect } from "react-redux";
import { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import api from "../../../../../assets/js/api/index.js";

import PosterBannerStyle from "../../../../../assets/css/posterBanner/posterBannerStyle.jsx";

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

    const trailers = useMemo(() => {
        let list = new Array();
        let _trailers= _.cloneDeep(props.trailers);

        for(let i = 0; i < _trailers.seasons.length; i ++){
            let season = _trailers.seasons[i];
            let __episodes = season.episodes;

            for(let j = 0; j < __episodes.length; j ++){
                let episode = __episodes[j];

                episode.title = season.title;

                list.push(episode);
            }
        }
        
        return list;
    }, [props.trailers]);

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

            <div className="trailer_episodes_section">
                {   
                    trailers.map((element, index) => {
                        return (
                            <a className={`episode_btn ${getEpisodeBtnFocus(element)}`} href={`/${props.programInfo.content_type}/${element.content_id}`} onClick={(event) => episodeBtnClickHandler(event, element)} target="_self" title={`${element.title}${element.episode_name}`} key={index}>
                                <div className="poster_section">
                                    <div className="padding_box"></div>
                                    <img className="poster" src={`${cdnstatic}/${element.video_image}`} alt={element.title} />

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

                                <div className="text">{element.episode_name}</div>
                            </a>
                        );
                    })
                }
            </div>

            <style jsx>
                {`
                    .trailer_episodes_section{
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
                `}
            </style>
        </>
    );
};


App.propTypes = {
    programInfo: PropTypes.object.isRequired,
    trailers: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
