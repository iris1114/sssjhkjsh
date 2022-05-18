
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import api from "../../../../../assets/js/api/index.js";
import tools from "../../../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        packageItem: state.purchase.packageItem,
        payMethodItem: state.purchase.payMethodItem,
        optionPackageItem: state.purchase.optionPackageItem,
        promocodeItem: state.purchase.promocodeItem,
        recurrent: state.purchase.recurrent,
        invoice: state.purchase.invoice,
        sumitClick: state.purchase.sumitClick
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
        dispatchSumitClick: (value) => {
            dispatch({
                type: "purchase/sumitClick",
                value: value
            });
        },
        dispatchPurchaseInfo: (value) => {
            dispatch({
                type: "purchase/purchaseInfo",
                value: value
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setMonthExpiry] = useState("01");
    const [expiryYear, setYearExpiry] = useState(new Date().getFullYear().toString());
    const [cvc, setCvc] = useState("");
    const [cardNumberError, setCardNumberError] = useState("");
    const [expiryError, setExpiryError] = useState("");
    const [cvcError, setCvcError] = useState("");

    const recurrentTime = useMemo(() => {
        let time = null;

        if(props.packageItem.time == "month"){
            time = "月";
        }
        else if(props.packageItem.time == "season"){
            time = "季";
        }
        else{
            time = "年";
        }

        return time;
    }, [props.packageItem]);

    const payMethodTip = useMemo(() => {
        let tip = null;

        if(props.packageItem.recurrent && !props.optionPackageItem.modifyFlag){
            if(props.packageItem.time == "year"){
                tip = `費用每${recurrentTime}將於信用卡帳單內自動扣款，可隨時取消。若不要自動扣款請選擇其他付款方式。`
            }
            else{
                tip = `費用每${recurrentTime}將於信用卡帳單內自動扣款`
            }
            return tip;
        } 
    }, [props.packageItem, props.optionPackageItem])

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

    useEffect(() => {
        if(!props.sumitClick){
            return;
        }

        props.dispatchSumitClick(null);

        if(!props.login){
            props.dispatchDialog({
                component: "login"
            });

            return;
        }

        let cardNumberPass = false;
        let cvcPass = false;
        let expiryPass = false;
        let recurrentPass = false;

        let cardNumberRegExp = /\d{4} \d{4} \d{4} \d{4}/;

        if(!cardNumber){
            setCardNumberError("請輸入卡號");
        }
        else if(!cardNumberRegExp.test(cardNumber)){
            setCardNumberError("請檢查格式");
        }
        else{
            cardNumberPass = true;
        }

        let cvcRegExp = /^\d{3}$/;

        if(!cvc){
            setCvcError("請輸入檢核碼");
        }
        else if(!cvcRegExp.test(cvc)){
            setCvcError("請檢查格式");
        }
        else{
            cvcPass = true;
        }

        if(parseInt(expiryMonth) < new Date().getMonth() + 1){
            setExpiryError("請檢查有效期限");
        }
        else{
            expiryPass = true;
        }

        if(props.packageItem.recurrent == props.recurrent){
            recurrentPass = true;
        }

        if(cardNumberPass && cvcPass && expiryPass && recurrentPass){
            let optionPackageId = null;
            let promoCode = null;

            if(props.optionPackageItem.optionPackageId){
                optionPackageId = props.optionPackageItem.optionPackageId;
            }

            if(props.promocodeItem.result_code && props.promocodeItem.result_code == "BSM-00000"){
                promoCode = props.promocodeItem.promo_code;
            }

            props.dispatchDialog({
                component: "payAuth",
                information: props.payMethodItem,
                exitIcon: false
            });

            api.bsm.webPurchase.getFetch({
                PurchaseInfo: {
                    SessionUid: tools.getSessionUid(),
                    PayType: props.payMethodItem.method,
                    CardType: creditCardType,
                    CardNumber: creditCardNumber,
                    CardExpiry: creditCardExpiry,
                    Cvc2: cvc,
                    InvoiceGiftFlg: props.invoice,
                    Details: {
                        PackageId: props.payMethodItem.sendPackageId,
                        OptionPackageId: optionPackageId
                    },
                    Extra: {
                        QueryString: location.href
                    },
                    PromoCode: promoCode
                }
            }).then((res) => {
                let result = res.result;

                api.trackLog.purchaseLog.getFetch(result);

                if(result.result_code == "BSM-00000"){
                    props.dispatchPurchaseInfo(result.purchase_list[0]);

                    if(props.optionPackageItem.modifyFlag){
                        let dialogInformation = null;
                        
                        if(props.groupId){
                            dialogInformation = props.groupId;
                        }

                        props.dispatchDialog({
                            component: "modify",
                            information: dialogInformation,
                            exitIcon: false
                        });
                    }
                    else{
                        if(props.groupId){
                            props.dispatchDialog({
                                component: "complete",
                                information: props.groupId,
                                exitIcon: false
                            });
                        }
                        else{
                            router.push("/purchase/complete");
                        }
                    }
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
    }, [props.sumitClick]);

    return (
        <>
            <section className="credit_section">
                <div className="slogan">立即刷，立即看！</div>
                <div className="pay_method_tip">{payMethodTip}</div>

                <div className="input_item">
                    <div className="card_number_input_title">卡號：</div>
                    <input className={`card_number_input ${getCardNumberInputClass}`} onChange={cardNumberInputChangeHandler} value={cardNumber} type="tel" placeholder="0000 0000 0000 0000" size="19" maxLength="19" autoComplete="cc-number" />
                    <img className="image" src={require("../../../../../assets/image/purchase/packageInfo/iconSSL.png")} alt="SSL 256bits 安全加密機制" />
                    <img className="image" src={require("../../../../../assets/image/purchase/packageInfo/iconCreditCard.png")} alt="visa, master" />

                    {
                        (() => {
                            if(cardNumberError){
                                return (
                                    <div className="card_number_input_error">{`※ ${cardNumberError}`}</div>
                                );
                            }
                        })()
                    }
                </div>

                <div className="input_item">
                    <div className="expiry_select_title">有效期限：</div>

                    <select className={`expiry_month_select ${getExpirySelectClass}`} onChange={expiryMonthSelectChangeHandler} value={expiryMonth} autoComplete="cc-exp-month">
                        {
                            tools.creditMonthOptions().map((item, index) => {
                                return (
                                    <option value={item.value} key={index}>{item.text}</option>
                                );
                            })
                        }
                    </select>

                    <div className="expiry">月</div>

                    <select className={`expiry_year_select ${getExpirySelectClass}`} onChange={expiryYearSelectChangeHandler} value={expiryYear} autoComplete="cc-exp-year">
                        {
                            tools.creditYearOptions().map((item, index) => {
                                return (
                                    <option value={item.value} key={index}>{item.text}</option>
                                );
                            })
                        }
                    </select>

                    <div className="expiry">年</div>

                    {
                        (() => {
                            if(expiryError){
                                return (
                                    <div className="expiry_select_error">{`※ ${expiryError}`}</div>
                                );
                            }
                        })()
                    }
                </div>

                <div className="input_item">
                    <div className="cvc_input_title">檢核碼：</div>
                    <input className={`cvc_input ${getCvcInputClass}`} onChange={cvcInputChangeHandler} value={cvc} type="tel" size="3" maxLength="3" autoComplete="cc-csc" />

                    {
                        (() => {
                            if(cvcError){
                                return (
                                    <div className="cvc_input_error">{`※ ${cvcError}`}</div>
                                );
                            }
                        })()
                    }
                </div>
            </section>

            <style jsx>
                {`
                    .credit_section{
                        overflow: hidden;

                        .slogan{
                            background-image: url(${require("../../../../../assets/image/purchase/packageInfo/iconFlag.png")});
                            background-size: 16px 16px;
                            background-repeat: no-repeat;
                            padding-left: 20px;
                            font-size: 16px;
                            font-weight: bold;
                            font-style: italic;
                            color: #8711aa;
                            padding-bottom: 15px;
                        }

                        .pay_method_tip{
                            padding-bottom: 10px;
                            margin-bottom: 15px;
                            border-bottom: 1px dotted #ccc;
                            font-size: 15px;
                        }

                        .input_item{
                            height: 36px;
                            line-height: 36px;
                            margin-top: 5px;

                            .card_number_input_title, .expiry_select_title, .cvc_input_title{
                                display: inline-block;
                                width: 130px;
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
                `}
            </style>
        </>
    );
};

App.propTypes = {
    groupId: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
