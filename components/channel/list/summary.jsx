
import { connect } from "react-redux";
import Link from "next/link";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const App = (props) => {
    const getHref = useCallback((element) => {
        return `/channel/watch?contentId=${element.cdn_code}`;
    }, []);

    const groupData = useMemo(() => {
        let list = props.list.summary_table.list;
        let count = 0;
        let limit = 20;
        let result = new Array();
        let arr = new Array();

        for(let i = 0; i < list.length; i ++){
            let item = list[i];

            arr.push(item);

            if(count >= limit - 1 || i >= list.length - 1){
                result.push(arr);

                arr = new Array();
                count = 0;
            }
            else{
                count ++;
            }
        }

        return result;
    }, [props.list]);

    return (
        <>
            <div className="summary_section">
                <div className="article_section">
                    <h2 className="title">{props.list.summary_table.title}</h2>
                    <a className="download_btn" href={props.list.download} title="下載頻道列表" target="_blank">下載頻道列表</a>

                    {
                        props.list.summary_table.descriptions.map((element, index) => {
                            return (
                                <p className="desc" key={index}>{element}</p>
                            );
                        })
                    }

                    {
                        props.list.summary_table.list.map((element, index) => {
                            return (
                                <a className="ssr_only" href={getHref(element)} title={element.title} key={index}>
                                    <h3>{element.title}</h3>
                                </a>
                            );
                        })
                    }
                </div>

                <div className="segment"></div>

                <div className="table_section">
                    {
                        groupData.map((element, index) => {
                            return (
                                <table className="table" key={index}>
                                    <thead className="head">
                                        <tr className="row">
                                            <th className="theme">頻道</th>
                                            <th className="theme">頻道名稱</th>
                                        </tr>
                                    </thead>

                                    <tbody className="body">
                                        {
                                            element.map((_element, _index) => {
                                                return (
                                                    <tr className="row" key={_index}>
                                                        <td className="cell">
                                                            <Link href="/channel/watch" as={getHref(_element)}>
                                                                <a className="link" title={_element.title} >{_element.no}</a>
                                                            </Link>
                                                        </td>

                                                        <td className="cell">
                                                            <Link href="/channel/watch" as={getHref(_element)}>
                                                                <a className="link" title={_element.title} >
                                                                    {
                                                                        (() => {
                                                                            if(_element.quality){
                                                                                return (
                                                                                    <div className="quality">{_element.quality}</div>
                                                                                );
                                                                            };
                                                                        })()
                                                                    }
                                                                    <div className="title">{_element.title}</div>
                                                                </a>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            );
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .summary_section{
                        padding-left: 10px;
                        padding-right: 10px;

                        .article_section{
                            overflow: hidden;
                            margin-top: 20px;
                            padding-left: 0.5%;
                            padding-right: 0.5%;

                            .title{
                                font-size: 25px;
                                line-height: 40px;
                            }

                            .download_btn{
                                float: right;
                                line-height: 35px;
                                font-size: 16px;
                                padding-left: 10px;
                                padding-right: 10px;
                                background-color: #f60;
                                color: #fff;
                                border-radius: 4px;
                                margin-top: 15px;
                                margin-left: 5px;
                            }

                            .desc{
                                overflow: hidden;
                                font-size: 15px;
                                line-height: 25px;
                                margin-top: 15px;
                
                                &:first-of-type{
                                    margin-top: 15px;
                                }
                            }
                        }

                        .segment{
                            width: 99%;
                            height: 1px;
                            background-color: #ccc;
                            margin-top: 15px;
                            margin-left: auto;
                            margin-right: auto;
                        }

                        .table_section{
                            display: flex;
                            flex-flow: row;
                            flex-wrap: wrap;
                            align-items: flex-start;

                            .table{
                                width: 32.33%;
                                margin-top: 15px;
                                margin-bottom: 15px;
                                line-height: 30px;
                                font-size: 15px;
                                margin-left: 0.5%;
                                margin-right: 0.5%;

                                @media screen and (max-width: 1023px) {
                                    width: 49%;
                                }

                                .head{
                                    background-image: -webkit-linear-gradient(90deg,#e6e6e6,#f6f6f6);

                                    .row{
                                        .theme{
                                            width: 15%;

                                            &:nth-of-type(2){
                                                width: 85%;
                                                text-align: left;
                                                padding-left: 5px;
                                                padding-right: 5px;
                                            }
                                        }
                                    }
                                }

                                .body{
                                    .row{
                                        &:hover{
                                            color: #f60;
                                        }

                                        .cell{
                                            .link{
                                                display: block;
                                                text-align: center;
                                                overflow: hidden;
                                                padding-left: 5px;
                                                padding-right: 5px;

                                                .quality{
                                                    float: right;
                                                }

                                                .title{
                                                    overflow: hidden;
                                                    font-weight: normal;
                                                    text-align: left;
                                                    font-size: 15px;
                                                    text-overflow: ellipsis;
                                                    white-space: nowrap;
                                                }
                                            }
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
    list: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
