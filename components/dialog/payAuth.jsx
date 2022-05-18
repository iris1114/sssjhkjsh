
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <section className="pay_auth_dialog">
                <div className="dialog_title">{props.dialog.information.title}</div>

                {
                    (() => {
                        if(props.dialog.information.method == "CREDIT"){
                            return (
                                <div className="dialog_description">連線進行信用卡授權中，請稍候...</div>
                            );
                        }
                        else{
                            return (
                                <div className="dialog_description">檢查中，請稍候...</div>
                            );
                        }
                    })()
                }

                <img className="loading_img" src={require(`../../assets/image/purchase/packageInfo/loading.gif`)} alt="loading" />
            </section>

            <style jsx>
                {`
                    .pay_auth_dialog{
                        width: 480px;
                        background-color: #fff;
                        padding: 15px;

                        .dialog_title{
                            font-size: 20px;
                            line-height: 35px;
                            font-weight: bold;
                            text-align: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .dialog_description{
                            font-size: 16px;
                            color: #f60;
                            text-align: center;
                            margin-top: 10px;
                            line-height: 30px;
                        }

                        .loading_img{
                            display: table;
                            margin-left: auto;
                            margin-right: auto;
                            margin-top: 20px;
                            margin-bottom: 20px;
                            width: 65px;
                            height: 65px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
