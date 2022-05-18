
import { connect } from "react-redux";
import { useCallback } from "react";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {
        packageItem: state.purchase.packageItem
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
        }
    };
};

const App = (props) => {
    const getAveragePrice = useCallback((item) => {
        let number = null;

        if(item.time == "month"){
            number = 1;
        }
        else if(item.time == "season"){
            number = 3;
        }
        else{
            number = 12;
        }

        return Math.round(item.price / number);
    }, []);

    const getContentItemFocusClass = useCallback((item) => {
        if(props.packageItem && item.packageId == props.packageItem.packageId){
            return "focus";
        }

        return "";
    }, [props.packageItem]);

    const getPriceHighlightClass = useCallback((item) => {
        if(item.priceHighlight){
            return "highlight";
        }

        return "";
    }, []);

    const getAverageHighlightClass = useCallback((item) => {
        if(item.averageHighlight){
            return "highlight";
        }

        return "";
    }, []);

    const contentItemClickHandler = useCallback((item) => {
        let payMethodItems = props.packageInfo.payMethodItems;
        let optionPackageInfo = item.optionPackageInfo;

        let payMethodItem = payMethodItems.find((element) => {
            return element.isDefault;
        });

        if(optionPackageInfo){
            let optionPackageItem = optionPackageInfo.optionPackageItems.find((element) => {
                return element.isDefault;
            });

            props.dispatchOptionPackageItem(optionPackageItem);
        }
        else{
            props.dispatchOptionPackageItem(null);
        }

        props.dispatchPackageItem(item);
        props.dispatchPayMethodItem(payMethodItem);
    }, []);

    const nextStepClickHandler = useCallback(() => {
        props.dispatchStep(2);
    }, []);

    return (
        <>
            <section className="content_items_section">
                {
                    props.packageInfo.packageItems.map((item, index) => {
                        return (
                            <button className={`content_item ${getContentItemFocusClass(item)}`} onClick={() => contentItemClickHandler(item)} key={index}>
                                <div className="radio"></div>

                                {
                                    (() => {
                                        if(item.promoHTML){
                                            return (
                                                <div className="promo_html" dangerouslySetInnerHTML={item.promoHTML}></div>
                                            );
                                        }
                                    })()
                                }
                                
                                <div className="title">{item.title} $<span className={`price ${getPriceHighlightClass(item)}`}>{item.price}</span></div>

                                {
                                    (() => {
                                        if(item.optionPackageInfo && item.optionPackageInfo.title){
                                            return (
                                                <div className="option_title">{item.optionPackageInfo.title}</div>
                                            );
                                        }
                                    })()
                                }

                                {
                                    (() => {
                                        if(item.average){
                                            if(item.packageId == "XD0005"){
                                                return (
                                                    <div className="average">平均 $<span className={`price ${getAverageHighlightClass(item)}`}>199</span> 起/月</div>
                                                );
                                            }
                                            else{
                                                return (
                                                    <div className="average">平均 $<span className={`price ${getAverageHighlightClass(item)}`}>{getAveragePrice(item)}</span> /月</div>
                                                );
                                            }
                                        }
                                    })()
                                }

                                {
                                    (() => {
                                        if(item.promoLabel){
                                            return (
                                                <img className="pormo_label" src={require(`../../../../assets/image/purchase/packageInfo/promoLabel/${item.promoLabel}`)} alt={props.packageInfo.title} />
                                            );
                                        }
                                    })()
                                }
                            </button>
                        );
                    })
                }

                <button className="next_step" onClick={nextStepClickHandler}>下一步</button>
            </section>

            <style jsx>
                {`
                    .content_items_section{
                        position: relative;

                        .content_item{
                            margin-left: 1%;
                            margin-right: 1%;
                            margin-top: 20px;
                            margin-bottom: 20px;
                            width: 31.33%;
                            min-height: 160px;
                            display: block;
                            float: left;
                            position: relative;
                            border: 1px solid #ccc;
                            box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);

                            &:hover{
                                border: 1px solid #a415ce;

                                .radio{
                                    background-image: url(${require("../../../../assets/image/purchase/packageInfo/select/checkbox/itemCheckboxHover.png")});
                                }

                                .promo_html{
                                    color: #f60;
                                }

                                .title{
                                    color: #8711aa;

                                    .price{
                                        &.highlight{
                                            color: #8711aa;
                                        }
                                    }
                                }

                                .option_title{
                                    color: #8711aa;
                                }

                                .average{
                                    color: #8711aa;

                                    .price{
                                        &.highlight{
                                            color: #8711aa;
                                        }
                                    }
                                }
                            }

                            &.focus{
                                background-image: linear-gradient(90deg, #a415ce, #8711aa);
                                border: 1px solid #8711aa;

                                .radio{
                                    background-image: url(${require("../../../../assets/image/purchase/packageInfo/select/checkbox/itemCheckboxCheck.png")});
                                }

                                .promo_html{
                                    color: #fff;
                                }

                                .title{
                                    color: #fff;

                                    .price{
                                        &.highlight{
                                            color: #fff;
                                        }
                                    }
                                }

                                .option_title{
                                    color: #fff;
                                }

                                .average{
                                    color: #fff;

                                    .price{
                                        &.highlight{
                                            color: #fff;
                                        }
                                    }
                                }
                            }

                            .radio{
                                background-image: url(${require("../../../../assets/image/purchase/packageInfo/select/checkbox/itemCheckbox.png")});
                                position: absolute;
                                width: 35px;
                                height: 35px;
                                top: 5px;
                                left: 5px;
                            }

                            .promo_html{
                                font-size: 18px;
                                font-weight: bold;
                                line-height: 30px;
                                color: #8f8f8f;
                            }

                            .title{
                                font-size: 18px;
                                font-weight: bold;
                                line-height: 30px;

                                .price{
                                    font-size: 30px;

                                    &.highlight{
                                        color: #ff4339;
                                    }
                                }
                            }

                            .option_title{
                                font-size: 18px;
                                font-weight: bold;
                                line-height: 30px;
                                color: #e00005;
                            }

                            .average{
                                font-size: 16px;
                                font-weight: bold;
                                line-height: 30px;
                                color: #8f8f8f;

                                .price{
                                    font-size: 18px;

                                    &.highlight{
                                        color: #e00005;
                                    }
                                }
                            }

                            .pormo_label{
                                position: absolute;
                                width: 100px;
                                top: -40px;
                                right: -20px;
                            }
                        }

                        .next_step{
                            display: table;
                            margin-left: auto;
                            margin-right: auto;
                            padding-left: 15px;
                            padding-right: 15px;
                            border-radius: 5px;
                            background-color: #8711aa;;
                            color: #fff;
                            font-size: 16px;
                            line-height: 40px;
                            border: 1px solid #a415ce;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    packageInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
