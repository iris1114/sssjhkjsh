
import { connect } from "react-redux";
import { useMemo, useCallback } from "react";
import { useRouter } from "next/router";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
    
    const information = useMemo(() => {
        return props.dialog.information;
    }, [props.dialog]);

    const cancelBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: null
        });
    }, []);

    const buyBtnClickHandler = useCallback((event) => {
        router.push("/purchase");
    }, []);

    return (
        <>
            <div className="valid_dialog">
                <div className="title">服務到期提醒</div>
                <div className="message">{information.notice_message}</div>

                <div className="btn_section">
                    <button className="cancel_btn" onClick={(event) => cancelBtnClickHandler(event)} title="下次再說">下次再說</button>
                    <button className="buy_btn" onClick={(event) => buyBtnClickHandler(event)} title="立即購買">立即購買</button>
                </div>
            </div>

            <style jsx>
                {`
                    .valid_dialog{
                        background-color: #fff;
                        padding: 20px;

                        .title{
                            text-align: center;
                            font-size: 22px;
                            font-weight: bold;
                            line-height: 40px;
                            margin-bottom: 20px;
                        }

                        .message{
                            font-size: 18px;
                            font-weight: 400;
                            line-height: 30px;
                            margin-bottom: 20px;
                        }

                        .btn_section{
                            text-align: center;

                            .cancel_btn{
                                padding-top: 12px;
                                padding-bottom: 12px;
                                padding-left: 15px;
                                padding-right: 15px;
                                margin-left: 3px;
                                margin-right: 3px;
                                font-size: 16px;
                                border: 1px solid #8711aa;
                                background-color: #fff;
                                border-radius: 5px;
                                color: #8711aa;
                            }

                            .buy_btn{
                                padding-top: 12px;
                                padding-bottom: 12px;
                                padding-left: 15px;
                                padding-right: 15px;
                                margin-left: 3px;
                                margin-right: 3px;
                                font-size: 16px;
                                border: 1px solid #8711aa;
                                background-color: #8711aa;
                                border-radius: 5px;
                                color: #fff;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
