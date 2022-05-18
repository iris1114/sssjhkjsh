
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
            <div className="copyright_problem_section">
                <div className="problem">如您在「啟用兌換券」時，有其他操作上的問題，請洽客服專線：<span className="mark">(02)7707-0708</span>。</div>
                <div className="copyright">本公司保留變更或終止活動時間、內容之權利。</div>
            </div>

            <style jsx>
                {`
                    .copyright_problem_section{
                        background-color: #f9f9f9;
                        padding: 30px;

                        .problem{
                            color: #666;
                            font-size: 16px;
                            line-height: 30px;

                            .mark{
                                color: #8711aa;
                            }
                        }

                        .copyright{
                            color: #666;
                            font-size: 12px;
                            line-height: 25px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
