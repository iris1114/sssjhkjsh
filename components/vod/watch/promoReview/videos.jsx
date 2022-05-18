
import {connect} from "react-redux";
import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide";
import _ from "lodash";

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
        if(props.resize.width <= 1023){
            return 5;
        }

        return 6;
    }, [props.resize]);
    //解決bug，el少於perview，點擊right會出現空元素
    const videos = useMemo(() => {
        if(!props.videos){
            return;
        }

        let _videos = _.cloneDeep(props.videos);
        let result = perView / _videos.length;
        
        if(result > 1){
            let maximum = parseInt(result);

            for(let i = 0; i < maximum; i ++){
                for(let j = 0; j < props.videos.length; j ++){
                    let video = props.videos[j];

                    _videos.push(video);
                }
            }
        }
        
        return _videos;
    }, [perView, props.videos]);

    useEffect(() => {
        if(!videos || videos.length <= 0){
            return;
        }

        let promoReviewVideos = document.querySelector(".promo_review_videos .glide_container");
        let promoReviewVideosComputedStyle = getComputedStyle(promoReviewVideos);
        let promoReviewVideosWidth = parseInt(promoReviewVideosComputedStyle.width);
        
        glide.current = new Glide(".promo_review_videos .glide_container", {
            type: "carousel",
            perView: perView,
            animationDuration: 300,
            rewindDuration: 300,
            gap: promoReviewVideosWidth * 0.01
        });

        glide.current.on("mount.after", () => {
            let reviewSection = document.querySelector(".promo_review_videos .glide_container");
            let glideSlides = reviewSection.querySelectorAll(".video");

            for(let i = 0; i < glideSlides.length; i ++){
                let glideSlide = glideSlides[i];

                glideSlide.addEventListener("click", (event) => {
                    event.preventDefault();

                    let target = event.target;
                    let href = target.getAttribute("href");
                    
                    while(target.tagName != "HTML"){
                        if(href){
                            break;
                        }
                        else{
                            target = target.parentNode;
                            href = target.getAttribute("href");
                        }
                    }

                    if(href){
                        router.push("/[contentType]/[contentId]", href);

                        scroll({
                            top: 0,
                            left: 0
                        });
                    }
                });
            }
        });

        glide.current.mount();

        return () => {
            glide.current.destroy();
        };
    }, [videos]);

    return (
        <>
            {
                (() => {
                    if(videos && videos.length){
                        return (
                            <div className="promo_review_videos">
                                <div className="glide_container">
                                    <div className="glide__track" data-glide-el="track">
                                        <div className="glide__slides">
                                            {
                                                videos.map((element, index) => {
                                                    return (
                                                        <div className="glide__slide" key={index}>
                                                            <a className="video" href={`/${element.content_type}/${element.content_id}?time=${element.start_time * 1000}`} title={element.title} >
                                                                <div className="poster_section">
                                                                    <div className="padding_box"></div>
                                                                    <img className="poster" src={element.picture} alt={element.title} />
                                                                </div>

                                                                <h4 className="title">{element.title}</h4>
                                                            </a>
                                                        </div>
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
                            </div>
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .promo_review_videos{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        margin-top: 10px;
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                        overflow: hidden;

                        .glide_container{
                            .glide__track{
                                position: relative;

                                &:hover{
                                    .glide__arrows{
                                        display: block;
                                    }
                                }

                                .glide__slides{
                                    white-space: nowrap;
                                    font-size: 0px;
                                    cursor: grab;

                                    &:active{
                                        cursor: grabbing;
                                    }
    
                                    .glide__slide{
                                        display: inline-block;
    
                                        .video{
                                            display: block;
                                            cursor: pointer;

                                            &:active{
                                                cursor: grabbing;
                                            }
    
                                            .poster_section{
                                                position: relative;
                                                border-radius: 5px;
                                                overflow: hidden;
                                                box-shadow: 0 2px 6px 0 rgba(150,150,150,0.5);
    
                                                .padding_box{
                                                    padding-bottom: 56.25%;
                                                }
    
                                                .poster{
                                                    display: block;
                                                    position: absolute;
                                                    top: 0px;
                                                    left: 0px;
                                                    width: 100%;
                                                    height: 100%;
                                                }
                                            }

                                            .title{
                                                height: 50px;
                                                font-weight: normal;
                                                line-height: 25px;
                                                overflow: hidden;
                                                font-size: 15px;
                                                padding-left: 5px;
                                                padding-right: 5px;
                                                white-space: normal;
                                                padding-top: 3px;
                                            }
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
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    videos: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);