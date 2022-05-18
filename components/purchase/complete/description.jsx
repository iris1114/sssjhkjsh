
import { connect } from "react-redux";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {
        packageInfo: state.purchase.packageInfo,
        purchaseInfo: state.purchase.purchaseInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <section className="description_section">
                <div className="description_title">說明：</div>

                <ol className="description_lists">
                    {
                        (() => {
                            if(props.purchaseInfo.pay_type == "REMIT" || props.purchaseInfo.pay_type == "ATM"){
                                return (
                                    <li className="list">請您於期限內完成繳費，繳費成功{props.contentInfo.title}將為您開啟服務，服務開通後，將以簡訊通知您。</li>
                                );
                            }
                        })()
                    }
                    
                    <li className="list">影片版權僅限台、澎、金、馬地區播放。</li>

                    {
                        (() => {
                            if(props.packageInfo.name != "channel"){
                                return (
                                    <li className="list">電影不含單片租借之內容觀賞權限。</li>
                                );
                            }
                        })()
                    }

                    {
                        (() => {
                            if(props.packageInfo.name != "vod"){
                                return (
                                    <li className="list">因版權規範限制，頻道部份內容與有線電視不同。</li>
                                );
                            }
                        })()
                    }
                </ol>
            </section>

            <style jsx>
                {`
                    .description_section{
                        border-top: 1px solid #999;
                        margin-top: 30px;
                        padding-top: 10px;
                        font-size: 15px;
                        line-height: 30px;

                        .description_title{
                            display: inline-block;
                        }

                        .description_lists{
                            display: inline-block;
                            vertical-align: top;
                            padding-left: 20px;
                            margin-top: 0;
                            margin-bottom: 0;

                            .list{
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
