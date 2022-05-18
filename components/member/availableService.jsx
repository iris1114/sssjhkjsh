
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import api from "../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        let unmounted = false;

        props.dispatchLoading(true);

        api.bsm.catalogInfo.getFetch().then((res) => {
            if(!unmounted){
                props.dispatchLoading(false);
                setMeta(res.result);
            }
        });

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <>
            <div className="available_service_section">
                <h2 className="title">可用服務</h2>

                {
                    (() => {
                        if(meta){
                            return (
                                <>
                                    <table className="table_section">
                                        <thead className="table_head">
                                            <tr className="head_row">
                                                <th className="head_cell">服務名稱</th>
                                                <th className="head_cell">服務到期日</th>
                                                <th className="head_cell">下次扣款日</th>
                                                <th className="head_cell">服務狀態</th>
                                            </tr>
                                        </thead>

                                        <tbody className="table_body">
                                            {
                                                meta.map((item, index) => {
                                                    return (
                                                        <tr className="body_row" key={index}>
                                                            <td className="body_cell">{item.catalog_name}</td>

                                                            {
                                                                (() => {
                                                                    if(item.current_recurrent_status == "R"){
                                                                        return (
                                                                            <td className="body_cell">
                                                                                <div className="flex_container">
                                                                                    <img className="icon" src={require("../../assets/image/member/recurrent.png")} alt="自動扣款" />
                                                                                    <div className="text">自動扣款</div>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <td className="body_cell">{item.end_date}</td>
                                                                        );
                                                                    }
                                                                })()
                                                            }

                                                            <td className="body_cell">{item.next_pay_date}</td>

                                                            {
                                                                (() => {
                                                                    if(item.use_status == "Y"){
                                                                        return (
                                                                            <td className="body_cell">已啟用</td>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <td className="body_cell">已到期</td>
                                                                        );
                                                                    }
                                                                })()
                                                            }
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>

                                    <div className="explain_section">
                                        <img className="icon" src={require("../../assets/image/member/recurrent.png")} alt="自動扣款" />
                                        <div className="text">為自動扣款符號，若您欲取消或有任何問題，請洽客服專線：<span className="mark">(02)7707-0708</span>。</div>
                                    </div>
                                </>
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .available_service_section{
                        .title{
                            font-size: 22px;
                            line-height: 30px;
                        }

                        .table_section{
                            width: 100%;
                            margin-top: 20px;

                            .table_head{
                                background-color: #f1f1f1;

                                .head_row{
                                    .head_cell{
                                        border-left: none;
                                        border-right: none;
                                        font-weight: bold;
                                        line-height: 30px;
                                        text-align: left;
                                        padding: 5px 10px;
                                    }
                                }
                            }

                            .table_body{
                                .body_row{
                                    .body_cell{
                                        border-left: none;
                                        border-right: none;
                                        font-size: 15px;
                                        line-height: 30px;
                                        padding: 5px 10px;

                                        .flex_container{
                                            display: flex;
                                            flex-direction: row;
                                            flex-wrap: wrap;
                                            justify-content: flex-start;
                                            align-items: center;

                                            .icon{
                                                display: block;
                                                width: 23px;
                                                height: 22px;
                                            }

                                            .text{
                                                margin-left: 5px;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        .explain_section{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: wrap;
                            justify-content: flex-start;
                            align-items: center;
                            margin-top: 20px;
                            padding: 0 15px;

                            .icon{
                                display: block;
                                width: 23px;
                                height: 22px;
                            }

                            .text{
                                margin-left: 5px;
                                line-height: 30px;

                                .mark{
                                    color: #8711aa;
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
