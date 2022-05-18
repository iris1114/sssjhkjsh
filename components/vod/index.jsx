
import { connect } from "react-redux";
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

import Banner from "../banner/index.jsx";
import VodCategory from "../home/vodCategory/index.jsx";

import api from "../../assets/js/api/index.js";
import contentTypeMap from "../../assets/json/content/contentTypeMap.json"

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [filter, setFilter] = useState(null);

    const filterByContentType = useMemo(() => {
        if(!filter){
            return null;
        }

        let _filter = filter[props.contentType];

        if(_filter){
            _filter.sort((a, b) => {
                return b.strength - a.strength;
            });

            _filter = _filter.filter((el) => {
                if(el.type == "filter"){
                    return true;
                }

                return false;
            });

            _filter = _filter.filter((el, index) => {
                if(index <= 3){
                    return true;
                }

                return false;
            });
        }

        return _filter;
    }, [filter, props.contentType]);

    const conditionWidth = useMemo(() => {
        if(!filterByContentType){
            return "100%";
        }

        if(props.resize.width <= 1024){
            return "50%";
        }
        else{
            return `${100 / filterByContentType.length}%`;
        }
    }, [filterByContentType, props.resize]);

    const getAs = useCallback((condition, extention) => {
        let conditions = encodeURIComponent(condition.condition);
        let extentions = encodeURIComponent(extention.value);

        return `/${props.contentType}/filter?conditions=${conditions}&extentions=${extentions}`;
    }, [props.contentType]);

    useEffect(() => {
        api.fino.filter.getFetch().then((res) => {
            setFilter(res);
        });
    }, []);

    return (
        <>
            <h1 className="ssr_only">LiTV-{contentTypeMap[props.contentType]}線上看</h1>
            <Banner banner={props.banner} />

            {
                (() => {
                    if(filterByContentType && filterByContentType.length){
                        return (
                            <div className="filter_section">
                                {
                                    filterByContentType.map((element, index) => {
                                        return (
                                            <div className="condition_section" key={index}>
                                                <div className="name">{element.name}</div>
                                                
                                                <span className="segment">
                                                    <div className="line"></div>
                                                </span>

                                                {
                                                    element.extention.map((_element, _index) => {
                                                        return (
                                                            <Link href="/[contentType]/filter" as={`${getAs(element, _element)}`} key={_index}>
                                                                <a className="extention_link" title={_element.caption}>{_element.caption}</a>
                                                            </Link>
                                                        );
                                                    })
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    }
                })()
            }

            <VodCategory mainContent={props.mainContent} />

            <style jsx>
                {`
                    .filter_section{
                        margin-top: 20px;
                        width: 98%;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;
                        border-radius: 5px;
                        overflow: hidden;
                        box-shadow: 0 2px 6px 0 rgba(150,150,150,0.5);

                        .condition_section{
                            width: ${conditionWidth};
                            height: 40px;
                            float: left;
                            overflow: hidden;
                            padding-left: 5px;
                            padding-right: 5px;

                            .name{
                                float: left;
                                font-size: 15px;
                                color: #666;
                                font-weight: normal;
                                line-height: 40px;
                                padding-left: 5px;
                                padding-right: 5px;
                            }

                            .segment{
                                display: block;
                                width: 1px;
                                height: 100%;
                                position: relative;
                                float: left;
                                padding-left: 5px;
                                padding-right: 5px;

                                .line{
                                    width: 1px;
                                    height: 40%;
                                    position: relative;
                                    top: 50%;
                                    left: 0px;
                                    transform: translateY(-50%);
                                    background-color: #333;
                                }
                            }

                            .extention_link{
                                float: left;
                                font-size: 15px;
                                line-height: 40px;
                                padding-left: 5px;
                                padding-right: 5px;

                                &:hover{
                                    color: #f60;
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
    mainContent: PropTypes.array.isRequired,
    banner: PropTypes.array,
    contentType: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
