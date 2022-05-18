
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";

import api from "../../assets/js/api/index.js";

import zipMapObject from "../../assets/json/purchase/zipMap.json";
import message from "../../assets/json/message/bsmStatus.json";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog,
        purchaseInfo: state.purchase.purchaseInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        },
        dispatchOrderInfo: (value) => {
            dispatch({
                type: "purchase/orderInfo",
                value: value
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const [orderName, setOrderName] = useState("");
    const [orderPhone, setOrderPhone] = useState("");
    const [orderEmail, setOrderEmail] = useState("");
    const [orderCounty, setOrderCounty] = useState("台北市");
    const [orderDistrict, setOrderDistrict] = useState("中正區");
    const [orderAddress, setOrderAddress] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [receiverEmail, setReceiverEmail] = useState("");
    const [receiverCounty, setReceiverCounty] = useState("台北市");
    const [receiverDistrict, setReceiverDistrict] = useState("中正區");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [asOrderChecked, setAsOrderChecked] = useState(false);
    const [orderNameError, setOrderNameError] = useState("");
    const [orderPhoneError, setOrderPhoneError] = useState("");
    const [orderEmailError, setOrderEmailError] = useState("");
    const [orderAddressError, setOrderAddressError] = useState("");
    const [receiverNameError, setReceiverNameError] = useState("");
    const [receiverPhoneError, setReceiverPhoneError] = useState("");
    const [receiverEmailError, setReceiverEmailError] = useState("");
    const [receiverAddressError, setReceiverAddressError] = useState("");
    const [modifyPurchaseError, setModifyPurchaseError] = useState("");

    const getOrderNameInputClass = useMemo(() => {
        if(orderNameError){
            return "error";
        }

        return "";
    }, [orderNameError]);

    const getOrderPhoneInputClass = useMemo(() => {
        if(orderPhoneError){
            return "error";
        }

        return "";
    }, [orderPhoneError]);

    const getOrderEmailInputClass = useMemo(() => {
        if(orderEmailError){
            return "error";
        }

        return "";
    }, [orderEmailError]);

    const getOrderAddressInputClass = useMemo(() => {
        if(orderAddressError){
            return "error";
        }

        return "";
    }, [orderAddressError]);

    const getReceiverNameInputClass = useMemo(() => {
        if(receiverNameError){
            return "error";
        }

        return "";
    }, [receiverNameError]);

    const getReceiverPhoneInputClass = useMemo(() => {
        if(receiverPhoneError){
            return "error";
        }

        return "";
    }, [receiverPhoneError]);

    const getReceiverEmailInputClass = useMemo(() => {
        if(receiverEmailError){
            return "error";
        }

        return "";
    }, [receiverEmailError]);

    const getReceiverAddressInputClass = useMemo(() => {
        if(receiverAddressError){
            return "error";
        }

        return "";
    }, [receiverAddressError]);

    const contractHref = useMemo(() => {
        return `${litv.config.fino}/tos/pc.html`;
    }, []);

    const county = useMemo(() => {
        return Object.keys(zipMapObject);
    }, []);

    const district = useMemo(() => {
        return {
            order: Object.keys(zipMapObject[orderCounty]),
            receiver: Object.keys(zipMapObject[receiverCounty])
        };
    }, [orderCounty, receiverCounty]);

    const zipCode = useMemo(() => {
        return {
            order: zipMapObject[orderCounty][orderDistrict],
            receiver: zipMapObject[receiverCounty][receiverDistrict]
        };
    }, [orderCounty, orderDistrict, receiverCounty, receiverDistrict]);

    const orderNameInputChangeHandler = useCallback((event) => {
        setOrderName(event.target.value);
        setOrderNameError("");
    }, []);

    const orderPhoneInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "");

        setOrderPhone(event.target.value);
        setOrderPhoneError("");
    }, []);

    const orderEmailInputChangeHandler = useCallback((event) => {
        setOrderEmail(event.target.value);
        setOrderEmailError("");
    }, []);

    const orderCountySelectChangeHandler = useCallback((event) => {
        setOrderCounty(event.target.value);
    }, []);

    const orderDistrictSelectChangeHandler = useCallback((event) => {
        setOrderDistrict(event.target.value);
    }, []);

    const orderAddressInputChangeHandler = useCallback((event) => {
        setOrderAddress(event.target.value);
        setOrderAddressError("");
    }, []);

    const receiverNameInputChangeHandler = useCallback((event) => {
        setReceiverName(event.target.value);
        setReceiverNameError("");
    }, []);

    const receiverPhoneInputChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "");

        setReceiverPhone(event.target.value);
        setReceiverPhoneError("");
    }, []);

    const receiverEmailInputChangeHandler = useCallback((event) => {
        setReceiverEmail(event.target.value);
        setReceiverEmailError("");
    }, []);

    const receiverCountySelectChangeHandler = useCallback((event) => {
        setReceiverCounty(event.target.value);
    }, []);

    const receiverDistrictSelectChangeHandler = useCallback((event) => {
        setReceiverDistrict(event.target.value);
    }, []);

    const receiverAddressInputChangeHandler = useCallback((event) => {
        setReceiverAddress(event.target.value);
        setReceiverAddressError("");
    }, []);

    const asOrderCheckboxClickHandler = useCallback((event) => {
        setAsOrderChecked(event.target.checked);
    }, []);

    const sumitBtnClickHandler = useCallback(() => {
        let orderNamePass = false;
        let orderPhonePass = false;
        let orderEmailPass = false;
        let orderAddressPass = false;
        let receiverNamePass = false;
        let receiverPhonePass = false;
        let receiverEmailPass = false;
        let receiverAddressPass = false;

        let phoneRegExp = /[0][0-9]{7,9}/;
        let emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!orderName){
            setOrderNameError("請輸入姓名");
        }
        else{
            orderNamePass = true;
        }

        if(!orderPhone){
            setOrderPhoneError("請輸入電話或手機號碼");
        }
        else if(!phoneRegExp.test(orderPhone)){
            setOrderPhoneError("請檢查格式");
        }
        else{
            orderPhonePass = true;
        }

        if(!orderEmail){
            setOrderEmailError("請輸入電子信箱");
        }
        else if(!emailRegExp.test(orderEmail)){
            setOrderEmailError("請檢查格式");
        }
        else{
            orderEmailPass = true;
        }

        if(!orderAddress){
            setOrderAddressError("請輸入地址");
        }
        else{
            orderAddressPass = true;
        }

        if(!receiverName){
            setReceiverNameError("請輸入姓名");
        }
        else{
            receiverNamePass = true;
        }

        if(!receiverPhone){
            setReceiverPhoneError("請輸入電話或手機號碼");
        }
        else if(!phoneRegExp.test(receiverPhone)){
            setReceiverPhoneError("請檢查格式");
        }
        else{
            receiverPhonePass = true;
        }

        if(!receiverEmail){
            setReceiverEmailError("請輸入電子信箱");
        }
        else if(!emailRegExp.test(receiverEmail)){
            setReceiverEmailError("請檢查格式");
        }
        else{
            receiverEmailPass = true;
        }

        if(!receiverAddress){
            setReceiverAddressError("請輸入地址");
        }
        else{
            receiverAddressPass = true;
        }

        if(orderNamePass && orderPhonePass && orderEmailPass && orderAddressPass && receiverNamePass && receiverPhonePass && receiverEmailPass && receiverAddressPass){
            props.dispatchLoading(true);

            api.bsm.modifyPurchase.getFetch({
                purchaseId: props.purchaseInfo.purchase_id,
                Order: {
                    OrderName: orderName,
                    OrderPhoneNumber: orderPhone,
                    OrderAddress: `${orderCounty}${orderDistrict}${orderAddress}`,
                    OrderEmail: orderEmail,
                    OrderPostal: zipCode.order,
                    OrderCounty: orderCounty,
                    OrderDistrict: orderDistrict,
                    ReceiverName: receiverName,
                    ReceiverPhoneNumber: receiverPhone,
                    ReceiverAddress: `${receiverCounty}${receiverDistrict}${receiverAddress}`,
                    ReceiverEmail: receiverEmail,
                    ReceiverPostal: zipCode.receiver,
                    ReceiverCounty: receiverCounty,
                    ReceiverDistrict: receiverDistrict,
                    Remarks: ""
                }
            }).then((res) => {
                let result = res.result;

                if(result.result_code == "BSM-00000"){
                    props.dispatchOrderInfo({
                        orderName: orderName,
                        orderPhone: orderPhone,
                        orderEmail: orderEmail,
                        orderAddress: `${zipCode.order} ${orderCounty}${orderDistrict}${orderAddress}`,
                        receiverName: receiverName,
                        receiverPhone: receiverPhone,
                        receiverEmail: receiverEmail,
                        receiverAddress: `${zipCode.receiver} ${receiverCounty}${receiverDistrict}${receiverAddress}`
                    });

                    if(props.dialog.information){
                        props.dispatchDialog({
                            component: "complete",
                            information: props.dialog.information,
                            exitIcon: false
                        });
                    }
                    else{
                        router.push("/purchase/complete");
                    }
                }
                else{
                    setModifyPurchaseError(message["modifypurchase.error.network"]);
                }

                props.dispatchLoading(false);
            }).catch((ex) => {
                setModifyPurchaseError(message["modifypurchase.error.network"]);
                props.dispatchLoading(false);
            });
        }
    }, [orderName, orderPhone, orderEmail, orderAddress, receiverName, receiverPhone, receiverEmail, receiverAddress]);

    useEffect(() => {
        setOrderDistrict(district.order[0]);
    }, [orderCounty]);

    useEffect(() => {
        if(asOrderChecked){
            return;
        }

        setReceiverDistrict(district.receiver[0]);
    }, [asOrderChecked, receiverCounty]);

    useEffect(() => {
        if(asOrderChecked){
            setReceiverName(orderName);
            setReceiverPhone(orderPhone);
            setReceiverEmail(orderEmail);
            setReceiverCounty(orderCounty);
            setReceiverDistrict(orderDistrict);
            setReceiverAddress(orderAddress);
        }
        else{
            setReceiverName("");
            setReceiverPhone("");
            setReceiverEmail("");
            setReceiverCounty("台北市");
            setReceiverDistrict("中正區");
            setReceiverAddress("");
        }
    }, [asOrderChecked]);

    return (
        <>
            <section className="modify_dialog">
                <div className="dialog_title">訂單已成立，請填寫配送資訊</div>
                <div className="dialog_subtitle">填寫完成後，免費領取4K電視盒</div>

                {
                    (() => {
                        if(modifyPurchaseError){
                            return (
                                <div className="modify_purchase_error">{`※ ${modifyPurchaseError}`}</div>
                            );
                        }
                    })()
                }

                <div className="dialog_description">
                    <div className="order_info_item">
                        <div className="item_title">購買人資訊</div>

                        <div className="order_info">
                            <div className="input_item">
                                <div className="input_title">姓&emsp;&emsp;名：</div>
                                <input className={`input ${getOrderNameInputClass}`} onChange={orderNameInputChangeHandler} value={orderName} type="text" placeholder="請填寫真實姓名" />

                                {
                                    (() => {
                                        if(orderNameError){
                                            return (
                                                <div className="input_error">{`※ ${orderNameError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>

                            <div className="input_item">
                                <div className="input_title">聯絡電話：</div>
                                <input className={`input ${getOrderPhoneInputClass}`} onChange={orderPhoneInputChangeHandler} value={orderPhone} type="tel" placeholder="請填寫電話或手機號碼" maxLength="10" />

                                {
                                    (() => {
                                        if(orderPhoneError){
                                            return (
                                                <div className="input_error">{`※ ${orderPhoneError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>

                            <div className="input_item">
                                <div className="input_title">電子信箱：</div>
                                <input className={`input ${getOrderEmailInputClass}`} onChange={orderEmailInputChangeHandler} value={orderEmail} type="text" placeholder="請填寫電子信箱" />

                                {
                                    (() => {
                                        if(orderEmailError){
                                            return (
                                                <div className="input_error">{`※ ${orderEmailError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>

                            <div className="input_item">
                                <div className="input_title">地&emsp;&emsp;址：</div>

                                <select className="select" onChange={orderCountySelectChangeHandler} value={orderCounty}>
                                    {
                                        county.map((item, index) => {
                                            return (
                                                <option value={item} key={index}>{item}</option>
                                            );
                                        })
                                    }
                                </select>

                                <select className="select" onChange={orderDistrictSelectChangeHandler} value={orderDistrict}>
                                    {
                                        district.order.map((item, index) => {
                                            return (
                                                <option value={item} key={index}>{item}</option>
                                            );
                                        })
                                    }
                                </select>

                                <input className="input" value={zipCode.order || ""} type="text" readOnly="readonly" size="3" />
                                <input className={`input address ${getOrderAddressInputClass}`} onChange={orderAddressInputChangeHandler} value={orderAddress} type="text" />

                                {
                                    (() => {
                                        if(orderAddressError){
                                            return (
                                                <div className="input_error">{`※ ${orderAddressError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>
                        </div>
                    </div>

                    <div className="order_info_item">
                        <div className="item_title">
                            <div className="title">收件人資訊</div>

                            <div className="checkbox_item">
                                <input id="as_order_checkbox" className="as_order_checkbox" onChange={asOrderCheckboxClickHandler} checked={asOrderChecked} type="checkbox" />
                                <label className="as_order_checkbox_label" htmlFor="as_order_checkbox">同購買人資訊</label>
                            </div>
                        </div>

                        <div className="order_info">
                            <div className="input_item">
                                <div className="input_title">姓&emsp;&emsp;名：</div>
                                <input className={`input ${getReceiverNameInputClass}`} onChange={receiverNameInputChangeHandler} value={receiverName} type="text" placeholder="請填寫真實姓名" />

                                {
                                    (() => {
                                        if(receiverNameError){
                                            return (
                                                <div className="input_error">{`※ ${receiverNameError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>

                            <div className="input_item">
                                <div className="input_title">聯絡電話：</div>
                                <input className={`input ${getReceiverPhoneInputClass}`} onChange={receiverPhoneInputChangeHandler} value={receiverPhone} type="tel" placeholder="請填寫電話或手機號碼" maxLength="10" />

                                {
                                    (() => {
                                        if(receiverPhoneError){
                                            return (
                                                <div className="input_error">{`※ ${receiverPhoneError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>

                            <div className="input_item">
                                <div className="input_title">電子信箱：</div>
                                <input className={`input ${getReceiverEmailInputClass}`} onChange={receiverEmailInputChangeHandler} value={receiverEmail} type="text" placeholder="請填寫電子信箱" />

                                {
                                    (() => {
                                        if(receiverEmailError){
                                            return (
                                                <div className="input_error">{`※ ${receiverEmailError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>

                            <div className="input_item">
                                <div className="input_title">地&emsp;&emsp;址：</div>

                                <select className="select" onChange={receiverCountySelectChangeHandler} value={receiverCounty}>
                                    {
                                        county.map((item, index) => {
                                            return (
                                                <option value={item} key={index}>{item}</option>
                                            );
                                        })
                                    }
                                </select>

                                <select className="select" onChange={receiverDistrictSelectChangeHandler} value={receiverDistrict}>
                                    {
                                        district.receiver.map((item, index) => {
                                            return (
                                                <option value={item} key={index}>{item}</option>
                                            );
                                        })
                                    }
                                </select>

                                <input className="input" value={zipCode.receiver || ""} type="text" readOnly="readonly" size="3" />
                                <input className={`input address ${getReceiverAddressInputClass}`} onChange={receiverAddressInputChangeHandler} value={receiverAddress} type="text" />

                                {
                                    (() => {
                                        if(receiverAddressError){
                                            return (
                                                <div className="input_error">{`※ ${receiverAddressError}`}</div>
                                            );
                                        }
                                    })()
                                }
                            </div>                            
                        </div>
                    </div>

                    <div className="more_items_section">
                        <ul className="more_items">
                            <li className="item">4K電視盒的寄送將於訂單確認後五個工作日內送達（不包含週六、日及國定假日）。</li>
                            <li className="item">其餘規範請參考<a className="link" href={contractHref} target="_blank">服務條款</a>。</li>
                        </ul>
                    </div>

                    <button className="sumit_btn" onClick={sumitBtnClickHandler}>確認配送資訊</button>
                </div>
            </section>

            <style jsx>
                {`
                    .modify_dialog{
                        width: 750px;
                        background-color: #fff;
                        padding: 15px;

                        .dialog_title{
                            font-size: 20px;
                            line-height: 35px;
                            font-weight: bold;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .dialog_subtitle{
                            font-size: 16px;
                            line-height: 35px;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #f60;
                        }

                        .modify_purchase_error{
                            font-size: 16px;
                            line-height: 35px;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #ff2400;
                        }

                        .dialog_description{
                            margin-top: 10px;

                            .order_info_item{
                                position: relative;
                                border: 1px solid #ccc;
                                border-bottom: none;

                                .item_title{
                                    font-size: 16px;
                                    font-weight: bold;
                                    line-height: 40px;
                                    padding-left: 20px;
                                    background-image: -webkit-linear-gradient(90deg, #e6e6e6, #f6f6f6);
                                    border-bottom: 1px solid #ccc;

                                    .title{
                                        display: inline-block;
                                    }

                                    .checkbox_item{
                                        position: relative;
                                        display: inline-block;
                                        height: 40px;
                                        margin-left: 20px;

                                        input[type="checkbox"]{
                                            background-image: url(${require("../../assets/image/purchase/packageInfo/select/checkbox/checkbox.png")});
                                            background-size: 16px 16px;
                                            background-repeat: no-repeat;
                                            appearance: inherit;
                                            width: 16px;
                                            height: 16px;
                                            outline: 0;
                                            border: 0;

                                            &:checked{
                                                background-image: url(${require("../../assets/image/purchase/packageInfo/select/checkbox/checkboxCheck.png")});
                                            }
                                        }

                                        .as_order_checkbox{
                                            position: relative;
                                            top: 50%;
                                            transform: translateY(-50%);
                                            float: left;
                                        }

                                        .as_order_checkbox_label{
                                            padding-left: 5px;
                                        }
                                    }
                                }

                                .order_info{
                                    padding-left: 40px;
                                    padding-right: 40px;
                                    padding-top: 20px;
                                    padding-bottom: 20px;

                                    .input_item{
                                        line-height: 35px;
                                        margin-top: 5px;

                                        &:first-of-type{
                                            margin-top: 0;
                                        }

                                        .input_title{
                                            display: inline-block;
                                            font-size: 14px;
                                        }

                                        .input, .select{
                                            display: inline-block;
                                            border: 1px solid #dbdbdb;
                                            border-radius: 3px;
                                            background-color: #fff;
                                            outline: none;
                                            padding: 5px;
                                            font-size: 14px;
                                            margin-left: 5px;
                                            margin-right: 5px;

                                            &.address{
                                                width: 60%;
                                                margin-left: 75px;
                                            }

                                            &.error{
                                                border: 1px solid #ff2400;
                                            }
                                        }

                                        .input_error{
                                            display: inline-block;
                                            font-size: 14px;
                                            font-weight: bold;
                                            color: #ff2400;
                                            margin-left: 5px;
                                        }
                                    }
                                }
                            }

                            .more_items_section{
                                border: 1px solid #ccc;
                                border-top: none;
                                padding-top: 10px;
                                padding-bottom: 10px;
                                background-color: #f8f8f8;
                                color: #777;

                                .more_items{
                                    margin: 0;

                                    .item{
                                        line-height: 25px;
                                        font-size: 14px;

                                        .link{
                                            text-decoration: underline;
                                        }
                                    }
                                }
                            }

                            .sumit_btn{
                                display: table;
                                margin-top: 20px;
                                margin-left: auto;
                                margin-right: auto;
                                padding-left: 15px;
                                padding-right: 15px;
                                border-radius: 5px;
                                background-color: #f60;
                                color: #fff;
                                font-size: 16px;
                                line-height: 40px;
                                border: 1px solid #f60;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
