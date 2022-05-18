
import {connect} from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import api from "../../../../assets/js/api/index.js";

import Videos from "./videos.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [promoContent, setPromoContent] = useState(null);

    useEffect(() => {
        let unmounted = false;

        api.fino.promoContent.getFetch(props.seriesId).then((res) => {
            if(unmounted){
                return;
            }
            
            setPromoContent(res);
        });

        return () => {
            unmounted = true;
        };
    }, [props.seriesId]);

    return (
        <>
            {
                (() => {
                    if(promoContent){
                        return (
                            <section className="promo_content_section">
                                {
                                    promoContent.contents.map((element, index) => {
                                        return (
                                            <div className="content_section" key={index}>
                                                <div className="title_section">
                                                    <h2 className="promo_review_title">{element.title}</h2>
                                                    <div className="border_bottom"></div>
                                                </div>

                                                <div className="couples_section">
                                                    {
                                                        element.couples.map((_element, _index) => {
                                                            return (
                                                                <React.Fragment key={_index}>
                                                                    <Videos couple={_element} contentType={promoContent.content_type} />

                                                                    {
                                                                        (() => {
                                                                            if(_index < element.couples.length - 1){
                                                                                return (
                                                                                    <div className="segment">
                                                                                        <div className="line"></div>
                                                                                    </div>
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
                            </section>
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .promo_content_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;

                        .content_section{
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

                            .couples_section{
                                .segment{
                                    padding-left: 0.5%;
                                    padding-right: 0.5%;

                                    .line{
                                        height: 1px;
                                        background-color: #ccc;
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
