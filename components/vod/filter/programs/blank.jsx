
import { connect } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import _ from "lodash";

import Placeholder from "../../../placeholder/index.jsx";
import PosterBannerStyle from "../../../../assets/css/posterBanner/posterBannerStyle.jsx";

import api from "../../../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [searchProgram, setSearchProgram] = useState(null);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    useEffect(() => {
        let unmounted = false;

        let req = {
            contentType: props.contentType,
            limit: "10",
            board: "top"
        };

        api.ccc.searchProgram.getFetch(req).then((res) => {
            if(!unmounted){
                setSearchProgram(res.result.data[0]);
            }
        });

        return () => {
            unmounted = true;
        };
    }, [props.contentType]);

    return (
        <>
            <PosterBannerStyle />

            <div className="filter_blank_section">
                <div className="blank_icon_section">
                    <img className="image" src={require("../../../../assets/image/filter/filterNoResult.svg")} alt="filter blank"/>

                    <div className="text_section">
                        <div className="text">很抱歉，</div>
                        <div className="text">暫時沒有您篩選的影片。</div>
                    </div>
                </div>

                {
                    (() => {
                        if(searchProgram){
                            return (
                                <div className="programs_section">
                                    <div className="title_section">
                                        <div className="title">大家都在看</div>

                                        {
                                            (() => {
                                                if(searchProgram.description){
                                                    return (
                                                        <div className="desc">{searchProgram.description}</div>
                                                    );
                                                }
                                            })()
                                        }

                                        <div className="border_bottom"></div>
                                    </div>

                                    <div className="programs" data-program-publish-pics-type={searchProgram.program_publish_pics_type}>
                                        {
                                            searchProgram.programs.map((element, index) => {
                                                return (
                                                    <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`} key={index}>
                                                        <a className="content_item" title={element.title}>
                                                            <div className="poster_section">
                                                                <div className="padding_box"></div>

                                                                {
                                                                    (() => {
                                                                        if(searchProgram.program_publish_pics_type == "p"){
                                                                            return (
                                                                                <LazyLoad placeholder={<Placeholder type="portrait" alt={element.title} />}>
                                                                                    <img className="poster" src={`${cdnstatic}/${element.picture}`} alt={element.title} />
                                                                                </LazyLoad>
                                                                            );
                                                                        }   
                                                                        else if(searchProgram.program_publish_pics_type == "l"){
                                                                            return (
                                                                                <LazyLoad placeholder={<Placeholder type="landscape" alt={element.title} />}>
                                                                                    <img className="poster" src={`${cdnstatic}/${element.video_image}`} alt={element.title} />
                                                                                </LazyLoad>
                                                                            );
                                                                        }
                                                                    })()                                                                            
                                                                }

                                                                {
                                                                    element.poster_banners.map((_element, _index) => {
                                                                        return (
                                                                            <span className="poster_banner_poster_icon" data-poster-banner={_element} key={_index}></span>
                                                                        );
                                                                    })
                                                                }

                                                                {
                                                                    (() => {
                                                                        if(element.original_date && searchProgram.program_publish_pics_type == "l"){
                                                                            return (
                                                                                <span className="original_date">{element.original_date}</span>
                                                                            );
                                                                        }
                                                                    })()
                                                                }
                                                            </div>

                                                            <div className="des_section">
                                                                <div className="top_section">
                                                                    {
                                                                        (() => {
                                                                            if(element.score){
                                                                                return (
                                                                                    <span className="score">{element.score}</span>
                                                                                );
                                                                            }
                                                                        })()
                                                                    }

                                                                    <div className="title">{element.title}</div>
                                                                </div>

                                                                {
                                                                    (() => {
                                                                        if(element.content_type != "ent"){
                                                                            if(element.content_type == "movie"){
                                                                                return (
                                                                                    <div className="bottom_section">{element.simple_comment}</div>
                                                                                );
                                                                            }
                                                                            else if(element.content_type == "show" || element.content_type == "blessedlife" && searchProgram.program_publish_pics_type == "l"){
                                                                                return (
                                                                                    <div className="bottom_section">{element.secondary_mark}</div>
                                                                                );
                                                                            }
                                                                            else{
                                                                                return (
                                                                                    <div className="bottom_section">{element.display_count}</div>
                                                                                );
                                                                            }
                                                                        }
                                                                    })()
                                                                }
                                                            </div>
                                                        </a>
                                                    </Link>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .filter_blank_section{
                        .blank_icon_section{
                            display: table;
                            padding-top: 30px;
                            padding-bottom: 30px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;

                            .image{
                                float: left;
                                display: block;
                                width: 70px;
                                height: 70px;
                            }

                            .text_section{
                                float: left;
                                display: block;
                                padding-left: 10px;

                                .text{
                                    color: #c8c8c8;
                                    font-size: 20px;
                                    line-height: 35px;
                                }
                            }
                        }

                        .programs_section{
                            margin-top: 20px;

                            .title_section{
                                overflow: hidden;
                                padding-left: 0.5%;
                                padding-right: 0.5%;
                                padding-bottom: 5px;
                                position: relative;

                                .title{
                                    color: #5e0b75;
                                    font-size: 25px;
                                    line-height: 35px;
                                    font-weight: bold;
                                    display: block;
                                    float: left;
                                }

                                .desc{
                                    color: #666;
                                    font-size: 15px;
                                    font-weight: bold;
                                    line-height: 35px;
                                    display: block;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    padding-left: 5px;
                                }

                                .border_bottom{
                                    position: absolute;
                                    bottom: 0px;
                                    width: 99%;
                                    height: 1px;
                                    background-color: #ccc;
                                }
                            }

                            .programs{
                                &[data-program-publish-pics-type=l]{
                                    .page{
                                        .content_item{
                                            .poster_section{
                                                .padding_box{
                                                    padding-bottom: 56.25%;
                                                }
                                            }
                                        }
                                    }
                                }

                                .content_item{
                                    margin-left: 0.5%;
                                    margin-right: 0.5%;
                                    margin-top: 10px;
                                    margin-bottom: 10px;
                                    width: 15.66%;
                                    display: block;
                                    float: left;
                                    position: relative;

                                    &:nth-of-type(n + 7){
                                        display: none;
                                    }

                                    .poster_section{
                                        position: relative;
                                        border-radius: 5px;
                                        overflow: hidden;
                                        box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);

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
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    contentType: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
