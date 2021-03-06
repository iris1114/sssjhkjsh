
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
                <h2 className="title">????????????</h2>

                {
                    (() => {
                        if(meta){
                            return (
                                <>
                                    <table className="table_section">
                                        <thead className="table_head">
                                            <tr className="head_row">
                                                <th className="head_cell">????????????</th>
                                                <th className="head_cell">????????????</th>
                                                <th className="head_cell">??????</th>
                                                <th className="head_cell">????????????</th>
                                                <th className="head_cell">????????????</th>
                                                <th className="head_cell">??????</th>
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
                                                                                    <img className="icon" src={require("../../assets/image/member/recurrent.png")} alt="????????????" />
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
                                                                                    <div className="text">????????????</div>
                                                                                    <div className="text mark">?????????{item.pay_due_date}</div>
                                                                                </div>
                                                                            </td>
                                                                        );
                                                                    }
                                                                    else if(item.pay_status == 2){
                                                                        return (
                                                                            <td className="body_cell mark">???????????????</td>
                                                                        );
                                                                    }
                                                                    else if(item.pay_status == 3){
                                                                        return (
                                                                            <td className="body_cell">?????????</td>
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
                                                                            <td className="body_cell">??????</td>
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
                                                                <button className="more_btn" onClick={(event) => moreBtnClickHandler(event, index)} title="??????">??????</button>
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
                                                                                                    <div className="package_item" key={_index}>{_index + 1}. ???????????????{_item.catalog_description} {_item.package_name}</div>
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
                                                                                                            <div className="pay_item_title">LiTV ???????????? - ???????????????????????????????????????</div>
                                                                                                            <div className="pay_item">???????????????{item.purchase_id}</div>
                                                                                                            <div className="pay_item">???????????????{item.purchase_datetime}</div>
                                                                                                            <div className="pay_item">???????????????{item.pay_due_date}?????????????????????????????????????????????????????????????????????????????????</div>
                                                                                                            <div className="pay_item">???????????????<span className="mark">${item.amount}</span></div>
                                                                                                            <div className="pay_item">???????????????????????????</div>

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

                                                                                                            <div className="pay_item">???????????????????????????????????????????????????????????????????????? 2 ??????????????????????????????????????????????????????????????????</div>
                                                                                                        </>
                                                                                                    );
                                                                                                }
                                                                                                else if(item.pay_type == "ATM" && item.pay_status == 1){
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div className="pay_item_title">LiTV ???????????? - ATM ??????????????????????????????</div>
                                                                                                            <div className="pay_item">???????????????{item.purchase_id}</div>
                                                                                                            <div className="pay_item">???????????????{item.purchase_datetime}</div>
                                                                                                            <div className="pay_item">???????????????{item.pay_due_date}?????????????????????????????????????????????????????????????????????????????????</div>
                                                                                                            <div className="pay_item">??????????????????????????????????????????</div>
                                                                                                            <div className="pay_item">???????????????{item.bar_atm}</div>
                                                                                                            <div className="pay_item">???????????????{item.bank_code}??????????????????????????????</div>
                                                                                                            <div className="pay_item">???????????????<span className="mark">${item.amount}</span></div>
                                                                                                            <div className="pay_item">????????????????????????????????????????????? ATM ??????????????????????????? 1 ??????????????????????????????????????????????????????????????????</div>
                                                                                                        </>
                                                                                                    );
                                                                                                }
                                                                                                else if(item.pay_status == 3){
                                                                                                    return (
                                                                                                        <>
                                                                                                            <div className="pay_item">???????????????{item.purchase_id}</div>
                                                                                                            <div className="pay_item">??????????????????{item.details[0].start_date}</div>
                                                                                                            <div className="pay_item">??????????????????{item.details[0].end_date}</div>

                                                                                                            {
                                                                                                                (() => {
                                                                                                                    if(item.recurrent == "R"){
                                                                                                                        return (
                                                                                                                            <div className="pay_item">??????????????????{item.next_pay_date}</div>
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
                                                                                                    <button className="print_btn" onClick={(event) => printBtnClickHandler(event)} title="??????">??????</button>
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
                                        <img className="icon" src={require("../../assets/image/member/recurrent.png")} alt="????????????" />
                                        <div className="text">?????????????????????????????????????????????????????????????????????????????????<span className="mark">(02)7707-0708</span>???</div>
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
