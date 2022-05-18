
import React, { useMemo, useCallback, useRef } from "react";
import { connect } from "react-redux";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import _ from "lodash";
import PropTypes from "prop-types";

import Placeholder from "../../placeholder/index.jsx";
import ShareBalloon from "./shareBalloon.jsx";

import seo from "../../../assets/js/seo/index.js";
import watch from "../../../assets/js/watch/index.js";

const mapStateToProps = (state) => {
    return {
        shareBalloonTrigger: state.vod.watch.shareBalloonTrigger
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchProgramInfo: (programInfo) => {
            dispatch({
                type: "vod/watch/programInfo",
                value: programInfo
            });
        },
        dispatchShareBalloonTrigger: (element) => {
            dispatch({
                type: "vod/watch/shareBalloonTrigger",
                value: element
            });
        }
    };
};

const App = (props) => {
    const shareBtnRef = useRef(null);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const parentalControl = useMemo(() => {
        let list = props.programInfo.parental_control;

        if(!list){
            return "";
        }
        else{
            let arr = new Array();

            for(let i = 0; i < list.length; i ++){
                let item = list[i];

                arr.push(item.name);
            }

            return arr.join("、");
        }
    }, [props.programInfo]);

    const playBtnDisplay = useMemo(() => {
        if(watch.vod.entryPoint(props.programInfo)){
            return false;
        }

        return true;
    }, [props.programInfo]);

    const continuePlayBtnDisplay = useMemo(() => {
        if(watch.vod.entryPoint(props.programInfo)){
            return false;
        }

        if(props.programInfo.accountVar){
            if(props.programInfo.accountVar.content_id == props.programInfo.content_id){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }, [props.programInfo]);

    const playClickHandler = useCallback(() => {
        let programInfo = _.cloneDeep(props.programInfo);

        programInfo.time = 0;
        
        props.dispatchProgramInfo(programInfo);

        scroll({
            top: 0,
            left: 0
        });
    }, [props.programInfo]);

    const continuePlayClickHandler = useCallback(() => {
        let programInfo = _.cloneDeep(props.programInfo);

        programInfo.time = programInfo.accountVar.time;
        
        props.dispatchProgramInfo(programInfo);

        scroll({
            top: 0,
            left: 0
        });
    }, [props.programInfo]);

    const shareBtnMouseOverHandler = useCallback(() => {
        props.dispatchShareBalloonTrigger(shareBtnRef.current);
    }, []);

    return (
        <>
            <section className="detail_section">
                <h2 className="ssr_only">影片資訊</h2>

                <div className="left_section">
                    <div className="poster_section">
                        <div className="padding_box">
                            <LazyLoad placeholder={<Placeholder type="portrait" alt={seo.vod.watch.getTitle(props.programInfo, props.seoDictionary)} />}>
                                <img className="poster" src={`${cdnstatic}/${props.programInfo.picture}`} alt={seo.vod.watch.getTitle(props.programInfo, props.seoDictionary)} />
                            </LazyLoad>
                        </div>

                        {
                            (() => {
                                if(props.programInfo.off_shelf_date){
                                    return (
                                        <div className="off_shelf_date">下架日期：{props.programInfo.off_shelf_date}</div>
                                    );
                                }
                            })()
                        }
                    </div>

                    <div className="social_score_Section">
                        <div className="fb-like" data-href="https://www.facebook.com/LiTVfans?fref=ts" data-send="false" data-width="150" data-show-faces="false" data-layout="button_count"></div>
                        
                        <a className="line_btn" href="http://bit.ly/2ROGn0C" target="_blank" title="加入line好友">
                            <LazyLoad placeholder={<Placeholder type="landscape" alt="加入line好友" />}>
                                <img className="img" src={require("../../../assets/image/footer/line/add.png")} alt="加入line好友" />
                            </LazyLoad>
                        </a>

                        {
                            (() => {
                                if(props.programInfo.score){
                                    return (
                                        <span className="score">{props.programInfo.score}</span>
                                    );
                                }
                            })()
                        }
                    </div>
                </div>

                <div className="right_section">
                    <div className="title">{props.programInfo.title}</div>
                    <div className="secondary_mark">{props.programInfo.secondary_mark}</div>
                    
                    {
                        (() => {
                            if(props.programInfo.is_series && props.programInfo.display_count){
                                return (
                                    <div className="display_count">{props.programInfo.display_count}</div>
                                );
                            }
                        })()
                    }

                    <div className="segment"></div>

                    {
                        (() => {
                            if(props.programInfo.original_date){
                                return (
                                    <div className="detail date short">
                                        <div className="title">首播日期：</div>
                                        <div className="content">{props.programInfo.original_date}</div>
                                    </div>
                                );
                            }
                        })()
                    }

                    {
                        (() => {
                            if(props.programInfo.release_year){
                                return (
                                    <div className="detail year short">
                                        <h3 className="ssr_only">年份</h3>
                                        <div className="title">年份：</div>

                                        <div className="content">
                                            <Link href={`/[contentType]/searchProgram?releaseYear=${props.programInfo.release_year}`} as={`/${props.programInfo.content_type}/searchProgram?releaseYear=${props.programInfo.release_year}`}>
                                                <h4 className="link" title={props.programInfo.release_year}>{props.programInfo.release_year}</h4>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            }
                        })()
                    }

                    {
                        (() => {
                            if(props.programInfo.film_length != "0"){
                                return (
                                    <div className="detail film_length short">
                                        <h3 className="ssr_only">片長</h3>
                                        <div className="title">片長：</div>
                                        <h4 className="content">{`${props.programInfo.film_length}分鐘`}</h4>
                                    </div>
                                );
                            }
                        })()
                    }

                    {   
                        (() => {
                            if(props.programInfo.countries && props.programInfo.countries.length){
                                return (
                                    <div className="detail country short">
                                        <h3 className="ssr_only">國別</h3>
                                        <div className="title">國別：</div>

                                        <div className="content">
                                            {
                                                props.programInfo.countries.map((item, index) => {
                                                    return (
                                                        <React.Fragment key={index} >
                                                            <Link href={`/[contentType]/searchProgram?countryId=${item.id}`} as={`/${props.programInfo.content_type}/searchProgram?countryId=${item.id}`}>
                                                                <h4 className="link" title={item.name}>{item.name}</h4>
                                                            </Link>

                                                            {
                                                                (() => {
                                                                    if(index < props.programInfo.countries.length - 1){
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
                            }
                        })()
                    }

                    {
                        (() => {
                            if(props.programInfo.rating){
                                return (
                                    <div className="detail rating short">
                                        <h3 className="ssr_only">級別</h3>
                                        <div className="title">級別：</div>

                                        <div className="content">
                                            {
                                                (() => {
                                                    if(props.programInfo.rating.age >= 18){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/rating/18.jpg")} alt="18" />
                                                        );
                                                    }
                                                    else if(props.programInfo.rating.age >= 15){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/rating/15.jpg")} alt="15" />
                                                        );
                                                    }
                                                    else if(props.programInfo.rating.age >= 12){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/rating/12.jpg")} alt="12" />
                                                        );
                                                    }
                                                    else if(props.programInfo.rating.age >= 6){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/rating/6.jpg")} alt="18" />
                                                        );
                                                    }
                                                    else{
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/rating/0.jpg")} alt="0" />
                                                        );
                                                    }
                                                })()
                                            }

                                            <h4 className="name">{props.programInfo.rating.name}</h4>
                                        </div>
                                    </div>
                                );
                            }
                        })()
                    }

                    {
                        (() => {
                            if(Array.isArray(props.programInfo.pronunciation) && props.programInfo.pronunciation.length){
                                return (
                                    <div className="detail pronunciation short">
                                        <h3 className="ssr_only">發音</h3>
                                        <div className="title">發音：</div>

                                        <div className="content">
                                            {
                                                props.programInfo.pronunciation.map((item, index) => {
                                                    return (
                                                        <React.Fragment key={index} >
                                                            <h4 className="name">{item.name}</h4>

                                                            {
                                                                (() => {
                                                                    if(index < props.programInfo.pronunciation.length - 1){
                                                                        return (
                                                                            <h4 className="comma">、</h4>
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
                            }
                        })()
                    }

                    {
                        (() => {
                            if(props.programInfo.copyright){
                                return (
                                    <div className="detail copyright short">
                                        <div className="title">授權平台：</div>

                                        <div className="content">
                                            {
                                                props.programInfo.copyright.map((item, index) => {
                                                    if(item == "PC"){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/device/pc.svg")} alt="pc" key="pc" />
                                                        );
                                                    }
                                                    else if(item == "PHONE"){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/device/phone.svg")} alt="phone" key="phone" />
                                                        );
                                                    }
                                                    else if(item == "PAD"){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/device/pad.svg")} alt="pad" key="pad" />
                                                        );
                                                    }
                                                    else if(item == "TV"){
                                                        return (
                                                            <img className="icon" src={require("../../../assets/image/device/tv.svg")} alt="tv" key="tv" />
                                                        );
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                );
                            }
                        })()
                    }

                    <div className="detail genre">
                        <h3 className="ssr_only">類別</h3>
                        <div className="title">類別：</div>

                        <div className="content">
                            {
                                props.programInfo.genres.map((item, index) => {
                                    return (
                                        <React.Fragment key={index} >
                                            <Link href={`/[contentType]/searchProgram?genreId=${item.id}`} as={`/${props.programInfo.content_type}/searchProgram?genreId=${item.id}`}>
                                                <h4 className="link" title={item.name}>{item.name}</h4>
                                            </Link>

                                            {
                                                (() => {
                                                    if(index < props.programInfo.genres.length - 1){
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

                    {
                        props.programInfo.credits.map((item, index) => {
                            return (
                                <div className="detail credits" key={`credits${index}`}>
                                    <h3 className="ssr_only">{item.type_name}</h3>
                                    <div className="title">{`${item.type_name}：`}</div>

                                    <div className="content">
                                        {
                                            item.list.map((_item, _index) => {
                                                return (
                                                    <React.Fragment key={_index} >
                                                        <Link href={`/search?query=${encodeURIComponent(_item.name)}`} as={`/search?query=${encodeURIComponent(_item.name)}`}>
                                                            <h4 className="link" title={_item.name}>{_item.name}</h4>
                                                        </Link>
            
                                                        {
                                                            (() => {
                                                                if(_index < item.list.length - 1){
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
                    <h3 className="ssr_only">簡介</h3>
                    <h4 className="detail description">{props.programInfo.description}</h4>

                    {
                        (() => {
                            if(props.programInfo.awards){
                                return (
                                    <div className="detail awards">
                                        <img className="icon" src={require("../../../assets/image/icon/award.png")} alt="awards" />
                                        <span className="text">{props.programInfo.awards}</span>
                                    </div>
                                );
                            }
                        })()
                    }

                    <div className="detail control">
                        {
                            (() => {
                                if(playBtnDisplay){
                                    return (
                                        <button className="play_btn" onClick={playClickHandler} title="從頭播放">
                                            <span className="icon"></span>
                                            <span className="text">從頭播放</span>
                                        </button>
                                    );
                                }
                            })()
                        }

                        {
                            (() => {
                                if(continuePlayBtnDisplay){
                                    return (
                                        <button className="play_btn" onClick={continuePlayClickHandler} title="繼續播放">
                                            <span className="icon"></span>
                                            <span className="text">繼續播放</span>
                                        </button>
                                    );
                                }
                            })()
                        }

                        <button className="share_btn" ref={shareBtnRef} onMouseOver={shareBtnMouseOverHandler}>
                            <span className="icon"></span>
                            <span className="text">分享</span>
                        </button>

                        {
                            (() => {
                                if(parentalControl){
                                    return (
                                        <div className="parental_control_section">
                                            <span className="title">※此內容含有：</span>
                                            <span className="content">{parentalControl}</span>
                                        </div>
                                    );
                                }
                            })()
                        }
                    </div>
                </div>

                {
                    (() => {
                        if(props.shareBalloonTrigger){
                            return (
                                <ShareBalloon programInfo={props.programInfo} />
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .detail_section{
                        overflow: hidden;
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                        margin-top: 20px;

                        .left_section{
                            float: left;
                            width: 20%;

                            @media screen and (max-width: 1023px) {
                                width: 25%;
                            }

                            .poster_section{
                                border-radius: 5px;
                                overflow: hidden;
                                box-shadow: 0 2px 6px 0 rgba(150,150,150,0.5);

                                .padding_box{
                                    position: relative;
                                    padding-bottom: 143.33%;

                                    .poster{
                                        position: absolute;
                                        width: 100%;
                                        height: 100%;
                                        top: 0px;
                                        left: 0px;
                                        display: block;
                                    }
                                }

                                .off_shelf_date{
                                    font-size: 15px;
                                    line-height: 25px;
                                    text-align: center;
                                    color: #fff;
                                    background-color: #ff4339;
                                }
                            }

                            .social_score_Section{
                                height: 40px;
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                align-items: center;

                                .fb-like{
                                    height: 20px;
                                    overflow: hidden;
                                    line-height: 0px;
                                }

                                .line_btn{
                                    width: 85px;
                                    height: 20px;
                                    position: relative;
                                    display: block;

                                    .img{
                                        position: aboslute;
                                        top: 0px;
                                        height: 0px;
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                .score{
                                    font-size: 20px;
                                    color: #f60;
                                    line-height: 30px;
                                    height: 30px;
                                }
                            }
                        }

                        .right_section{
                            overflow: hidden;
                            padding-left: 10px;

                            & > .title{
                                font-size: 25px;
                                line-height: 40px;
                                font-weight: bold;
                            }

                            .secondary_mark{
                                font-size: 20px;
                                line-height: 40px;
                                font-weight: bold;
                            }

                            .display_count{
                                color: #666;
                                font-size: 15px;
                                line-height: 30px;
                            }

                            .segment{
                                width: 100%;
                                height: 1px;
                                background-color: #ccc;
                                margin-top: 10px;
                                margin-bottom: 10px;
                            }

                            .detail{
                                float: left;
                                width: 100%;
                                overflow: hidden;
                                position: relative;
                                font-size: 15px;
                                line-height: 40px; 

                                &.short{
                                    width: 33.33%;
                                    height: 40px;
                                }

                                &.rating{
                                    .content{
                                        .icon{
                                            float: left;
                                            width: 25px;
                                            height: 25px;
                                            display: block;
                                            position: relative;
                                            top: 50%;
                                            transform: translateY(-50%);
                                        }

                                        .name{
                                            margin-left: 5px;
                                        }
                                    }
                                }

                                &.copyright{
                                    .content{
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

                                &.description{
                                    margin-top: 10px;
                                    line-height: 30px; 
                                }

                                &.awards{
                                    margin-top: 10px;
                                    border: 1px solid #ccc;
                                    border-radius: 5px;
                                    padding: 10px;
                                    display: flex;
                                    align-items: center;

                                    .icon{
                                        display: block;
                                    }

                                    .text{
                                        display: block;
                                        padding-left: 10px;
                                        line-height: 30px;
                                    }
                                }

                                &.control{
                                    margin-top: 10px;

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
                                        margin-right: 10px;

                                        .icon{
                                            width: 14px;
                                            height: 14px;
                                            background-image: url(${require("../../../assets/image/icon/arrow_white.svg")});
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

                                    .share_btn{
                                        float: left;
                                        display: flex;
                                        height: 40px;
                                        flex-direction: row;
                                        padding-left: 15px;
                                        padding-right: 15px;
                                        justify-content: center;
                                        align-items: center;
                                        margin-right: 10px;

                                        .icon{
                                            width: 20px;
                                            height: 20px;
                                            background-image: url(${require("../../../assets/image/icon/share_orange.svg")});
                                            background-size: cover;
                                            display: block;
                                        }

                                        .text{
                                            padding-left: 5px;
                                            font-size: 15px;
                                            display: block;
                                            color: #f60;
                                        }
                                    }

                                    .parental_control_section{
                                        float: left;
                                        display: flex;
                                        height: 40px;
                                        flex-direction: row;
                                        justify-content: center;
                                        align-items: center;

                                        .title{
                                            font-size: 15px;
                                            line-height: 30px;
                                            color: #ff4339;
                                        }

                                        .content{
                                            font-size: 15px;
                                            line-height: 30px;
                                            height: auto;
                                        }
                                    }
                                }

                                .title{
                                    float: left; 
                                }

                                .content{
                                    overflow: hidden;
                                    position: relative;
                                    height: 100%;
                                    
                                    .link{
                                        display: block;
                                        line-height: 40px; 
                                        float: left;
                                        color: #408ed6;
                                        cursor: pointer;
                                    }

                                    .comma{
                                        display: block;
                                        line-height: 40px; 
                                        float: left;
                                    }

                                    .name{
                                        display: block;
                                        line-height: 40px; 
                                        float: left;
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
    programInfo: PropTypes.object.isRequired,
    seoDictionary: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
