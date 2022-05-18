
import { connect } from "react-redux";
import { useCallback, useMemo } from "react";

import Barcode from "react-barcode";

const mapStateToProps = (state) => {
    return {
        accountInfo: state.accountInfo,
        purchaseInfo: state.purchase.purchaseInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const barcodeOption = useMemo(() => {
        let obj = {
            width: 1,
            height: 50,
            format: "CODE39",
            fontSize: 15
        };

        return obj;
    }, []);

    const getBarcode = useCallback((item) => {
        return item.split("*")[1];
    }, []);

    return (
        <>
            <section className="remit_section">
                <div className="bill_title">LiTV 線上影視 - 超商代收繳費單（尚未繳費）</div>
                <div className="item">訂購服務：{`${props.purchaseInfo.details[0].catalog_description} ${props.purchaseInfo.details[0].package_name}`}</div>
                <div className="item">訂購日期：{props.purchaseInfo.purchase_datetime}</div>
                <div className="item">訂單編號：{props.purchaseInfo.purchase_id}</div>

                {
                    (() => {
                        if(props.accountInfo && props.accountInfo.User){
                            return (
                                <div className="item">手機號碼：{props.accountInfo.User}</div>
                            );
                        }
                    })()
                }

                <div className="item">繳費期限：{props.purchaseInfo.pay_due_date}（請務必於繳費期限內完成繳費程序，逾期將自動取消訂單）</div>
                <div className="item">應繳金額：${props.purchaseInfo.amount}</div>
                <div className="item">超商專用條碼：</div>

                <div className="barcode">
                    <Barcode className="barcode" value={getBarcode(props.purchaseInfo.bar_due_date)} width={barcodeOption.width} height={barcodeOption.height} format={barcodeOption.format} fontSize={barcodeOption.fontSize} />
                </div>
                
                <div className="barcode">
                    <Barcode className="barcode" value={getBarcode(props.purchaseInfo.bar_invo_no)} width={barcodeOption.width} height={barcodeOption.height} format={barcodeOption.format} fontSize={barcodeOption.fontSize} />
                </div>

                <div className="barcode">
                    <Barcode className="barcode" value={getBarcode(props.purchaseInfo.bar_price)} width={barcodeOption.width} height={barcodeOption.height} format={barcodeOption.format} fontSize={barcodeOption.fontSize} />
                </div>

                <div className="item store">您可以透過以下兩種方式至超商繳費：<img className="image" src={require("../../../assets/image/purchase/packageInfo/stores.png")} alt="全省超商" /></div>
                
                <div className="item">(1) 列印繳費單。</div>
                <div className="item">(2) 透過手機開啟 LiTV 網頁版，前往「個人中心 → 消費記錄 → 明細」查詢繳費條碼。</div>
            </section>

            <style jsx>
                {`
                    .remit_section{
                        overflow: hidden;

                        .bill_title{
                            background-color: #f1f1f1;
                            text-align: center;
                            line-height: 50px;
                            font-size: 18px;
                        }

                        .item{
                            position: relative;
                            font-size: 15px;
                            line-height: 35px;

                            &.store{
                                height: 40px;
                                line-height: 40px;

                                .image{
                                    position: absolute;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    height: 100%;
                                }
                            }
                        }

                        .barcode{
                            display: table;
                            margin-left: auto;
                            margin-right: auto;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
