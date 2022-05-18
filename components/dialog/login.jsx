
import { connect } from "react-redux";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import keycode from "keycode";

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
        dispatchLogin: (value) => {
            dispatch({
                type: "login",
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
    const [userBlank, setUserBlank] = useState(false);
    const [passwordBlank, setPasswordBlank] = useState(false);
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [passwordChecked, setPasswordChecked] = useState(false);
    const [loginResponse, setLoginResponse] = useState(true);

    const router = useRouter();

    const description = useMemo(() => {
        let information = props.dialog.information;

        if(information && information.description){
            return information.description;
        }

        return "登入使用完整功能";
    }, [props.dialog]);

    const passwordInputType = useMemo(() => {
        if(passwordChecked){
            return "text";
        }

        return "password";
    }, [passwordChecked]);

    const userInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "")

        let _user = event.target.value;

        setUser(_user);

        if(_user){
            setUserBlank(false);
        }
    }, []);

    const forgetPasswordBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: "forgetPassword",
            information: props.dialog.information || null
        });
    }, [props.dialog]);

    const passwordInputChangeHandler = useCallback((event) => {
        let _password = event.target.value;

        setPassword(_password);

        if(_password){
            setPasswordBlank(false);
        }
    }, []);

    const passwordCheckboxClickHandler = useCallback((event) => {
        setPasswordChecked(event.target.checked);
    }, []);

    const submitKeyDownHandler = useCallback((event) => {
        if(keycode.isEventKey(event, "enter")){
            submitClickHandler();
        }
    }, [user, password, props.dialog]);

    const submitClickHandler = useCallback((event) => {
        if(!user){
            setUserBlank(true);
        }
        
        if(!password){
            setPasswordBlank(true);
        }

        if(user && password){
            props.dispatchLoading(true);

            api.account.login.getFetch(user, password).then((response) => {
                setLoginResponse(response.result);
                props.dispatchLogin(response.result);
                props.dispatchLoading(false);

                if(response.result){
                    let information = props.dialog.information || {};

                    if(information.url){
                        //當router change時，dialog有自己關掉的機制
                        router.push(information.url);
                    }
                    else{
                        props.dispatchDialog({
                            component: null
                        });
                    }
                }
            });
        }
    }, [user, password, props.dialog]);

    const registerBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: "register",
            information: props.dialog.information || null
        });
    }, [props.dialog]);

    useEffect(() => {
        let information = props.dialog.information || {};

        if(information.MobileNumber){
            setUser(information.MobileNumber);
        }
    }, [props.dialog]);

    useEffect(() => {
        let information = props.dialog.information || {};

        if(information.NewPassword){
            setPassword(information.NewPassword);
        }
        else if(information.Passocde){
            setPassword(information.Passocde);
        }
    }, [props.dialog]);

    return (
        <>
            <section className="login_dialog" onKeyDown={(event) => submitKeyDownHandler(event)}>
                <h2 className="dialog_title">登入</h2>
                <h3 className="dialog_description">{description}</h3>

                {
                    (() => {
                        if(!loginResponse){
                            return (
                                <h4 className="error_message">帳號或密碼錯誤！</h4>
                            );
                        }
                    })()
                }

                <div className="dialog_body">
                    <div className="user_input_title">手機號碼</div>
                    <input className="user_input" onChange={userInputChangeHandler} value={user} type="tel" placeholder="請輸入手機號碼" maxLength="10" />
                    
                    {
                        (() => {
                            if(userBlank){
                                return (
                                    <div className="user_blank_message">手機號碼必填</div>
                                );
                            }
                        })()
                    }

                    <div className="password_title_section">
                        <span className="password_input_title">密碼</span>
                        <button className="forget_password_btn" onClick={forgetPasswordBtnClickHandler}>忘記密碼？</button>
                    </div>

                    <input className="password_input" onChange={passwordInputChangeHandler} value={password} type={passwordInputType} placeholder="請輸入密碼" />

                    {
                        (() => {
                            if(passwordBlank){
                                return (
                                    <div className="password_blank_message">請輸入密碼</div>
                                );
                            }
                        })()
                    }

                    <div className="password_input_type">
                        <input id="password_checkbox" className="password_checkbox" onClick={passwordCheckboxClickHandler} type="checkbox" />
                        <label className="password_checkbox_label" htmlFor="password_checkbox">顯示密碼</label>
                    </div>

                    <button className="submit_btn" onClick={submitClickHandler}>登入</button>

                    <div className="register_section">
                        <span className="description">還不是會員嗎？</span>
                        <button className="register_btn" onClick={registerBtnClickHandler}>免費註冊</button>
                    </div>
                </div>
            </section>

            <style jsx>
                {`
                    .login_dialog{
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

                            .user_input{
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

                            .user_blank_message{
                                font-size: 14px;
                                color: #ff2400;
                                line-height: 25px;
                            }

                            .password_title_section{
                                margin-top: 15px;
                                overflow: hidden;

                                .password_input_title{
                                    font-size: 15px;
                                    line-height: 30px;
                                    float: left;
                                }

                                .forget_password_btn{
                                    font-size: 15px;
                                    line-height: 30px;
                                    color: #3e94dc;
                                    float: right;
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

                            .register_section{
                                display: table;
                                margin-left: auto;
                                margin-right: auto;
                                overflow: hidden;
                                margin-top: 15px;

                                .description{
                                    font-size: 15px;
                                    line-height: 30px;
                                    float: left;
                                }

                                .register_btn{
                                    font-size: 15px;
                                    line-height: 30px;
                                    color: #f60;
                                    text-decoration: underline;
                                    background-color: transparent;
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
