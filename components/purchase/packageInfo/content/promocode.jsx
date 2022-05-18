
import { connect } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

import api from "../../../../assets/js/api/index.js";

import message from "../../../../assets/json/message/bsmStatus.json";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        packageItem: state.purchase.packageItem,
        promocodeItem: state.purchase.promocodeItem
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
        dispatchPromocodeItem: (value) => {
            dispatch({
                type: "purchase/promocodeItem",
                value: value
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const [promocodeChecked, setPromocodeChecked] = useState(false);
    const [promocode, setPromocode] = useState("");
    const [promocodeInputClass, setPromocodeInputClass] = useState("");
    const [usePromocodeBtnDisabled, setUsePromocodeBtnDisabled] = useState(false);

    const promocodeCheckboxClickHandler = useCallback((event) => {
        props.dispatchPromocodeItem(null);
        setPromocodeChecked(event.target.checked);
        setPromocodeInputClass("");
        setUsePromocodeBtnDisabled(false);
    }, []);

    const promocodeInputChangeHandler = useCallback((event) => {
        props.dispatchPromocodeItem(null);
        setPromocode(event.target.value);
        setPromocodeInputClass("");
        setUsePromocodeBtnDisabled(false);
    }, []);

    const usePromocodeBtnClickHandler = useCallback((_promocode) => {
        if(!props.login){
            props.dispatchDialog({
                component: "login"
            });

            return;
        }

        let packageId = props.packageItem.packageId;

        setPromocodeInputClass("loading");
        setUsePromocodeBtnDisabled(true);

        api.bsm.checkPromoCode.getFetch(packageId, _promocode).then((res) => {
            let result = res.result;

            if(result.result_code == "BSM-00000"){
                setPromocodeInputClass("success");
                setUsePromocodeBtnDisabled(true);
            }
            else{
                setPromocodeInputClass("error");
                setUsePromocodeBtnDisabled(false);
            }

            props.dispatchPromocodeItem(result);
        }).catch((ex) => {
            props.dispatchPromocodeItem({
                result_code: "promocode.error.network"
            });
        });
    }, [promocode, props.login]);

    useEffect(() => {
        let promoCode = router.query.promoCode;

        if(promoCode){
            setPromocodeChecked(true);
            setPromocode(promoCode);
            usePromocodeBtnClickHandler(promoCode);
        }

        return () => {
            props.dispatchPromocodeItem(null);
        };
    }, []);

    return (
        <>
            <section className="promocode_section">
                <div className="checkbox_item">
                    <input id="promocode_checkbox" className="promocode_checkbox" onChange={promocodeCheckboxClickHandler} checked={promocodeChecked} type="checkbox" />
                    <label className="promocode_checkbox_label" htmlFor="promocode_checkbox">使用優惠碼</label>
                </div>

                {
                    (() => {
                        if(promocodeChecked){
                            return (
                                <div className="input_item">
                                    <input className={`promocode_input ${promocodeInputClass}`} onChange={promocodeInputChangeHandler} value={promocode} type="text" />
                                    <button className="use_promocode_btn" onClick={() => usePromocodeBtnClickHandler(promocode)} disabled={usePromocodeBtnDisabled}>使用</button>

                                    {
                                        (() => {
                                            if(props.promocodeItem.result_code){
                                                if(props.promocodeItem.result_code == "BSM-00000"){
                                                    return (
                                                        <>
                                                            <span className="message">{props.promocodeItem.promo_title}</span>
                                                            <span className="discount_price">-$<span className="price">{Math.abs(props.promocodeItem.discount_amount)}</span></span>
                                                        </>
                                                    );
                                                }
                                                else{
                                                    return (
                                                        <span className="message error">{message[props.promocodeItem.result_code]}</span>
                                                    );
                                                }
                                            }
                                        })()
                                    }
                                </div>
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .promocode_section{
                        margin-top: 10px;

                        .checkbox_item{
                            position: relative;
                            height: 30px;

                            input[type="checkbox"]{
                                background-image: url(${require("../../../../assets/image/purchase/packageInfo/select/checkbox/checkbox.png")});
                                background-size: 16px 16px;
                                background-repeat: no-repeat;
                                appearance: inherit;
                                width: 16px;
                                height: 16px;
                                outline: 0;
                                border: 0;

                                &:checked{
                                    background-image: url(${require("../../../../assets/image/purchase/packageInfo/select/checkbox/checkboxCheck.png")});
                                }
                            }

                            .promocode_checkbox{
                                position: relative;
                                top: 50%;
                                transform: translateY(-50%);
                                float: left;
                            }

                            .promocode_checkbox_label{
                                padding-left: 5px;
                                font-size: 14px;
                                line-height: 30px;
                            }
                        }

                        .input_item{
                            height: 36px;
                            line-height: 36px;
                            margin-left: 20px;

                            .promocode_input{
                                display: inline-block;
                                border: 1px solid #dbdbdb;
                                border-radius: 3px;
                                outline: none;
                                padding: 5px;
                                font-size: 16px;

                                &.error{
                                    border: 1px solid #ff2400;
                                }

                                &.success{
                                    background-image: url(${require("../../../../assets/image/purchase/packageInfo/iconCorrect.png")});
                                    background-size: 15px 15px;
                                    background-repeat: no-repeat;
                                    background-position: 95% center;
                                }

                                &.loading{
                                    background-image: url(${require("../../../../assets/image/purchase/packageInfo/iconLoading.gif")});
                                    background-size: 15px 15px;
                                    background-repeat: no-repeat;
                                    background-position: 95% center;
                                }
                            }

                            .use_promocode_btn{
                                display: inline-block;
                                padding-left: 15px;
                                padding-right: 15px;
                                margin-left: 10px;
                                border: 1px solid #f60;
                                border-radius: 5px;
                                font-size: 16px;
                                background-color: #f60;
                                color: #fff;
                                line-height: 28px;

                                &:disabled{
                                    background-color: #eee;
                                    color: #c2c2c2;
                                    border: 1px solid #d0d0d0;
                                    cursor: not-allowed;
                                }
                            }

                            .message{
                                font-size: 14px;
                                color: #f60;
                                margin-left: 10px;

                                &.error{
                                    color: #ff2400;
                                }
                            }

                            .discount_price{
                                font-size: 14px;
                                color: #f60;
                                float: right;

                                .price{
                                    font-size: 16px;
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
