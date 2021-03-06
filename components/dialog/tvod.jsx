
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";

import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        },
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [packageInfo, setPackageInfo] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setMonthExpiry] = useState("01");
    const [expiryYear, setYearExpiry] = useState(new Date().getFullYear().toString());
    const [cvc, setCvc] = useState("");
    const [cardNumberError, setCardNumberError] = useState("");
    const [expiryError, setExpiryError] = useState("");
    const [cvcError, setCvcError] = useState("");
    const [invoiceChecked, setInvoiceChecked] = useState("N");
    const [invoiceMoreItemsShow, setInvoiceMoreItemsShow] = useState(false);

    const creditCardNumber = useMemo(() => {
        return cardNumber.replace(/\s/g, "");
    }, [cardNumber]);

    const creditCardType = useMemo(() => {
        let firstChar = creditCardNumber.charAt(0);
        let type = null;

        if(firstChar == "5"){
            type = "MASTER";
        }
        else if(firstChar == "3"){
            type = "JCB";
        }
        else{
            type = "VISA";
        }

        return type;
    }, [creditCardNumber]);

    const creditCardExpiry = useMemo(() => {
        return expiryYear + expiryMonth;
    }, [expiryMonth, expiryYear]);

    const getCardNumberInputClass = useMemo(() => {
        if(cardNumberError){
            return "error";
        }

        return "";
    }, [cardNumberError]);

    const getExpirySelectClass = useMemo(() => {
        if(expiryError){
            return "error";
        }

        return "";
    }, [expiryError]);

    const getCvcInputClass = useMemo(() => {
        if(cvcError){
            return "error";
        }

        return "";
    }, [cvcError]);

    const cardNumberInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");

        let _cardNumber = event.target.value;

        setCardNumber(_cardNumber);
        setCardNumberError("");
    }, []);

    const expiryMonthSelectChangeHandler = useCallback((event) => {
        setMonthExpiry(event.target.value);
        setExpiryError("");
    }, []);

    const expiryYearSelectChangeHandler = useCallback((event) => {
        setYearExpiry(event.target.value);
        setExpiryError("");
    }, []);

    const cvcInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "");

        let _cvc = event.target.value;

        setCvc(_cvc);
        setCvcError("");
    }, []);

    const invoiceRadioChangeHandler = useCallback((event) => {
        setInvoiceChecked(event.target.value);
    }, []);

    const invoiceMoreBtnClickHandler = useCallback(() => {
        setInvoiceMoreItemsShow(!invoiceMoreItemsShow);
    }, [invoiceMoreItemsShow]);

    const cancelBtnClickHandler = useCallback(() => {
        props.dispatchDialog({
            component: null
        });
    }, []);

    const sumitBtnClickHandler = useCallback(() => {
        let cardNumberPass = false;
        let cvcPass = false;
        let expiryPass = false;

        let cardNumberRegExp = /\d{4} \d{4} \d{4} \d{4}/;

        if(!cardNumber){
            setCardNumberError("???????????????");
        }
        else if(!cardNumberRegExp.test(cardNumber)){
            setCardNumberError("???????????????");
        }
        else{
            cardNumberPass = true;
        }

        let cvcRegExp = /^\d{3}$/;

        if(!cvc){
            setCvcError("??????????????????");
        }
        else if(!cvcRegExp.test(cvc)){
            setCvcError("???????????????");
        }
        else{
            cvcPass = true;
        }

        if(parseInt(expiryMonth) < new Date().getMonth() + 1){
            setExpiryError("?????????????????????");
        }
        else{
            expiryPass = true;
        }

        if(cardNumberPass && cvcPass && expiryPass){
            props.dispatchDialog({
                component: "payAuth",
                information: {
                    title: "????????????",
                    method: "CREDIT"
                },
                exitIcon: false
            });

            api.bsm.webPurchase.getFetch({
                PurchaseInfo: {
                    SessionUid: tools.getSessionUid(),
                    PayType: "CREDIT",
                    CardType: creditCardType,
                    CardNumber: creditCardNumber,
                    CardExpiry: creditCardExpiry,
                    Cvc2: cvc,
                    InvoiceGiftFlg: invoiceChecked,
                    Details: {
                        PackageId: packageInfo.package_id,
                        ItemId: props.dialog.information.content_id
                    },
                    Extra: {
                        QueryString: location.href
                    }
                }
            }).then((res) => {
                let result = res.result;

                api.trackLog.purchaseLog.getFetch(result);

                if(result.result_code == "BSM-00000"){
                    props.dispatchDialog({
                        component: "tvodComplete",
                        information: result.purchase_list[0],
                        exitIcon: false
                    });
                }
                else{
                    props.dispatchDialog({
                        component: "payError",
                        information: result
                    });
                }
            }).catch((ex) => {                
                props.dispatchDialog({
                    component: "payError",
                    information: {
                        result_code: "webpurchase.error.network"
                    }
                });
            });
        }
    }, [cardNumber, cvc, expiryMonth]);

    useEffect(() => {
        props.dispatchLoading(true);

        api.bsm.packageInfo.getFetch("TVOD").then((res) => {
            setPackageInfo(res.result[0]);
            props.dispatchLoading(false);
        }).catch((ex) => {
            props.dispatchLoading(false);

            props.dispatchDialog({
                component: null
            });
        });
    }, []);

    return (
        <>
            <section className="tvod_dialog">
                <div className="dialog_title">????????????</div>
                <div className="dialog_description">?????????????????????????????????48??????????????????????????????????????????????????????</div>

                {
                    (() => {
                        if(packageInfo){
                            return (
                                <>
                                    <div className="dialog_body">
                                        <div className="content_item">
                                            <div className="item_title">1. ?????????????????????</div>
                                            
                                            <table className="list_container">
                                                <thead className="list_head">
                                                    <tr className="head_tr">
                                                        <th className="head_th" width="10%">NO.</th>
                                                        <th className="head_th" width="50%">??????</th>
                                                        <th className="head_th" width="20%">????????????</th>
                                                        <th className="head_th" width="20%">??????</th>
                                                    </tr>
                                                </thead>

                                                <tbody className="list_body">
                                                    <tr className="body_tr">
                                                        <td className="body_td">1</td>
                                                        <td className="body_td">{props.dialog.information.title}</td>
                                                        <td className="body_td">????????????</td>
                                                        <td className="body_td">${packageInfo.price}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <div className="totle_section">???????????????????????????<span className="mark">${packageInfo.price}</span></div>
                                        </div>

                                        <div className="content_item">
                                            <div className="item_title">2. ??????????????????????????????</div>

                                            <div className="credit_section">
                                                <div className="input_item">
                                                    <div className="card_number_input_title">?????????</div>
                                                    <input className={`card_number_input ${getCardNumberInputClass}`} onChange={cardNumberInputChangeHandler} value={cardNumber} type="tel" placeholder="0000 0000 0000 0000" size="19" maxLength="19" autoComplete="cc-number" />
                                                    <img className="image" src={require("../../assets/image/purchase/packageInfo/iconSSL.png")} alt="SSL 256bits ??????????????????" />
                                                    <img className="image" src={require("../../assets/image/purchase/packageInfo/iconCreditCard.png")} alt="visa, master" />

                                                    {
                                                        (() => {
                                                            if(cardNumberError){
                                                                return (
                                                                    <div className="card_number_input_error">{`??? ${cardNumberError}`}</div>
                                                                );
                                                            }
                                                        })()
                                                    }
                                                </div>

                                                <div className="input_item">
                                                    <div className="expiry_select_title">???????????????</div>

                                                    <select className={`expiry_month_select ${getExpirySelectClass}`} onChange={expiryMonthSelectChangeHandler} value={expiryMonth} autoComplete="cc-exp-month">
                                                        {
                                                            tools.creditMonthOptions().map((item, index) => {
                                                                return (
                                                                    <option value={item.value} key={index}>{item.text}</option>
                                                                );
                                                            })
                                                        }
                                                    </select>

                                                    <div className="expiry">???</div>

                                                    <select className={`expiry_year_select ${getExpirySelectClass}`} onChange={expiryYearSelectChangeHandler} value={expiryYear} autoComplete="cc-exp-year">
                                                        {
                                                            tools.creditYearOptions().map((item, index) => {
                                                                return (
                                                                    <option value={item.value} key={index}>{item.text}</option>
                                                                );
                                                            })
                                                        }
                                                    </select>

                                                    <div className="expiry">???</div>

                                                    {
                                                        (() => {
                                                            if(expiryError){
                                                                return (
                                                                    <div className="expiry_select_error">{`??? ${expiryError}`}</div>
                                                                );
                                                            }
                                                        })()
                                                    }
                                                </div>

                                                <div className="input_item">
                                                    <div className="cvc_input_title">????????????</div>
                                                    <input className={`cvc_input ${getCvcInputClass}`} onChange={cvcInputChangeHandler} value={cvc} type="tel" size="3" maxLength="3" autoComplete="cc-csc" />

                                                    {
                                                        (() => {
                                                            if(cvcError){
                                                                return (
                                                                    <div className="cvc_input_error">{`??? ${cvcError}`}</div>
                                                                );
                                                            }
                                                        })()
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="invoice_section">
                                            <div className="title">???????????????</div>

                                            <div className="radio_item">
                                                <input id="invoice_radio_n" className="invoice_radio" value="N" onChange={invoiceRadioChangeHandler} checked={invoiceChecked == "N"} type="radio" />
                                                <label className="invoice_radio_label" htmlFor="invoice_radio_n">?????????</label>
                                            </div>

                                            <div className="radio_item">
                                                <input id="invoice_radio_y" className="invoice_radio" value="Y" onChange={invoiceRadioChangeHandler} checked={invoiceChecked == "Y"} type="radio" />
                                                <label className="invoice_radio_label" htmlFor="invoice_radio_y">???????????????????????????????????????</label>
                                            </div>

                                            <button className="more_btn" onClick={invoiceMoreBtnClickHandler}>???????????? ??</button>

                                            {
                                                (() => {
                                                    if(invoiceMoreItemsShow){
                                                        return (
                                                            <ol className="more_items">
                                                                <li className="item">????????????????????????????????? 0952400194 ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 1000011813 ??????</li>
                                                                <li className="item">???????????????????????????????????????????????????????????????</li>
                                                                <li className="item">????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</li>
                                                                <li className="item">?????????????????????????????????????????????????????????????????????????????????????????? (02)7707-0708 ?????????</li>
                                                            </ol>
                                                        );
                                                    }
                                                })()
                                            }
                                        </div>

                                        <div className="description_section">
                                            <div className="title">???????????????</div>

                                            <ol className="description_items">
                                                <li className="item">???????????????48??????????????????????????????????????????????????????</li>
                                                <li className="item">??????????????????????????????????????????48?????????????????????????????????????????????????????????????????????????????????</li>
                                                <li className="item">??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</li>
                                                <li className="item">?????????????????????????????????????????????????????????????????????</li>
                                                <li className="item">??????????????????????????????????????????????????????</li>
                                            </ol>
                                        </div>

                                        <div className="btn_section">
                                            <button className="btn cancel" onClick={cancelBtnClickHandler}>??????</button>
                                            <button className="btn sumit" onClick={sumitBtnClickHandler}>??????</button>
                                        </div>
                                    </div>
                                </>
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .tvod_dialog{
                        width: 750px;
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

                        .dialog_description{
                            margin-top: 15px;
                            font-weight: normal;
                            font-size: 18px;
                            line-height: 28px;
                            text-align: center;
                            color: #666;
                        }

                        .dialog_body{
                            .content_item{
                                margin-top: 15px;

                                .item_title{
                                    font-size: 16px;
                                    line-height: 28px;
                                    font-weight: bold;
                                }

                                .list_container{
                                    width: 100%;
                                    text-align: center;
                                    margin-top: 10px;
                                    font-size: 14px;
                                    line-height: 35px;

                                    .list_head{
                                        .head_tr{
                                            .head_th{
                                                font-weight: bold;
                                            }
                                        }
                                    }
                                }

                                .totle_section{
                                    text-align: right;
                                    font-size: 16px;
                                    font-weight: bold;
                                    line-height: 30px;
                                    padding-left: 20px;
                                    padding-right: 20px;
                                    margin-top: 20px;

                                    .mark{
                                        color: #f60;
                                    }
                                }

                                .credit_section{
                                    .input_item{
                                        height: 36px;
                                        line-height: 36px;
                                        margin-top: 5px;

                                        .card_number_input_title, .expiry_select_title, .cvc_input_title{
                                            display: inline-block;
                                            width: 100px;
                                            font-size: 14px;
                                            text-align: right;
                                        }

                                        .card_number_input, .expiry_month_select, .expiry_year_select, .cvc_input{
                                            display: inline-block;
                                            border: 1px solid #dbdbdb;
                                            border-radius: 3px;
                                            background-color: #fff;
                                            outline: none;
                                            padding: 5px;
                                            font-size: 16px;

                                            &.error{
                                                border: 1px solid #ff2400;
                                            }
                                        }

                                        .card_number_input_error, .expiry_select_error, .cvc_input_error{
                                            display: inline-block;
                                            font-size: 14px;
                                            font-weight: bold;
                                            color: #ff2400;
                                            margin-left: 5px;
                                        }

                                        .expiry{
                                            display: inline-block;
                                            font-size: 14px;
                                            padding-left: 5px;
                                            padding-right: 5px;
                                        }

                                        .image{
                                            display: block;
                                            height: 100%;
                                            float: right;
                                            margin-left: 5px;
                                            margin-right: 5px;
                                        }
                                    }
                                }                                
                            }

                            .invoice_section{
                                background-color: #f8f8f8;
                                margin-top: 15px;
                                padding: 10px;
                                border-radius: 5px;
                                line-height: 30px;
                                font-size: 14px;

                                .title{
                                    width: 90px;
                                    text-align: right;
                                    display: inline-block;
                                }

                                .radio_item{
                                    position: relative;
                                    display: inline-block;
                                    height: 30px;
                                    margin-right: 10px;

                                    input[type="radio"]{
                                        background-image: url(${require("../../assets/image/purchase/packageInfo/select/radio/radio.png")});
                                        background-size: 16px 16px;
                                        background-repeat: no-repeat;
                                        appearance: inherit;
                                        width: 16px;
                                        height: 16px;
                                        outline: 0;
                                        border: 0;

                                        &:checked{
                                            background-image: url(${require("../../assets/image/purchase/packageInfo/select/radio/radioCheck.png")});
                                        }
                                    }

                                    .invoice_radio{
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        float: left;
                                    }

                                    .invoice_radio_label{
                                        padding-left: 5px;
                                    }
                                }

                                .more_btn{
                                    background-image: url(${require("../../assets/image/purchase/packageInfo/iconMore.png")});
                                    background-size: 16px 16px;
                                    background-repeat: no-repeat;
                                    padding-left: 20px;
                                    margin-left: 10px;
                                    font-weight: bold;
                                    color: #408ed6;
                                }

                                .more_items{
                                    margin-left: 70px;
                                    margin-top: 10px;
                                    margin-bottom: 10px;

                                    .item{
                                        color: #777;
                                        font-size: 13px;
                                    }
                                }
                            }

                            .description_section{
                                line-height: 30px;
                                font-size: 14px;
                                margin-top: 15px;

                                .title{
                                    display: inline-block;
                                    width: 100px;
                                    text-align: right;
                                }

                                .description_items{
                                    display: inline-block;
                                    width: calc(100% - 100px);
                                    vertical-align: top;
                                    padding-left: 20px;
                                    margin-top: 0;
                                    margin-bottom: 0;
                                }
                            }

                            .btn_section{
                                display: table;
                                margin-left: auto;
                                margin-right: auto;
                                margin-top: 20px;

                                .btn{
                                    display: inline-block;
                                    padding-left: 15px;
                                    padding-right: 15px;
                                    margin-left: 5px;
                                    margin-right: 5px;
                                    border-radius: 5px;
                                    font-size: 16px;
                                    line-height: 40px;

                                    &.cancel{
                                        background-color: #fff;
                                        border: 1px solid #f60;
                                        color: #f60;
                                    }

                                    &.sumit{
                                        background-color: #f60;
                                        border: 1px solid #f60;
                                        color: #fff;
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
