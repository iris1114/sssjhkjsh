
import { connect } from "react-redux";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import Banner from "../packageInfo/banner.jsx";
import StepBar from "../packageInfo/stepBar.jsx";
import Detail from "./detail.jsx";
import Remit from "./remit.jsx";
import Atm from "./atm.jsx";
import Description from "./description.jsx";
import Order from "./order.jsx";

const mapStateToProps = (state) => {
    return {
        packageInfo: state.purchase.packageInfo,
        purchaseInfo: state.purchase.purchaseInfo,
        orderInfo: state.purchase.orderInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchStep: (value) => {
            dispatch({
                type: "purchase/step",
                value: value
            });
        },
        dispatchPurchaseInfo: (value) => {
            dispatch({
                type: "purchase/purchaseInfo",
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

    const billSectionElement = useRef(null);

    const completeSectionStyle = useMemo(() => {
        let obj = {
            marginTop: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.2)"
        };

        if(props.groupId){
            obj.marginTop = "0px";
            obj.marginBottom = "0px";
            obj.boxShadow = "none";
        }

        return obj;
    }, []);

    const contentInfo = useMemo(() => {
        if(!props.packageInfo || !props.purchaseInfo){
            return;
        }

        let obj = {
            title: null,
            payType: null,
            payState: null
        };

        if(props.purchaseInfo.pay_type == "CREDIT"){
            obj.title = "即時";
            obj.payType = "信用卡";
            obj.payState = "已繳款";
        }
        else if(props.purchaseInfo.pay_type == "REMIT"){
            obj.title = "繳費後 2 日內";
            obj.payType = "超商代收";
            obj.payState = "未繳款";
        }
        else if(props.purchaseInfo.pay_type == "ATM"){
            obj.title = "繳費後 1 日內";
            obj.payType = "ATM";
            obj.payState = "未繳款";
        }

        return obj;
    }, []);

    const recordBtnClickHandler = useCallback(() => {
        router.push({
            pathname: "/member",
            query: { 
                service: "consumptionRecord"
            }
        });
    }, []);

    const printBtnClickHandler = useCallback(() => {
        let billSectionHTML = billSectionElement.current.innerHTML;
        let printWindow = open();

        printWindow.document.write(billSectionHTML);
        printWindow.print();
        printWindow.close();
    }, []);

    useEffect(() => {
        if(!props.packageInfo || !props.purchaseInfo){
            router.push("/purchase");

            return;
        }

        props.dispatchStep(3);

        return () => {
            props.dispatchPurchaseInfo(null);
            props.dispatchOrderInfo(null);
            props.dispatchStep(0);
        };
    }, []);

    return (
        <>
            {
                (() => {
                    if(props.packageInfo && props.purchaseInfo){
                        return (
                            <section className="complete_section">
                                {
                                    (() => {
                                        if(!props.groupId){
                                            return (
                                                <>
                                                    <Banner packageInfo={props.packageInfo} />
                                                    <StepBar />
                                                </>
                                            );
                                        }
                                    })()
                                }

                                <div className="content_section">
                                    <Detail contentInfo={contentInfo} />

                                    {
                                        (() => {
                                            if(props.purchaseInfo.pay_type == "REMIT" || props.purchaseInfo.pay_type == "ATM"){
                                                return (
                                                    <div className="bill_section" ref={billSectionElement}>
                                                        {
                                                            (() => {
                                                                if(props.purchaseInfo.pay_type == "REMIT"){
                                                                    return (
                                                                        <Remit />
                                                                    );
                                                                }
                                                                else if(props.purchaseInfo.pay_type == "ATM"){
                                                                    return (
                                                                        <Atm />
                                                                    );
                                                                }
                                                            })()
                                                        }
                                                    </div>
                                                );
                                            }
                                        })()
                                    }

                                    <Description contentInfo={contentInfo} />

                                    <div className="btn_section">
                                        <button className="btn record" onClick={recordBtnClickHandler}>消費記錄</button>

                                        {
                                            (() => {
                                                if(props.purchaseInfo.pay_type == "REMIT" || props.purchaseInfo.pay_type == "ATM"){
                                                    return (
                                                        <button className="btn print" onClick={printBtnClickHandler}>列印繳款單</button>
                                                    );
                                                }
                                            })()
                                        }
                                    </div>

                                    {
                                        (() => {
                                            if(props.orderInfo){
                                                return (
                                                    <Order />
                                                );
                                            }
                                        })()
                                    }
                                </div>
                            </section>
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .complete_section{
                        position: relative;
                        max-width: 900px;
                        margin-left: auto;
                        margin-right: auto;

                        .content_section{
                            overflow: hidden;
                            background-color: #fff;
                            margin-top: ${completeSectionStyle.marginTop};
                            margin-bottom: ${completeSectionStyle.marginBottom};
                            padding: 20px;
                            box-shadow: ${completeSectionStyle.boxShadow};

                            .bill_section{
                                border-top: 1px dashed #999;
                                margin-top: 40px;
                                padding-top: 20px;
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

                                    &.record{
                                        background-color: #fff;
                                        border: 1px solid #f60;
                                        color: #f60;
                                    }

                                    &.print{
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

App.propTypes = {
    groupId: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
