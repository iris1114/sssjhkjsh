
import { connect } from "react-redux";
import { useMemo } from "react";

const mapStateToProps = (state) => {
    return {
        orderInfo: state.purchase.orderInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const contractHref = useMemo(() => {
        return `${litv.config.fino}/tos/pc.html`;
    }, []);

    return (
        <>
            <section className="order_section">
                <div className="order_title">配送資訊</div>

                <div className="order_items">
                    <div className="order_item">
                        <div className="item_title">購買人資訊</div>
                        <div className="item">姓&emsp;&emsp;名：{props.orderInfo.orderName}</div>
                        <div className="item">聯絡電話：{props.orderInfo.orderPhone}</div>
                        <div className="item">電子信箱：{props.orderInfo.orderEmail}</div>
                        <div className="item">地&emsp;&emsp;址：{props.orderInfo.orderAddress}</div>
                    </div>

                    <div className="order_item">
                        <div className="item_title">收貨人資訊</div>
                        <div className="item">姓&emsp;&emsp;名：{props.orderInfo.receiverName}</div>
                        <div className="item">聯絡電話：{props.orderInfo.receiverPhone}</div>
                        <div className="item">電子信箱：{props.orderInfo.receiverEmail}</div>
                        <div className="item">地&emsp;&emsp;址：{props.orderInfo.receiverAddress}</div>
                    </div>
                </div>

                <ul className="description">
                    <li className="list">4K電視盒的寄送將於訂單確認後五個工作日內送達（不包含週六、日及國定假日）。</li>
                    <li className="list">其餘規範請參考<a className="link" href={contractHref} target="_blank">服務條款</a>。</li>
                </ul>
            </section>

            <style jsx>
                {`
                    .order_section{
                        border-top: 1px dashed #999;
                        margin-top: 30px;
                        padding-top: 10px;

                        .order_title{
                            background-color: #f1f1f1;
                            text-align: center;
                            line-height: 50px;
                            font-size: 18px;
                        }

                        .order_items{
                            line-height: 35px;

                            .order_item{
                                border-top: 1px solid #999;
                                padding-top: 10px;
                                padding-bottom: 10px;

                                &:first-of-type{
                                    border-top: none;
                                }

                                .item_title{
                                    font-size: 16px;
                                    font-weight: bold;
                                }

                                .item{
                                    font-size: 15px;
                                }
                            }
                        }

                        .description{
                            background-color: #f8f8f8;
                            margin-top: 0;
                            margin-bottom: 0;
                            padding-top: 10px;
                            padding-bottom: 10px;

                            .list{
                                line-height: 30px;
                                font-size: 15px;

                                .link{
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
