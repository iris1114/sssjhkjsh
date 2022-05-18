
import { connect } from "react-redux";
import { useMemo } from "react";
import PropTypes from "prop-types";

import Promocode from "./promocode.jsx";
import OptionPackageItems from "./optionPackageItems.jsx";
import Tabs from "./tabs/index.jsx";

const mapStateToProps = (state) => {
    return {
        packageItem: state.purchase.packageItem,
        promocodeItem: state.purchase.promocodeItem
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const averagePrice = useMemo(() => {
        let number = null;

        if(props.packageItem.time == "month"){
            number = 1;
        }
        else if(props.packageItem.time == "season"){
            number = 3;
        }
        else{
            number = 12
        }

        return {
            average: Math.round(props.packageItem.price / number),
            number: number
        };
    }, []);

    const averageHighlightClass = useMemo(() => {
        if(props.packageItem.averageHighlight){
            return "highlight";
        }

        return "";
    }, []);

    const getTotalPrice = useMemo(() => {
        let price = null;

        if(props.promocodeItem.result_code && props.promocodeItem.result_code == "BSM-00000"){
            price = props.promocodeItem.amount;
        }
        else{
            price = props.packageItem.price;
        }

        return price;
    }, [props.promocodeItem]);
    
    return (
        <>
            <section className="info_section">
                <div className="package_item">
                    <div className="item_title">購買項目</div>

                    <div className="service_info">
                        <span className="package_title">{props.packageInfo.title} {props.packageItem.title}</span>

                        {
                            (() => {
                                if(props.packageItem.optionPackageInfo && props.packageItem.optionPackageInfo.title){
                                    return (
                                        <span className="option_title">{props.packageItem.optionPackageInfo.title}</span>
                                    );
                                }
                            })()
                        }

                        <span className="package_average">(平均 $<span className={`average ${averageHighlightClass}`}>{averagePrice.average}</span> /月 x {averagePrice.number})</span>

                        {
                            (() => {
                                if(props.packageItem.itemPromoHTML){
                                    return (
                                        <span className="package_price" dangerouslySetInnerHTML={props.packageItem.itemPromoHTML}></span>
                                    );
                                }
                                else{
                                    return (
                                        <span className="package_price">$<span className="price">{props.packageItem.price}</span></span>
                                    );
                                }
                            })()
                        }

                        {
                            (() => {
                                if(props.packageItem.promocode){
                                    return (
                                        <Promocode />
                                    );
                                }
                            })()
                        }
                    </div>

                    <div className="total_price">本次應付金額 <span className="highlight">$<span className="price">{getTotalPrice}</span></span></div>
                </div>

                {
                    (() => {
                        if(props.packageItem.optionPackageInfo){
                            return (
                                <OptionPackageItems />
                            );
                        }
                    })()
                }

                <Tabs packageInfo={props.packageInfo} groupId={props.groupId} />
            </section>

            <style jsx>
                {`
                    .info_section{
                        .package_item{
                            position: relative;
                            border: 1px solid #ccc;
                            margin-top: 20px;

                            .item_title{
                                font-size: 16px;
                                font-weight: bold;
                                line-height: 40px;
                                padding-left: 20px;
                                background-image: -webkit-linear-gradient(90deg, #e6e6e6, #f6f6f6);
                                border-bottom: 1px solid #ccc;
                            }

                            .service_info{
                                padding-left: 40px;
                                padding-right: 40px;
                                padding-top: 20px;
                                padding-bottom: 20px;
                                line-height: 30px;

                                .package_title{
                                    font-size: 18px;
                                }

                                .option_title{
                                    font-size: 18px;
                                    font-weight: bold;
                                    color: #8711aa;
                                    padding-left: 5px;
                                }

                                .package_average{
                                    font-size: 14px;
                                    font-weight: bold;
                                    color: #999;
                                    padding-left: 10px;

                                    .average{
                                        font-size: 16px;

                                        &.highlight{
                                            color: #8711aa;
                                        }
                                    }
                                }

                                .package_price{
                                    float: right;
                                    font-size: 14px;

                                    .price{
                                        font-size: 18px;
                                    }
                                }
                            }

                            .total_price{
                                background-color: #f8f8f8;
                                padding-left: 40px;
                                padding-right: 40px;
                                padding-top: 20px;
                                padding-bottom: 20px;
                                line-height: 30px;
                                text-align: right;
                                font-size: 14px;
                                font-weight: bold;

                                .highlight{
                                    color: #8711aa;

                                    .price{
                                        font-size: 25px;
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
