
import { connect } from "react-redux";
import { useCallback } from "react";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        },
        dispatchRatingPass: (value) => {
            dispatch({
                type: "ratingPass",
                value: value
            });
        }
    };
};

const App = (props) => {
    const cancelBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: null
        });
    }, []);

    const confirmBtnClickHandler = useCallback((event) => {
        props.dispatchRatingPass(true);
        
        props.dispatchDialog({
            component: null
        });
    }, []);

    return (
        <>
            <section className="rating_dialog">
                <div className="dialog_description">
                    <img className="icon" src={require("../../assets/image/dialog/rating/restricted.png")} />

                    <div className="text_section">
                        <div className="title">若您未滿 18 歲請勿觀賞！</div>
                        <div className="desc">本類商品為限制級商品，限 18 歲以上使用者可瀏覽及購買。LiTV 線上影視網站內容依據台灣網路內容分級辦法處理，年滿 18 歲以上或達當地國家法定年齡人士；且願接受本站內容及各項條款方可觀賞</div>
                    </div>
                </div>

                <div className="dialog_btn_section">
                    <button className="cancel_btn" onClick={cancelBtnClickHandler}>我未滿十八歲</button>
                    <button className="confirm_btn" onClick={confirmBtnClickHandler}>我已滿十八歲</button>
                </div>
            </section>

            <style jsx>
                {`
                    .rating_dialog{
                        width: 480px;
                        background-color: #fff;
                        padding: 5px;

                        .dialog_description{
                            background-color: #ff0c00;
                            overflow: hidden;
                            padding-top: 30px;
                            padding-bottom: 30px;
                            padding-left: 10px;
                            padding-right: 10px;

                            .icon{
                                display: block;
                                float: left;
                                width: 108px;
                                height: 108px;
                            }

                            .text_section{
                                overflow: hidden;
                                padding-left: 10px;

                                .title{
                                    font-size: 22px;
                                    line-height: 32px;
                                    font-weight: bold;
                                    color: #f1f1f1;
                                }

                                .desc{
                                    font-size: 15px;
                                    line-height: 25px;
                                    color: #f1f1f1;
                                }
                            }
                        }

                        .dialog_btn_section{
                            display: flex;
                            flex-direction: row;
                            justify-content: space-around;
                            align-items: center;
                            height: 80px;

                            .cancel_btn{
                                background-color: #ff0c00;
                                font-size: 22px;
                                line-height: 40px;
                                border-radius: 4px;
                                padding-left: 10px;
                                padding-right: 10px;
                                color: #f1f1f1;
                            }

                            .confirm_btn{
                                background-color: #f60;
                                font-size: 22px;
                                line-height: 40px;
                                border-radius: 4px;
                                padding-left: 10px;
                                padding-right: 10px;
                                color: #f1f1f1;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
