
import { connect } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LazyLoad from "react-lazyload";

import Placeholder from "../placeholder/index.jsx";

import api from "../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [searchOptions, setSearchOptions] = useState(null);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    useEffect(() => {
        let unmounted = false;

        api.ccc.searchOptions.getFetch().then((res) => {
            if(unmounted){
                return;
            }

            setSearchOptions(res.result.data);
        });

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <>
            {
                (() => {
                    if(searchOptions){
                        return (
                            <section className="search_options_section">
                                <div className="title_section">
                                    <h2 className="search_options_title">{searchOptions.title}</h2>
                                    <div className="border_bottom"></div>
                                </div>

                                <div className="content_items">
                                    {
                                        searchOptions.items.slice(0, 12).map((element, index) => {
                                            return (
                                                <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`} key={index}>
                                                    <a className="content_item" title={element.content_name}>
                                                        <div className="poster_section">
                                                            <div className="padding_box"></div>

                                                            <LazyLoad placeholder={<Placeholder type="portrait" alt={element.content_name} />}>
                                                                <img className="poster" src={`${cdnstatic}/${element.picture}`} alt={element.content_name} />
                                                            </LazyLoad>
                                                        </div>

                                                        <h3 className="title">{element.content_name}</h3>
                                                    </a>
                                                </Link>
                                            );
                                        })
                                    }
                                </div>
                            </section>
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .search_options_section{
                        margin-top: 20px;
                        
                        .title_section{
                            overflow: hidden;
                            display: block;
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                            padding-bottom: 5px;
                            position: relative;

                            .search_options_title{
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
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
