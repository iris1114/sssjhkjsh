
// Glide 目前沒有 lazyload，已有人提出 issue：https://github.com/glidejs/glide/issues/362，有待追蹤。
import { useEffect, useRef, useMemo } from "react";
import { connect } from "react-redux";
import dynamic from "next/dynamic";
import Glide from "@glidejs/glide";
import PropTypes from "prop-types";

const App = connect((state) => {
    return {};
}, (dispatch) => {
    return {};
})((props) => {
    const glide = useRef(null);
    const timeStamp = useRef(`t${new Date().getTime()}`);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    useEffect(() => {
        glide.current = new Glide(`.banner_section.${timeStamp.current}`, {
            type: "carousel",
            autoplay: 5000,
            classes: {
                activeNav: "banner_bullet_active"
            }
        });

        glide.current.mount();

        return () => {
            glide.current.destroy();
        };
    }, [props.categoryBanner]);

    return (
        <>
            <div className={`banner_section ${timeStamp.current}`}>
                <div className="banner_container glide__track" data-glide-el="track">
                    <div className="banner_items glide__slides">
                        {
                            props.categoryBanner.map((item, index) => {
                                return (
                                    <a className="banner_item glide__slide" href={item.click_through} target="_blank" key={index}>
                                        <div className="padding_box"></div>
                                        <img className="banner_img" src={`${cdnstatic}/${item.data}`} alt={item.title} />
                                    </a>
                                );
                            })
                        }
                    </div>

                    <div className="banner_arrows" data-glide-el="controls">
                        <button className="banner_arrow left" data-glide-dir="<"></button>
                        <button className="banner_arrow right" data-glide-dir=">"></button>
                    </div>

                    <div className="banner_bullets glide__bullets" data-glide-el="controls[nav]">
                        {
                            props.categoryBanner.map((item, index) => {
                                return (
                                    <button className="banner_bullet glide__bullet" data-glide-dir={`=${index}`} key={index}>
                                        <i className="icon"></i>
                                    </button>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
           
            <style jsx>
                {`
                    .banner_section{
                        display: block;
                        margin-top: 20px;

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

                            .banner_items{
                                white-space: nowrap;
                                font-size: 0px;

                                .banner_item{
                                    display: inline-block;
                                    touch-action: none;
                                    position: relative;

                                    .padding_box{
                                        padding-bottom: 24.48%;
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
                                    background-image: url(${require("../../../assets/image/swiper/swiperArrow.png")});
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
                                        background-color: #fff;
                                        box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translateX(-50%) translateY(-50%);
                                    }

                                    &.banner_bullet_active{
                                        .icon{
                                            background-color: #5e0b75;
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
});

App.propTypes = {
    categoryBanner: PropTypes.array.isRequired
};

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {};
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {};
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            return (
                <>
                    {
                        (() => {
                            if(props.categoryBanner && props.categoryBanner.length){
                                return (
                                    <App categoryBanner={props.categoryBanner} />
                                );
                            }
                        })()
                    }
                </>
            );
        }));
    });
}, {
    ssr: false
});