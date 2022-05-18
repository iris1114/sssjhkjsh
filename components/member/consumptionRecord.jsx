
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Barcode from "react-barcode";

import payTypeMap from "../../assets/json/purchase/payTypeMap.json";

import api from "../../assets/js/api/index.js";

const mapStateToProps = (state) => {
    return {};
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
    const payItemsRef = useRef(null);

    const [meta, setMeta] = useState(null);
    const [moreDisplays, setMoreDisplays] = useState([]);

    const barcodeOption = useMemo(() => {
        return {
            width: 1,
            height: 50,
            format: "CODE39",
            fontSize: 15
        };
    }, []);

    const moreBtnClickHandler = useCallback((event, index) => {
        let _moreDisplays = [];

        for(let i = 0; i < meta.length; i ++){
            if(i == index){
                if(moreDisplays[index]){
                    _moreDisplays.push(false);
                }
                else{
                    _moreDisplays.push(true);
                }
            }
            else{
                _moreDisplays.push(false);
            }
        }

        setMoreDisplays(_moreDisplays);
    }, [meta, moreDisplays]);

    const printBtnClickHandler = useCallback((event) => {
        let payItemsHTML = payItemsRef.current.innerHTML;
        let printWindow = open();

        printWindow.document.write(payItemsHTML);
        printWindow.print();
        printWindow.close();
    }, []);

    const getBarcode = useCallback((item) => {
        return item.split("*")[1];
    }, []);

    useEffect(() => {
        if(!meta){
            return;
        }

        let _moreDisplays = [];

        for(let i = 0; i < meta.length; i ++){
            _moreDisplays.push(false);
        }

        setMoreDisplays(_moreDisplays);
    }, [meta]);

    useEffect(() => {
        let unmounted = false;

        props.dispatchLoading(true);

        api.bsm.purchaseInfo.getFetch().then((res) => {
            if(!unmounted){
                props.dispatchLoading(false);
                setMeta(res.result);
            }
        });

        return () => {
            unmounted = true;
        };
    }, []);

    return (
        <>
            <div className="comsumption_record_section">
                <h2 className="title">消費紀錄</h2>

                {
                    (() => {
                        if(meta){
                            return (
                                <>
                                    <table className="table_section">
                                        <thead className="table_head">
                                            <tr className="head_row">
                                                <th className="head_cell">購買日期</th>
                                                <th className="head_cell">訂單編號</th>
                                                <th className="head_cell">總價</th>
                                                <th className="head_cell">付款方式</th>
                                                <th className="head_cell">繳費狀態</th>
                                                <th className="head_cell">發票</th>
                                                <th className="head_cell"></th>
                                            </tr>
                                        </thead>
                                        
                                        {
                                            meta.map((item, index) => {
                                                return (
                                                    <tbody className="table_body" key={index}>
                                                        <tr className="body_row">
                                                            {
                                                                (() => {
                                                                    if(item.recurrent == "R"){
                                                                        return (
                                                                            <td className="body_cell">
                                                                                <div className="flex_container">
                                                                                    <img className="icon" src={require("../../assets/image/member/recurrent.png")} alt="自動扣款" />
                                                                                    <div className="text">{item.purchase_datetime}</div>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <td className="body_cell">{item.purchase_datetime}</td>
                                                                        );
                                                                    }
                                                                })()
                                                            }

                                                            <td className="body_cell">{item.purchase_id}</td>

                                                            {
                                                                (() => {
                                                                    if(item.amount > 0){
                                                                        return (
                                                                            <td className="body_cell">${item.amount}</td>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <td className="body_cell">--</td>
                                                                        );
                                                                    }
                                                                })()
                                                            }

                                                            <td className="body_cell">{payTypeMap[item.pay_type]}</td>

                                                            {
                                                                (() => {
                                                                    if(item.pay_type == "COUPON" || item.pay_type == "GIFT"){
                                                                        return (
                                                                            <td className="body_cell">--</td>
                                                                        );
                                                                    }
                                                                    else if(item.pay_status == 1){
                                                                        return (
                                                                            <td className="body_cell">
                                                                                <div className="flex_container column">
                                                                                    <div className="text">尚未繳費</div>
                                                                                    <div className="text mark">期限：{item.pay_due_date}</div>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    else if(item.pay_status == 2){
                                                                        return (
                                                                            <td className="body_cell mark">逾期未繳費</td>
                                                                        );
                                                                    }
                                                                    else if(item.pay_status == 3){
                                                                        return (
                                                                            <td className="body_cell">已繳款</td>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <td className="body_cell">--</td>
                                                                        );
                                                                    }
                                                                })()
                                                            }

                                                            {
                                                                (() => {
                                                                    if(item.invoice_gift_flg == "Y"){
                                                                        return (
                                                                            <td className="body_cell">捐贈</td>
                                                                        );
                                                                    }
                                                                    else if(item.invoice_gift_flg == "N"){
                                                                        return (
                                                                            <td className="body_cell">{item.invoice_no}</td>
                                                                        );
                                                                    }
                                                                    else{
                                                                        return (
                                                                            <td className="body_cell">--</td>
                                                                        );
                                                                    }
                                                                })()
                                                            }

                                                            <td className="body_cell">
                                                                <button className="more_btn" onClick={(event) => moreBtnClickHandler(event, index)} title="明細">明細</button>
                                                            </td>
                                                        </tr>

                                                        {
                                                            (() => {
                                                                if(moreDisplays[index]){
                                                                    return (
                                                                        <tr className="body_row">
                                                                            <td className="body_cell" colSpan="7">
                                                                                <div className="more_section">
                                                                                    <div className="package_items">
                                                                                        {
                                                                                            item.details.map((_item, _index) => {
                                                                                                return (
                                                                                                    <div className="package_item" key={_index}>{_index + 1}. 訂購項目：{_item.catalog_description} {_item.package_name}</div>
                                                                                                );
                                                                                            })
                                                                                        }
                                                                                    </div>

                                                                                    <div className="pay_items" ref={payItemsRef}>
                                                                                        {
                                                                                            (() => {
                                                                                                if(item.pay_type == "REMIT" && item.pay_status == 1){
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div className="pay_item_title">LiTV 線上影視 - 超商代收繳費單（尚未繳費）</div>
                                                                                                            <div className="pay_item">訂單編號：{item.purchase_id}</div>
                                                                                                            <div className="pay_item">訂購日期：{item.purchase_datetime}</div>
                                                                                                            <div className="pay_item">繳費期限：{item.pay_due_date}（請務必於繳費期限內完成繳費程序，逾期將自動取消訂單）</div>
                                                                                                            <div className="pay_item">應繳金額：<span className="mark">${item.amount}</span></div>
                                                                                                            <div className="pay_item">便利商店專用條碼：</div>

                                                                                                            <div className="barcode_section">
                                                                                                                <div className="barcode">
                                                                                                                    <Barcode value={getBarcode(item.bar_due_date)} width={barcodeOption.width} height={barcodeOption.height} format={barcodeOption.format} fontSize={barcodeOption.fontSize} />
                                                                                                                </div>

                                                                                                                <div className="barcode">
                                                                                                                    <Barcode value={getBarcode(item.bar_invo_no)} width={barcodeOption.width} height={barcodeOption.height} format={barcodeOption.format} fontSize={barcodeOption.fontSize} />
                                                                                                                </div>

                                                                                                                <div className="barcode">
                                                                                                                    <Barcode value={getBarcode(item.bar_price)} width={barcodeOption.width} height={barcodeOption.height} format={barcodeOption.format} fontSize={barcodeOption.fontSize} />
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            <div className="pay_item">貼心叮嚀：請您於繳費期限內完成繳費；完成繳費後約 2 個工作天始能開啟服務，並請留意手機簡訊通知。</div>
                                                                                                        </>
                                                                                                    );
                                                                                                }
                                                                                                else if(item.pay_type == "ATM" && item.pay_status == 1){
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div className="pay_item_title">LiTV 線上影視 - ATM 轉帳資訊（尚未繳費）</div>
                                                                                                            <div className="pay_item">訂單編號：{item.purchase_id}</div>
                                                                                                            <div className="pay_item">訂購日期：{item.purchase_datetime}</div>
                                                                                                            <div className="pay_item">繳費期限：{item.pay_due_date}（請務必於繳費期限內完成繳費程序，逾期將自動取消訂單）</div>
                                                                                                            <div className="pay_item">戶名：替您錄科技股份有限公司</div>
                                                                                                            <div className="pay_item">轉帳帳號：{item.bar_atm}</div>
                                                                                                            <div className="pay_item">銀行代碼：{item.bank_code}（台新國際商業銀行）</div>
                                                                                                            <div className="pay_item">應繳金額：<span className="mark">${item.amount}</span></div>
                                                                                                            <div className="pay_item">貼心叮嚀：請您於繳費期限內完成 ATM 轉帳；轉帳成功後約 1 個工作天始能開啟服務，並請留意手機簡訊通知。</div>
                                                                                                        </>
                                                                                                    );
                                                                                                }
                                                                                                else if(item.pay_status == 3){
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div className="pay_item">訂單編號：{item.purchase_id}</div>
                                                                                                            <div className="pay_item">服務起始日：{item.details[0].start_date}</div>
                                                                                                            <div className="pay_item">服務到期日：{item.details[0].end_date}</div>

                                                                                                            {
                                                                                                                (() => {
                                                                                                                    if(item.recurrent == "R"){
                                                                                                                        return (
                                                                                                                            <div className="pay_item">下次扣款日：{item.next_pay_date}</div>
                                                                                                                        );
                                                                                                                    }
                                                                                                                })()
                                                                                                            }
                                                                                                        </>
                                                                                                    );
                                                                                                }
                                                                                            })()
                                                                                        }
                                                                                    </div>


                                                                                    {
                                                                                        (() => {
                                                                                            if(item.pay_status == 1){
                                                                                                return (
                                                                                                    <button className="print_btn" onClick={(event) => printBtnClickHandler(event)} title="列印">列印</button>
                                                                                                );
                                                                                            }
                                                                                        })()
                                                                                    }
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            })()
                                                        }
                                                    </tbody>
                                                );
                                            })
                                        }
                                    </table>

                                    <div className="explain_section">
                                        <img className="icon" src={require("../../assets/image/member/recurrent.png")} alt="自動扣款" />
                                        <div className="text">為自動扣款符號，若您欲取消或有任何問題，請洽客服專線：<span className="mark">(02)7707-0708</span>。</div>
                                    </div>
                                </>
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .comsumption_record_section{
                        .title{
                            font-size: 22px;
                            line-height: 30px;
                        }

                        .table_section{
                            width: 100%;
                            margin-top: 20px;

                            .table_head{
                                background-color: #f1f1f1;

                                .head_row{
                                    .head_cell{
                                        border-left: none;
                                        border-right: none;
                                        font-weight: bold;
                                        line-height: 30px;
                                        text-align: left;
                                        padding: 5px 10px;
                                    }
                                }
                            }

                            .table_body{
                                .body_row{
                                    .body_cell{
                                        border-left: none;
                                        border-right: none;
                                        font-size: 15px;
                                        line-height: 30px;
                                        padding: 5px 10px;

                                        &.mark{
                                            color: #ff2400;
                                        }

                                        .flex_container{
                                            display: flex;
                                            flex-direction: row;
                                            flex-wrap: wrap;
                                            justify-content: flex-start;
                                            align-items: center;

                                            &.column{
                                                flex-direction: column;
                                                justify-content: center;
                                                align-items: flex-start;

                                                .text{
                                                    margin-left: 0;

                                                    &.mark{
                                                        color: #ff2400;
                                                    }
                                                }
                                            }

                                            .icon{
                                                display: block;
                                                width: 23px;
                                                height: 22px;
                                            }

                                            .text{
                                                margin-left: 5px;
                                            }
                                        }

                                        .more_btn{
                                            color: #408ed6;
                                        }

                                        .more_section{
                                            .pay_items{
                                                .pay_item_title{
                                                    background-color: #f1f1f1;
                                                    font-size: 18px;
                                                    font-weight: bold;
                                                    line-height: 30px;
                                                    text-align: center;
                                                    padding: 10px 0;
                                                    margin: 10px 0;
                                                }

                                                .pay_item{
                                                    .mark{
                                                        font-size: 22px;
                                                        color: #ff2400;
                                                    }
                                                }

                                                .barcode_section{
                                                    .barcode{
                                                        display: table;
                                                    }
                                                }                                                
                                            }

                                            .print_btn{
                                                line-height: 30px;
                                                padding-left: 10px;
                                                padding-right: 10px;
                                                margin-right: 10px;
                                                margin-top: 10px;
                                                margin-bottom: 10px;
                                                background-color: #f60;
                                                border: 1px solid #f60;
                                                color: #fff;
                                                border-radius: 5px;
                                                font-size: 16px;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        .explain_section{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: wrap;
                            justify-content: flex-start;
                            align-items: center;
                            margin-top: 20px;
                            padding: 0 15px;

                            .icon{
                                display: block;
                                width: 23px;
                                height: 22px;
                            }

                            .text{
                                margin-left: 5px;
                                line-height: 30px;

                                .mark{
                                    color: #8711aa;
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
