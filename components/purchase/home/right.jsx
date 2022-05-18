
import { connect } from "react-redux";
import { useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        }
    };
};

const App = (props) => {
    const getSlognStyle = useCallback((item) => {
        return {
            backgroundColor: item.color
        };
    }, []);

    const descriptionBtnClickHandler = useCallback((item) => {
        props.dispatchDialog({
            component: "description",
            information: item
        });
    }, []);

    const getAveragePrice = useCallback((item) => {
        return Math.round(item / 12);
    }, []);

    const getVodText = useCallback((item) => {
        let text = "";

        if(item.vod){
            text = "1台";
        }

        return text;
    }, []);

    const getChannelText = useCallback((item) => {
        let text = "";

        if(item.channel){
            text = "2台";
        }

        return text;
    }, []);

    return (
        <>
            <section className="right_content">
                <table className="list_container">
                    <tbody className="list_body">
                        <tr className="body_tr">
                            <td className="body_td hidden"></td>

                            {
                                props.content.map((item, index) => {
                                    return (
                                        <td className="body_td" key={index}>
                                            <div className="slogn" style={getSlognStyle(item)}>
                                                {
                                                    (() => {
                                                        if(item.name == "vod" || item.name == "delux"){
                                                            return (
                                                                <div className="icon">
                                                                    <img className="img" src={require("../../../assets/image/purchase/home/iconVod.png")} alt="vod" />
                                                                </div>
                                                            );
                                                        }
                                                    })()                                                    
                                                }

                                                {
                                                    (() => {
                                                        if(item.name == "channel" || item.name == "delux"){
                                                            return (
                                                                <div className="icon">
                                                                    <img className="img" src={require("../../../assets/image/purchase/home/iconChannel.png")} alt="channel" />
                                                                </div>
                                                            );
                                                        }
                                                    })()
                                                }

                                                <div className="text">{item.slogn}</div>
                                            </div>

                                            <div className="title">{item.title}</div>
                                            <div className="price">$<span className="mark">{item.price.month}</span> /月</div>
                                            
                                            <Link href="/purchase/[groupId]" as={item.href}>
                                                <a className="btn">立即購買</a>
                                            </Link>

                                            <button className="description_btn" onClick={() => descriptionBtnClickHandler(item)}>詳細介紹 »</button>

                                           
                                        </td>
                                    );
                                })
                            }
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td year">
                                <div className="list_title">年繳優惠方案</div>
                            </td>

                            {
                                props.content.map((item, index) => {
                                    return (
                                        <td className="body_td package" key={index}>
                                            <div className="subtitle">{item.shortTitle}年繳方案</div>
                                            <div className="price">$<span className="mark">{item.price.year}</span> /年</div>
                                            <div className="average">每月 ${getAveragePrice(item.price.year)} 起</div>
                                            <Link href="/purchase/[groupId]" as={item.yearHref}>
                                                <a className="btn">立即購買</a>
                                            </Link>
                                            {
                                                (() => {
                                                    if(item.promoLabel){
                                                        return (
                                                            <a className="promo_label" href={item.promoLabel.href} target="_blank">
                                                                <img className="image" src={require(`../../../assets/image/purchase/home/${item.promoLabel.image}`)} alt={item.promoLabel.title} />
                                                            </a>
                                                        );
                                                    }
                                                })()
                                            }
                                        </td>
                                    );
                                })
                            }

                           
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td inline" colSpan="4">
                                <div className="inline_title">
                                    <div className="text">一個帳號可同時幾人觀看</div>

                                    <a className="icon" href="https://support.litv.tv/hc/zh-tw/articles/115001250013-%E4%B8%80%E5%80%8B%E5%B8%B3%E8%99%9F%E6%9C%89%E9%99%90%E5%88%B6%E5%B9%BE%E5%8F%B0%E8%A3%9D%E7%BD%AE%E5%97%8E-" target="_blank">
                                        <img className="img" src={require("../../../assets/image/purchase/home/iconInfo.png")} alt="了解詳情" />
                                    </a>
                                </div>
                            </td>
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td">
                                <div className="small_title">6萬小時隨選影片</div>
                            </td>

                            {
                                props.content.map((item, index) => {
                                    return (
                                        <td className="body_td" key={index}>
                                            <div className="view_people">{getVodText(item)}</div>
                                        </td>
                                    );
                                })
                            }
                        </tr>
                        
                        <tr className="body_tr">
                            <td className="body_td">
                                <div className="small_title">400台電視頻道</div>
                            </td>

                            {
                                props.content.map((item, index) => {
                                    return (
                                        <td className="body_td" key={index}>
                                            <div className="view_people">{getChannelText(item)}</div>
                                        </td>
                                    );
                                })
                            }
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td inline" colSpan="4">
                                <div className="inline_title">
                                    <div className="text">頻道</div>
                                </div>
                            </td>
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td">
                                <div className="small_title">400台電視頻道</div>
                            </td>

                            {
                                props.content.map((item, index) => {
                                    if(item.channel){
                                        return (
                                            <td className="body_td" key={index}>
                                                <img className="check_icon" src={require("../../../assets/image/purchase/home/iconCheck.png")} alt="yes" />
                                            </td>
                                        );
                                    }
                                    else{
                                        return (
                                            <td className="body_td" key={index}></td>
                                        );
                                    }
                                })
                            }
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td inline" colSpan="4">
                                <div className="inline_title">
                                    <div className="text">隨選影片</div>
                                </div>
                            </td>
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td">
                                <div className="small_title">6大館隨選影片（電影＋戲劇＋動漫＋綜藝＋兒童＋蒙福人生）皆可收看</div>
                            </td>

                            {
                                props.content.map((item, index) => {
                                    if(item.vod){
                                        return (
                                            <td className="body_td" key={index}>
                                                <img className="check_icon" src={require("../../../assets/image/purchase/home/iconCheck.png")} alt="yes" />
                                            </td>
                                        );
                                    }
                                    else{
                                        return (
                                            <td className="body_td" key={index}></td>
                                        );
                                    }
                                })
                            }
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td inline" colSpan="4">
                                <div className="inline_title">
                                    <div className="text">跨載具觀賞</div>
                                </div>
                            </td>
                        </tr>

                        <tr className="body_tr">
                            <td className="body_td">
                                <div className="small_title">電視、電腦、手機、平板、機上盒、車載等多螢跨載具觀賞</div>
                            </td>

                            {
                                props.content.map((item, index) => {
                                    if(item.multiscreen){
                                        return (
                                            <td className="body_td" key={index}>
                                                <img className="check_icon" src={require("../../../assets/image/purchase/home/iconCheck.png")} alt="yes" />
                                            </td>
                                        );
                                    }
                                    else{
                                        return (
                                            <td className="body_td" key={index}></td>
                                        );
                                    }
                                })
                            }
                        </tr>
                    </tbody>
                </table>
            </section>

            <style jsx>
                {`
                    .right_content{
                        padding-top: 60px;

                        .list_container{
                            width: 100%;
                            text-align: center;
                            border: none;

                            .list_body{
                                .body_tr{
                                    .body_td{
                                        width: 25%;
                                        padding: 0;

                                        &:nth-child(odd){
                                            background-color: #f8f8f8;
                                        }

                                        &.hidden{
                                            border: none;
                                            background-color: #fff;
                                        }

                                        &.inline{
                                            background-color: #eaeaea;
                                        }

                                        &.year{
                                            .list_title{
                                                font-size: 22px;
                                            }
                                        }

                                        &.package{
                                            position: relative;

                                            .promo_label{
                                                position: absolute;
                                                right: -30px;
                                                top: -45px;
                                                width: 95px;
                                                z-index: 1;

                                                .image{
                                                    display: block;
                                                    width: 100%;
                                                    height: 100%;
                                                }
                                            }
                                        }

                                        .slogn{
                                            display: flex;
                                            height: 35px;
                                            text-align: left;
                                            overflow: hidden;
                                            padding-left: 10px;
                                            padding-right: 10px;

                                            .icon{
                                                width: 42px;
                                                filter: brightness(0) invert(1);
                                                transform: rotate(30deg);
                                                margin-right: 10px;

                                                .img{
                                                    display: block;
                                                    width: 100%;
                                                }
                                            }

                                            .text{
                                                color: #fff;
                                                font-size: 18px;
                                                font-weight: bold;
                                                line-height: 35px;
                                            }
                                        }

                                        .title{
                                            font-size: 26px;
                                            font-weight: bold;
                                            margin-top: 20px;
                                        }

                                        .subtitle{
                                            font-size: 20px;
                                            font-weight: bold;
                                            margin-top: 20px;
                                        }

                                        .price{
                                            font-size: 16px;
                                            margin-top: 20px;

                                            .mark{
                                                font-size: 40px;
                                                font-weight: bold;

                                                &.highlight{
                                                    color: #ff4339;
                                                }
                                            }
                                        }

                                        .average{
                                            color: #ff4339;
                                            font-size: 15px;
                                            margin-top: 20px;
                                        }

                                        .btn{
                                            display: block;
                                            margin-top: 20px;
                                            margin-bottom: 20px;
                                            margin-left: auto;
                                            margin-right: auto;
                                            border-radius: 5px;
                                            background-color: #f60;
                                            color: #fff;
                                            font-size: 16px;
                                            line-height: 40px;
                                            border: 1px solid #f60;
                                            width: 90px;
                                        }

                                        .description_btn{
                                            text-decoration: underline;
                                            font-size: 14px;
                                            color: #999;
                                            margin-bottom: 20px;
                                        }

                                        .inline_title{
                                            display: flex;
                                            text-align: left;
                                            align-items: center;
                                            padding: 10px;

                                            .text{
                                                line-height: 25px;
                                                padding-left: 5px;
                                                padding-right: 5px;
                                                font-size: 16px;
                                                font-weight: bold;
                                            }

                                            .icon{
                                                display: block;
                                                width: 19px;
                                                height: 18px;

                                                .img{
                                                    display: block;
                                                    width: 100%;
                                                    height: 100%;
                                                }
                                            }
                                        }

                                        .small_title{
                                            font-size: 15px;
                                            line-height: 25px;
                                            padding: 10px;
                                        }

                                        .view_people{
                                            font-size: 15px;
                                            line-height: 25px;
                                            padding: 10px;
                                        }

                                        .check_icon{
                                            width: 20px;
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
    content: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
