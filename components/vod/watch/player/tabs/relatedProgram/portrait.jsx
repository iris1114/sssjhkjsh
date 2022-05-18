
import { connect } from "react-redux";
import { useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import PosterBannerStyle from "../../../../../../assets/css/posterBanner/posterBannerStyle.jsx";

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
            
            <div className="related_program_section">
                {
                    props.relatedProgram.programs.map((item, index) => {
                        return (
                            <a className="content_item" href={`/${item.content_type}/${item.content_id}`} onClick={(event) => contentItemClickHandler(event, item)} target="_self" title={item.title} key={index}>
                                <div className="poster_section">
                                    <div className="padding_box"></div>
                                    <img className="poster" src={`${cdnstatic}/${item.picture}`} alt={item.title} />

                                    {
                                        item.poster_banners.map((_item, _index) => {
                                            return (
                                                <span className="poster_banner_poster_icon" data-poster-banner={_item} key={_index}></span>
                                            );
                                        })
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

                                        <div className="title">{item.title}</div>
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
                                                        <div className="bottom_section">{item.simple_comment}</div>
                                                    );
                                                }
                                                else if(item.secondary_mark){
                                                    return (
                                                        <div className="bottom_section">{item.secondary_mark}</div>
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

            <style jsx>
                {`
                    .related_program_section{
                        overflow: hidden;

                        .content_item{
                            margin-left: 1%;
                            margin-right: 1%;
                            margin-top: 10px;
                            margin-bottom: 10px;
                            width: 31.33%;
                            display: block;
                            float: left;
                            position: relative;

                            @media screen and (max-width: 1023px) {
                                width: 18%;
                            }

                            .poster_section{
                                position: relative;
                                border-radius: 5px;
                                overflow: hidden;

                                .padding_box{
                                    padding-bottom: 143.33%;
                                }

                                .poster{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    display: block;
                                    width: 100%;
                                    height: 100%;
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
                                        color: #ccc;
                                    }
                                }

                                .bottom_section{
                                    height: 25px;
                                    padding-left: 5px;
                                    padding-right: 5px;
                                    font-size: 14px;
                                    line-height: 25px;
                                    color: #999;
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
    relatedProgram: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
