
import { connect } from "react-redux";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import keycode from "keycode";

import bsmStatusMap from "../../../../assets/json/message/bsmStatus.json";

import api from "../../../../assets/js/api/index.js";

import Step from "./step.jsx";
import Faq from "./faq.jsx";
import Copyright from "./copyright.jsx";

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
    const couponInput01Ref = useRef(null);
    const couponInput02Ref = useRef(null);
    const couponInput03Ref = useRef(null);
    const couponInput04Ref = useRef(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [couponInput01, setCouponInput01] = useState("");
    const [couponInput02, setCouponInput02] = useState("");
    const [couponInput03, setCouponInput03] = useState("");
    const [couponInput04, setCouponInput04] = useState("");
    const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);

    const couponInputComplete = useMemo(() => {
        return couponInput01 + couponInput02 + couponInput03 + couponInput04;
    }, [couponInput01, couponInput02, couponInput03, couponInput04]);

    const couponInputErrorClass = useMemo(() => {
        if(errorMessage){
            return "error";
        }

        return "";
    }, [errorMessage]);

    const couponInput01ChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "");

        let _couponInput01 = event.target.value;

        if(_couponInput01.length >= 4){
            couponInput02Ref.current.focus();
        }

        setErrorMessage("");
        setCouponInput01(_couponInput01);
    }, []);

    const couponInput02ChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "");

        let _couponInput02 = event.target.value;

        if(_couponInput02.length >= 4){
            couponInput03Ref.current.focus();
        }

        setErrorMessage("");
        setCouponInput02(_couponInput02);
    }, []);

    const couponInput03ChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "");

        let _couponInput03 = event.target.value;

        if(_couponInput03.length >= 4){
            couponInput04Ref.current.focus();
        }

        setErrorMessage("");
        setCouponInput03(_couponInput03);
    }, []);

    const couponInput04ChangeHandler = useCallback((event) => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, "");

        let _couponInput04 = event.target.value;

        setErrorMessage("");
        setCouponInput04(_couponInput04);
    }, []);

    const couponInput01KeyDownHandler = useCallback((event) => {
        //
    }, []);

    const couponInput02KeyDownHandler = useCallback((event) => {
        if(keycode.isEventKey(event, "backspace")){
            if(couponInput02.length <= 1){
                setCouponInput02("");
                couponInput01Ref.current.focus();
            }
        }
    }, [couponInput02]);

    const couponInput03KeyDownHandler = useCallback((event) => {
        if(keycode.isEventKey(event, "backspace")){
            if(couponInput03.length <= 1){
                setCouponInput03("");
                couponInput02Ref.current.focus();
            }
        }
    }, [couponInput03]);

    const couponInput04KeyDownHandler = useCallback((event) => {
        if(keycode.isEventKey(event, "backspace")){
            if(couponInput04.length <= 1){
                setCouponInput04("");
                couponInput03Ref.current.focus();
            }
        }
    }, [couponInput04]);

    const submitBtnClickHandler = useCallback((event) => {
        props.dispatchLoading(true);

        api.bsm.registerCoupon.getFetch(couponInputComplete).then((res) => {
            if(res.error){
                setErrorMessage(res.error);
                setCouponInput01("");
                setCouponInput02("");
                setCouponInput03("");
                setCouponInput04("");
            }
            else{
                let result = res.result;
                let resultCode = result.result_code;

                if(resultCode == "BSM-00000" || resultCode == "BSM-00404"){
                    props.setSuccessMessage(result);
                }
                else{
                    setErrorMessage(`[${resultCode}] ${bsmStatusMap[resultCode]}`);
                    setCouponInput01("");
                    setCouponInput02("");
                    setCouponInput03("");
                    setCouponInput04("");
                }
            }

            props.dispatchLoading(false);
        }).catch((ex) => {
            props.dispatchLoading(false);
            setErrorMessage(bsmStatusMap["coupon.error.network"]);
        });
    }, [couponInputComplete]);

    useEffect(() => {
        if(couponInputComplete.length >= 16){
            setSubmitBtnDisabled(false);
        }
        else{
            setSubmitBtnDisabled(true);
        }
    }, [couponInputComplete]);

    return (
        <>
            <div className="content_section">
                <h2 className="title">啟用 LiTV 兌換券</h2>
                <div className="description">輸入兌換碼，即可立即啟用兌換券上指定的「電視頻道」或「隨選影片」服務。</div>

                <div className="coupon_input_section">
                    <div className="coupon_title">請輸入兌換碼（共16個數字）：</div>

                    <div className="coupon_input_items">
                        <input className={`coupon_input_item ${couponInputErrorClass}`} type="tel" maxLength="4" value={couponInput01} onChange={(event) => couponInput01ChangeHandler(event)} onKeyDown={(event) => couponInput01KeyDownHandler(event)} ref={couponInput01Ref} />
                        <input className={`coupon_input_item ${couponInputErrorClass}`} type="tel" maxLength="4" value={couponInput02} onChange={(event) => couponInput02ChangeHandler(event)} onKeyDown={(event) => couponInput02KeyDownHandler(event)} ref={couponInput02Ref} />
                        <input className={`coupon_input_item ${couponInputErrorClass}`} type="tel" maxLength="4" value={couponInput03} onChange={(event) => couponInput03ChangeHandler(event)} onKeyDown={(event) => couponInput03KeyDownHandler(event)} ref={couponInput03Ref} />
                        <input className={`coupon_input_item ${couponInputErrorClass}`} type="tel" maxLength="4" value={couponInput04} onChange={(event) => couponInput04ChangeHandler(event)} onKeyDown={(event) => couponInput04KeyDownHandler(event)} ref={couponInput04Ref} />
                    </div>

                    {
                        (() => {
                            if(errorMessage){
                                return (
                                    <div className="error_message">{errorMessage}</div>
                                );
                            }
                        })()
                    }
                    
                    <button className="submit_btn" title="確認啟用" disabled={submitBtnDisabled} onClick={(event) => submitBtnClickHandler(event)}>確認啟用</button>
                </div>

                <Step />
                <Faq />
                <Copyright />
            </div>

            <style jsx>
                {`
                    .content_section{
                        .title{
                            font-size: 22px;
                            line-height: 30px;
                        }

                        .description{
                            font-size: 16px;
                            line-height: 30px;
                            color: #666;
                        }

                        .coupon_input_section{
                            margin-top: 10px;

                            .coupon_title{
                                line-height: 30px;
                            }

                            .coupon_input_items{
                                display: flex;
                                flex-direction: row;
                                flex-wrap: wrap;
                                justify-content: flex-start;
                                align-items: center;

                                .coupon_input_item{
                                    width: 90px;
                                    height: 40px;
                                    font-size: 15px;
                                    border-radius: 5px;
                                    border: 1px solid #dbdbdb;
                                    outline: none;
                                    padding: 5px 11px;
                                    line-height: 35px;
                                    display: block;
                                    position: relative;
                                    text-align: center;
                                    margin-right: 5px;
                                    margin-top: 10px;

                                    &:focus{
                                        border: 1px solid #8711aa;
                                    }

                                    &.error{
                                        border: 1px solid #ff2400;
                                    }
                                }
                            }

                            .error_message{
                                font-size: 14px;
                                color: #ff2400;
                                line-height: 25px;
                                margin-top: 10px;
                            }

                            .submit_btn{
                                display: block;
                                background-color: #8711aa;
                                color: #fff;
                                border-radius: 4px;
                                line-height: 35px;
                                font-size: 16px;
                                padding-left: 50px;
                                padding-right: 50px;
                                border: 1px solid #8711aa;
                                margin-top: 25px;

                                &[disabled]{
                                    cursor: not-allowed;
                                    opacity: .3;
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    setSuccessMessage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
