
import { connect } from "react-redux";
import { useCallback } from "react";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {
        purchaseInfo: state.purchase.purchaseInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const getServiceName = useCallback((item) => {
        let name = item.catalog_description;

        if(item.package_name){
            name += ` ${item.package_name}`;
        }

        return name;
    }, []);

    return (
        <>
            <section className="detail_section">
                <div className="content_title">感謝您本次的購買，付費會員權益將於 <span className="mark">{props.contentInfo.title}</span> 生效，敬請收看。</div>

                <table className="list_container">
                    <thead className="list_head">
                        <tr className="head_tr">
                            <th className="head_th" width="8%">NO.</th>
                            <th className="head_th" width="47%">服務名稱</th>
                            <th className="head_th" width="15%">付款方式</th>
                            <th className="head_th" width="15%">交易狀態</th>
                            <th className="head_th" width="15%">小計</th>
                        </tr>
                    </thead>

                    <tbody className="list_body">
                        {
                            props.purchaseInfo.details.map((item, index) => {
                                return (
                                    <tr className="body_tr" key={index}>
                                        <td className="body_td">{index + 1}</td>
                                        <td className="body_td">{getServiceName(item)}</td>

                                        {
                                            (() => {
                                                if(item.price > 0){
                                                    return (
                                                        <>
                                                            <td className="body_td">{props.contentInfo.payType}</td>
                                                            <td className="body_td">{props.contentInfo.payState}</td>
                                                        </>
                                                    );
                                                }
                                                else{
                                                    return (
                                                        <>
                                                            <td className="body_td"></td>
                                                            <td className="body_td"></td>
                                                        </>
                                                    );
                                                }
                                            })()
                                        }
                                        
                                        <td className="body_td">${item.price}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>

                <div className="totle_section">本次消費金額總計：<span className="mark">${props.purchaseInfo.amount}</span></div>
            </section>

            <style jsx>
                {`
                    .detail_section{
                        overflow: hidden;

                        .content_title{
                            text-align: center;
                            font-size: 16px;

                            .mark{
                                font-weight: bold;
                                color: #f60;
                            }
                        }

                        .list_container{
                            width: 100%;
                            text-align: center;
                            margin-top: 20px;
                            font-size: 15px;
                            line-height: 35px;

                            .list_head{
                                .head_tr{
                                    .head_th{
                                        font-weight: bold;
                                    }
                                }
                            }
                        }

                        .totle_section{
                            text-align: right;
                            font-size: 16px;
                            font-weight: bold;
                            line-height: 30px;
                            padding-left: 20px;
                            padding-right: 20px;
                            margin-top: 20px;

                            .mark{
                                color: #f60;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    contentInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
