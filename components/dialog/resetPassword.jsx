
import { connect } from "react-redux";
import { useState, useMemo, useCallback } from "react";

import api from "../../assets/js/api/index.js";

import message from "../../assets/json/message/resetPassword.json";

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
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [passwordBlank, setPasswordBlank] = useState(false);
    const [checkPassword, setCheckPassword] = useState("");
    const [checkPasswordBlank, setCheckPasswordBlank] = useState(false);
    const [passwordChecked, setPasswordChecked] = useState(false);

    const passwordInputType = useMemo(() => {
        if(passwordChecked){
            return "text";
        }

        return "password";
    }, [passwordChecked]);

    const passwordInputChangeHandler = useCallback((event) => {
        let _password = event.target.value;

        setPassword(_password);

        if(_password){
            setPasswordBlank(false);
        }
    }, []);

    const checkPasswordInputChangeHandler = useCallback((event) => {
        let _password = event.target.value;

        setCheckPassword(_password);

        if(_password){
            setCheckPasswordBlank(false);
        }
    }, []);

    const passwordCheckboxClickHandler = useCallback((event) => {
        setPasswordChecked(event.target.checked);
    }, []);

    const cancelClickHandler = useCallback((event) => {
        let information = props.dialog.information || null;

        props.dispatchDialog({
            component: "login",
            information: information
        });
    }, [props.dialog]);

    const submitClickHandler = useCallback((event) => {
        setErrorMessage("");
        
        if(!password){
            setPasswordBlank(true);
        }

        if(!checkPassword){
            setCheckPasswordBlank(true);
        }

        if(password && checkPassword){
            if(password != checkPassword){
                setErrorMessage(message["resetpassword.error.passwordnotequal"]);
            }
            else{
                if(password.length < 8){
                    setErrorMessage(message["resetpassword.error.passwordshort"]);
                }
                else{
                    props.dispatchLoading(true);

                    api.account.resetPasswordByPasscode.getFetch(password).then((response) => {
                        if(response.error){
                            setErrorMessage(response.error);
                        }
                        else{
                            let information = props.dialog.information || {};

                            information.NewPassword = password;

                            props.dispatchDialog({
                                component: "login",
                                information: information
                            });
                        }

                        props.dispatchLoading(false);
                    });
                }
            }
        }
    }, [password, checkPassword, props.dialog]);

    return (
        <>
            <section className="reset_password_dialog">
                <h2 className="dialog_title">重設密碼</h2>
                <h3 className="dialog_description">密碼預設為通行碼，為確保帳號安全，請重設密碼</h3>

                {
                    (() => {
                        if(errorMessage){
                            return (
                                <h4 className="error_message">{errorMessage}</h4>
                            );
                        }
                    })()
                }

                <div className="dialog_body">
                    <div className="password_title">新密碼(8個字元以上的英文或數字)</div>
                    <input className="password_input" type={passwordInputType} onChange={passwordInputChangeHandler} placeholder="請輸入新密碼" />

                    {
                        (() => {
                            if(passwordBlank){
                                return (
                                    <div className="password_blank_message">請輸入新密碼</div>
                                );
                            }
                        })()
                    }

                    <div className="password_title">再次確認新密碼</div>
                    <input className="password_input" type={passwordInputType} onChange={checkPasswordInputChangeHandler} placeholder="請再次輸入新密碼" />

                    {
                        (() => {
                            if(checkPasswordBlank){
                                return (
                                    <div className="password_blank_message">請再次輸入新密碼</div>
                                );
                            }
                        })()
                    }

                    <div className="password_input_type">
                        <input id="password_checkbox" className="password_checkbox" onClick={passwordCheckboxClickHandler} type="checkbox" />
                        <label className="password_checkbox_label" htmlFor="password_checkbox">顯示密碼</label>
                    </div>

                    <div className="btn_section">
                        <button className="cancel_btn" onClick={cancelClickHandler}>不重設</button>
                        <button className="submit_btn" onClick={submitClickHandler}>確認新密碼</button>
                    </div>
                </div>
            </section>

            <style jsx>
                {`
                    .reset_password_dialog{
                        width: 350px;
                        background-color: #fff;
                        padding: 15px;

                        .dialog_title{
                            font-size: 22px;
                            line-height: 32px;
                            font-weight: bold;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .dialog_description{
                            margin-top: 15px;
                            font-weight: normal;
                            font-size: 18px;
                            line-height: 28px;
                            text-align: center;
                            color: #666;
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

                            .password_title{
                                font-size: 15px;
                                line-height: 30px;

                                &:nth-of-type(2){
                                    margin-top: 15px;
                                }
                            }

                            .password_input{
                                width: 100%;
                                height: 30px;
                                overflow: hidden;
                                font-size: 15px;
                                border-radius: 5px;
                                border: 1px solid #dbdbdb;
                                outline: none;
                                padding: 5px 11px;
                                line-height: 25px;
                                display: block;
                                margin: 0;
                                position: relative;

                                &:focus{
                                    border: 1px solid #f60;
                                }
                            }

                            .password_blank_message{
                                font-size: 14px;
                                color: #ff2400;
                                line-height: 25px;
                            }

                            .password_input_type{
                                height: 30px;
                                position: relative;

                                .password_checkbox{
                                    width: 15px;
                                    height: 15px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    display: block;
                                    float: left;
                                }

                                .password_checkbox_label{
                                    display: block;
                                    overflow: hidden;
                                    font-size: 15px;
                                    line-height: 30px;
                                    padding-left: 5px;
                                }
                            }

                            .btn_section{
                                display: table;
                                margin-left: auto;
                                margin-right: auto;
                                overflow: hidden;
                                margin-top: 30px;
                
                                .cancel_btn{
                                    display: block;
                                    float: left;
                                    color: #f60;
                                    border-radius: 4px;
                                    line-height: 35px;
                                    font-size: 16px;
                                    border: 1px solid #f60;
                                    padding-left: 30px;
                                    padding-right: 30px;
                                }
                
                                .submit_btn{
                                    display: block;
                                    float: left;
                                    background-color: #f60;
                                    color: #fff;
                                    border-radius: 4px;
                                    line-height: 35px;
                                    font-size: 16px;
                                    padding-left: 30px;
                                    padding-right: 30px;
                                    margin-left: 10px;
                                    border: 1px solid #f60;
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
