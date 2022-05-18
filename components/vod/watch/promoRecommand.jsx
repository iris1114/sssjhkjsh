
import { connect } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import _ from "lodash";

import api from "../../../assets/js/api/index.js";

import Placeholder from "../../placeholder/index.jsx";
import PosterBannerStyle from "../../../assets/css/posterBanner/posterBannerStyle.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [promoRecommand, setPromoRecommand] = useState(null);

    const videos = useMemo(() => {
        if(!promoRecommand){
            return null;
        }

        let _videos = _.cloneDeep(promoRecommand.list);
        let result = 12 / _videos.length;
        
        if(result > 1){
            let maximum = parseInt(result);

            for(let i = 0; i < maximum; i ++){
                for(let j = 0; j < promoRecommand.list.length; j ++){
                    let video = promoRecommand.list[j];

                    _videos.push(video);
                }
            }
        }
        
        return _videos;
    }, [promoRecommand]);

    useEffect(() => {
        let unmounted = false;

        api.fino.promoRecommand.getFetch(props.seriesId).then((res) => {
            if(unmounted){
                return;
            }
            
            setPromoRecommand(res);
        });

        return () => {
            unmounted = true;
        };
    }, [props.seriesId]);

    return (
        <>
            <PosterBannerStyle />

            {
                (() => {
                    if(videos){
                        return (
                            <div className="promo_recommand_section">
                                <div className="title_section">
                                    <h2 className="promo_review_title">{promoRecommand.title}</h2>
                                    <div className="border_bottom"></div>
                                </div>

                                <div className="content_items">
                                    {
                                        videos.slice(0, 12).map((element, index) => {
                                            return (
                                                <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`} key={index}>
                                                    <a className="content_item" title={element.title}>
                                                        <div className="poster_section">
                                                            <div className="padding_box"></div>

                                                            <LazyLoad placeholder={<Placeholder type="portrait" alt={element.title} />}>
                                                                <img className="poster" src={element.picture} alt={element.title} />
                                                            </LazyLoad>

                                                            {
                                                                element.poster_banners.map((_element, _index) => {
                                                                    return (
                                                                        <span className="poster_banner_poster_icon" data-poster-banner={_element} key={_index}></span>
                                                                    );
                                                                })
                                                            }
                                                        </div>

                                                        <div className="des_section">
                                                            {
                                                                (() => {
                                                                    if(element.score){
                                                                        return (
                                                                            <span className="score">{element.score}</span>
                                                                        );
                                                                    }
                                                                })()
                                                            }

                                                            <h3 className="title">{element.title}</h3>
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

            <style jsx>
                {`
                    .promo_recommand_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        margin-top: 20px;

                        .title_section{
                            overflow: hidden;
                            display: block;
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                            padding-bottom: 5px;
                            position: relative;

                            .promo_review_title{
                                color: #5e0b75;
                                font-size: 25px;
                                line-height: 35px;
                                font-weight: bold;
                            }

                            .border_bottom{
                                position: absolute;
                                left: 50%;
                                bottom: 0px;
                                width: 99%;
                                height: 1px;
                                background-color: #ccc;
                                transform: translateX(-50%);
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

                                &:nth-child(n + 13){
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
                                }

                                .des_section{
                                    position: relative;
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
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    seriesId: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
