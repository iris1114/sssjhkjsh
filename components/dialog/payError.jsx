
import { connect } from "react-redux";
import { useCallback } from "react";

import message from "../../assets/json/message/bsmStatus.json";

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
        }
    };
};

const App = (props) => {
    const confirmBtnClickHandler = useCallback(() => {
        props.dispatchDialog({
            component: null
        });
    }, []);

    return (
        <>
            <section className="pay_error_dialog">
                <div className="dialog_title">購買失敗</div>

                <div className="dialog_description">
                    {
                        (() => {
                            if(props.dialog.information.session_uid){
                                return (
                                    <div className="session_uid">訂購編號：{props.dialog.information.session_uid}</div>
                                );
                            }
                        })()
                    }

                    <div className="error_items">
                        <div className="item">
                            <div className="title">錯誤訊息：</div>
                            <div className="text">{message[props.dialog.information.result_code]}</div>
                        </div>

                        <div className="item">
                            <div className="title">代&emsp;&emsp;碼：</div>
                            <div className="text">{props.dialog.information.result_code}</div>
                        </div>
                    </div>
                </div>

                <button className="confirm_btn" onClick={confirmBtnClickHandler}>確認</button>
            </section>

            <style jsx>
                {`
                    .pay_error_dialog{
                        width: 480px;
                        background-color: #fff;
                        padding: 15px;

                        .dialog_title{
                            font-size: 20px;
                            line-height: 35px;
                            font-weight: bold;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .dialog_description{
                            .session_uid{
                                background-color: #f8f8f8;
                                color: #777;
                                line-height: 30px;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                            }

                            .error_items{
                                margin-top: 10px;

                                .item{
                                    line-height: 30px;
                                    font-size: 16px;

                                    .title{
                                        display: inline-block;
                                        width: 80px;
                                    }

                                    .text{
                                        display: inline-block;
                                        vertical-align: top;
                                        width: calc(100% - 80px);
                                    }
                                }
                            }
                        }

                        .confirm_btn{
                            display: table;
                            margin-top: 20px;
                            margin-left: auto;
                            margin-right: auto;
                            padding-left: 15px;
                            padding-right: 15px;
                            border-radius: 5px;
                            background-color: #f60;
                            color: #fff;
                            font-size: 16px;
                            line-height: 40px;
                            border: 1px solid #f60;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
