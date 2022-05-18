
import { connect } from "react-redux";
import { useMemo } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const successMessageDetail = useMemo(() => {
        if(props.successMessage){
            let detail = props.successMessage.purchase_list[0].details[0];

            return {
                service: `${detail.catalog_description} ${detail.package_name}`,
                expiry: detail.end_date
            };
        }

        return {
            service: "",
            expiry: ""
        };
    }, [props.successMessage]);

    return (
        <>
            <div className="success_section">
                <h2 className="title">啟用 LiTV 兌換券成功</h2>
                <div className="description">每組兌換碼僅能兌換一次，兌換成功即失效。</div>

                <div className="service_section">
                    <div className="content">
                        <div className="content_title">服務名稱</div>

                        {
                            (() => {
                                if(successMessageDetail.service){
                                    return (
                                        <div className="detail">{successMessageDetail.service}</div>
                                    );
                                }
                            })()
                        }
                    </div>

                    <div className="content">
                        <div className="content_title">到期日</div>

                        {
                            (() => {
                                if(successMessageDetail.expiry){
                                    return (
                                        <div className="detail">{successMessageDetail.expiry}</div>
                                    );
                                }
                            })()
                        }
                    </div>
                </div>

                <Link href="/member?service=consumptionRecord" as="/member?service=consumptionRecord">
                    <a className="consumption_record_link" title="購買紀錄">前往購買紀錄查詢</a>
                </Link>
            </div>

            <style jsx>
                {`
                    .success_section{
                        overflow: hidden;

                        .title{
                            font-size: 22px;
                            line-height: 30px;
                        }

                        .description{
                            font-size: 16px;
                            line-height: 30px;
                            color: #666;
                        }

                        .service_section{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: nowrap;
                            justify-content: flex-start;
                            align-items: center;
                            border-top: 1px solid #ccc;
                            border-bottom: 1px solid #ccc;
                            margin-top: 20px;
                            padding: 15px;

                            .content{
                                width: 50%;

                                .content_title{
                                    color: #666;
                                    line-height: 30px;
                                }

                                .detail{
                                    color: #333;
                                    font-size: 15px;
                                    font-weight: bold;
                                    line-height: 30px;
                                }
                            } 
                        }

                        .consumption_record_link{
                            display: block;
                            width: fit-content;
                            background-color: #8711aa;
                            color: #fff;
                            border-radius: 4px;
                            line-height: 35px;
                            font-size: 16px;
                            padding-left: 30px;
                            padding-right: 30px;
                            border: 1px solid #8711aa;
                            margin-top: 25px;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    successMessage: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
