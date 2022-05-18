
import { connect } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import keycode from "keycode";

import api from "../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [inputText, setInputText] = useState("");
    const [meta, setMeta] = useState(null);

    const router = useRouter();

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

    const inputChangeHandler = useCallback((event) => {
        setInputText(event.target.value);
    }, []);

    useEffect(() => {
        let unmounted = false;

        props.dispatchLoading(true);

        api.ccc.searchOptions.getFetch().then((res) => {
            let data = res.result.data;
            
            if(!unmounted){
                props.dispatchLoading(false);
                setMeta(data);
            }
        });

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <>
            <section className="login_dialog">
                <div className="dialog_title">搜尋</div>

                <div className="dialog_body">
                    <div className="search_container">
                        <button className="submit" title="搜尋" onClick={submitClickHandler}></button>
                        <input className="input" type="text" onChange={inputChangeHandler} onKeyDown={submitKeyDownHandler} placeholder="請輸入片名或演員" />
                    </div>

                    {
                        (() => {
                            if(meta){
                                return (
                                    <>
                                        <div className="title">{meta.title}</div>

                                        <div className="items_section">
                                            {
                                                meta.items.map((element, index) => {
                                                    return (
                                                        <Link href="/[contentType]/[contentId]" as={`/${element.content_type}/${element.content_id}`} key={index}>
                                                            <a className="item_link" target="_self" title={element.content_name}>
                                                                <span className="index">{index + 1}</span>
                                                                <span className="text">{element.content_name}</span>
                                                            </a>
                                                        </Link>
                                                    );
                                                })
                                            }
                                        </div>
                                    </>
                                );
                            }
                        })()
                    }
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

                        .dialog_body{
                            .search_container{
                                height: 30px;
                                overflow: hidden;
                                margin-top: 15px;

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

                            .title{
                                font-size: 15px;
                                line-height: 25px;
                                font-weight: bold;
                                margin-top: 15px;
                            }

                            .items_section{
                                border: 1px solid #bababa;
                                padding: 10px;

                                .item_link{
                                    display: block;
                                    overflow: hidden;
                                    position: relative;
                                    height: 30px;
    
                                    &:nth-of-type(1), &:nth-of-type(2), &:nth-of-type(3){
                                        .index{
                                            background-color: #f60;
                                            color: #fff;
                                        }
                                    }
    
                                    &:hover{
                                        .text{
                                            color: #f60;
                                        }
                                    }
    
                                    .index{
                                        display: block;
                                        width: 25px;
                                        height: 25px;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        line-height: 23px;
                                        text-align: center;
                                        float: left;
                                        font-size: 15px;
                                        border: 1px solid #f60;
                                        color: #f60;
                                    }
    
                                    .text{
                                        display: block;
                                        height: 25px;
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        line-height: 25px;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        font-size: 15px;
                                        padding-left: 5px;
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
