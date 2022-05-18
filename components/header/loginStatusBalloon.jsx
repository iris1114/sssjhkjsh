
import {connect} from "react-redux";
import {useEffect, useState, useCallback, useRef, useMemo} from "react";
import {useRouter} from "next/router";

import tools from "../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        accountInfo: state.accountInfo,
        login: state.login,
        loginStatusBalloonTrigger: state.header.loginStatusBalloonTrigger,
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoginStatusBalloonTrigger: (element) => {
            dispatch({
                type: "header/loginStatusBalloonTrigger",
                value: element
            });
        },
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
        }
    };
};

const App = (props) => {
    const [loginStatusBalloonSectionStyle, setLoginStatusBalloonSectionStyle] = useState({});

    const loginStatusBalloonSectionRef = useRef(null);

    const router = useRouter();

    const loginClass = useMemo(() => {
        if(!props.login){
            return "logout";
        }

        return "";
    }, [props.login]);

    const mouseoverHandler = useCallback((event) => {
        if(!tools.isElement(event.target, props.loginStatusBalloonTrigger) && !tools.isElement(event.target, loginStatusBalloonSectionRef.current)){
            props.dispatchLoginStatusBalloonTrigger(null);
        }
    }, [props.loginStatusBalloonTrigger]);

    const loginBtnClickHandler = useCallback(() => {
        props.dispatchDialog({
            component: "login"
        });

        props.dispatchLoginStatusBalloonTrigger(null);
    }, []);

    const logoutBtnClickHandler = useCallback(() => {
        props.dispatchLoginStatusBalloonTrigger(null);
        props.dispatchLogin(false);
    }, []);

    const watchRecordBtnClickHandler = useCallback(() => {
        let url = {
            pathname: "/member",
            query: { 
                service: "watchRecord"
            }
        };

        if(!props.login){
            props.dispatchDialog({
                component: "login",
                information: {
                    url: url,
                    description: "觀看紀錄"
                }
            });
        }
        else{
            router.push(url);
        }
    }, [props.login]);

    const enableCouponBtnClickHandler = useCallback(() => {
        let url = {
            pathname: "/member",
            query: { 
                service: "enableCoupon"
            }
        };

        if(!props.login){
            props.dispatchDialog({
                component: "login",
                information: {
                    url: url,
                    description: "啟用兌換券"
                }
            });
        }
        else{
            router.push(url);
        }
    }, [props.login]);

    const moreDetailClickHandler = useCallback(() => {
        let url = {
            pathname: "/member"
        };

        if(!props.login){
            props.dispatchDialog({
                component: "login",
                information: {
                    url: url,
                    description: "更多個人中心功能"
                }
            });
        }
        else{
            router.push(url);
        }
    }, [props.login]);
    
    useEffect(() => {
        let triggerElement = props.loginStatusBalloonTrigger;
        let loginStatusBalloonSection = loginStatusBalloonSectionRef.current;
        let triggerElementBoundingClientRect = triggerElement.getBoundingClientRect();
        let loginStatusBalloonSectionBoundingClientRect = loginStatusBalloonSection.getBoundingClientRect();
        let top = triggerElementBoundingClientRect.top + triggerElementBoundingClientRect.height;
        let left = triggerElementBoundingClientRect.left - (loginStatusBalloonSectionBoundingClientRect.width - triggerElementBoundingClientRect.width) / 2;

        setLoginStatusBalloonSectionStyle({
            top: parseInt(top),
            left: parseInt(left),
            opacity: 1
        });
    }, [props.loginStatusBalloonTrigger]);
    
    useEffect(() => {
        removeEventListener("mouseover", mouseoverHandler);

        if(props.loginStatusBalloonTrigger){
            addEventListener("mouseover", mouseoverHandler);
        }

        return () => {
            removeEventListener("mouseover", mouseoverHandler);
        };
    }, [props.loginStatusBalloonTrigger]);

    useEffect(() => {
        const handleRouteChange = () => {
            props.dispatchLoginStatusBalloonTrigger(null);
        };
        
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.on("routeChangeStart", handleRouteChange);
    
        return () => {
          router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);

    return (
        <>
            <div className="login_status_balloon_section" style={loginStatusBalloonSectionStyle} ref={loginStatusBalloonSectionRef}>
                <div className="content_section">
                    <div className="btn_section">
                        {
                            (() => {
                                if(!props.login){
                                    return (
                                        <button className="loing_btn" onClick={loginBtnClickHandler}>登入｜註冊</button>
                                    );
                                }
                                else{
                                    return (
                                        <div className="account_info">
                                            <button className="logout_btn" onClick={logoutBtnClickHandler}>登出</button>

                                            {
                                                (() => {
                                                    if(props.accountInfo && props.accountInfo.User){
                                                        return (
                                                            <span className="user">{`您好，${props.accountInfo.User}`}</span>
                                                        );
                                                    }
                                                    else{
                                                        return (
                                                            <span className="user">您好，***</span>
                                                        );
                                                    }
                                                })()
                                            }
                                        </div>
                                    );
                                }
                            })()
                        }

                        <div className="segment"></div>
                        <button className={`item watch_record ${loginClass}`} onClick={watchRecordBtnClickHandler}>觀看紀錄</button>
                        <button className={`item enable_coupon ${loginClass}`} onClick={enableCouponBtnClickHandler}>啟用兌換券</button>
                        <a className={`item support`} href="https://support.litv.tv/" target="_blank">常見問題</a>
                    </div>

                    <button className={`more ${loginClass}`} onClick={moreDetailClickHandler}>更多個人中心功能</button>
                </div>

                <div className="triangle"></div>
            </div>

            <style jsx>
                {`
                    .login_status_balloon_section{
                        display: block;
                        position: fixed;
                        width: 200px;
                        opacity: 0;
                        
                        .content_section{
                            margin-top: 10px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 20px rgba(0,0,0,.5);
                            overflow: hidden;

                            .btn_section{
                                padding-top: 10px;
                                padding-left: 10px;
                                padding-right: 10px;

                                .loing_btn{
                                   background-color: #f60;
                                   font-size: 15px;
                                   line-height: 25px;
                                   text-align: center;
                                   color: #fff;
                                   border-radius: 5px;
                                   overflow: hidden;
                                   display: block;
                                   width: 100%;
                                }

                                .account_info{
                                    overflow: hidden;
                                    
                                    .logout_btn{
                                        float: right;
                                        font-size: 15px;
                                        line-height: 25px;
                                        padding-left: 5px;
                                        padding-right: 5px;

                                        &:hover{
                                            color: #f60;
                                        }
                                    }

                                    .user{
                                        font-size: 15px;
                                        line-height: 25px;
                                        overflow: hidden;
                                        text-align: left;
                                        display: block;
                                    }
                                }

                                .segment{
                                    width: 100%;
                                    height: 1px;
                                    background-color: #999;
                                    margin-top: 10px;
                                }

                                .item{
                                    font-size: 15px;
                                    line-height: 35px;
                                    display: block;
                                    width: 100%;
                                    text-align: left;

                                    &:hover{
                                        color: #f60;
                                    }

                                    &.logout{
                                        color: #999;

                                        &:hover{
                                            color: #f60;
                                        }
                                    }
                                }
                            }

                            .more{
                                background: #efefef;
                                font-size: 15px;
                                line-height: 35px;
                                display: block;
                                width: 100%;
                                text-align: center;

                                &.logout{
                                    color: #999;

                                    &:hover{
                                        color: #fff;
                                        background-color: #bbb;
                                    }
                                }

                                &:hover{
                                    color: #fff;
                                    background-color: #bbb;
                                }
                            }
                        }

                        .triangle{
                            position: absolute;
                            width: 20px;
                            height: 10px;
                            border-style: solid;
                            border-width: 0 10px 10px;
                            border-color: transparent transparent #fff;
                            top: 0px;
                            left: 50%;
                            transform: translateX(-50%);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
