
import { connect } from "react-redux";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        searchOptionsTrigger: state.header.searchOptionsTrigger
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSearchOptionsTrigger: (element) => {
            dispatch({
                type: "header/searchOptionsTrigger",
                value: element
            });
        }
    };
};

const App = (props) => {
    const [meta, setMeta] = useState(null);

    const searchOptionsSectionRef = useRef(null);

    const router = useRouter();

    const style = useMemo(() => {
        let boundingClientRect = props.searchOptionsTrigger.getBoundingClientRect();

        return {
            width: boundingClientRect.width,
            top: parseInt(boundingClientRect.top + boundingClientRect.height) + 1,
            left: boundingClientRect.left
        };
    }, [props.searchOptionsTrigger]);

    const clickHandler = useCallback((event) => {
        if(!tools.isElement(event.target, props.searchOptionsTrigger) && !tools.isElement(event.target, searchOptionsSectionRef.current)){
            props.dispatchSearchOptionsTrigger(null);
        }
    }, [props.searchOptionsTrigger]);

    useEffect(() => {
        let unmounted = false;

        api.ccc.searchOptions.getFetch().then((res) => {
            let data = res.result.data;
            
            if(!unmounted){
                setMeta(data);
            }
        });

        return () => {
            unmounted = true;
        };
    }, []);
    
    useEffect(() => {
        removeEventListener("click", clickHandler);

        if(props.searchOptionsTrigger){
            addEventListener("click", clickHandler);
        }

        return () => {
            removeEventListener("click", clickHandler);
        };
    }, [props.searchOptionsTrigger]);

    useEffect(() => {
        const handleRouteChange = () => {
            props.dispatchSearchOptionsTrigger(null);
        };
        
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.on("routeChangeStart", handleRouteChange);
    
        return () => {
          router.events.off("routeChangeStart", handleRouteChange);
        }
    }, []);
    
    return (
        <>
            {
                (() => {
                    if(meta){
                        return (
                            <section className="search_options_section" ref={searchOptionsSectionRef} style={style}>
                                <div className="title">{meta.title}</div>

                                <div className="items_section">
                                    {
                                        meta.items.map((element, index) => {
                                            return (
                                                <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`} key={index}>
                                                    <a className="item_link" target="_self" title={element.content_name}>
                                                        <span className="index">{index + 1}</span>
                                                        <span className="text">{element.content_name}</span>
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
                        position: fixed;
                        border: 1px solid #bababa;
                        background-color: #fff;
                        padding: 10px;

                        .title{
                            font-size: 15px;
                            line-height: 25px;
                            font-weight: bold;
                        }

                        .items_section{
                            .item_link{
                                display: block;
                                overflow: hidden;
                                position: relative;
                                height: 30px;

                                &:nth-of-type(1), &:nth-of-type(2), &:nth-of-type(3){
                                    .index{
                                        background-color: #f60;
                                        color: #fff;
                                    }
                                }

                                &:hover{
                                    .text{
                                        color: #f60;
                                    }
                                }

                                .index{
                                    display: block;
                                    width: 25px;
                                    height: 25px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    line-height: 23px;
                                    text-align: center;
                                    float: left;
                                    font-size: 15px;
                                    border: 1px solid #f60;
                                    color: #f60;
                                }

                                .text{
                                    display: block;
                                    height: 25px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    line-height: 25px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 15px;
                                    padding-left: 5px;
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
