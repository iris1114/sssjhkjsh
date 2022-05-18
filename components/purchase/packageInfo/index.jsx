
import { connect } from "react-redux";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import Banner from "./banner.jsx";
import StepBar from "./stepBar.jsx";
import Content from "./content/index.jsx";

import tools from "../../../assets/js/tools/index.js";
import beacon from "../../../assets/js/beacon/index.js";
import gtag from "../../../assets/js/gtag/index.js";

import packageInfoObject from "../../../assets/json/purchase/packageInfo.json";

const mapStateToProps = (state) => {
    return {
        step: state.purchase.step,
        packageItem: state.purchase.packageItem,
        payMethodItem: state.purchase.payMethodItem,
        optionPackageItem: state.purchase.optionPackageItem,
        promocodeItem: state.purchase.promocodeItem
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
        dispatchPackageInfo: (value) => {
            dispatch({
                type: "purchase/packageInfo",
                value: value
            });
        },
        dispatchPackageItem: (value) => {
            dispatch({
                type: "purchase/packageItem",
                value: value
            });
        },
        dispatchPayMethodItem: (value) => {
            dispatch({
                type: "purchase/payMethodItem",
                value: value
            });
        },
        dispatchOptionPackageItem: (value) => {
            dispatch({
                type: "purchase/optionPackageItem",
                value: value
            });
        },
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const packageInfo = useMemo(() => {
        let groupId = null;

        if(props.groupId){
            groupId = props.groupId;
        }
        else{
            groupId = router.query.groupId;
        }

        if(!packageInfoObject[groupId]){
            groupId = Object.keys(packageInfoObject[0]);
        }
        
        return packageInfoObject[groupId];
    }, [router.query.groupId, props.groupId]);

    useEffect(() => {
        if(props.groupId){
            return;
        }

        if(!props.packageItem || !props.payMethodItem || props.step == 0){
            return;
        }

        let href = location.href;

        if(props.packageItem){
            href = tools.url.replaceQuery(href, "packageId", props.packageItem.packageId);
            href = tools.url.replaceQuery(href, "payTime", props.packageItem.time);
        }

        if(props.payMethodItem){
            href = tools.url.replaceQuery(href, "payMethod", props.payMethodItem.method);
        }

        if(props.optionPackageItem.optionPackageId){
            href = tools.url.replaceQuery(href, "optionPackageId", props.optionPackageItem.optionPackageId);
        }
        else{
            href = tools.url.removeQuery(href, "optionPackageId");
        }

        if(props.promocodeItem.result_code && props.promocodeItem.result_code == "BSM-00000"){
            href = tools.url.replaceQuery(href, "promoCode", props.promocodeItem.promo_code);
        }
        else{
            href = tools.url.removeQuery(href, "promoCode");
        }

        if(props.step){
            href = tools.url.replaceQuery(href, "step", props.step);
        }

        history.replaceState({
            "url": router.pathname,
            "as": href,
            "options": {},
            "__N": true
        }, document.title, href);

        beacon();
        gtag.pageview();
    }, [props.packageItem, props.payMethodItem, props.optionPackageItem, props.promocodeItem, props.step]);

    useEffect(() => {
        let packageId = tools.url.getQuery(location.href, "packageId");
        let payMethod = tools.url.getQuery(location.href, "payMethod");
        let optionPackageId = tools.url.getQuery(location.href, "optionPackageId");
        let step = tools.url.getQuery(location.href, "step");

        let packageItems = packageInfo.packageItems;
        let payMethodItems = packageInfo.payMethodItems;

        let packageItem = null;
        let payMethodItem = null;
        let optionPackageItem = null;

        let _step = null;

        if(packageId){
            packageItem = packageItems.find((element) => {
                return element.packageId == packageId;
            });

            if(!packageItem){
                packageItem = packageItems.find((element) => {
                    return element.isDefault;
                });
            }

            if(payMethod){
                payMethodItem = payMethodItems.find((element) => {
                    return element.method == payMethod;
                });

                if(!payMethodItem){
                    payMethodItem = payMethodItems.find((element) => {
                        return element.isDefault;
                    });
                }
            }
            else{
                payMethodItem = payMethodItems.find((element) => {
                    return element.isDefault;
                });
            }

            if(packageItem.optionPackageInfo){
                if(optionPackageId){
                    optionPackageItem = packageItem.optionPackageInfo.optionPackageItems.find((element) => {
                        return element.optionPackageId == optionPackageId;
                    });
    
                    if(!optionPackageItem){
                        optionPackageItem = packageItem.optionPackageInfo.optionPackageItems.find((element) => {
                            return element.isDefault;
                        });
                    }
                }
                else{
                    optionPackageItem = packageItem.optionPackageInfo.optionPackageItems.find((element) => {
                        return element.isDefault;
                    });
                }
            }            
        }
        else{
            packageItem = packageItems.find((element) => {
                return element.isDefault;
            });

            payMethodItem = payMethodItems.find((element) => {
                return element.isDefault;
            });

            if(packageItem.optionPackageInfo){
                optionPackageItem = packageItem.optionPackageInfo.optionPackageItems.find((element) => {
                    return element.isDefault;
                });
            }
        }

        if(step){
            step = parseInt(step);

            if(step < 3){
                _step = step;
            }
            else{
                _step = 1;
            }
        }
        else{
            _step = 1;
        }

        if(packageInfo.promoDialog){
            props.dispatchDialog({
                component: "packageInfoPromo",
                information: packageInfo.promoDialog
            });
        }

        props.dispatchPackageInfo(packageInfo);
        props.dispatchPackageItem(packageItem);
        props.dispatchPayMethodItem(payMethodItem);
        props.dispatchOptionPackageItem(optionPackageItem);
        props.dispatchStep(_step);

        return () => {
            props.dispatchPackageItem(null);
            props.dispatchPayMethodItem(null);
            props.dispatchOptionPackageItem(null);
            props.dispatchStep(0);
        };
    }, [packageInfo]);

    return (
        <>
            <section className="package_info_content">
                {
                    (() => {
                        if(!props.groupId){
                            return (
                                <>
                                    <Banner packageInfo={packageInfo} />
                                    <StepBar />
                                </>
                            );
                        }
                    })()
                }
                
                <Content packageInfo={packageInfo} groupId={props.groupId} />
            </section>

            <style jsx>
                {`
                    .package_info_content{
                        max-width: 900px;
                        margin-left: auto;
                        margin-right: auto;
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
