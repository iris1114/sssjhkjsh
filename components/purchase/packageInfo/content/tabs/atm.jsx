
import { connect } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

import api from "../../../../../assets/js/api/index.js";
import tools from "../../../../../assets/js/tools/index.js";

const mapStateToProps = (state) => {
    return {
        login: state.login,
        packageItem: state.purchase.packageItem,
        payMethodItem: state.purchase.payMethodItem,
        optionPackageItem: state.purchase.optionPackageItem,
        promocodeItem: state.purchase.promocodeItem,
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
                    props.dispatchDialog({
                        component: "modify",
                        exitIcon: false
                    });
                }
                else{
                    router.push("/purchase/complete");
                }
            }
            else{
                props.dispatchDialog({
                    component: "payError",
                    information: {
                        result_code: "webpurchase.error.network"
                    }
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
    }, [props.sumitClick]);

    return (
        <>
            <section className="atm_section">
                <div className="top_section">
                    <div className="slogan">入帳時間依各銀行轉入規定，繳費成功後，約1天始可觀賞！</div>
                    <div className="description">於各銀行 ATM 皆可轉帳繳費，服務開通後，將以簡訊通知您。</div>
                </div>
            </section>

            <style jsx>
                {`
                    .atm_section{
                        overflow: hidden;

                        .top_section{
                            padding-bottom: 15px;
                            border-bottom: 1px dotted #ccc;

                            .slogan{
                                background-image: url(${require("../../../../../assets/image/purchase/packageInfo/iconFlag.png")});
                                background-size: 16px 16px;
                                background-repeat: no-repeat;
                                padding-left: 20px;
                                font-size: 16px;
                                font-weight: bold;
                                font-style: italic;
                                color: #8711aa;
                            }

                            .description{
                                margin-top: 10px;
                                font-size: 14px;
                                line-height: 40px;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
