
import {connect} from "react-redux";
import { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide";

import api from "../../../../assets/js/api/index.js";

import Videos from "./videos.jsx";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [promoReview, setPromoReview] = useState(null);
    const [focusIndex, setFocusIndex] = useState(-1);
    
    const glide = useRef(null);

    const focusReview = useMemo(() => {
        if(!promoReview){
            return;
        }

        return promoReview.review[focusIndex];
    }, [focusIndex, promoReview]);

    const perView = useMemo(() => {
        return 5;
    }, [props.resize]);

    const review = useMemo(() => {
        if(!promoReview){
            return;
        }

        let _review = _.cloneDeep(promoReview.review);
        let result = perView / _review.length;

        if(result > 1){
            let maximum = parseInt(result);

            for(let i = 0; i < maximum; i ++){
                for(let j = 0; j < promoReview.review.length; j ++){
                    let item = promoReview.review[j];

                    _review.push(item);
                }
            }
        }
        
        return _review;
    }, [perView, promoReview]);

    useEffect(() => {
        let unmounted = false;

        api.fino.promoReview.getFetch(props.seriesId).then((res) => {
            if(unmounted){
                return;
            }
            
            setPromoReview(res);
        });

        return () => {
            unmounted = true;
        };
    }, [props.seriesId]);

    useEffect(() => {
        if(!review){
            return;
        }

        if(review.length <= 0){
            return;
        }

        glide.current = new Glide(".review_section", {
            type: "carousel",
            perView: perView,
            animationDuration: 300,
            rewindDuration: 300,
            focusAt: "center",
            gap: 0
        });

        glide.current.on("run.after", () => {
            let reviewSection = document.querySelector(".review_section");
            let glideSlides = reviewSection.querySelectorAll(".glide__slide");
            let index = -1;

            for(let i = 0; i < glideSlides.length; i ++){
                let glideSlide = glideSlides[i];

                if(glideSlide.classList.contains("glide__slide--active")){
                    index = glideSlide.getAttribute("data-index");

                    break;
                }
            }

            setFocusIndex(index);
        });

        glide.current.mount();
        setFocusIndex(0);

        return () => {
            glide.current.destroy();
        };
    }, [review]);

    return (
        <>
            {
                (() => {
                    if(review && review.length){
                        return (
                            <section className="promo_review_section">
                                <div className="title_section">
                                    <h2 className="promo_review_title">{promoReview.title}</h2>
                                    <div className="border_bottom"></div>
                                </div>

                                <div className="review_section">
                                    <div className="glide__track" data-glide-el="track">
                                        <div className="glide__slides">
                                            {
                                                review.map((element, index) => {
                                                    return (
                                                        <button className="glide__slide" data-index={index} title={element.name} key={index}>
                                                            <div className="padding_box"></div>
                                                            <img className="img" src={element.picture} />
                                                        </button>
                                                    );
                                                })
                                            }
                                        </div>

                                        <div className="glide__arrows" data-glide-el="controls">
                                            <button className="glide__arrow glide__arrow--left" data-glide-dir="<"></button>
                                            <button className="glide__arrow glide__arrow--right" data-glide-dir=">"></button>
                                        </div>
                                    </div>
                                </div>
                                
                                {
                                    (() => {
                                        if(focusReview){
                                            return (
                                                <h3 className="review_name" dangerouslySetInnerHTML={{__html: focusReview.name}}></h3>
                                            );
                                        }
                                    })()
                                }

                                {
                                    (() => {
                                        if(focusReview){
                                            if(focusReview.video && focusReview.video.length){
                                                return (
                                                    <Videos videos={focusReview.video} />
                                                );
                                            }
                                        }
                                    })()
                                }
                            </section>
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .promo_review_section{
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

                        .review_section{
                            width: 99%;
                            margin-left: auto;
                            margin-right: auto;

                            .glide__track{
                                overflow: hidden;
                                position: relative;

                                &:hover{
                                    .glide__arrows{
                                        display: block;
                                    }
                                }

                                .glide__slides{
                                    .glide__slide{
                                        cursor: grab;

                                        &:active{
                                            cursor: grabbing;
                                        }

                                        &.glide__slide--active{
                                            .img{
                                                @keyframes review_icon_zoom{
                                                    from{
                                                        width: 70%;
                                                        height: 70%;
                                                    }
                                                    to{
                                                        width: 85%;
                                                        height: 85%;
                                                    }
                                                }

                                                animation: review_icon_zoom .5s forwards;
                                            }
                                        }

                                        position: relative;

                                        .padding_box{
                                            padding-bottom: 100%;
                                        }

                                        .img{
                                            @keyframes review_icon_shrink{
                                                from{
                                                    width: 85%;
                                                    height: 85%;
                                                }
                                                to{
                                                    width: 70%;
                                                    height: 70%;
                                                }
                                            }

                                            display: block;
                                            width: 85%;
                                            height: 85%;
                                            position: absolute;
                                            top: 50%;
                                            left: 50%;
                                            transform: translateX(-50%) translateY(-50%);
                                            border-radius: 50%;
                                            overflow: hidden;
                                            box-shadow: 0 2px 6px 0 hsla(0,0%,58.8%,.5);
                                            animation: review_icon_shrink .5s forwards;
                                        }
                                    }
                                }

                                .glide__arrows{
                                    display: none;
    
                                    .glide__arrow{
                                        position: absolute;
                                        background-image: url(${require("../../../../assets/image/swiper/swiperArrow.png")});
                                        width: 60px;
                                        height: 60px;
                                        background-size: 60px 60px;
                                        top: 50%;
    
                                        &.glide__arrow--left{
                                            left: 0px;
                                            transform: translateY(-50%);
                                        }
    
                                        &.glide__arrow--right{
                                            right: 0px;
                                            transform: translateY(-50%) rotate(180deg);
                                        }
                                    }
                                }
                            }
                        }

                        .review_name{
                            line-height: 30px;
                            font-size: 15px;
                            text-align: center;
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                        }
                    }
                `}
            </style>

            <style jsx global>
                {`
                    .review_name{
                        a{
                            color: #408ed6;
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
