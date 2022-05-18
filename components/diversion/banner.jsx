
import { connect } from "react-redux";
import { useEffect, useRef, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide";
import LazyLoad from "lazyload";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const glide = useRef(null);

    const cdnStatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const banner = useMemo(() => {
        let _banner = props.meta.pc;

        if(_banner.banner_type == "pics"){
            if(_banner.data.length <= 0){
                return null;
            }
        }
        else{
            if(!_banner.data){
                return null;
            }
        }

        return _banner;
    }, [props.meta]);

    const getHTML = useCallback((data) => {
        let html = data.replace(/\\"/g, "\"");

        return {
            __html: html
        };
    }, []);

    useEffect(() => {
        if(!banner){
            return;
        }

        if(banner.banner_type != "pics"){
            return;
        }

        glide.current = new Glide(".banner_section", {
            type: "carousel",
            autoplay: 5000,
            gap: 0,
            classes: {
                activeNav: "banner_bullet_active"
            }
        });

        glide.current.mount();

        let images = document.querySelectorAll(".banner_section .banner_img");

        new LazyLoad(images, {
            root: null,
            rootMargin: "0px",
            threshold: 0
        });

        return () => {
            glide.current.destroy();
        };
    }, [banner]);

    return (
        <>
            {
                (() => {
                    if(banner){
                        return (
                            <div className="banner_section">
                                {
                                    (() => {
                                        if(banner.banner_type == "text"){
                                            return (
                                                <div className="banner_container">
                                                    <div className="banner_text" dangerouslySetInnerHTML={getHTML(banner.data)}></div>
                                                </div>
                                            );
                                        }
                                        else{
                                            return (
                                                <div className="banner_container glide__track" data-glide-el="track">
                                                    <div className="banner_items glide__slides">
                                                        {
                                                            banner.data.map((item, index) => {
                                                                return (
                                                                    <a className="banner_item glide__slide" href={item.url} target={item.url_target} key={index}>
                                                                        <div className="padding_box"></div>
                                                                        <img className="banner_img" width="1120" height="138" data-src={`${cdnStatic}${item.picture}`} src={require("../../assets/image/poster/default/posterLandscape.svg")} />
                                                                    </a>
                                                                );
                                                            })
                                                        }
                                                    </div>

                                                    <div className="banner_arrows" data-glide-el="controls">
                                                        <button className="banner_arrow left" data-glide-dir="<" title="上一個"></button>
                                                        <button className="banner_arrow right" data-glide-dir=">" title="下一個"></button>
                                                    </div>

                                                    <div className="banner_bullets glide__bullets" data-glide-el="controls[nav]">
                                                        {
                                                            banner.data.map((item, index) => {
                                                                return (
                                                                    <button className="banner_bullet glide__bullet" data-glide-dir={`=${index}`} title={index} key={index}>
                                                                        <i className="icon"></i>
                                                                    </button>
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
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .banner_section{
                        background-color: #fff;
                        margin-top: 30px;
                        margin-bottom: 15px;

                        &:hover{
                            .banner_container{
                                .banner_arrows{
                                    display: block;
                                }
                            }
                        }

                        .banner_container{
                            position: relative;
                            overflow: hidden;

                            .banner_text{
                                display: table;
                                margin-left: auto;
                                margin-right: auto;
                            }

                            .banner_items{
                                white-space: nowrap;
                                font-size: 0px;

                                .banner_item{
                                    width: 100%;
                                    display: inline-block;
                                    touch-action: none;
                                    position: relative;

                                    .padding_box{
                                        padding-bottom: 12.32%;
                                    }

                                    .banner_img{
                                        display: block;
                                        position: absolute;
                                        width: 100%;
                                        height: 100%;
                                        top: 0px;
                                        left: 0px;
                                    }
                                }
                            }

                            .banner_arrows{
                                display: none;

                                .banner_arrow{
                                    position: absolute;
                                    background-image: url(${require("../../assets/image/swiper/swiperArrow.png")});
                                    width: 60px;
                                    height: 60px;
                                    background-size: 60px 60px;
                                    top: 50%;

                                    &.left{
                                        left: 50px;
                                        transform: translateY(-50%);
                                    }

                                    &.right{
                                        right: 50px;
                                        transform: translateY(-50%) rotate(180deg);
                                    }
                                }
                            }

                            .banner_bullets{
                                position: absolute;
                                width: 100%;
                                height: 40px;
                                bottom: 0px;
                                overflow: hidden;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .6));

                                .banner_bullet{
                                    width: 20px;
                                    height: 20px;
                                    display: inline-block;
                                    position: relative;

                                    .icon{
                                        width: 10px;
                                        height: 10px;
                                        border-radius: 50%;
                                        border: 1px solid #ccc;
                                        background-color: #ccc;
                                        box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translateX(-50%) translateY(-50%);
                                    }

                                    &.banner_bullet_active{
                                        .icon{
                                            background-color: #ff9900;
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
    meta: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
