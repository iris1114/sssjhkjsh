
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";

const mapStateToProps = (state) => {
    return {
        packageItem: state.purchase.packageItem,
        sumitClick: state.purchase.sumitClick,
        optionPackageItem: state.purchase.optionPackageItem
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchRecurrent: (value) => {
            dispatch({
                type: "purchase/recurrent",
                value: value
            });
        },
        dispatchInvoice: (value) => {
            dispatch({
                type: "purchase/invoice",
                value: value
            });
        },
        dispatchSumitClick: (value) => {
            dispatch({
                type: "purchase/sumitClick",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [recurrentChecked, setRecurrentChecked] = useState(false);
    const [recurrrentMoreItemsShow, setRecurrentMoreItemsShow] = useState(false);
    const [invoiceChecked, setInvoiceChecked] = useState("N");
    const [invoiceMoreItemsShow, setInvoiceMoreItemsShow] = useState(false);
    const [recurrentError, setRecurrentError] = useState(false);

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
    }, []);

    const recurrentCheckboxClickHandler = useCallback((event) => {
        setRecurrentChecked(event.target.checked);
        setRecurrentError(false);
    }, []);

    const recurrentMoreBtnClickHandler = useCallback(() => {
        setRecurrentMoreItemsShow(!recurrrentMoreItemsShow);
    }, [recurrrentMoreItemsShow]);

    const invoiceRadioChangeHandler = useCallback((event) => {
        setInvoiceChecked(event.target.value);
    }, []);

    const invoiceMoreBtnClickHandler = useCallback(() => {
        setInvoiceMoreItemsShow(!invoiceMoreItemsShow);
    }, [invoiceMoreItemsShow]);

    useEffect(() => {
        props.dispatchRecurrent(recurrentChecked);
        props.dispatchInvoice(invoiceChecked);

        return () => {
            props.dispatchRecurrent(false);
            props.dispatchInvoice(null);
        };
    }, [recurrentChecked, invoiceChecked]);

    useEffect(() => {
        if(!props.sumitClick){
            return;
        }

        if(recurrentChecked){
            return;
        }

        setRecurrentError(true);

        return () => {
            props.dispatchSumitClick(null);
        };
    }, [props.sumitClick]);

    return (
        <>
            <section className="invoice_recurrent_section">
                {
                    (() => {
                        if(props.payType == "CREDIT" && props.packageItem.recurrent && !props.optionPackageItem.modifyFlag){
                            return (
                                <div className="recurrent_section">
                                    <div className="title">自動扣款同意書：</div>

                                    <div className="checkbox_item">
                                        <input id="recurrent_checkbox" className="recurrent_checkbox" onChange={recurrentCheckboxClickHandler} checked={recurrentChecked} type="checkbox" />
                                        <label className="recurrent_checkbox_label" htmlFor="recurrent_checkbox">我同意
                                            <span className="mark">每{recurrentTime}以${props.packageItem.price}自動扣款</span>
                                        </label>
                                    </div>

                                    {
                                        (() => {
                                            if(recurrentError){
                                                return (
                                                    <div className="recurrent_error">※ 請勾選同意，即可付款</div>
                                                );
                                            }
                                        })()
                                    }

                                    <button className="more_btn" onClick={recurrentMoreBtnClickHandler}>瞭解更多 »</button>

                                    {
                                        (() => {
                                            if(recurrrentMoreItemsShow){
                                                return (
                                                    <ol className="more_items">
                                                        <li className="item">本人同意以「每{recurrentTime}自動扣款」方式購買此服務，並委託貴公司於服務到期日自本人信用卡帳戶自動扣款支付「每期應繳費用」。</li>
                                                        <li className="item">本方案為每{recurrentTime}自動扣款，不另行通知。費用每{recurrentTime}將於信用卡帳單內自動扣款，可隨時取消。</li>
                                                        <li className="item">若遇信用卡換發、補發、升級，卡號或有效期限變更、信用卡停卡，或因法院查封及其他原因，導致無法扣抵同意人應繳費用之全額時，貴公司得不經催告於服務到期時逕行終止本服務。</li>
                                                        <li className="item">如欲終止自動扣款服務，本人會電洽貴公司客服人員辦理：(02)7707-0708。</li>
                                                        <li className="item">使用優惠碼折抵或加價購商品，僅限本次消費使用，選擇每{recurrentTime}自動扣款，將於次期維持原方案之金額自動扣繳。</li>
                                                    </ol>
                                                );
                                            }
                                        })()
                                    }
                                </div>
                            );
                        }
                    })()
                }

                <div className="invoice_section">
                    <div className="title">發票捐贈：</div>

                    <div className="radio_item">
                        <input id="invoice_radio_n" className="invoice_radio" value="N" onChange={invoiceRadioChangeHandler} checked={invoiceChecked == "N"} type="radio" />
                        <label className="invoice_radio_label" htmlFor="invoice_radio_n">不捐贈</label>
                    </div>

                    <div className="radio_item">
                        <input id="invoice_radio_y" className="invoice_radio" value="Y" onChange={invoiceRadioChangeHandler} checked={invoiceChecked == "Y"} type="radio" />
                        <label className="invoice_radio_label" htmlFor="invoice_radio_y">財團法人伊甸社會福利基金會</label>
                    </div>

                    <button className="more_btn" onClick={invoiceMoreBtnClickHandler}>瞭解更多 »</button>

                    {
                        (() => {
                            if(invoiceMoreItemsShow){
                                return (
                                    <ol className="more_items">
                                        <li className="item">根據財政部令台財稅字第 0952400194 號「電子發票實施作業要點」，本公司開立電子發票，不主動寄送紙本發票。（核准文號：財北國稅松山營業字第 1000011813 號）</li>
                                        <li className="item">選擇發票捐贈者，一經開立即無法再換開發票。</li>
                                        <li className="item">選擇不捐贈者，請務必確認會員註冊資訊填寫正確，以利通知發票中獎訊息，並提供中獎發票作為兌獎憑證。</li>
                                        <li className="item">若欲索取二聯式紙本發票或三聯式發票（需統編者），請洽客服專線 (02)7707-0708 辦理。</li>
                                    </ol>
                                );
                            }
                        })()
                    }
                </div>
            </section>

            <style jsx>
                {`
                    .invoice_recurrent_section{
                        background-color: #f8f8f8;
                        margin-top: 10px;
                        padding: 10px;
                        border-radius: 5px;
                        line-height: 30px;
                        font-size: 14px;

                        .recurrent_section{
                            overflow: hidden;

                            .title{
                                width: 120px;
                                text-align: right;
                                display: inline-block;
                            }

                            .checkbox_item{
                                position: relative;
                                display: inline-block;
                                height: 30px;
                                margin-right: 10px;

                                input[type="checkbox"]{
                                    background-image: url(${require("../../../../../../assets/image/purchase/packageInfo/select/checkbox/checkbox.png")});
                                    background-size: 16px 16px;
                                    background-repeat: no-repeat;
                                    appearance: inherit;
                                    width: 16px;
                                    height: 16px;
                                    outline: 0;
                                    border: 0;

                                    &:checked{
                                        background-image: url(${require("../../../../../../assets/image/purchase/packageInfo/select/checkbox/checkboxCheck.png")});
                                    }
                                }

                                .recurrent_checkbox{
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    float: left;
                                }

                                .recurrent_checkbox_label{
                                    margin-left: 5px;
                                    text-decoration: underline;
                                    color: #000;
                                    font-weight: 700;

                                    .mark{
                                        color: #e00005;
                                    }
                                }
                            }

                            .recurrent_error{
                                display: inline-block;
                                font-weight: bold;
                                color: #ff2400;
                                margin-left: 5px;
                                margin-right: 5px;
                            }

                            .more_btn{
                                background-image: url(${require("../../../../../../assets/image/purchase/packageInfo/iconMore.png")});
                                background-size: 16px 16px;
                                background-repeat: no-repeat;
                                padding-left: 20px;
                                margin-left: 10px;
                                font-weight: bold;
                                color: #408ed6;
                            }

                            .more_items{
                                margin-left: 100px;
                                margin-top: 10px;
                                margin-bottom: 10px;

                                .item{
                                    color: #777;
                                    font-size: 13px;
                                }
                            }
                        }

                        .invoice_section{
                            overflow: hidden;

                            .title{
                                width: 120px;
                                text-align: right;
                                display: inline-block;
                            }

                            .radio_item{
                                position: relative;
                                display: inline-block;
                                height: 30px;
                                margin-right: 10px;

                                input[type="radio"]{
                                    background-image: url(${require("../../../../../../assets/image/purchase/packageInfo/select/radio/radio.png")});
                                    background-size: 16px 16px;
                                    background-repeat: no-repeat;
                                    appearance: inherit;
                                    width: 16px;
                                    height: 16px;
                                    outline: 0;
                                    border: 0;

                                    &:checked{
                                        background-image: url(${require("../../../../../../assets/image/purchase/packageInfo/select/radio/radioCheck.png")});
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
                                background-image: url(${require("../../../../../../assets/image/purchase/packageInfo/iconMore.png")});
                                background-size: 16px 16px;
                                background-repeat: no-repeat;
                                padding-left: 20px;
                                margin-left: 10px;
                                font-weight: bold;
                                color: #408ed6;
                            }

                            .more_items{
                                margin-left: 100px;
                                margin-top: 10px;
                                margin-bottom: 10px;

                                .item{
                                    color: #777;
                                    font-size: 13px;
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
