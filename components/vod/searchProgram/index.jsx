
import { connect } from "react-redux";
import { createRef, useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import _ from "lodash";
import LazyLoad from "react-lazyload";

import contentTypeMap from "../../../assets/json/content/contentTypeMap.json";

import Placeholder from "../../placeholder/index.jsx";
import PosterBannerStyle from "../../../assets/css/posterBanner/posterBannerStyle.jsx";
import CategoryBanner from "./categoryBanner.jsx";
import BreadCrumb from "../../breadCrumb/index.jsx";

import tools from "../../../assets/js/tools/index.js";
import seo from "../../../assets/js/seo/index.js";
import api from "../../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const router = useRouter();

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const breadCrumb = useMemo(() => {
        let _breadCrumb = new Array();

        _breadCrumb.push({
            name: "首頁",
            href: "/",
            as: "/"
        });

        _breadCrumb.push({
            name: contentTypeMap[props.searchProgram.data[0].content_type],
            href: "/[contentType]",
            as: `/${props.searchProgram.data[0].content_type}`
        });

        _breadCrumb.push({
            name: props.searchProgram.data[0].result_type_name
        });

        return _breadCrumb;
    }, [props.searchProgram]);

    const filterData = useMemo(() => {
        let filter = [
            {
                "caption": "最受歡迎",
                "value": "sorting_number"
            },
            {
                "caption": "最新上架",
                "value": "first_publish_date"
            }
        ];

        if(props.searchProgram.data[0].content_type == "movie"){
            filter.push({
                "caption": "評分最高",
                "value": "score"
            });
        }

        return filter;
    }, [props.searchProgram]);

    const [sort, setSort] = useState({
        value: filterData[0].value
    });

    const clonePrograms = useMemo(() => {
        let programs = _.cloneDeep(props.searchProgram.data[0].programs);

        for(let i = 0; i < programs.length; i ++){
            let program = programs[i];

            if(program.first_publish_date){
                program.first_publish_date = new Date(program.first_publish_date).getTime();
            }

            if(program.score){
                program.score = parseFloat(program.score);
            }
        }

        return programs;
    }, [props.searchProgram]);

    const sortPrograms = useMemo(() => {
        let programs = clonePrograms;

        programs = programs.sort((a, b) => {
            return b[sort.value] - a[sort.value];
        });
        
        return _.cloneDeep(programs);
    }, [clonePrograms, sort]);

    const pagePrograms = useMemo(() => {
        let programs = sortPrograms;
        let _programs = new Array();

        for(let i = 0; i < programs.length; i ++){
            let program = programs[i];
            let index = parseInt(i / 60);

            if(!_programs[index]){
                _programs[index] = new Array();
            }

            _programs[index].push(program);
        }
        
        return _programs;
    }, [sortPrograms]);

    const pageRefs = useMemo(() => {
        let len = pagePrograms.length;
        let arr = new Array();

        for(let i = 0; i < len; i ++){
            arr.push(createRef());
        }

        return arr;
    }, [pagePrograms]);
    
    const [intersectionIndex, setIntersectionIndex] = useState([0]);
    const [categoryPromo, setCategoryPromo] = useState(null);
    const [categoryPromoItems, setCategoryPromoItems] = useState(null);

    const sortBtnClickHandler = useCallback((event, element) => {
        setSort({
            value: element.value
        });
    }, []);

    const getSortBtnClass = useCallback((_sort) => {
        if(_sort == sort.value){
            return "focus";
        }

        return "";
    }, [sort]);
    
    useEffect(() => {
        let observer = new IntersectionObserver((entries) => {
            for(let i = 0; i < entries.length; i ++){
                let entry = entries[i];

                if(entry.isIntersecting){
                    let target = entry.target;
                    let index = target.getAttribute("data-page-index");

                    index = parseInt(index);
                    
                    setIntersectionIndex((value) => {
                        if(value.indexOf(index) == -1){
                            value = _.cloneDeep(value);

                            value.push(index);
                        }
                        
                        return value;
                    });
                }
            }
        });

        for(let i = 0; i < pageRefs.length; i ++){
            let pageRef = pageRefs[i];

            if(pageRef.current){
                observer.observe(pageRef.current);
            }
        }

        return () => {
            observer.disconnect();
        };
    }, [pagePrograms]);

    useEffect(() => {
        setIntersectionIndex([0]);
    }, [pagePrograms]);

    useEffect(() => {
        let href = tools.url.replaceQuery(location.href, "sort", sort.value);
        let pathname = router.pathname;
        let query = [];
        
        for(let key in props.request){
            if(props.request[key]){
                query.push(`${key}=${props.request[key]}`);
            }
        }

        query = query.join("&");
        pathname = `${pathname}?${query}`;
        
        history.replaceState({
            "url": pathname,
            "as": href,
            "options": {},
            "__N": true
        }, seo.vod.searchProgram.getTitle(props.searchProgram.data[0]), href);
    }, [sort]);

    useEffect(() => {
        let _sort = tools.url.getQuery(location.href, "sort");

        if(_sort){
            setSort({
                value: _sort
            });
        }
        else{
            setSort({
                value: filterData[0].value
            });
        }
    }, [props.searchProgram]);

    useEffect(() => {
        api.fino.categoryPromo.getFetch().then((res) => {
            setCategoryPromo(res);
        });
    }, []);
    
    useEffect(() => {
        if(!categoryPromo){
            setCategoryPromoItems(null);
        }
        else{
            let categoryId = props.request.categoryId;

            if(categoryId){
                let _categoryPromoItem = categoryPromo[categoryId];

                if(_categoryPromoItem){
                    let req = {
                        url: _categoryPromoItem,
                        obj: {
                            method: "GET",
                            headers: {
                                "Accept": "application/json, text/plain, */*",
                                "Content-Type": "text/plain"
                            }
                        }
                    };

                    fetch(req.url, req.obj).then((response) => {
                        return response.json();
                    }).then((response) => {
                        setCategoryPromoItems(response);
                    });
                }
                else{
                    setCategoryPromoItems(null);
                }
            }
            else{
                setCategoryPromoItems(null);
            }
        }
    }, [categoryPromo, props.searchProgram]);
    
    return (
        <>
            <PosterBannerStyle />
            
            <div className="search_program_section">
                <h1 className="ssr_only">LiTV-{props.searchProgram.data[0].result_type_name}線上看</h1>
                
                <BreadCrumb breadCrumb={breadCrumb} />
                <CategoryBanner categoryBanner={props.searchProgram.category_banner} />
                
                <div className="programs_section">
                    <div className="title_sort_section">
                        <div className="right_section">
                            <span className="sort_text">排序：</span>

                            {
                                filterData.map((element, index) => {
                                    return (
                                        <button className={`sort_btn ${getSortBtnClass(element.value)}`} onClick={(event) => sortBtnClickHandler(event, element)} key={index}>{element.caption}</button>
                                    );
                                })
                            }
                        </div>

                        <div className="left_section">
                            <div className="title">{props.searchProgram.data[0].result_type_name}</div>

                            {
                                (() => {
                                    if(props.searchProgram.data[0].description){
                                        return (
                                            <div className="desc">{props.searchProgram.data[0].description}</div>
                                        );
                                    }
                                })()
                            }
                        </div>

                        <div className="border_bottom"></div>
                    </div>
                    
                    <div className="programs" data-program-publish-pics-type={props.searchProgram.data[0].program_publish_pics_type}>
                        {
                            pagePrograms.map((element, index) => {
                                return (
                                    <div className="page" data-page-index={index} ref={pageRefs[index]} key={index}>
                                        {
                                            (() => {
                                                if(intersectionIndex.indexOf(index) != -1){
                                                    return element.map((_element, _index) => {
                                                        return (
                                                            <Link href="/[contentType]/[contentId]" as={`/${_element.content_type}/${_element.content_id}`} key={_index}>
                                                                <a className="content_item" title={_element.title}>
                                                                    <div className="poster_section">
                                                                        <div className="padding_box"></div>

                                                                        {
                                                                            (() => {
                                                                                if(props.searchProgram.data[0].program_publish_pics_type == "p"){
                                                                                    return (
                                                                                        <LazyLoad placeholder={<Placeholder type="portrait" alt={_element.title} />}>
                                                                                            <img className="poster" src={`${cdnstatic}/${_element.picture}`} alt={_element.title} />
                                                                                        </LazyLoad>
                                                                                    );
                                                                                }   
                                                                                else if(props.searchProgram.data[0].program_publish_pics_type == "l"){
                                                                                    return (
                                                                                        <LazyLoad placeholder={<Placeholder type="landscape" alt={_element.title} />}>
                                                                                            <img className="poster" src={`${cdnstatic}/${_element.video_image}`} alt={_element.title} />
                                                                                        </LazyLoad>
                                                                                    );
                                                                                }
                                                                            })()                                                                            
                                                                        }

                                                                        {
                                                                            _element.poster_banners.map((__item, __index) => {
                                                                                return (
                                                                                    <span className="poster_banner_poster_icon" data-poster-banner={__item} key={__index}></span>
                                                                                );
                                                                            })
                                                                        }

                                                                        {
                                                                            (() => {
                                                                                if(_element.original_date && props.searchProgram.data[0].program_publish_pics_type == "l"){
                                                                                    return (
                                                                                        <span className="original_date">{_element.original_date}</span>
                                                                                    );
                                                                                }
                                                                            })()
                                                                        }
                                                                    </div>

                                                                    <div className="des_section">
                                                                        <div className="top_section">
                                                                            {
                                                                                (() => {
                                                                                    if(_element.score){
                                                                                        return (
                                                                                            <span className="score">{_element.score}</span>
                                                                                        );
                                                                                    }
                                                                                })()
                                                                            }

                                                                            <h2 className="title">{_element.title}</h2>
                                                                        </div>

                                                                        {
                                                                            (() => {
                                                                                if(_element.content_type != "ent"){
                                                                                    if(_element.content_type == "movie"){
                                                                                        return (
                                                                                            <h3 className="bottom_section">{_element.simple_comment}</h3>
                                                                                        );
                                                                                    }
                                                                                    else if((_element.content_type == "show" || _element.content_type == "blessedlife") && props.searchProgram.data[0].program_publish_pics_type == "l"){
                                                                                        return (
                                                                                            <h3 className="bottom_section">{_element.secondary_mark}</h3>
                                                                                        );
                                                                                    }
                                                                                    else{
                                                                                        return (
                                                                                            <div className="bottom_section">{_element.display_count}</div>
                                                                                        );
                                                                                    }
                                                                                }
                                                                            })()
                                                                        }
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        );
                                                    });
                                                }
                                            })()
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>  
                
                <CategoryBanner categoryBanner={categoryPromoItems} />
            </div>
                    
            <style jsx>
                {`
                    .search_program_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        
                        .programs_section{
                            margin-top: 20px;

                            .title_sort_section{
                                overflow: hidden;
                                padding-left: 0.5%;
                                padding-right: 0.5%;
                                padding-bottom: 5px;
                                position: relative;

                                .right_section{
                                    float: right;
                                    height: 35px;
                                    position: relative;
                                    overflow: hidden;

                                    .sort_text{
                                        line-height: 35px;
                                        font-size: 15px;
                                        display: block;
                                        float: left;
                                    }

                                    .sort_btn{
                                        font-size: 15px;
                                        line-height: 30px;
                                        height: 30px;
                                        display: block;
                                        float: left;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        padding-left: 15px;
                                        padding-right: 15px;
                                        border-radius: 5px;
                                        overflow: hidden;

                                        &.focus{
                                            background-color: #f60;
                                            color: #fff;
                                        }
                                    }
                                }

                                .left_section{
                                    overflow: hidden;

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
                                        padding-right: 5px;
                                    }
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

                                .page{
                                    position: relative;
                                    overflow: hidden;
                                    min-height: 60px;
    
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
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    searchProgram: PropTypes.object.isRequired,
    request: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
