
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import PropTypes from "prop-types";

import api from "../../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [ranks, setRanks] = useState(null);

    useEffect(() => {
        let unmounted = false;

        let req = {
            contentType: props.contentType,
            limit: "10",
            board: "top"
        };

        api.ccc.searchProgram.getFetch(req).then((res) => {
            if(!unmounted){
                setRanks(res.result.data[0].programs);
            }
        });

        return () => {
            unmounted = true;
        };
    }, [props.contentType]);

    return (
        <>
            {
                (() => {
                    if(ranks){
                        return (
                            <section className="ranks_section">
                                <h2 className="ssr_only">{props.title}</h2>
                                {
                                    ranks.map((item, index) => {
                                        return (
                                            <Link href="/[contentType]/[contentId]" as={`/${item.content_type}/${item.content_id}`} key={index}>
                                                <a className="rank_item" title={item.title}>
                                                    <div className="index">{index + 1}</div>
                                                    <h3 className="title">{item.title}</h3>
                                                </a>
                                            </Link>
                                        );
                                    })
                                }
                            </section>
                        )
                    }
                })()
            }

            <style jsx>
                {`
                    .ranks_section{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;

                        .rank_item{
                            display: block;
                            height: 10%;
                            overflow: hidden;
    
                            &:nth-of-type(n + 4){
                                .index{
                                    color: #f60;
                                    background-color: #fcfcfc;
                                }
                            }
    
                            &:hover{
                                .title{
                                    color: #f60;
                                }
                            }
    
                            .index{
                                width: 20px;
                                height: 20px;
                                text-align: center;
                                color: #fff;
                                font-size: 14px;
                                float: left;
                                line-height: 18px;
                                border: 1px solid #f60;
                                background-color: #f60;
                                position: relative;
                                top: 50%;
                                transform: translateY(-50%);                              
                            }
    
                            .title{
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                padding-left: 10px;
                                font-size: 15px;
                                line-height: 20px;
                                overflow: hidden;
                                position: relative;
                                top: 50%;
                                transform: translateY(-50%);
                                color: #666;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    contentType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);