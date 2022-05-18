
import { connect } from "react-redux";
import Link from "next/link";
import { useState, useMemo, useCallback, useEffect } from "react";

import api from "../../assets/js/api/index.js";

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
    const [checked, setChecked] = useState(false);
    const [isError, setIsError] = useState(false);

    const confirmClickHandler = useCallback((event) => {console.log(event.target.checked);
        setChecked(event.target.checked);
    }, []);

    const submitClickHandler = useCallback((event) => {
        if(checked){
            setIsError(false);

            props.dialog.information.callback();

            props.dispatchDialog({
                component: null
            });
        }
        else{
            setIsError(true);
        }
    }, [checked, props.dialog]);

    return (
        <>
            <section className="channel_trial_dialog">
                <h2 className="dialog_title">開始體驗</h2>

                {
                    (() => {
                        if(isError){
                            return (
                                <h4 className="error_message">請閱讀體驗條款並勾選同意框！！</h4>
                            );
                        }
                    })()
                }

                <div className="dialog_body">
                    <div className="check_section">
                        <input className="checkbox" type="checkbox" id="confirm_checkbox" onClick={confirmClickHandler} />
                        
                        <label className="checkbox_label" htmlFor="confirm_checkbox">
                            <span className="text">我已閱讀並同意「</span>

                            <Link href="/channel/experienceTerms" as="/channel/experienceTerms">
                                <a className="link" title="體驗條款">體驗條款</a>
                            </Link>
                            
                            <span className="text">」</span>
                            <span className="star">*</span>
                        </label>
                    </div>

                    <button className="submit_btn" onClick={submitClickHandler}>確認</button>
                </div>
            </section>

            <style jsx>
                {`
                    .channel_trial_dialog{
                        width: 350px;
                        background-color: #fff;
                        padding: 15px;

                        .dialog_title{
                            font-size: 22px;
                            font-weight: bold;
                            line-height: 40px;
                            text-align: center;
                        }

                        .error_message{
                            color: #fff;
                            background-color: #f3575a;
                            text-align: center;
                            line-height: 50px;
                            margin-top: 15px;
                            font-size: 15px;
                            font-weight: normal;
                        }

                        .dialog_body{
                            margin-top: 15px;

                            .check_section{
                                height: 30px;
                                position: relative;
                                margin-left: auto;
                                margin-right: auto;
                                display: table;

                                .checkbox{
                                    width: 15px;
                                    height: 15px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    display: block;
                                    float: left;
                                }

                                .checkbox_label{
                                    display: block;
                                    overflow: hidden;
                                    font-size: 15px;
                                    line-height: 30px;
                                    padding-left: 5px;

                                    .text{
                                        display: block;
                                        float: left;
                                    }

                                    .link{
                                        display: block;
                                        float: left;
                                        text-decoration: underline;
                                        color: #3e6ddc;
                                    }

                                    .star{
                                        display: block;
                                        float: left;
                                        color: #ff2400;
                                    }
                                }
                            }

                            .submit_btn{
                                display: table;
                                background-color: #f60;
                                color: #fff;
                                border-radius: 4px;
                                width: 90px;
                                line-height: 35px;
                                font-size: 16px;
                                margin-left: auto;
                                margin-right: auto;
                                margin-top: 30px;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
