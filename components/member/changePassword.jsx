
import { connect } from "react-redux";
import { useState, useMemo, useCallback } from "react";

import message from "../../assets/json/message/setPassword.json";

import api from "../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
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
        },
        dispatchToast: (message) => {
            dispatch({
                type: "toast",
                value: message
            });
        }
    };
};

const App = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordChecked, setPasswordChecked] = useState(false);
    const [originalPassword, setOriginalPassword] = useState("");
    const [originalPasswordBlank, setOriginalPasswordBlank] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordBlank, setNewPasswordBlank] = useState(false);
    const [checkPassword, setCheckPassword] = useState("");
    const [checkPasswordBlank, setCheckPasswordBlank] = useState(false);

    const inputType = useMemo(() => {
        if(!passwordChecked){
            return "password";
        }

        return "text";
    }, [passwordChecked]);

    const originalPasswordInputChangeHandler = useCallback((event) => {
        let _originalPassword = event.target.value;

        setOriginalPassword(_originalPassword);

        if(_originalPassword){
            setOriginalPasswordBlank(false);
        }
    }, []);

    const newPasswordInputChangeHandler = useCallback((event) => {
        let _newPassword = event.target.value;

        setNewPassword(_newPassword);

        if(_newPassword){
            setNewPasswordBlank(false);
        }
    }, []);

    const checkPasswordInputChangeHandler = useCallback((event) => {
        let _checkPassword = event.target.value;

        setCheckPassword(_checkPassword);

        if(_checkPassword){
            setCheckPasswordBlank(false);
        }
    }, []);

    const passwordCheckboxClickHandler = useCallback((event) => {
        setPasswordChecked(event.target.checked);
    }, []);

    const submitBtnClickHandler = useCallback((event) => {
        setErrorMessage("");

        if(!originalPassword){
            setOriginalPasswordBlank(true);
        }

        if(!newPassword){
            setNewPasswordBlank(true);
        }

        if(!checkPassword){
            setCheckPasswordBlank(true);
        }

        if(originalPassword && newPassword && checkPassword){
            if(newPassword == checkPassword){
                if(newPassword.length >= 8){
                    props.dispatchLoading(true);

                    api.account.setPassword.getFetch(originalPassword, newPassword).then((res) => {
                        if(res.error){
                            setErrorMessage(res.error);
                        }
                        else{
                            props.dispatchToast("修改成功，請重新登入");
                            props.dispatchLogin(false);
                        }

                        props.dispatchLoading(false);
                    });
                }
                else{
                    setErrorMessage(message["setPassword.error.passwordshort"]);
                }
            }
            else{
                setErrorMessage(message["setPassword.error.passwordnotequal"]);
            }
        }
    }, [originalPassword, newPassword, checkPassword]);

    return (
        <>
            <div className="change_password_section">
                <h2 className="title">修改密碼</h2>

                {
                    (() => {
                        if(errorMessage){
                            return (
                                <div className="error_message">{errorMessage}</div>
                            );
                        }
                    })()
                }

                <div className="password_title">原密碼</div>
                <input className="password_input" type={inputType} onChange={(event) => originalPasswordInputChangeHandler(event)} placeholder="請輸入原密碼" />

                {
                    (() => {
                        if(originalPasswordBlank){
                            return (
                                <div className="password_blank_message">請輸入原密碼</div>
                            );
                        }
                    })()
                }

                <div className="password_title">新密碼（8個字元以上的英文或數字）</div>
                <input className="password_input" type={inputType} onChange={(event) => newPasswordInputChangeHandler(event)} placeholder="請輸入新密碼" />

                {
                    (() => {
                        if(newPasswordBlank){
                            return (
                                <div className="password_blank_message">請輸入新密碼</div>
                            );
                        }
                    })()
                }

                <div className="password_title">再次確認新密碼</div>
                <input className="password_input" type={inputType} onChange={(event) => checkPasswordInputChangeHandler(event)} placeholder="請再次輸入新密碼" />

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
                    <input id="password_checkbox" className="password_checkbox" onClick={(event) => passwordCheckboxClickHandler(event)} type="checkbox" />
                    <label className="password_checkbox_label" htmlFor="password_checkbox">顯示密碼</label>
                </div>

                <button className="submit_btn" onClick={(event) => submitBtnClickHandler(event)} title="確認">確認</button>
            </div>

            <style jsx>
                {`
                    .change_password_section{
                        .title{
                            font-size: 22px;
                            line-height: 30px;
                            margin-bottom: 10px;
                        }

                        .error_message{
                            color: #f3575a;
                            line-height: 30px;
                            font-weight: bold;
                        }

                        .password_title{
                            font-size: 15px;
                            line-height: 30px;
                            margin-top: 10px;

                            &:nth-of-type(1){
                                margin-top: 0;
                            }
                        }

                        .password_input{
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
                                width: fit-content;
                            }
                        }

                        .submit_btn{
                            display: block;
                            background-color: #f60;
                            color: #fff;
                            border-radius: 4px;
                            line-height: 35px;
                            font-size: 16px;
                            padding-left: 30px;
                            padding-right: 30px;
                            border: 1px solid #f60;
                            margin-top: 10px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
