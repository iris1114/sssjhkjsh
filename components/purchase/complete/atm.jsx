
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        accountInfo: state.accountInfo,
        purchaseInfo: state.purchase.purchaseInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <section className="atm_section">
                <div className="bill_title">LiTV 線上影視 - ATM 轉帳資訊（尚未繳費）</div>
                <div className="item">訂購服務：{`${props.purchaseInfo.details[0].catalog_description} ${props.purchaseInfo.details[0].package_name}`}</div>
                <div className="item">訂購日期：{props.purchaseInfo.purchase_datetime}</div>
                <div className="item">訂單編號：{props.purchaseInfo.purchase_id}</div>

                {
                    (() => {
                        if(props.accountInfo && props.accountInfo.User){
                            return (
                                <div className="item">手機號碼：{props.accountInfo.User}</div>
                            );
                        }
                    })()
                }

                <div className="item">繳費期限：{props.purchaseInfo.pay_due_date}（請務必於繳費期限內完成繳費程序，逾期將自動取消訂單）</div>
                <div className="item">戶&emsp;&emsp;名：替您錄科技股份有限公司</div>
                <div className="item">轉帳帳號：{props.purchaseInfo.bar_atm}</div>
                <div className="item">銀行代碼：{props.purchaseInfo.bank_code}（台新國際商業銀行）</div>
                <div className="item">轉帳金額：${props.purchaseInfo.amount}</div>
            </section>

            <style jsx>
                {`
                    .atm_section{
                        overflow: hidden;

                        .bill_title{
                            background-color: #f1f1f1;
                            text-align: center;
                            line-height: 50px;
                            font-size: 18px;
                        }

                        .item{
                            position: relative;
                            font-size: 15px;
                            line-height: 35px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
