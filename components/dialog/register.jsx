
import {connect} from "react-redux";
import {useState, useMemo, useCallback, useEffect} from "react";

import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";

import message from "../../assets/json/message/register.json";

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
    const [user, setUser] = useState("");
    const [userBlank, setUserBlank] = useState(false);
    const [email, setEmail] = useState("");
    const [birth, setBirth] = useState(0);
    const [birthBlank, setBirthBlank] = useState(false);
    const [sex, setSex] = useState("");
    const [sexBlank, setSexBlank] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [captchaBlank, setCaptchaBlank] = useState(false);
    const [captchaKey, setCaptchaKey] = useState(new Date().getTime());
    const [referringPartner, setReferringPartner] = useState(null);

    const maleBtnClass = useMemo(() => {
        if(sex == "male"){
            return "focus";
        }

        return "";
    }, [sex]);

    const femaleBtnClass = useMemo(() => {
        if(sex == "female"){
            return "focus";
        }

        return "";
    }, [sex]);

    const captchaSrc = useMemo(() => {
        return `/api/captcha?key=${captchaKey}`;
    }, [captchaKey]);

    const contractHref = useMemo(() => {
        return `${litv.config.fino}/tos/pc.html`;
    }, []);

    const userInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "")

        let _user = event.target.value;

        setUser(_user);

        if(_user){
            setUserBlank(false);
        }
    }, []);

    const emailInputChangeHandler = useCallback((event) => {
        let _email = event.target.value;

        setEmail(_email);
    }, []);

    const birthSelectChangeHandler = useCallback((event) => {
        let value = event.target.value;

        value = parseInt(value);

        setBirth(value);

        if(value){
            setBirthBlank(false);
        }
    }, []);

    const sexBtnClickHandler = useCallback((event) => {
        let value = event.target.getAttribute("data-value");

        setSex(value);
        setSexBlank(false);
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

    const submitBtnClickHandler = useCallback((event) => {
        setErrorMessage("");

        if(!user){
            setUserBlank(true);
        }

        if(!birth){
            setBirthBlank(true);
        }

        if(!sex){
            setSexBlank(true);
        }

        if(!captcha){
            setCaptchaBlank(true);
        }

        if(user && birth && sex && captcha){
            let regExp = /[0][9][0-9]{8}/;

            if(!regExp.test(user)){
                let msg = message["register.error.badmobile"];
                console.log(msg);
                setErrorMessage(msg);

                return;
            }

            props.dispatchLoading(true);

            api.account.register.getFetch({
                MobileNumber: user,
                ReferringPartner: referringPartner,
                Captcha: captcha,
                CustomerInformation: {
                    BirthYear: birth,
                    EmailAddress: email,
                    Sex: sex
                }
            }).then((response) => {
                if(response.error){
                    setErrorMessage(response.error);
                }
                else{
                    let information = props.dialog.information || {};

                    information.MobileNumber = user;
                    information.ReferringPartner = referringPartner;
                    
                    information.CustomerInformation = {
                        BirthYear: birth,
                        Sex: sex
                    };

                    props.dispatchDialog({
                        component: "passcode",
                        information: information
                    });
                }

                props.dispatchLoading(false);
            });
        }
    }, [user, birth, sex, captcha, referringPartner, props.dialog]);

    const loginBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: "login",
            information: props.dialog.information || null
        });
    }, [props.dialog]);

    useEffect(() => {
        let referringPartner = tools.url.getReferringPartner();

        setReferringPartner(referringPartner);
    }, []);

    return (
        <>
            <section className="register_dialog">
                <h2 className="dialog_title">註冊</h2>
                <h3 className="dialog_description">新註冊，400台電視頻道免費看</h3>

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

                    <div className="email_input_title">電子信箱</div>
                    <input className="email_input" onChange={emailInputChangeHandler} type="text" placeholder="請輸入電子信箱" />

                    <div className="birth_sex_section">
                        <div className="birth_section">
                            <div className="birth_title">出生年(西元)</div>

                            <select className="birth_select" onChange={birthSelectChangeHandler}>
                                {
                                    tools.birthYearOptions().map((item, index) => {
                                        return (
                                            <option value={item.value} key={index}>{item.text}</option>
                                        );
                                    })
                                }
                            </select>
                            
                            {
                                (() => {
                                    if(birthBlank){
                                        return (
                                            <div className="birth_blank_message">請選擇出生年</div>
                                        );
                                    }
                                })()
                            }
                        </div>

                        <div className="sex_section">
                            <div className="sex_title">性別</div>

                            <div className="btn_section">
                                <button className={`male_btn ${maleBtnClass}`} data-value="male" onClick={sexBtnClickHandler}>男生</button>
                                <button className={`female_btn ${femaleBtnClass}`} data-value="female" onClick={sexBtnClickHandler}>女生</button>
                            </div>

                            {
                                (() => {
                                    if(sexBlank){
                                        return (
                                            <div className="sex_blank_message" v-if="sexBlank">請選擇性別</div>
                                        );
                                    }
                                })()
                            }
                        </div>
                    </div>

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

                    <div className="terms">註冊即表示同意 LiTV <a className="terms_link" href={contractHref} title="服務條款" target="_blank">服務條款</a> 與訂閱優惠資訊</div>
                    <button className="submit_btn" onClick={submitBtnClickHandler}>註冊</button>

                    <div className="login_section">
                        <div className="desc">已經是會員了？</div>
                        <button className="login_btn" onClick={loginBtnClickHandler}>由此登入</button>
                    </div>
                </div>
            </section>

            <style jsx>
                {`
                    .register_dialog{
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
                            .user_input_title, .email_input_title, .captcha_title{
                                font-size: 15px;
                                line-height: 30px;
                                margin-top: 15px;
                            }

                            .user_input, .email_input, .captcha_input{
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

                            .birth_sex_section{
                                margin-top: 15px;
                                overflow: hidden;
                
                                .birth_section{
                                    float: left;
                
                                    .birth_title{
                                        font-size: 15px;
                                        line-height: 30px;
                                    }
                
                                    .birth_select{
                                        outline: none;
                                        height: 30px;
                                    }
                
                                    .birth_blank_message{
                                        font-size: 14px;
                                        color: #ff2400;
                                        line-height: 25px;
                                    }
                                }
                
                                .sex_section{
                                    float: right;
                
                                    .sex_title{
                                        font-size: 15px;
                                        line-height: 30px;
                                    }
                
                                    .btn_section{
                                        overflow: hidden;
                
                                        .male_btn, .female_btn{
                                            width: 75px;
                                            height: 30px;
                                            display: block;
                                            float: left;
                                            text-align: center;
                                            border: 1px solid #dbdbdb;
                                            cursor: pointer;
                
                                            &.focus{
                                                color: #fff;
                                            }
                                        }
                
                                        .male_btn.focus{
                                            background-color: #009ddc;
                                        }
                
                                        .female_btn.focus{
                                            background-color: #f68ccb;
                                        }
                                    }
                
                                    .sex_blank_message{
                                        font-size: 14px;
                                        color: #ff2400;
                                        line-height: 25px;
                                    }
                                }
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

                            .terms{
                                font-size: 14px;
                                color: #666;
                                text-align: center;
                                margin-top: 30px;
                                line-height: 30px;
                
                                .terms_link{
                                    color: #3e94dc;
                                    text-decoration: underline;
                                    display: inline-block;
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

                            .login_section{
                                display: table;
                                margin-left: auto;
                                margin-right: auto;
                                overflow: hidden;
                                margin-top: 15px;
                
                                .desc{
                                    font-size: 15px;
                                    line-height: 30px;
                                    float: left;
                                }
                
                                .login_btn{
                                    font-size: 15px;
                                    line-height: 30px;
                                    border: none;
                                    outline: none;
                                    color: #f60;
                                    text-decoration: underline;
                                    cursor: pointer;
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