
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <div className="step_section">
                <div className="step_title">啟用流程說明圖示</div>

                <div className="content_items">
                    <div className="content_item">
                        <div className="poster_section">
                            <div className="padding_box"></div>
                            <img className="poster" src={require("../../../../assets/image/member/couponStep01.png")} alt="step01" />
                        </div>

                        <div className="content_section">
                            <div className="number">1</div>
                            <div className="text">登入/註冊</div>
                        </div>
                    </div>

                    <div className="content_item">
                        <div className="poster_section">
                            <div className="padding_box"></div>
                            <img className="poster" src={require("../../../../assets/image/member/couponStep02.png")} alt="step02" />
                        </div>

                        <div className="content_section">
                            <div className="number">2</div>
                            <div className="text">輸入兌換碼，按下確認啟用</div>
                        </div>
                    </div>

                    <div className="content_item">
                        <div className="poster_section">
                            <div className="padding_box"></div>
                            <img className="poster" src={require("../../../../assets/image/member/couponStep03.png")} alt="step03" />
                        </div>

                        <div className="content_section">
                            <div className="number">3</div>
                            <div className="text">完成啟用，開始觀看</div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .step_section{
                        background-color: #f9f9f9;
                        margin-top: 60px;
                        border-top: 1px solid #e0e0e0;

                        .step_title{
                            font-size: 24px;
                            line-height: 30px;
                            color: #333333;
                            text-align: center;
                            padding-top: 20px;
                            font-weight: bold;
                        }

                        .content_items{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: nowrap;
                            justify-content: center;
                            align-items: center;
                            margin-top: 30px;

                            .content_item{
                                width: 33.33%;

                                .poster_section{
                                    position: relative;
                                    width: 70%;
                                    margin: 0 auto;

                                    .padding_box{
                                        padding-bottom: 106.19%;
                                    }

                                    .poster{
                                        display: block;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                .content_section{
                                    display: flex;
                                    flex-direction: row;
                                    flex-wrap: nowrap;
                                    justify-content: center;
                                    align-items: center;
                                    margin-top: 10px;

                                    .number{
                                        border-radius: 50%;
                                        background-color: #333;
                                        overflow: hidden;
                                        color: #fff;
                                        font-weight: bold;
                                        width: 22px;
                                        height: 22px;
                                        text-align: center;
                                        line-height: 25px;
                                    }

                                    .text{
                                        margin-left: 5px;
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
