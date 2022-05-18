
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide";

import Banner from "../../banner/index.jsx";
import Placeholder from "../../placeholder/index.jsx";
import PromoteBanner from "./banner.jsx";

import tools from "../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const router = useRouter();
    const glide = useRef(null);

    const perView = useMemo(() => {
        return 7;
    }, [props.resize]);

    const arrowDisplayClass = useMemo(() => {
        if(props.introduction.categories.length <= perView){
            return "none";
        }
        else{
            return "";
        }
    }, [props.introduction, perView]);

    const defaultListFocus = useMemo(() => {
        let category = "";

        if(process.title == "node"){
            category = router.query.category;
        }
        else{
            category = tools.url.getQuery(location.href, "category");
        }

        if(category){
            category = decodeURIComponent(category);

            for(let i = 0; i < props.introduction.categories.length; i ++){
                if(category == props.introduction.categories[i].eng_name){
                    return i;
                }
            }
        }
        
        for(let i = 0; i < props.introduction.categories.length; i ++){
            if(props.introduction.categories[i].eng_name == "News & Finance"){
                return i;
            }
        }

        return 0;
    }, [props.introduction]);

    const [listFocus, setListFocus] = useState(defaultListFocus);

    const channels = useMemo(() => {
        return props.introduction.categories[listFocus].channels;
    }, [listFocus]);

    const arrowClickHandler = useCallback((event, dir) => {
        if(!glide.current){
            return;
        }

        glide.current.go(dir);
    }, []);

    const listBtnClickHandler = useCallback((event, index) => {
        event.preventDefault();
        setListFocus(index);
    }, []);

    const getListBtnFocus = useCallback((index) => {
        if(index == listFocus){
            return "focus";
        }

        return "";
    }, [listFocus]);

    const getListBtnHref = useCallback((element) => {
        return `/channel?category=${encodeURIComponent(element.eng_name)}`;
    }, [props.introduction]);

    useEffect(() => {
        glide.current = new Glide(".channel_categories_tab_list", {
            perView: perView,
            bound: true,
            dragThreshold: false,
            animationDuration: 100,
            rewindDuration: 100,
            gap: 1
        });

        glide.current.mount();

        return () => {
            glide.current.destroy();
        };
    }, [props.introduction, perView]);

    useEffect(() => {
        setListFocus(defaultListFocus);
    }, [props.introduction, perView]);

    useEffect(() => {
        let perView = glide.current.settings.perView;
        let max = props.introduction.categories.length - perView;
        let startAt = Math.floor(defaultListFocus - perView / 2 + 1);
        
        if(startAt >= max){
            startAt = max;
        }

        if(startAt <= 0){
            startAt = 0;
        }
        
        glide.current.go(`=${startAt}`);
    }, [props.introduction]);

    useEffect(() => {
        let name = props.introduction.categories[listFocus].eng_name;
        let href = tools.url.replaceQuery(location.href, "category", encodeURIComponent(name));

        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, document.title, href);
    }, [listFocus]);

    return (
        <>
            <h1 className="ssr_only">LiTV立視線上影視-400台電視直播線上看</h1>
            <Banner banner={props.banner} />
            
            <section className="channel_home_section">
                <div className="glide_section">
                    <button className={`glide_arrow left ${arrowDisplayClass}`} data-glide-dir="<" onClick={(event) => arrowClickHandler(event, "<")}>
                        <img className="icon" src={`${require("../../../assets/image/icon/arrow_black.svg")}`} alt="arrow" />
                    </button>

                    <button className={`glide_arrow right ${arrowDisplayClass}`} data-glide-dir=">" onClick={(event) => arrowClickHandler(event, ">")}>
                        <img className="icon" src={`${require("../../../assets/image/icon/arrow_black.svg")}`} alt="arrow" />
                    </button>

                    <div className="channel_categories_tab_list">
                        <div className="glide__track" data-glide-el="track">
                            <div className="glide__slides">
                                {
                                    props.introduction.categories.map((element, index) => {
                                        return (
                                            <a className={`glide__slide ${getListBtnFocus(index)}`} href={getListBtnHref(element)} onClick={(event) => listBtnClickHandler(event, index)} title={element.name} key={index}>
                                                <span className="text">{element.name}</span>
                                            </a>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="channel_categories_tab_pane">
                    <h2 className="ssr_only">{props.introduction.categories[listFocus].name}</h2>

                    {
                        channels.map((element, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className="channel_section">
                                        <Link href="/channel/watch" as={`/channel/watch?contentId=${element.cdn_code}`} >
                                            <a className="picture_section" title={element.title}>
                                                <div className="padding_box"></div>

                                                <LazyLoad placeholder={<Placeholder type="landscape" alt={element.title} />}>
                                                    <img className="picture" src={element.picture} alt={element.title} />
                                                </LazyLoad>
                                            </a>
                                        </Link>

                                        <div className="desc_section">
                                            <div className="title_section">
                                                <Link href="/channel/watch" as={`/channel/watch?contentId=${element.cdn_code}`} >
                                                    <a className="link" title={element.title}>
                                                        <h3 className="ssr_only">{element.title}</h3>
                                                        <div className="text">{`${element.no} ${element.title}`}</div>

                                                        {
                                                            (() => {
                                                                if(element.quality == "HD"){
                                                                    return (
                                                                        <span className="hd_icon"></span>
                                                                    );
                                                                }
                                                            })()
                                                        }
                                                    </a>
                                                </Link>
                                            </div>

                                            <div className="segment"></div>
                                            <h4 className="desc">{element.description}</h4>

                                            <div className="copyright_section">
                                                <div className="title">授權平台：</div>

                                                <div className="content">
                                                    {
                                                        element.copyright.map((_element, _index) => {
                                                            if(_element == "PC"){
                                                                return (
                                                                    <img className="icon" src={require("../../../assets/image/device/pc.svg")} alt="pc" key="pc" />
                                                                );
                                                            }
                                                            else if(_element == "PHONE"){
                                                                return (
                                                                    <img className="icon" src={require("../../../assets/image/device/phone.svg")} alt="phone" key="phone" />
                                                                );
                                                            }
                                                            else if(_element == "PAD"){
                                                                return (
                                                                    <img className="icon" src={require("../../../assets/image/device/pad.svg")} alt="pad" key="pad" />
                                                                );
                                                            }
                                                            else if(_element == "TV"){
                                                                return (
                                                                    <img className="icon" src={require("../../../assets/image/device/tv.svg")} alt="tv" key="tv" />
                                                                );
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="promote_program_section">
                                            <h4 className="title">推薦節目</h4>
                                            <div className="segment"></div>
                                            
                                            <div className="poster_section">
                                                {
                                                    element.showcase.map((_element, _index) => {
                                                        return (
                                                            <Link href="/channel/watch" as={`/channel/watch?contentId=${element.cdn_code}`} key={_index}>
                                                                <a className="poster" title={_element.title} >
                                                                    <div className="img_section">
                                                                        <div className="padding_box"></div>

                                                                        <LazyLoad placeholder={<Placeholder type="landscape" alt={_element.title} />}>
                                                                            <img className="picture" src={_element.picture} alt={_element.title} />
                                                                        </LazyLoad>
                                                                    </div>

                                                                    <h5 className="title">{_element.title}</h5>
                                                                </a>
                                                            </Link>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        (() => {
                                            if(index < channels.length - 1){
                                                return (
                                                    <div className="segment"></div>
                                                );
                                            }
                                        })()
                                    }
                                </React.Fragment>
                            );
                        })
                    }
                </div>
            </section>
            
            <PromoteBanner banner={props.introduction.promote} />

            <div className="promote_link_section">
                <Link href="/service" as="/service">
                    <a className="link" title="多螢裝置">
                        <img className="icon" src={require("../../../assets/image/channel/icon_multi_device.png")} alt="多螢裝置" />
                        <div className="text">多螢裝置</div>
                        <div className="more">了解更多 》</div>
                    </a>
                </Link>

                <Link href="/purchase" as="/purchase">
                    <a className="link" title="立即購買">
                        <img className="icon" src={require("../../../assets/image/channel/icon_buy.png")} alt="立即購買" />
                        <div className="text">立即購買</div>
                        <div className="more">了解更多 》</div>
                        <div className="segement left"></div>
                        <div className="segement right"></div>
                    </a>
                </Link>

                <Link href="/channel/watch" as="/channel/watch">
                    <a className="link" title="頻道免費體驗7天">
                        <img className="icon" src={require("../../../assets/image/channel/icon_free.png")} alt="頻道免費體驗7天" />
                        <div className="text">頻道免費體驗7天</div>
                        <div className="more">了解更多 》</div>
                    </a>
                </Link>
            </div>

            <style jsx>
                {`
                    .channel_home_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        margin-top: 20px;
                        padding-left: 0.5%;
                        padding-right: 0.5%;

                        .glide_section{
                            border-top-left-radius: 4px;
                            border-top-right-radius: 4px;
                            border-top: 1px solid #ccc;
                            border-left: 1px solid #ccc;
                            border-right: 1px solid #ccc;
                            user-select: none;
                            overflow: hidden;
                            background-color: #ccc;

                            .glide_arrow{
                                width: 35px;
                                height: 35px;
                                position: relative;
                                background-image: -webkit-linear-gradient(90deg,#e6e6e6,#f6f6f6);
    
                                &.left{
                                    float: left;
                                    border-right: 1px solid #ccc;
    
                                    .icon{
                                        transform: translateX(-50%) translateY(-50%) rotate(180deg);
                                    }
                                }
    
                                &.right{
                                    float: right;
                                    border-left: 1px solid #ccc;
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

                            .channel_categories_tab_list{
                                overflow: hidden;

                                .glide__track{
                                    .glide__slides{
                                        white-space: nowrap;
                                        font-size: 0px;
                                        width: 100%;
    
                                        .glide__slide{
                                            background-color: #ccc;
                                            padding-left: 5px;
                                            padding-right: 5px;
                                            touch-action: none;
                                            display: inline-block;
                                            width: 16.66%;
                                            cursor: pointer;
                                            border-bottom: 1px solid #ccc;
                                            background-image: -webkit-linear-gradient(90deg,#e6e6e6,#f6f6f6);
                                            position: relative;
    
                                            &.focus{
                                                background-image: none;
                                                background-color: #fff;
                                                color: #408ed6;
                                                border-bottom: 1px solid #fff;
                                            }

                                            .text{
                                                display: block;
                                                font-size: 15px;
                                                line-height: 35px;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                overflow: hidden;
                                                text-align: center;
                                                font-weight: bold;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        .channel_categories_tab_pane{
                            padding-top: 20px;
                            padding-bottom: 20px;
                            padding-left: 10px;
                            padding-right: 10px;
                            border-left: 1px solid #ccc;
                            border-right: 1px solid #ccc;
                            border-bottom: 1px solid #ccc;
                            border-bottom-left-radius: 4px;
                            border-bottom-right-radius: 4px;
                            overflow: hidden;

                            .channel_section{
                                overflow: hidden;

                                .picture_section{
                                    float: left;
                                    width: 33.33%;
                                    position: relative;
                                    display: block;

                                    @media screen and (max-width: 1023px) {
                                        width: 100%;
                                        float: none;
                                    }

                                    .padding_box{
                                        padding-bottom: 56.25%;
                                    }

                                    .picture{
                                        display: block;
                                        position: absolute;
                                        top: 0px;
                                        left: 0px;
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 5px;
                                        overflow: hidden;
                                        box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);
                                    }
                                }

                                .desc_section{
                                    float: left;
                                    width: 33.33%;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    overflow: hidden;

                                    @media screen and (max-width: 1023px) {
                                        width: 100%;
                                        float: none;
                                        padding-left: 0px;
                                        padding-right: 0px;
                                        margin-top: 10px;
                                    }

                                    .title_section{
                                        overflow: hidden;

                                        .link{
                                            display: block;
                                            max-width: 100%;
                                            position: relative;
                                            padding-right: 25px;
                                            overflow: hidden;
                                            float: left;

                                            .text{
                                                font-size: 25px;
                                                line-height: 40px;
                                                color: #5e0b75;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                overflow: hidden;
                                                height: 40px;
                                                font-weight: bold;
                                            }

                                            .hd_icon{
                                                position: absolute;
                                                right: 0;
                                                top: 0;
                                                width: 25px;
                                                height: 40px;
                                                background-repeat: no-repeat;
                                                background-position-x: 100%;
                                                background-position-y: center;
                                                background-image: url(${require("../../../assets/image/channel/hd_icon.png")})
                                            }
                                        }
                                    }

                                    & > .segment{
                                        background-color: #ccc;
                                        height: 1px;
                                        margin-top: 10px;
                                    }

                                    .desc{
                                        margin-top: 10px;
                                        font-size: 15px;
                                        line-height: 30px;
                                        color: #666;
                                    }

                                    .copyright_section{
                                        height: 40px;
                                        position: relative;
                                        overflow: hidden;
                                        margin-top: 20px;

                                        @media screen and (max-width: 1023px) {
                                            margin-top: 0px;
                                        }

                                        .title{
                                            float: left;
                                            font-size: 15px;
                                            line-height: 40px;
                                        }

                                        .content{
                                            overflow: hidden;
                                            position: relative;
                                            height: 100%;

                                            .icon{
                                                float: left;
                                                width: 25px;
                                                height: 25px;
                                                display: block;
                                                position: relative;
                                                top: 50%;
                                                transform: translateY(-50%);
                                            }
                                        }
                                    }
                                }

                                .promote_program_section{
                                    overflow: hidden;

                                    @media screen and (max-width: 1023px) {
                                        margin-top: 10px;
                                    }

                                    & > .title{
                                        font-size: 20px;
                                        line-height: 40px;
                                        color: #408ed6;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        height: 40px;
                                        font-weight: bold;
                                    }

                                    & > .segment{
                                        background-color: #ccc;
                                        height: 1px;
                                        margin-top: 10px;
                                    }

                                    .poster_section{
                                        overflow: hidden;

                                        .poster{
                                            width: calc(50% - 5px);
                                            float: left;
                                            margin-top: 10px;
                                            margin-bottom: 10px;

                                            &:nth-of-type(odd){
                                                margin-right: 10px;
                                            }

                                            .img_section{
                                                position: relative;
                                                border-radius: 5px;
                                                overflow: hidden;
                                                box-shadow: 0 2px 6px 0 rgba(150,150,150,0.5);

                                                .padding_box{
                                                    padding-bottom: 56.25%;
                                                }

                                                .picture{
                                                    position: absolute;
                                                    display: block;
                                                    top: 0px;
                                                    left: 0px;
                                                    width: 100%;
                                                    height: 100%;
                                                }
                                            }

                                            .title{
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
                                }
                            }

                            & > .segment{
                                background-color: #666;
                                height: 1px;
                                margin-top: 20px;
                                margin-bottom: 20px;
                            }
                        }
                    }

                    .promote_link_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        margin-top: 20px;
                        padding-bottom: 20px;

                        .link{
                            width: 33.33%;
                            float: left;
                            position: relative;

                            .icon{
                                display: block;
                                width: 80px;
                                height: 65px;
                                margin-left: auto;
                                margin-right: auto;
                            }

                            .text{
                                font-size: 20px;
                                line-height: 30px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                height: 30px;
                                font-weight: bold;
                                text-align: center;
                            }

                            .more{
                                font-size: 15px;
                                line-height: 25px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                height: 25px;
                                text-align: center;
                                color: #408ed6;
                                text-decoration: underline;
                            }

                            .segement{
                                position: absolute;
                                width: 1px;
                                height: 100%;
                                top: 0px;
                                background-color: #ccc;

                                &.left{
                                    left: 0px;
                                }

                                &.right{
                                    right: 0px;
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
    banner: PropTypes.array.isRequired,
    introduction: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
