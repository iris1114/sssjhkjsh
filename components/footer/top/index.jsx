
import { connect } from "react-redux";
import { useMemo } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Landscape from "./landscape.jsx";
import Portrait from "./portrait.jsx";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const menu = useMemo(() => {
        let data = new Array();

        for(let i = 0; i < props.menu.length; i ++){
            let items = props.menu[i];

            for(let j = 0; j < items.length; j ++){
                let item = items[j];

                if(item.footer){
                    item = _.cloneDeep(item);
                    item.submenu = item.submenu.slice(0, 4);

                    data.push(item);
                }
            }
        }

        data = data.slice(0, 5);

        return data;
    }, [props.menu]);

    return (
        <>
            <div className="top_section">
                {
                    (() => {
                        if(props.resize.width <= 1024){
                            return (
                                <Portrait menu={menu} />
                            );
                        }
                        else{
                            return (
                                <Landscape menu={menu} />
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .top_section{
                        border-top: 1px solid #ddd;
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    menu: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
/*
import { connect } from "react-redux";
import { useMemo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";


const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const contentData = useMemo(() => {
        let data = new Array();

        for(let i = 0; i < props.menu.length; i ++){
            let items = props.menu[i];

            for(let j = 0; j < items.length; j ++){
                let item = items[j];

                if(item.footer){
                    data.push(item);
                }
            }
        }

        return data;
    }, [props.menu]);

    const [showList, setShowList] = useState("");
    const [focusTab, setFocusTab] = useState("");

    const getFocusClass = useCallback((category) => {
        if(category == focusTab){
            return "focus";
        }

        return "";
    }, [focusTab]);


    const listClickHandle = useCallback((event,category) => {

        event.preventDefault();
        
        if(showList == category){
            setShowList("");
            setFocusTab("");
        }else{
            setShowList(category);
            setFocusTab(category);
        }
    }, [showList]);


    return (
        <>
            <div className="top_section">

                <div className="content_section block_section">
                    <div className={`title ${getFocusClass("content")}`} onClick={(event)=>listClickHandle(event,"content")}>內容服務</div>
                    <div className="content_lists">
                        {
                            (() => {
                                if(showList == "content" || props.resize.width >= 1024){
                                    return(
                                        contentData.map((element, index) => {
                                            return(
                                                <div className="content_list" key={index}>
                                                    <div className="subtitle">{element.description}</div>
                                                    <ul className="lists">
                                                        {
                                                            element.submenu.slice(0,3).map((_element, _index) => {
                                                                return(
                                                                    <li className="list" key={_index}>
                                                                        <Link href={_element.href} as={_element.as}>
                                                                            <a title={_element.title} className="link">{_element.title}</a>
                                                                        </Link>  
                                                                    </li>
                                                                );
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            );
                                        })
                                    );
                                }
                            })()
                        }
                    </div>
                </div>

                <div className="about_section block_section">
                    <div className={`title ${getFocusClass("about")}`} onClick={(event)=>listClickHandle(event,"about")}>關於 LiTV</div>
                    {
                        (() => {
                            if(showList == "about" || props.resize.width >= 1024){
                                return(
                                    <ul className="lists">
                                        <li className="list">
                                            <Link href="/purchase/introduction" as="/purchase/introduction">
                                                <a title="服務介紹" className="link">服務介紹</a>
                                            </Link> 
                                        </li>
                                        <li className="list">
                                            <Link href="/purchase" as="/purchase">
                                                <a title="購買專區" className="link">購買專區</a>
                                            </Link> 
                                        </li>
                                        <li className="list">
                                            <Link href="/service/copyright" as="/service/copyright">
                                                <a title="版權聲明" className="link">版權聲明</a>
                                            </Link> 
                                        </li>
                                        <li className="list">
                                            <Link href="/service/privacy" as="/service/privacy">
                                                <a title="隱私權政策" className="link">隱私權政策</a>
                                            </Link> 
                                        </li>

                                        <li className="list">
                                            <a href={`${litv.config.fino}/tos/pc.html`} title="服務條款" target="_blank" className="link">服務條款</a>
                                        </li>
                                    </ul>
                                );
                            }
                        })()
                    }
                </div>

                <div className="download_section block_section">
                    <div className={`title ${getFocusClass("download")}`} onClick={(event)=>listClickHandle(event,"download")}>下載</div>
                    {
                        (() => {
                            if(showList == "download" || props.resize.width >= 1024){
                                return(
                                        <ul className="lists">
                                            <li className="list">
                                                <Link href="/service#downloadapp" as="/service#downloadapp">
                                                    <a title="Android" className="link">Android</a>
                                                </Link>
                                            </li>
                                            <li className="list">
                                                <Link href="/service#downloadapp" as="/service#downloadapp">
                                                    <a title="iOS" className="link">iOS</a>
                                                </Link>
                                            </li>
                                            <li className="list">
                                                <Link href="/service#tvstb" as="/service#tvstb">
                                                    <a title="TV" className="link">TV</a>
                                                </Link>
                                            </li>
                                            <li className="list">
                                                <Link href="/service#downloadapp" as="/service#downloadapp">
                                                    <a title="HUAWEI" className="link">HUAWEI</a>
                                                </Link>
                                            </li>
                                        </ul>
                                    );
                                }
                            })()
                        }
                </div>

                <div className="help_section block_section">
                    <div className={`title ${getFocusClass("help")}`} onClick={(event)=>listClickHandle(event,"help")}>用戶幫助</div>
                    {
                        (() => {
                            if(showList == "help" || props.resize.width >= 1024){
                                return(
                                    <ul className="lists">
                                        <li className="list">
                                            <Link href={`${litv.config.promo}/freechannel/`} as={`${litv.config.promo}/freechannel/`}>
                                                <a title="免費試用" className="link active">免費試用</a>
                                            </Link> 
                                        </li>
                                        <li className="list">
                                            <Link href="/member?service=enableCoupon" as="/member?service=enableCoupon">
                                                <a title="啟用兌換券" className="link active">啟用兌換券</a>
                                            </Link> 
                                        </li>
                                        <li className="list">
                                            <a href="https://support.litv.tv/hc/zh-tw" title="常見問題" target="_blank" className="link">常見問題</a>
                                        </li>
                                        <li className="list">
                                            <Link href="/service/contactus" as="/service/contactus">
                                                <a title="聯絡我們" className="link">聯絡我們</a>
                                            </Link> 
                                        </li>
                                        <li className="list">
                                            <a href="https://www.facebook.com/LiTVfans/" title="Facebook" target="_blank" className="link">Facebook↗︎</a>
                                        </li>
                                        <li className="list">
                                            <a href="http://bit.ly/2ROGn0C" title="Line" target="_blank" className="link">Line↗︎</a>
                                        </li>
                                    </ul>
                                );
                            }
                        })()
                    }
                   
                </div>
                
            </div>

            <style jsx>
                {`
                    .top_section{
                        display:flex;
                        border-top: 1px solid #ddd;

                        @media (max-width: 1024px){
                            display:block;
                        }

                        .block_section{
                            width: 15%;
                            padding: 20px;
                            border-right: 1px solid #ddd;

                            @media (max-width: 1024px){
                                border-right: none;
                                width: 100%;
                                border-bottom: 1px solid #ddd;

                                &:last-child{
                                    border-bottom: none;
                                }
                            }

                            &:last-child{
                                border-right: none;
                            }

                            .title{
                                font-size: 20px;
                                line-height: 25px;
                                opacity: 0.87;
                                font-weight: 700;
                                padding-left: 10px;

                                @media (max-width: 1200px){
                                    font-size: 17px;
                                    line-height: 22px;
                                }

                                @media (max-width: 1024px){
                                    display: flex;
                                    justify-content: space-between;
                                    cursor: pointer;
                                    align-items: center;

                                    &::after{
                                        content: "";
                                        width: 15px;
                                        height: 15px;
                                        margin-right: 10px;
                                        color: #000;
                                        border-top: 1px solid #000;
                                        border-right: 1px solid #000;
                                        transform: rotate(135deg);
                                    }
                                }
                            }

                            .focus{
                                &::after{
                                    transform: rotate(-45deg);
                                }
                            }

                            .lists{
                                padding-left: 0px;

                                @media (max-width: 1024px){
                                    padding-left: 15px;
                                }
                            }

                            .list{
                                list-style: none;
                                font-size: 16px;
                                line-height: 27px;
                                opacity: 0.87;
                                text-decoration: none;
                                color: #000;
                                margin-bottom: 5px;

                                @media (max-width: 1200px){
                                    font-size: 13px;
                                    line-height: 24px;
                                }
                              
                                .link{
                                    padding: 5px 10px;
                                 
                                    &:hover{
                                        color: #fff;
                                        border-radius: 12px;
                                        background-image: linear-gradient(104deg, #791099, #5d0c75 64%);
                                        opacity: 0.7;
                                    }

                                    &.active{
                                        color: #fff;
								        border-radius: 12px;
								        background-image: linear-gradient(104deg, #791099, #5d0c75 64%);
                                    }
                                }
                            }
                        }

                        .content_section{
                            width: 55%;
                            padding: 20px;

                            @media (max-width: 1024px){
                                width: 100%;
                            }
                    
                            .content_lists{
                                display: flex;
                                justify-content: space-around;

                                @media (max-width: 1024px){
                                    display: block;
                                }

                                .content_list{
                                    width: 20%;

                                    @media (max-width: 1024px){
                                        width: 100%;
                                    }
    
                                    .subtitle{
                                        font-size: 16px;
                                        line-height: 29px;
                                        display: flex;
                                        align-items: center;
                                        font-weight: 700;
                                        padding-left: 10px;

                                        @media (max-width: 1200px){
                                            font-size: 13px;
                                            line-height: 26px;
                                        }

                                        &:after{
                                            content: "";
                                            width: 31px;
                                            height: 1px;
                                            margin-left: 5px;
                                            opacity: 0.5;
                                            background-image: linear-gradient(90deg,#000,transparent);
                                        }
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

App.propTypes = {
    menu: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
*/