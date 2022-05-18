
import { connect } from "react-redux";
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
    const [passcodeBlank, setPasscodeBlank] = useState(false);
    const [passcodeChecked, setPasscodeChecked] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [count, setCount] = useState(40);

    const passcodeInputType = useMemo(() => {
        if(passcodeChecked){
            return "text";
        }

        return "password";
    }, [passcodeChecked]);

    const mobileNumber = useMemo(() => {
        let information = props.dialog.information;

        if(information && information.MobileNumber){
            return information.MobileNumber;
        }

        return "";
    }, [props.dialog]);

    const passcodeBtnClickHandler = useCallback(() => {
        setErrorMessage("");
        props.dispatchLoading(true);

        api.account.requestPasscode.getFetch().then((response) => {
            if(!response.error){
                setCount(40);
            }
            else{
                setErrorMessage(response.error);
            }

            props.dispatchLoading(false);
        });
    }, []);

    const passcodeInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "")

        let _passcode = event.target.value;

        setPasscode(_passcode);

        if(_passcode){
            setPasscodeBlank(false);
        }
    }, []);

    const passwordCheckboxClickHandler = useCallback((event) => {
        setPasscodeChecked(event.target.checked);
    }, []);

    const submitClickHandler = useCallback((event) => {
        setErrorMessage("");

        if(!passcode){
            setPasscodeBlank(true);
        }

        if(passcode){
            props.dispatchLoading(true);

            api.account.passcode.getFetch(passcode).then((response) => {
                if(!response.error){
                    let information = props.dialog.information || {};
                    
                    information.Passocde = passcode;
                    
                    props.dispatchDialog({
                        component: "resetPassword",
                        information: information
                    });
                }
                else{
                    setErrorMessage(response.error);
                }

                props.dispatchLoading(false);
            });
        }
    }, [passcode, props.dialog]);

    useEffect(() => {
        if(!count){
            return;
        }

        let countTimeout = setTimeout(() => {
            let _count = count - 1;

            setCount(_count);
        }, 1000);

        return () => {
            clearTimeout(countTimeout);
        };
    }, [count]);

    return (
        <>
            <section className="passcode_dialog">
                <h2 className="dialog_title">輸入通行碼</h2>
                <h3 className="dialog_description">通行碼已傳送至以下手機號碼</h3>
                <div className="mobile_number">{mobileNumber}</div>

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
                    <div className="passcode_title_section">
                        <span className="passcode_title">通行碼 (8位數)</span>

                        {
                            (() => {
                                if(count){
                                    return(
                                        <span className="passcode_time">{`${count} 秒`}</span>
                                    );
                                }
                                else{
                                    return (
                                        <button className="passcode_btn" onClick={passcodeBtnClickHandler}>重新取得通行碼</button>
                                    );
                                }
                            })()
                        }
                    </div>

                    <input className="passcode_input" placeholder="請輸入 8 位通行碼" maxLength="8" type={passcodeInputType} onChange={passcodeInputChangeHandler} />
                    
                    {
                        (() => {
                            if(passcodeBlank){
                                return (
                                    <div className="passcode_blank_message">請輸入通行碼</div>
                                );
                            }
                        })()
                    }
                    
                    <div className="passcode_input_type">
                        <input type="checkbox" id="passcode_checkbox" className="passcode_checkbox" onClick={passwordCheckboxClickHandler} /> 
                        <label htmlFor="passcode_checkbox" className="passcode_checkbox_label">顯示通行碼</label>
                    </div>

                    <button className="submit_btn" onClick={submitClickHandler}>送出</button>
                </div>
            </section>

            <style jsx>
                {`
                    .passcode_dialog{
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

                        .mobile_number{
                            font-size: 18px;
                            line-height: 30px;
                            text-align: center;
                            margin-top: 15px;
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

                            .passcode_title_section{
                                margin-top: 15px;
                                overflow: hidden;

                                .passcode_title{
                                    font-size: 15px;
                                    line-height: 30px;
                                    float: left;
                                }

                                .passcode_time{
                                    float: right;
                                    color: #f3575a;
                                    line-height: 30px;
                                }

                                .passcode_btn{
                                    font-size: 15px;
                                    line-height: 30px;
                                    color: #3e94dc;
                                    float: right;
                                }
                            }

                            .passcode_input{
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

                            .passcode_blank_message{
                                font-size: 14px;
                                color: #ff2400;
                                line-height: 25px;
                            }

                            .passcode_input_type{
                                height: 30px;
                                position: relative;

                                .passcode_checkbox{
                                    width: 15px;
                                    height: 15px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    display: block;
                                    float: left;
                                }

                                .passcode_checkbox_label{
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
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
