
import { connect } from "react-redux";
import { useCallback } from "react";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        },
        dispatchTvodPass: (value) => {
            dispatch({
                type: "tvodPass",
                value: value
            });
        }
    };
};

const App = (props) => {
    const playBtnClickHandler = useCallback(() => {
        props.dispatchTvodPass(true);

        props.dispatchDialog({
            component: null
        });
    }, []);

    return (
        <>
            <section className="tvod_complete_dialog">
                <div className="dialog_description">感謝您本次的消費，租借的影片可立即觀看。</div>

                <div className="dialog_body">
                    <table className="list_container">
                        <thead className="list_head">
                            <tr className="head_tr">
                                <th className="head_th" width="10%">NO.</th>
                                <th className="head_th" width="50%">品項</th>
                                <th className="head_th" width="20%">訂購項目</th>
                                <th className="head_th" width="20%">總價</th>
                            </tr>
                        </thead>

                        <tbody className="list_body">
                            <tr className="body_tr">
                                <td className="body_td">1</td>
                                <td className="body_td">{props.dialog.information.details[0].catalog_description}</td>
                                <td className="body_td">單片租借</td>
                                <td className="body_td">${props.dialog.information.amount}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="totle_section">本次消費金額總計：<span className="mark">${props.dialog.information.amount}</span></div>

                    <div className="description_section">
                        <div className="title">貼心叮嚀：</div>

                        <ol className="description_items">
                            <li className="item">請於付款後48小時內觀賞完畢，期間內可無限次觀賞。</li>
                            <li className="item">若在影片觀賞過程中，剛好達到48小時租借之期限，影片會停止播放，欲繼續觀賞須再次租借。</li>
                            <li className="item">單片租借影片，皆經廠商合法授權取得，租借期限由授權廠商決定；部份單片租借影片亦可能包含在隨選影片電影類別中。</li>
                            <li className="item">單片租借啟用及到期日期，以本公司系統時間為準。</li>
                            <li className="item">影片版權僅限台、澎、金、馬地區播放。</li>
                        </ol>
                    </div>
                </div>

                <button className="play_btn" onClick={playBtnClickHandler}>確認並播放</button>
            </section>

            <style jsx>
                {`
                    .tvod_complete_dialog{
                        width: 750px;
                        background-color: #fff;
                        padding: 15px;

                        .dialog_description{
                            margin-top: 15px;
                            font-weight: normal;
                            font-size: 18px;
                            line-height: 28px;
                            text-align: center;
                            color: #666;
                        }

                        .dialog_body{
                            margin-top: 15px;

                            .list_container{
                                width: 100%;
                                text-align: center;
                                font-size: 14px;
                                line-height: 35px;

                                .list_head{
                                    .head_tr{
                                        .head_th{
                                            font-weight: bold;
                                        }
                                    }
                                }
                            }

                            .totle_section{
                                text-align: right;
                                font-size: 16px;
                                font-weight: bold;
                                line-height: 30px;
                                padding-left: 20px;
                                padding-right: 20px;
                                margin-top: 20px;

                                .mark{
                                    color: #f60;
                                }
                            }

                            .description_section{
                                line-height: 30px;
                                font-size: 14px;
                                margin-top: 15px;

                                .title{
                                    display: inline-block;
                                    width: 70px;
                                    text-align: right;
                                }

                                .description_items{
                                    display: inline-block;
                                    vertical-align: top;
                                    width: calc(100% - 70px);
                                    padding-left: 20px;
                                    margin-top: 0;
                                    margin-bottom: 0;

                                    .item{
                                        color: #f60;
                                    }
                                }
                            }
                        }

                        .play_btn{
                            display: table;
                            margin-left: auto;
                            margin-right: auto;
                            margin-top: 20px;
                            padding-left: 15px;
                            padding-right: 15px;
                            border: 1px solid #f60;
                            border-radius: 5px;
                            font-size: 16px;
                            line-height: 40px;
                            background-color: #f60;
                            color: #fff;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
