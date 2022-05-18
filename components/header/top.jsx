
import { connect } from "react-redux";
import { forwardRef, useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import keycode from "keycode";

import SearchOptions from "./searchOptions.jsx";
import LoginStatusBalloon from "./loginStatusBalloon.jsx";

import promoteMeta from "../../assets/json/header/promote.json";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        searchOptionsTrigger: state.header.searchOptionsTrigger,
        loginStatusBalloonTrigger: state.header.loginStatusBalloonTrigger
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSearchOptionsTrigger: (element) => {
            dispatch({
                type: "header/searchOptionsTrigger",
                value: element
            });
        },
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
        }
    };
};

const App = (props, ref) => {
    const [promote, setPromote] = useState(null);
    const [inputText, setInputText] = useState("");

    const router = useRouter();

    const loginStatusText = useMemo(() => {
        if(props.login){
            return "個人中心";
        }
        else{
            return "登入/註冊";
        }
    }, [props.login]);

    const searchInputRef = useRef(null);
    const loginStatusRef = useRef(null);

    const inputFocusHandler = useCallback(() => {
        props.dispatchSearchOptionsTrigger(searchInputRef.current);
    }, []);

    const inputChangeHandler = useCallback((event) => {
        setInputText(event.target.value);
    }, []);

    const submitClickHandler = useCallback(() => {
        if(!inputText){
            return;
        }

        router.push({
            pathname: "/search",
            query: { 
                query: encodeURIComponent(inputText)
            }
        });
    }, [inputText]);

    const submitKeyDownHandler = useCallback((event) => {
        if(keycode.isEventKey(event, "enter")){
            submitClickHandler();
        }
    }, [inputText]);

    const loginStatusMouseOverHandler = useCallback(() => {
        props.dispatchLoginStatusBalloonTrigger(loginStatusRef.current);
    }, []);

    const searchBtnClickHandler = useCallback(() => {
        props.dispatchDialog({
            component: "search"
        });
    }, []);
    
    useEffect(() => {
        let items = promoteMeta.items;
        let count = 0;

        setPromote(items[count]);

        if(items.length > 1){
            let refreshPromoteInterval = setInterval(() => {
                count ++;

                if(count >= items.length){
                    count = 0;
                }
                
                setPromote(items[count]);
            }, 5000);

            return () => {
                clearInterval(refreshPromoteInterval);
            };
        }
    }, []);

    useEffect(() => {
        const handleRouteChange = () => {
            searchInputRef.current.value = "";
        };
        
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.on("routeChangeStart", handleRouteChange);
    
        return () => {
          router.events.off("routeChangeStart", handleRouteChange);
        }
    }, []);
    
    return (
        <>
            <div className="top_section" ref={ref}>
                <div className="container">
                    <div className="right_section">
                        {   
                            (() => {
                                if(promote){
                                    return (
                                        <a className="right_item promote" href={litv.config.url + promote.href} target={promote.target} title={promote.title}>
                                            <img className="img" src={require("../../assets/image/header/promote/" + promote.src)} width="150" height="40" alt={promote.title} />
                                        </a>
                                    );
                                }
                            })()
                        }
                        {
                            (() => {
                                if(props.login != null){
                                    return (
                                        <button className="right_item login_status" ref={loginStatusRef} onMouseOver={loginStatusMouseOverHandler}>{loginStatusText}</button>
                                    );
                                }
                            })()
                        }

                        <Link href="/purchase">
                            <a className="right_item purchase" target="_self" title="訂購服務">
                                <img className="img" width="15" height="15" alt="訂購服務" src={require("../../assets/image/header/purchaseIcon.png")} />
                                <span className="txt">訂購服務</span>
                            </a>
                        </Link>

                        <Link href="/purchase/introduction">
                            <a className="right_item purchase_introduction" target="_self" title="服務介紹">服務介紹</a>
                        </Link>

                        <Link href="/purchase/introduction">
                            <a className="right_item tv_app" target="_self" title="TV版">TV版</a>
                        </Link>
                    </div>

                    <div className="left_section">
                        <Link href="/">
                            <a className="litv_logo" target="_self" title="首頁">
                                <img className="img" width="167" height="35" alt="首頁" src={require("../../assets/image/header/litvLogo.svg")} />
                            </a>
                        </Link>

                        <div className="search_section">
                            <div className="search_container">
                                <button className="submit" title="搜尋" onClick={submitClickHandler}></button>
                                <input className="input" type="text" ref={searchInputRef} onFocus={inputFocusHandler} onChange={inputChangeHandler} onKeyDown={submitKeyDownHandler} placeholder="請輸入片名或演員" />
                            </div>
                        </div>

                        <button className="m_search_btn" title="搜尋" onClick={searchBtnClickHandler}></button>
                    </div>
                </div>
            </div>
            
            {
                (() => {
                    if(props.searchOptionsTrigger){
                        return (
                            <SearchOptions />
                        );
                    }
                })()
            }
            {
                (() => {
                    if(props.loginStatusBalloonTrigger){
                        return (
                            <LoginStatusBalloon />
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .top_section{
                        height: 50px;
                        padding-left: 1%;
                        padding-right: 1%;
                        border-bottom: 1px solid #ccc;
                        background-color: #fff;

                        .container{
                            height: 100%;
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            overflow: hidden;

                            .right_section{
                                float: right;
                                height: 100%;
                                position: relative;
                                overflow: hidden;

                                .right_item{
                                    display: block;
                                    position: relative;
                                    float: left;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    margin-left: 5px;
                                    margin-right: 5px;
                                    font-size: 15px;
                                    line-height: 30px;
                                    color: #666;
                                    cursor: pointer;

                                    &:hover{
                                        color: #f60;
                                    }
                                }

                                .promote{
                                    display: block;
                                    width: 150px;
                                    height: 40px;

                                    .img{
                                        display: block;
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                .login_status, .purchase_introduction, .download_app, .tv_app{
                                    padding-left: 5px;
                                    padding-right: 5px;
                                }

                                .purchase{
                                    height: 30px;
                                    position: relative;
                                    overflow: hidden;
                                    padding-left: 5px;
                                    padding-right: 5px;

                                    &:hover{
                                        .txt{
                                            color: #f60;
                                        }
                                    }

                                    .img{
                                        float: left;
                                        width: 15px;
                                        height: 15px;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                    }

                                    .txt{
                                        float: left;
                                        display: block;
                                        padding-left: 5px;
                                        color: #5e0b75;
                                    }
                                }
                            }
    
                            .left_section{
                                overflow: hidden;
                                position: relative;
                                height: 100%;
    
                                .litv_logo{
                                    display: block;
                                    width: 167px;
                                    height: 35px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    position: relative;
                                    float: left;
    
                                    .img{
                                        display: block;
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                .search_section{
                                    overflow: hidden;
                                    height: 100%;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    position: relative;

                                    @media(max-width: 1023px) {
                                        display: none;
                                    }

                                    .search_container{
                                        width: 250px;
                                        height: 30px;
                                        float: left;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        overflow: hidden;
                                        max-width: 100%;

                                        .submit{
                                            width: 30px;
                                            height: 30px;
                                            display: block;
                                            float: right;
                                            background-image: url(${require("../../assets/image/header/searchSubmitIcon.png")});
                                            background-size: 15px 15px;
                                            background-repeat: no-repeat;
                                            background-position: center center;
                                            background-color: #eee;
                                            border: 1px solid #bbb;
                                            border-top-left-radius: 0px;
                                            border-top-right-radius: 5px;
                                            border-bottom-right-radius: 5px;
                                            border-bottom-left-radius: 0px;
                                        }

                                        .input{
                                            width: calc(100% - 30px);
                                            height: 30px;
                                            padding: 0px;
                                            border-top-left-radius: 5px;
                                            border-top-right-radius: 0;
                                            border-bottom-right-radius: 0;
                                            border-bottom-left-radius: 5px;
                                            border: 1px solid #dbdbdb;
                                            padding-top: 5px;
                                            padding-bottom: 5px;
                                            padding-left: 10px;
                                            padding-right: 10px;
                                            font-size: 15px;
                                            display: block;
                                            outline: none;

                                            &:focus{
                                                border: 1px solid #f60;
                                            }
                                        }
                                    }
                                }

                                .m_search_btn{
                                    width: 30px;
                                    height: 30px;
                                    float: left;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    background-image: url(${require("../../assets/image/header/searchSubmitIcon.png")});
                                    background-size: 15px 15px;
                                    background-repeat: no-repeat;
                                    background-position: center center;
                                    background-color: #eee;
                                    border: 1px solid #bbb;
                                    border-top-left-radius: 5px;
                                    border-top-right-radius: 5px;
                                    border-bottom-right-radius: 5px;
                                    border-bottom-left-radius: 5px;
                                    margin-left: 10px;
                                    display: none;

                                    @media(max-width: 1023px) {
                                        display: block;
                                    }
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(forwardRef(App));
