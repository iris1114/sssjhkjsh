
import { connect } from "react-redux";
import { useState, useMemo, useCallback } from "react";

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
    const [userBlank, setUserBlank] = useState(false);
    const [user, setUser] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [captchaBlank, setCaptchaBlank] = useState(false);
    const [captchaKey, setCaptchaKey] = useState(new Date().getTime());

    const captchaSrc = useMemo(() => {
        return `/api/captcha?key=${captchaKey}`;
    }, [captchaKey]);

    const userInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "")

        let _user = event.target.value;

        setUser(_user);

        if(_user){
            setUserBlank(false);
        }
    }, []);

    const captchaInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "")

        let _captcha = event.target.value;

        setCaptcha(_captcha);

        if(_captcha){
            setCaptchaBlank(false);
        }
    }, []);

    const generateCaptchaClickHandler = useCallback((event) => {
        setCaptchaKey(new Date().getTime());
    }, []);

    const cancelBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: "login",
            information: props.dialog.information || null
        });
    }, [props.dialog]);

    const submitBtnClickHandler = useCallback((event) => {
        setErrorMessage("");

        if(!user){
            setUserBlank(true);
        }

        if(!captcha){
            setCaptchaBlank(true);
        }

        if(user && captcha){
            props.dispatchLoading(true);

            api.account.forgetPassword.getFetch(user, captcha).then((response) => {
                if(response.error){
                    setErrorMessage(response.error);
                }
                else{
                    let information = props.dialog.information || {};

                    information.MobileNumber = user;

                    props.dispatchDialog({
                        component: "passcode",
                        information: information
                    });
                }

                props.dispatchLoading(false);
            });
        }
    }, [user, captcha, props.dialog]);

    return (
        <>
            <section className="forget_password_dialog">
                <h2 className="dialog_title">忘記密碼</h2>
                <h3 className="dialog_description">請輸入您的手機號碼</h3>

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
                    <div className="user_input_title">手機號碼</div>
                    <input className="user_input" onChange={userInputChangeHandler} type="tel" placeholder="請輸入手機號碼" maxLength="10" />

                    {
                        (() => {
                            if(userBlank){
                                return (
                                    <div className="user_blank_message">手機號碼必填</div>
                                );
                            }
                        })()
                    }

                    <div className="captcha_title">驗證碼</div>
                    <input className="captcha_input" type="tel" onChange={captchaInputChangeHandler} placeholder="請輸入下方驗證碼" maxLength="4"></input>

                    {
                        (() => {
                            if(captchaBlank){
                                return (
                                    <div className="captcha_blank_message">驗證碼必填</div>
                                );
                            }
                        })()
                    }

                    <div className="captcha_section">
                        <img className="captcha_img" src={captchaSrc} />
                        <button className="generate_captcha" onClick={generateCaptchaClickHandler}>重新產生驗證碼</button>
                    </div>

                    <div className="btn_section">
                        <button className="cancel_btn" onClick={cancelBtnClickHandler}>取消</button> 
                        <button className="submit_btn" onClick={submitBtnClickHandler}>送出</button>
                    </div>
                </div>
            </section>

            <style jsx>
                {`
                    .forget_password_dialog{
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

                            .user_input_title{
                                font-size: 15px;
                                line-height: 30px;
                            }

                            .user_input, .captcha_input{
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

                            .user_blank_message, .captcha_blank_message{
                                font-size: 14px;
                                color: #ff2400;
                                line-height: 25px;
                            }

                            .captcha_title{
                                font-size: 15px;
                                line-height: 30px;
                                margin-top: 15px;
                            }

                            .captcha_section{
                                overflow: hidden;
                                height: 50px;
                                position: relative;
                
                                .captcha_img{
                                    display: block;
                                    float: left;
                                    height: 100%;
                                }
                
                                .generate_captcha{
                                    color: #3e94dc;
                                    cursor: pointer;
                                    text-decoration: underline;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    display: block;
                                    position: relative;
                                    float: left;
                                    padding: 10px;
                                    font-size: 15px;
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
                                    border-radius: 4px;
                                    line-height: 35px;
                                    font-size: 16px;
                                    border: 1px solid #f60;
                                    padding-left: 30px;
                                    padding-right: 30px;
                                    color: #f60;
                                }

                                .submit_btn{
                                    background-color: #f60;
                                    color: #fff;
                                    margin-left: 10px;
                                    display: block;
                                    float: left;
                                    border-radius: 4px;
                                    line-height: 35px;
                                    font-size: 16px;
                                    border: 1px solid #f60;
                                    padding-left: 30px;
                                    padding-right: 30px;
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