
import { connect } from "react-redux";
import { useMemo } from "react";
import Link from "next/link";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const averagePrice = useMemo(() => {
        let price = props.dialog.information.price;

        return {
            month: Math.round(price.month / 1),
            season: Math.round(price.season / 3),
            year: Math.round(price.year / 12)
        };
    }, []);

    return (
        <>
            <div className="description_dialog">
                <div className="dialog_title">
                    {
                        (() => {
                            if(props.dialog.information.name == "vod" || props.dialog.information.name == "delux"){
                                return (
                                    <img className="img" src={require("../../assets/image/purchase/home/iconVod.png")} alt="vod" />
                                );
                            }
                        })()                                                    
                    }

                    {
                        (() => {
                            if(props.dialog.information.name == "channel" || props.dialog.information.name == "delux"){
                                return (
                                    <img className="img" src={require("../../assets/image/purchase/home/iconChannel.png")} alt="channel" />
                                );
                            }
                        })()
                    }

                    <div className="text">{props.dialog.information.title}</div>
                </div>

                <div className="dialog_body">
                    <div className="price_section">$<span className="price">{props.dialog.information.price.month}</span> /月</div>

                    <ul className="list_section">
                        {
                            props.dialog.information.description.map((item, index) => {
                                return (
                                    <li className="item" key={index}>
                                        <div className="text" dangerouslySetInnerHTML={item}></div>
                                    </li>
                                );
                            })
                        }
                    </ul>

                    <div className="rate_section">
                        <div className="title">費率說明</div>

                        <table className="list_container">
                            <thead className="list_head">
                                <tr className="head_tr">
                                    <th className="head_th" width="33.33%">月繳</th>
                                    <th className="head_th" width="33.33%">季繳</th>
                                    <th className="head_th" width="33.33%">年繳</th>
                                </tr>
                            </thead>

                            <tbody className="list_body">
                                <tr className="body_tr">
                                    <td className="body_td">
                                        <div className="price">${props.dialog.information.price.month}</div>
                                        <div className="average_price">（平均 ${averagePrice.month} /月）</div>
                                    </td>

                                    <td className="body_td">
                                        <div className="price">${props.dialog.information.price.season}</div>
                                        <div className="average_price">（平均 ${averagePrice.season} /月）</div>
                                    </td>

                                    <td className="body_td">
                                        <div className="price">${props.dialog.information.price.year}</div>

                                        {
                                            (() => {
                                                if(props.dialog.information.name == "delux"){
                                                    return (
                                                        <div className="average_price">（平均 $199 起/月）</div>
                                                    );
                                                }
                                                else{
                                                    return (
                                                        <div className="average_price">（平均 ${averagePrice.year} /月）</div>
                                                    );
                                                }
                                            })()
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Link href="/purchase/[groupId]" as={props.dialog.information.href}>
                        <a className="buy_btn">立即購買</a>
                    </Link>
                </div>
            </div>

            <style jsx>
                {`
                    .description_dialog{
                        width: 750px;
                        background-color: #fff;

                        .dialog_title{
                            display: flex;
                            height: 60px;
                            background-color: ${props.dialog.information.color};
                            justify-content: center;
                            align-items: center;

                            .img{
                                display: block;
                                width: 40px;
                                margin-right: 10px;
                                filter: brightness(0) invert(1);
                            }

                            .text{
                                color: #fff;
                                font-size: 30px;
                                font-weight: bold;
                                line-height: 60px;
                            }
                        }

                        .dialog_body{
                            padding: 10px;

                            .price_section{
                                font-size: 16px;
                                margin-top: 20px;
                                text-align: center;

                                .price{
                                    font-size: 40px;
                                    font-weight: bold;
                                }
                            }

                            .list_section{
                                line-height: 35px;

                                .item{
                                    font-size: 16px;                                    
                                }
                            }

                            .rate_section{
                                padding-left: 25px;
                                padding-right: 25px;

                                .title{
                                    line-height: 35px;
                                }

                                .list_container{
                                    width: 100%;
                                    text-align: center;
                                    margin-top: 10px;
                                    font-size: 18px;
                                    line-height: 35px;

                                    .list_head{
                                        background-color: #eaeaea;

                                        .head_tr{
                                            .head_th{
                                                font-weight: bold;
                                            }
                                        }
                                    }

                                    .list_body{
                                        .body_tr{
                                            .body_td{
                                                padding: 10px;

                                                &:last-child{
                                                    .average_price{
                                                        color: #f60;
                                                    }
                                                }

                                                .price{
                                                    font-size: 22px;
                                                    font-weight: bold;
                                                }

                                                .average_price{
                                                    font-size: 15px;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            .buy_btn{
                                display: block;
                                text-align: center;
                                margin-top: 20px;
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
                        }
                    }
                `}
            </style>

            <style jsx global>
                {`
                    .description_dialog{
                        .dialog_body{
                            .list_section{
                                a{
                                    color: #408ed6;
                                    text-decoration: underline;
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
