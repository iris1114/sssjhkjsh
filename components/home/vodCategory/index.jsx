
import { useState, useEffect, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";

import api from "../../../assets/js/api/index.js";

import Placeholder from "../../placeholder/index.jsx";
import Ranks from "./ranks.jsx";
import PosterBannerStyle from "../../../assets/css/posterBanner/posterBannerStyle.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const router = useRouter();

    const [hotRankTitleMap, setHotRankTitleMap] = useState(null);

    const hotRankContentTypes = useMemo(() => {
        let contentTypes = new Array();

        for(let i = 0; i < props.mainContent.length; i ++){
            let contentType = props.mainContent[i].content_type;

            if(contentTypes.indexOf(contentType) == -1){
                contentTypes.push(contentType);
            }
            else{
                contentTypes.push(null);
            }
        }

        return contentTypes;
    }, []);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const getHotRankTitle = useCallback((contentType) => {
        let title = hotRankTitleMap[contentType];

        if(!title){
            title = hotRankTitleMap.default;
        }

        return title;
    }, [hotRankTitleMap]);

    const getLeftSectionClass = useCallback((index) => {
        if(hotRankContentTypes[index]){
            return "short";
        }
        
        return "";
    }, [hotRankContentTypes]);

    const getCategoryLinkHref = useCallback((item) => {
        if(router.pathname == "/"){
            if(item.content_type == "ent"){
                return {
                    pathname: "/[contentType]/searchProgram",
                    query: {
                        categoryId: 113
                    }
                };
            }
            else if(item.content_type == "movie" && item.category_id == "47"){
                return {
                    pathname: "/[contentType]/searchProgram",
                    query: {
                        categoryId: 47
                    }
                };
            }
            else if(item.content_type == "movie" && item.category_id == "169"){
                return {
                    pathname: "/[contentType]/searchProgram",
                    query: {
                        categoryId: 169
                    }
                };
            }
            else{
                return "/[contentType]";
            }
        }
        else{
            return {
                pathname: "/[contentType]/searchProgram",
                query: {
                    categoryId: item.category_id
                }
            };
        }
    }, []);

    const getCategoryLinkAs = useCallback((item) => {
        if(router.pathname == "/"){
            if(item.content_type == "ent"){
                return `/${item.content_type}/searchProgram?categoryId=113`;
            }
            else if(item.content_type == "movie" && item.category_id == "47"){
                return `/${item.content_type}/searchProgram?categoryId=47`;
            }
            else if(item.content_type == "movie" && item.category_id == "169"){
                return `/${item.content_type}/searchProgram?categoryId=169`;
            }
            else{
                return `/${item.content_type}`;
            }
        }
        else{
            return `/${item.content_type}/searchProgram?categoryId=${item.category_id}`;
        }
    }, []);

    const getgetContentItemsClass = useCallback((item, index) => {
        if(item.program_publish_pics_type == "l" && hotRankContentTypes[index]){
            return "rank";
        }

        return "";
    }, [hotRankContentTypes]);

    useEffect(() => {
        let unmounted = false;

        api.fino.hotRank.getFetch().then((res) => {
            if(!unmounted){
                setHotRankTitleMap(res);
            }
        });

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <>  
            <PosterBannerStyle />

            <section className="categories_section">
                {
                    props.mainContent.map((item, index) => {
                        return (
                            <div className="category_section" key={index}>
                                <div className="info_section">
                                    {
                                        (() => {
                                            if(hotRankTitleMap && hotRankContentTypes[index]){
                                                return (
                                                    <div className="right_section">
                                                        {
                                                            (() => {
                                                                return (
                                                                    <>
                                                                        <div className="rank_title">{getHotRankTitle(item.content_type)}</div>
                                                                        <div className="border_bottom"></div>
                                                                    </>
                                                                );
                                                            })()
                                                        }
                                                    </div>
                                                );
                                            }
                                        })()
                                    }

                                    <div className={`left_section ${getLeftSectionClass(index)}`}>
                                        <Link href={getCategoryLinkHref(item)} as={getCategoryLinkAs(item)}>
                                            <a className="category_link_section" title={item.category_name}>
                                                <h2 className="title">{item.category_name}</h2>
                                                <div className="segment"></div>
                                                <div className="more">更多...</div>
                                            </a>
                                        </Link>

                                        {
                                            item.poster_banners.map((_item, _index) => {
                                                return (
                                                    <span className="poster_banner poster_banner_episode_tag" data-poster-banner={_item} key={_index}></span>
                                                );
                                            })
                                        }

                                        {
                                            (() => {
                                                if(item.description){
                                                    return (
                                                        <div className="category_des">{item.description}</div>
                                                    );
                                                }
                                            })()
                                        }

                                        <div className="border_bottom"></div>
                                    </div>
                                </div>

                                <div className={`content_items ${getgetContentItemsClass(item, index)}`} data-program-publish-pics-type={item.program_publish_pics_type}>
                                    {
                                        (() => {
                                            if(hotRankContentTypes[index]){
                                                return (
                                                    <div className="content_item right">
                                                        <div className="poster_section">
                                                            <div className="padding_box"></div>
                                                        </div>

                                                        <div className="des_section">
                                                            <div className="top_section"></div>
                                                            <div className="bottom_section"></div>
                                                        </div>

                                                        {
                                                            (() => {
                                                                if(hotRankTitleMap && item.program_publish_pics_type == "p"){
                                                                    return (
                                                                        <Ranks contentType={hotRankContentTypes[index]} title={getHotRankTitle(item.content_type)} />
                                                                    );
                                                                }
                                                            })()
                                                        }
                                                    </div>
                                                );
                                            }
                                        })()
                                    }

                                    {
                                        (() => {
                                            if(hotRankTitleMap && hotRankContentTypes[index] && item.program_publish_pics_type == "l"){
                                                return (
                                                    <div className="landscape_rank_container">
                                                        <Ranks contentType={hotRankContentTypes[index]} title={getHotRankTitle(item.content_type)} />
                                                    </div>
                                                );
                                            }
                                        })()
                                    }
                                    
                                    {
                                        item.programs.slice(0, 12).map((_item, _index) => {
                                            return (
                                                <Link href="/[contentType]/[contentId]" as={`/${_item.content_type}/${_item.content_id}`} key={_index}>
                                                    <a className="content_item" title={_item.title}>
                                                        <div className="poster_section">
                                                            <div className="padding_box"></div>

                                                            {
                                                                (() => {
                                                                    if(item.program_publish_pics_type == "p"){
                                                                        return (
                                                                            <LazyLoad placeholder={<Placeholder type="portrait" alt={_item.title} />}>
                                                                                <img className="poster" src={`${cdnstatic}/${_item.picture}`} alt={_item.title} />
                                                                            </LazyLoad>
                                                                        );
                                                                    }   
                                                                    else if(item.program_publish_pics_type == "l"){
                                                                        return (
                                                                            <LazyLoad placeholder={<Placeholder type="landscape" alt={_item.title} />}>
                                                                                <img className="poster" src={`${cdnstatic}/${_item.video_image}`} alt={_item.title} />
                                                                            </LazyLoad>
                                                                        );
                                                                    }
                                                                })()                                                                            
                                                            }

                                                            {
                                                                _item.poster_banners.map((__item, __index) => {
                                                                    return (
                                                                        <span className="poster_banner_poster_icon" data-poster-banner={__item} key={__index}></span>
                                                                    );
                                                                })
                                                            }

                                                            {
                                                                (() => {
                                                                    if(_item.original_date && item.program_publish_pics_type == "l"){
                                                                        return (
                                                                            <span className="original_date">{_item.original_date}</span>
                                                                        );
                                                                    }
                                                                })()
                                                            }
                                                        </div>

                                                        <div className="des_section">
                                                            <div className="top_section">
                                                                {
                                                                    (() => {
                                                                        if(_item.score){
                                                                            return (
                                                                                <span className="score">{_item.score}</span>
                                                                            );
                                                                        }
                                                                    })()
                                                                }

                                                                <h3 className="title">{_item.title}</h3>
                                                            </div>

                                                            {
                                                                (() => {
                                                                    if(_item.content_type != "ent"){
                                                                        if(_item.content_type == "movie"){
                                                                            return (
                                                                                <h4 className="bottom_section">{_item.simple_comment}</h4>
                                                                            );
                                                                        }
                                                                        else if((_item.content_type == "show" || _item.content_type == "blessedlife") && item.program_publish_pics_type == "l"){
                                                                            return (
                                                                                <h4 className="bottom_section">{_item.secondary_mark}</h4>
                                                                            );
                                                                        }
                                                                        else{
                                                                            return (
                                                                                <div className="bottom_section">{_item.display_count}</div>
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
                    })
                }
            </section>

            <style jsx>
                {`
                    .categories_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;

                        .category_section{
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

                                    @media screen and (max-width: 1023px) {
                                        width: 19%;
                                    }
                                }

                                .left_section{
                                    overflow: hidden;
                                    display: block;
                                    width: 99%;
                                    margin-left: 0.5%;
                                    margin-right: 0.5%;
                                    padding-bottom: 5px;
                                    float: left;
                                    position: relative;
                                    
                                    &.short{
                                        width: 82.33%;

                                        @media screen and (max-width: 1023px) {
                                            width: 79%;
                                        }
                                    }

                                    .category_link_section{
                                        overflow: hidden;
                                        margin-right: 10px;
                                        display: block;
                                        float: left;
                                        height: 35px;
                                        position: relative;

                                        &:hover{
                                            .title, .more{
                                                color: #f60;
                                            }
                                        }

                                        .title{
                                            color: #5e0b75;
                                            font-size: 25px;
                                            line-height: 35px;
                                            font-weight: bold;
                                            display: block;
                                            float: left;
                                        }

                                        .segment{
                                            position: relative;
                                            top: 50%;
                                            width: 1px;
                                            height: 25px;
                                            background-color: #ccc;
                                            margin-left: 10px;
                                            margin-right: 10px;
                                            display: block;
                                            float: left;
                                            transform: translateY(-50%);
                                        }

                                        .more{
                                            color: #666;
                                            font-size: 15px;
                                            line-height: 35px;
                                            font-weight: bold;
                                            display: block;
                                            float: left;
                                        }
                                    }

                                    .poster_banner{
                                        height: 35px;
                                        margin-right: 10px;
                                        display: block;
                                        float: left;
                                    }

                                    .category_des{
                                        color: #666;
                                        font-size: 15px;
                                        font-weight: bold;
                                        line-height: 35px;
                                        display: block;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
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

                                &[data-program-publish-pics-type=l]{
                                    .content_item{
                                        .poster_section{
                                            .padding_box{
                                                padding-bottom: 56.25%;
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

                                    &.right{
                                        float: right;

                                        .poster_section{
                                            box-shadow: none;
                                        }
                                    }

                                    &:nth-child(n + 13){
                                        display: none;
                                    }

                                    @media screen and (max-width: 1023px) {
                                        width: 19%;
    
                                        &:nth-child(n + 11){
                                            display: none;
                                        }
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
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    mainContent: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
