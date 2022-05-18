
import { connect } from "react-redux";
import { useCallback } from "react";
import PropTypes from "prop-types";

import Credit from "./credit.jsx";
import Remit from "./remit.jsx";
import Atm from "./atm.jsx";
import InvoiceRecurrent from "./common/invoiceRecurrent.jsx";
import Remind from "./common/remind.jsx";

const mapStateToProps = (state) => {
    return {
        packageItem: state.purchase.packageItem,
        payMethodItem: state.purchase.payMethodItem
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
        dispatchPayMethodItem: (value) => {
            dispatch({
                type: "purchase/payMethodItem",
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
    const payMethodDisplay = useCallback((item) => {
        if(item.packageIdList.indexOf(props.packageItem.packageId) != -1){
            return true;
        }

        return false;
    }, []);

    const getPayMethodBtnFocusClass = useCallback((item) => {
        if(item.method == props.payMethodItem.method){
            return "focus";
        }

        return "";
    }, [props.payMethodItem]);

    const payMethodBtnClickHandler = useCallback((item) => {
        props.dispatchPayMethodItem(item);
    }, []);

    const prevStepClickHandler = useCallback(() => {
        props.dispatchStep(1);
    }, []);

    const sumitClickHandler = useCallback(() => {
        props.dispatchSumitClick(new Date().getTime());
    }, []);

    return (
        <>
            <section className="pay_tabs_section">
                <div className="tab_list_section">
                    <div className="absolute_section">
                        {
                            props.packageInfo.payMethodItems.map((item, index) => {
                                if(payMethodDisplay(item)){
                                    return (
                                        <button className={`pay_method_btn ${getPayMethodBtnFocusClass(item)}`} onClick={() => payMethodBtnClickHandler(item)} key={index}>{item.title}</button>
                                    );
                                }
                            })
                        }
                    </div>
                </div>

                <div className="tab_pane_section">
                    <div className="tab_pane">
                        {
                            (() => {
                                if(props.payMethodItem.method == "CREDIT"){
                                    return (
                                        <Credit groupId={props.groupId} />
                                    );
                                }
                                else if(props.payMethodItem.method == "REMIT"){
                                    return (
                                        <Remit />
                                    );
                                }
                                else if(props.payMethodItem.method == "ATM"){
                                    return (
                                        <Atm />
                                    );
                                }
                            })()
                        }

                        <InvoiceRecurrent payType={props.payMethodItem.method}/>
                        <Remind />

                        <div className="step_section">
                            <button className="step prev" onClick={prevStepClickHandler}>上一步</button>
                            <button className="step sumit" onClick={sumitClickHandler}>同意付款</button>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>
                {`
                    .pay_tabs_section{
                        position: relative;
                        margin-top: 20px;

                        .tab_list_section{
                            position: relative;
                            height: 42px;
                            z-index: 1;

                            .absolute_section{
                                white-space: nowrap;
                                overflow: hidden;
                                border-top: 1px solid #ccc;
                                border-left: 1px solid #ccc;
                                border-right: 1px solid #ccc;
                                border-top-left-radius: 5px;
                                border-top-right-radius: 5px;
                                position: absolute;
                                max-width: 100%;
                                font-size: 0;

                                .pay_method_btn{
                                    font-size: 16px;
                                    line-height: 40px;
                                    padding-left: 30px;
                                    padding-right: 30px;
                                    display: inline-block;
                                    color: #333;
                                    border-left: 1px solid #ccc;
                                    border-bottom: 1px solid #ccc;
                                    background-image: -webkit-linear-gradient(90deg, #e6e6e6, #f6f6f6);

                                    &:first-of-type{
                                        border-left: none;
                                    }

                                    &.focus{
                                        background-image: none;
                                        background-color: #fff;
                                        font-weight: bold;
                                        border-bottom: 1px solid #fff;
                                    }
                                }
                            }
                        }

                        .tab_pane_section{
                            border: 1px solid #ccc;
                            overflow: hidden;
                            background: #fff;
                            position: relative;
                            top: -1px;

                            .tab_pane{
                                padding: 20px;     

                                .step_section{
                                    display: table;
                                    margin-left: auto;
                                    margin-right: auto;
                                    margin-top: 10px;

                                    .step{
                                        margin-left: 5px;
                                        margin-right: 5px;
                                        padding-left: 15px;
                                        padding-right: 15px;
                                        border: 1px solid #a415ce;
                                        border-radius: 5px;
                                        font-size: 16px;
                                        line-height: 40px;

                                        &.prev{
                                            background-color: #fff;
                                            color: #a415ce;
                                        }

                                        &.sumit{
                                            background-color: #a415ce;
                                            color: #fff;
                                        }
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
    packageInfo: PropTypes.object.isRequired,
    groupId: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
