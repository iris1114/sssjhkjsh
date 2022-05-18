
import { connect } from "react-redux";
import { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";

import Ranks from "./ranks.jsx";
import Placeholder from "../../../placeholder/index.jsx";
import PosterBannerStyle from "../../../../assets/css/posterBanner/posterBannerStyle.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchProgramInfoByRelatedProgram: (value) => {
            dispatch({
                type: "vod/watch/programInfoByRelatedProgram",
                value: value
            });
        }
    };
};

const App = (props) => {
    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const contentItemClickHandler = useCallback((event, item) => {
        event.preventDefault();
        props.dispatchProgramInfoByRelatedProgram(item);
    }, []);

    useEffect(() => {
        return () => {
            props.dispatchProgramInfoByRelatedProgram(null);
        };
    }, []);

    return (
        <>
            <PosterBannerStyle />

            <section className="related_program_section">
                <div className="info_section">
                    <div className="right_section">
                        <div className="rank_title">熱門排行</div>
                        <div className="border_bottom"></div>
                    </div>

                    <div className="left_section">
                        <h2 className="title">{props.relatedProgram.result_type_name}</h2>
                        <div className="border_bottom"></div>
                    </div>
                </div>

                <div className="content_items">
                    <div className="content_item right">
                        <div className="poster_section">
                            <div className="padding_box"></div>
                        </div>

                        <div className="des_section">
                            <div className="top_section"></div>
                            <div className="bottom_section"></div>
                        </div>
                    </div>

                    {
                        (() => {
                            if(props.rank){
                                return (
                                    <div className="landscape_rank_container">
                                        <Ranks rank={props.rank} />
                                    </div>
                                );
                            }
                        })()
                    }

                    {
                        props.relatedProgram.programs.map((item, index) => {
                            return (
                                <a className="content_item" href={`/${item.content_type}/${item.content_id}`} onClick={(event) => contentItemClickHandler(event, item)} target="_self" title={item.title} key={index}>
                                    <div className="poster_section">
                                        <div className="padding_box"></div>

                                        <LazyLoad placeholder={<Placeholder type="landscape" alt={item.title} />}>
                                            <img className="poster" src={`${cdnstatic}/${item.video_image}`} alt={item.title} />
                                        </LazyLoad>

                                        {
                                            item.poster_banners.map((_item, _index) => {
                                                return (
                                                    <span className="poster_banner_poster_icon" data-poster-banner={_item} key={_index}></span>
                                                );
                                            })
                                        }

                                        {
                                            (() => {
                                                if(item.original_date){
                                                    return (
                                                        <span className="original_date">{item.original_date}</span>
                                                    );
                                                }
                                            })()
                                        }
                                    </div>
                                    
                                    <div className="des_section">
                                        <div className="top_section">
                                            {
                                                (() => {
                                                    if(item.score){
                                                        return (
                                                            <span className="score">{item.score}</span>
                                                        );
                                                    }
                                                })()
                                            }

                                            <h3 className="title">{item.title}</h3>
                                        </div>

                                        {
                                            (() => {
                                                if(item.content_type != "ent"){
                                                    if(item.is_series){
                                                        return (
                                                            <div className="bottom_section">{item.display_count}</div>
                                                        );
                                                    }
                                                    else if(item.simple_comment){
                                                        return (
                                                            <h4 className="bottom_section">{item.simple_comment}</h4>
                                                        );
                                                    }
                                                    else if(item.secondary_mark){
                                                        return (
                                                            <h4 className="bottom_section">{item.secondary_mark}</h4>
                                                        );
                                                    }
                                                    else{
                                                        return (
                                                            <div className="bottom_section"></div>
                                                        );
                                                    }
                                                }
                                            })()
                                        }
                                    </div>
                                </a>
                            );
                        })
                    }
                </div>
            </section>

            <style jsx>
                {`
                    .related_program_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        margin-top: 20px;

                        .info_section{
                            overflow: hidden;
                            margin-left: auto;
                            margin-right: auto;

                            .right_section{
                                width: 15.66%;
                                display: block;
                                float: right;
                                position: relative;
                                margin-left: 0.5%;
                                margin-right: 0.5%;

                                @media screen and (max-width: 1023px) {
                                    width: 19%;
                                }

                                .rank_title{
                                    color: #5e0b75;
                                    font-size: 25px;
                                    line-height: 35px;
                                    font-weight: bold;
                                    padding-bottom: 5px;
                                }

                                .border_bottom{
                                    position: absolute;
                                    bottom: 0px;
                                    width: 100%;
                                    height: 1px;
                                    background-color: #ccc;
                                }
                            }

                            .left_section{
                                overflow: hidden;
                                display: block;
                                width: 82.33%;
                                margin-left: 0.5%;
                                margin-right: 0.5%;
                                padding-bottom: 5px;
                                float: left;
                                position: relative;

                                @media screen and (max-width: 1023px) {
                                    width: 79%;
                                }

                                .title{
                                    color: #5e0b75;
                                    font-size: 25px;
                                    line-height: 35px;
                                    font-weight: bold;
                                    display: block;
                                    float: left;
                                }

                                .border_bottom{
                                    position: absolute;
                                    bottom: 0px;
                                    width: 100%;
                                    height: 1px;
                                    background-color: #ccc;
                                }
                            }
                        }

                        .content_items{
                            position: relative;
                            overflow: hidden;

                            .content_item{
                                margin-left: 0.5%;
                                margin-right: 0.5%;
                                margin-top: 10px;
                                margin-bottom: 10px;
                                width: 15.66%;
                                display: block;
                                float: left;
                                position: relative;

                                @media screen and (max-width: 1023px) {
                                    width: 19%;

                                    &:nth-child(n + 11){
                                        display: none;
                                    }
                                }

                                &.right{
                                    float: right;

                                    .poster_section{
                                        box-shadow: none;
                                    }
                                }

                                &:nth-child(n + 13){
                                    display: none;
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

                                .des_section{
                                    position: relative;
                                    overflow: hidden;

                                    .top_section{
                                        height: 30px;
                                        overflow: hidden;
                                        padding-left: 5px;
                                        padding-right: 5px;

                                        .score{
                                            color: #f60;
                                            float: right;
                                            padding-left: 5px;
                                            font-size: 13px;
                                            line-height: 30px;
                                        }

                                        .title{
                                            font-weight: normal;
                                            line-height: 30px;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            overflow: hidden;
                                            font-size: 15px;
                                        }
                                    }

                                    .bottom_section{
                                        height: 25px;
                                        padding-left: 5px;
                                        padding-right: 5px;
                                        font-size: 14px;
                                        line-height: 25px;
                                        color: #666;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                    }
                                }
                            }

                            .landscape_rank_container{
                                position: absolute;
                                top: 10px;
                                bottom: 10px;
                                width: 15.66%;
                                right: 0.5%;

                                @media screen and (max-width: 1023px) {
                                    width: 19%;
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
    relatedProgram: PropTypes.object.isRequired,
    rank: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
