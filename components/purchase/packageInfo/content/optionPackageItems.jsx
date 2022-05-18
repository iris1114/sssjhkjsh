
import { connect } from "react-redux";
import { useCallback } from "react";

const mapStateToProps = (state) => {
    return {
        packageItem: state.purchase.packageItem,
        optionPackageItem: state.purchase.optionPackageItem
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
    const optionPackageRadioChangeHandler = useCallback((item) => {
        props.dispatchOptionPackageItem(item);
    }, []);

    const optionPackageLabelClickHandler = useCallback((item) => {
        props.dispatchDialog({
            component: "optionPackageInfo",
            information: item
        });
    }, []);

    return (
        <>
            <section className="option_package_items_section">
                <div className="option_package_items">
                    <div className="info_title">加贈優惠：{props.packageItem.optionPackageInfo.title}</div>

                    <div className="radio_items">
                        {
                            props.packageItem.optionPackageInfo.optionPackageItems.map((item, index) => {
                                return (
                                    <div className="radio_item" key={index}>
                                        <input className="option_package_radio" value={item.optionPackageId} onChange={() => optionPackageRadioChangeHandler(item)} checked={item.optionPackageId == props.optionPackageItem.optionPackageId} type="radio" />
                                        <label className="option_package_label" onClick={() => optionPackageLabelClickHandler(item)}>{item.title}</label>
                                        <span className="option_package_price">$<span className="price">{item.price}</span></span>
                                        <span className="option_package_promo_html" dangerouslySetInnerHTML={item.promoHTML}></span>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                {
                    (() => {
                        if(props.optionPackageItem.modifyFlag){
                            return (
                                <div className="modify_alert">※ 付款後請務必填寫配送資訊，以利贈品後續配送</div>
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .option_package_items_section{
                        margin-top: 20px;

                        .option_package_items{
                            position: relative;
                            border: 1px solid #ccc;

                            .info_title{
                                font-size: 16px;
                                font-weight: bold;
                                line-height: 40px;
                                padding-left: 20px;
                                background-image: -webkit-linear-gradient(90deg, #e6e6e6, #f6f6f6);
                                border-bottom: 1px solid #ccc;
                            }

                            .radio_items{
                                padding-left: 40px;
                                padding-right: 40px;
                                padding-top: 20px;
                                padding-bottom: 20px;
                                line-height: 30px;

                                .radio_item{
                                    position: relative;
                                    height: 30px;

                                    input[type="radio"]{
                                        background-image: url(${require("../../../../assets/image/purchase/packageInfo/select/radio/radio.png")});
                                        background-size: 16px 16px;
                                        background-repeat: no-repeat;
                                        appearance: inherit;
                                        width: 16px;
                                        height: 16px;
                                        outline: 0;
                                        border: 0;

                                        &:checked{
                                            background-image: url(${require("../../../../assets/image/purchase/packageInfo/select/radio/radioCheck.png")});
                                        }
                                    }

                                    .option_package_radio{
                                        position: relative;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        float: left;
                                    }

                                    .option_package_label{
                                        padding-left: 5px;
                                        font-size: 14px;
                                        text-decoration: underline;
                                        cursor: pointer;

                                        &:hover{
                                            color: #8711aa;
                                        }
                                    }

                                    .option_package_price{
                                        float: right;
                                        font-size: 14px;
                                        margin-left: 10px;

                                        .price{
                                            float: right;
                                            font-size: 18px;
                                        }
                                    }

                                    .option_package_promo_html{
                                        float: right;
                                        font-size: 12px;
                                        color: #999;
                                    }
                                }
                            }
                        }

                        .modify_alert{
                            font-size: 16px;
                            font-weight: bold;
                            color: #f60;
                            line-height: 25px;
                            margin-top: 20px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
