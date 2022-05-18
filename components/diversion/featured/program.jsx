
import { connect } from "react-redux";
import { useEffect, useRef, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import Glide from "@glidejs/glide";
import LazyLoad from "lazyload";
import _ from "lodash";

import PosterBannerStyle from "../../../assets/css/posterBanner/posterBannerStyle.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDiversionFeatured: (value) => {
            dispatch({
                type: "diversion/featured",
                value: value
            });
        }
    };
};

const App = (props) => {
    const glide = useRef(null);

    const cdnStatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const perView = useMemo(() => {
        return 6;
    }, []);

    const meta = useMemo(() => {
        let _meta = _.cloneDeep(props.meta);
        let last = _meta.list.length % perView;

        if(last){
            let display = _meta.list.length - last;

            _meta.list = _meta.list.slice(0, display);
        }

        _meta.list = _.chunk(_meta.list, perView);

        return _meta;
    }, [props.meta, perView]);

    const contentItemWidth = useMemo(() => {
        return `${(100 - 1 * perView) / perView}%`;
    }, [perView]);

    const contentItemClickHandler = useCallback((event, item) => {
        event.preventDefault();
        props.dispatchDiversionFeatured(item);
    }, []);

    const refreshBtnClickHandler = useCallback((event, dir) => {
        if(!glide.current){
            return;
        }

        glide.current.go(dir);
    }, []);

    useEffect(() => {
        glide.current = new Glide(`.program_list_section_${props.index}`, {
            type: "carousel",
            gap: 0,
            classes: {
                activeNav: "program_list_bullet_active"
            }
        });

        glide.current.mount();

        let images = document.querySelectorAll(`.program_list_section_${props.index} .poster`);

        new LazyLoad(images, {
            root: null,
            rootMargin: "0px",
            threshold: 0
        });

        return () => {
            glide.current.destroy();
        };
    }, [perView]);
    
    return (
        <>
            <PosterBannerStyle />

            <div className="program_section">
                <div className="title_refresh_section">
                    <img className="icon" width="25" height="24" src={require("../../../assets/image/diversion/star.png")} alt="star" />
                    <div className="text">{meta.title}</div>

                    {
                        (() => {
                            if(meta.list.length > 1){
                                return (
                                    <button className="refresh_btn" data-glide-dir=">" title="換一批" onClick={(event) => refreshBtnClickHandler(event, ">")}>
                                        <img className="btn_icon" width="15" height="14" src={require("../../../assets/image/diversion/refresh.png")} alt="換一批" />
                                        <div className="btn_text">換一批</div>
                                    </button>
                                );
                            }
                        })()
                    }
                </div>

                <div className={`program_list_section program_list_section_${props.index}`}>
                    <div className="program_list_container glide__track" data-glide-el="track">
                        <div className="program_list_items glide__slides">
                            {
                                meta.list.map((item, index) => {
                                    return (
                                        <div className="program_list_item glide__slide" key={index}>
                                            <div className="program_list_group">
                                                {
                                                    item.map((_item, _index) => {
                                                        return (
                                                            <a className="content_item" href={`/${_item.content_type}/${_item.content_id}`} onClick={(event) => contentItemClickHandler(event, _item)} target="_self" title={_item.title} key={_index}>
                                                                <div className="poster_section">
                                                                    <div className="padding_box"></div>
                                                                    <img className="poster" width="172" height="97" data-src={`${cdnStatic}/${_item.screen_pic}`} src={require("../../../assets/image/poster/default/posterLandscape.svg")} alt={_item.title} />

                                                                    {
                                                                        (() => {
                                                                            if(_item.charge_mode == "P"){
                                                                                return (
                                                                                    <span className="poster_banner_poster_icon" data-poster-banner="U"></span>
                                                                                );
                                                                            }
                                                                        })()
                                                                    }
                                                                </div>

                                                                <div className="des_section">{_item.title}</div>
                                                            </a>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                    <div className="program_list_bullets glide__bullets" data-glide-el="controls[nav]">
                        {
                            meta.list.map((item, index) => {
                                return (
                                    <button className="program_list_bullet glide__bullet" data-glide-dir={`=${index}`} title={index} key={index}>
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
                    .program_section{
                        overflow: hidden;

                        .title_refresh_section{
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            align-items: center;
                            height: 40px;

                            .icon{
                                display: block;
                                width: 25px;
                            }

                            .text{
                                color: #fff;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 22px;
                                line-height: 30px;
                                margin-left: 5px;
                            }

                            .refresh_btn{
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;
                                border-radius: 15px;
                                background-color: #ff9900;
                                padding-left: 10px;
                                padding-right: 10px;
                                margin-left: 15px;

                                .btn_icon{
                                    display: block;
                                    width: 15px;
                                }

                                .btn_text{
                                    color: #fff;
                                    font-size: 13px;
                                    line-height: 25px;
                                    margin-left: 5px;
                                }
                            }
                        }

                        .program_list_section{
                            margin-top: 5px;

                            .program_list_container{
                                position: relative;
                                overflow: hidden;

                                .program_list_items{
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: center;
                                    align-items: center;

                                    .program_list_item{
                                        touch-action: pan-y;

                                        .program_list_group{
                                            display: flex;
                                            flex-direction: row;
                                            justify-content: center;
                                            align-items: center;

                                            .content_item{
                                                position: relative;
                                                width: ${contentItemWidth};
                                                margin-left: .5%;
                                                margin-right: .5%;

                                                .poster_section{
                                                    position: relative;
                                                    border-radius: 5px;
                                                    overflow: hidden;
                                                    box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);

                                                    .padding_box{
                                                        padding-bottom: 56.4%;
                                                    }

                                                    .poster{
                                                        display: block;
                                                        position: absolute;
                                                        width: 100%;
                                                        height: 100%;
                                                        top: 0;
                                                        left: 0;
                                                    }
                                                }

                                                .des_section{
                                                    line-height: 30px;
                                                    text-overflow: ellipsis;
                                                    white-space: nowrap;
                                                    overflow: hidden;
                                                    font-size: 15px;
                                                    color: #ccc;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            .program_list_bullets{
                                width: 100%;
                                height: 40px;
                                overflow: hidden;
                                display: flex;
                                flex-direction: row;
                                justify-content: center;
                                align-items: center;

                                .program_list_bullet{
                                    width: 20px;
                                    height: 20px;
                                    display: flex;
                                    flex-direction: row;
                                    justify-content: center;
                                    align-items: center;

                                    .icon{
                                        width: 10px;
                                        height: 10px;
                                        border-radius: 50%;
                                        border: 1px solid #ccc;
                                        background-color: #ccc;
                                    }

                                    &.program_list_bullet_active{
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
    meta: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
