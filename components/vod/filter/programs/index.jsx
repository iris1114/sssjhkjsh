
import { connect } from "react-redux";
import { createRef, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import _ from "lodash";

import Placeholder from "../../../placeholder/index.jsx";
import PosterBannerStyle from "../../../../assets/css/posterBanner/posterBannerStyle.jsx";
import Blank from "./blank.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [intersectionIndex, setIntersectionIndex] = useState([0]);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const title = useMemo(() => {
        if(props.filter && props.filterState){
            let title = new Array();

            for(let i = 0; i < props.filter.length; i ++){
                let item = props.filter[i];

                if(item.type == "filter" && props.filterState.conditions && props.filterState.extentions){
                    let condition = item.condition;
                    let conditionIndex = props.filterState.conditions.indexOf(condition);
                    let extention = props.filterState.extentions[conditionIndex];
                    
                    for(let j = 0; j < item.extention.length; j ++){
                        let _extention = item.extention[j];
                        
                        if(_extention.value == extention){
                            let caption = _extention.caption;

                            if(caption != "全部"){
                                title.push(caption);
                            }
                        }
                    }
                }

                if(item.type == "sort" && props.filterState.sort){
                    for(let j = 0; j < item.extention.length; j ++){
                        let _extention = item.extention[j];
                        
                        if(_extention.value == props.filterState.sort){
                            let caption = _extention.caption;

                            title.push(caption);
                        }
                    }
                }
            }

            if(title.length){
                title = title.join("、");

                return title;
            }
        }

        return "全部";
    }, [props.filter, props.filterState]);

    const formatProgram = useMemo(() => {
        let programs = _.cloneDeep(props.searchProgram.data[0].programs);

        if(!props.filter){
            return programs;
        }

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

    const filteredProgram = useMemo(() => {
        let programs = formatProgram;

        if(!props.filter || !props.filterState || !props.filterState.conditions || !props.filterState.extentions){
            return programs;
        }

        programs = programs.filter((program) => {
            let test = true;

            for(let i = 0; i < props.filterState.conditions.length; i ++){
                let condition = props.filterState.conditions[i];
                let extention = props.filterState.extentions[i];
                
                if(extention == ".*"){
                    continue;
                }

                if(!program[condition] || !program[condition].match(extention)){
                    test = false;

                    break;
                }
            }

            return test;
        });

        return programs;
    }, [formatProgram, props.filterState, props.filter]);

    const sortProgram = useMemo(() => {
        let programs = filteredProgram;

        if(!props.filter || !props.filterState || !props.filterState.sort){
            return programs;
        }
        
        programs = programs.sort((a, b) => {
            return b[props.filterState.sort] - a[props.filterState.sort];
        });
        
        return programs;
    }, [filteredProgram, props.filterState, props.filter]);

    const pageProgram = useMemo(() => {
        let programs = sortProgram;
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
    }, [sortProgram]);

    const pageRefs = useMemo(() => {
        let len = pageProgram.length;
        let arr = new Array();

        for(let i = 0; i < len; i ++){
            arr.push(createRef());
        }

        return arr;
    }, [pageProgram]);

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
    }, [pageProgram]);

    useEffect(() => {
        setIntersectionIndex([0]);
    }, [pageProgram]);

    return (
        <>
            <PosterBannerStyle />

            <div className="programs_section">
                {
                    (() => {
                        if(props.filter){
                            return (
                                <div className="title_section">
                                    <h1 className="title">進階篩選：{title}</h1>
                                    <div className="border_bottom"></div>
                                </div>
                            );
                        }
                        else{
                            return (
                                <div className="title_section">
                                    <div className="title">{props.searchProgram.data[0].result_type_name}</div>
                                    <div className="border_bottom"></div>
                                </div>
                            );
                        }
                    })()
                }

                <div className="programs" data-program-publish-pics-type={props.searchProgram.data[0].program_publish_pics_type}>
                    {   
                        pageProgram.map((element, index) => {
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

                                                                        <h3 className="title">{_element.title}</h3>
                                                                    </div>

                                                                    {
                                                                        (() => {
                                                                            if(_element.content_type != "ent"){
                                                                                if(_element.content_type == "movie"){
                                                                                    return (
                                                                                        <h4 className="bottom_section">{_element.simple_comment}</h4>
                                                                                    );
                                                                                }
                                                                                else if((_element.content_type == "show" || _element.content_type == "blessedlife") && props.searchProgram.data[0].program_publish_pics_type == "l"){
                                                                                    return (
                                                                                        <h4 className="bottom_section">{_element.secondary_mark}</h4>
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

                    {
                        (() => {
                            if(pageProgram.length <= 0){
                                return (
                                    <Blank contentType={props.searchProgram.data[0].content_type} />
                                );
                            }
                        })()
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .programs_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        margin-top: 20px;

                        .title_section{
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                            padding-bottom: 5px;
                            position: relative;

                            .title{
                                color: #5e0b75;
                                font-size: 25px;
                                line-height: 35px;
                                font-weight: bold;
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
                `}
            </style>
        </>
    );
};

App.propTypes = {
    filter: PropTypes.array,
    filterState: PropTypes.object,
    searchProgram: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
