
import { connect } from "react-redux";
import React, { useMemo } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";

import Placeholder from "../placeholder/index.jsx";
import PosterBannerStyle from "../../assets/css/posterBanner/posterBannerStyle.jsx";
import SearchOptions from "./searchOptions.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    return (
        <>
            <PosterBannerStyle />

            <div className="search_section">
                <div className="title_section">
                    <h1 className="query_title">關於 "<span className="query">{props.query}</span>" 的搜尋結果</h1>

                    {
                        (() => {
                            if(props.searchByPattern){
                                return (
                                    <div className="result_count">{`共 ${props.searchByPattern.length} 筆結果`}</div>
                                );
                            }
                            else{
                                return (
                                    <div className="result_count">共 0 筆結果</div>
                                );
                            }
                        })()
                    }
                </div>
                
                {
                    (() => {
                        if(props.searchByPattern && props.searchByPattern.length){
                            return (
                                <div className="programs_section">
                                    {
                                        props.searchByPattern.map((element, index) => {
                                            return (
                                                <div className="program_section" key={index}>
                                                    <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`}>
                                                        <a className="poster" title={element.title}>
                                                            <div className="padding_box"></div>

                                                            <LazyLoad placeholder={<Placeholder type="portrait" alt={element.title} />}>
                                                                <img className="poster" src={`${cdnstatic}/${element.picture}`} alt={element.title} />
                                                            </LazyLoad>

                                                            {
                                                                element.poster_banners.map((_element, _index) => {
                                                                    return (
                                                                        <span className="poster_banner_poster_icon" data-poster-banner={_element} key={_index}></span>
                                                                    );
                                                                })
                                                            }
                                                        </a>
                                                    </Link>

                                                    <div className="detail_section">
                                                        <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`}>
                                                            <a className="title_link" title={element.title}>
                                                                {
                                                                    (() => {
                                                                        if(element.secondary_mark){
                                                                            return (
                                                                                <h2 className="ssr_only">{element.title}-{element.secondary_mark}</h2>
                                                                            );
                                                                        }
                                                                        else{
                                                                            return (
                                                                                <h2 className="ssr_only">{element.title}</h2>
                                                                            );
                                                                        }
                                                                    })()
                                                                }
                                                                
                                                                <div className="title">{element.title}</div>
                                                            </a>
                                                        </Link>

                                                        <div className="secondary_mark">{element.secondary_mark}</div>

                                                        {
                                                            element.credits.map((_element, _index) => {
                                                                return (
                                                                    <div className="credit" key={_index}>
                                                                        <div className="title">{`${_element.type_name}：`}</div>

                                                                        <div className="content">
                                                                            {
                                                                                _element.list.map((__element, __index) => {
                                                                                    return (
                                                                                        <React.Fragment key={__index} >
                                                                                            <Link href={`/search?query=${encodeURIComponent(__element.name)}`} as={`/search?query=${encodeURIComponent(__element.name)}`}>
                                                                                                <a className="link" title={__element.name}>
                                                                                                    <h3 className="text">{__element.name}</h3>
                                                                                                </a>
                                                                                            </Link>
                                                
                                                                                            {
                                                                                                (() => {
                                                                                                    if(__index < _element.list.length - 1){
                                                                                                        return (
                                                                                                            <span className="comma">、</span>
                                                                                                        );
                                                                                                    }
                                                                                                })()
                                                                                            }
                                                                                        </React.Fragment>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        }

                                                        <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`}>
                                                            <a className="play_btn" title={element.title}>
                                                                <span className="icon"></span>
                                                                <span className="text">播放</span>
                                                            </a>
                                                        </Link>
                                                    </div>

                                                    {
                                                        (() => {
                                                            if(index < props.searchByPattern.length - 1){
                                                                return (
                                                                    <div className="segment"></div>
                                                                );
                                                            }
                                                        })()
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        }
                        else{
                            return (
                                <>
                                    <div className="search_result_by_blank">
                                        <div className="blank_title">
                                            <img className="icon" src={require("../../assets/image/search/blank.png")} alt="no result" />
                                            
                                            <div className="description">
                                                <span className="text">很抱歉，沒有找到 "</span>
                                                <span className="text query">{props.query}</span>
                                                <span className="text">" 相關的內容，</span>

                                                <Link href="/" as="/">
                                                    <a className="text link" target="_self" title="首頁">回首頁 </a>
                                                </Link>

                                                <span>逛逛吧！</span>
                                            </div>
                                        </div>

                                        <SearchOptions />
                                    </div>
                                </>
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .search_section{
                        overflow: hidden;
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        
                        .title_section{
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                            margin-top: 20px;

                            .query_title{
                                font-size: 20px;
                                line-height: 40px;
                                font-weight: bold;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;

                                .query{
                                    color: #5e0b75;
                                }
                            }

                            .result_count{
                                font-size: 15px;
                                line-height: 30px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                        }

                        .programs_section{
                            overflow: hidden;

                            .program_section{
                                padding-top: 20px;
                                padding-bottom: 20px;
                                padding-left: 0.5%;
                                padding-right: 0.5%;
                                overflow: hidden;
                                position: relative;

                                .poster{
                                    width: 200px;
                                    float: left;
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
                                }

                                .detail_section{
                                    overflow: hidden;
                                    padding-left: 10px;

                                    .title_link{
                                        display: block;
                                        float: left;
                                        max-width: 100%;
                                        
                                        .title{
                                            font-size: 25px;
                                            line-height: 40px;
                                            color: #5e0b75;
                                            text-overflow: ellipsis;
                                            white-space: nowrap;
                                            overflow: hidden;
                                        }
                                    }

                                    .secondary_mark{
                                        clear: both;
                                        font-size: 20px;
                                        line-height: 40px;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                    }
                                }

                                .credit{
                                    overflow: hidden;

                                    .title{
                                        float: left;
                                        overflow: hidden;
                                        position: relative;
                                        font-size: 15px;
                                        line-height: 40px;
                                    }

                                    .content{
                                        overflow: hidden;
                                        position: relative;

                                        .link{
                                            display: block;
                                            float: left;

                                            .text{
                                                font-size: 15px;
                                                line-height: 40px;
                                                color: #408ed6;
                                            }
                                        }

                                        .comma{
                                            display: block;
                                            line-height: 40px;
                                            float: left;
                                            font-size: 15px;
                                            line-height: 40px;
                                        }
                                    }
                                }

                                .play_btn{
                                    background-color: #f60;
                                    float: left;
                                    overflow: hidden;
                                    display: flex;
                                    height: 40px;
                                    border-radius: 5px;
                                    flex-direction: row;
                                    padding-left: 15px;
                                    padding-right: 15px;
                                    justify-content: center;
                                    align-items: center;
                                    margin-top: 20px;

                                    .icon{
                                        width: 14px;
                                        height: 14px;
                                        background-image: url(${require("../../assets/image/icon/arrow_white.svg")});
                                        background-size: cover;
                                        display: block;
                                    }

                                    .text{
                                        padding-left: 5px;
                                        font-size: 15px;
                                        display: block;
                                        color: #f1f1f1;
                                    }
                                }

                                .segment{
                                    position: absolute;
                                    width: 99%;
                                    height: 1px;
                                    bottom: 0px;
                                    background-color: #ccc;
                                    left: 50%;
                                    transform: translateX(-50%);
                                }
                            }
                        }

                        .search_result_by_blank{
                            margin-top: 20px;

                            .blank_title{
                                height: 60px;
                                position: relative;
                                padding-left: 0.5%;
                                padding-right: 0.5%;
                                overflow: hidden;

                                .icon{
                                    display: block;
                                    float: left;
                                    width: 55px;
                                    height: 55px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                }

                                .description{
                                    overflow: hidden;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    padding-left: 10px;

                                    .text{
                                        font-size: 15px;
                                        line-height: 30px;

                                        &.query{
                                            color: #5e0b75;
                                        }

                                        &.link{
                                            color: #408ed6;
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
    query: PropTypes.string.isRequired,
    searchByPattern: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
