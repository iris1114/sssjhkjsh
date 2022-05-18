
import { connect } from "react-redux";
import { useMemo, useCallback } from "react";

const mapStateToProps = (state) => {
    return {
        step: state.purchase.step
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const barFillWidth = useMemo(() => {
        let width = null;

        if(props.step == 1){
            width = "0%";
        }
        else if(props.step == 2){
            width = "50%";
        }
        else{
            width = "100%";
        }

        return width;
    }, [props.step]);

    const getStep1FocusClass = useCallback(() => {
        if(props.step <= 3){
            return "focus";
        }

        return "";
    }, [props.step]);

    const getStep2FocusClass = useCallback(() => {
        if(props.step > 1 && props.step <= 3){
            return "focus";
        }

        return "";
    }, [props.step]);

    const getStep3FocusClass = useCallback(() => {
        if(props.step == 3){
            return "focus";
        }

        return "";
    }, [props.step]);

    return (
        <>
            {
                (() => {
                    if(props.step != 0){
                        return (
                            <section className="step_bar_section">
                                <div className="step_bar">
                                    <div className="bar">
                                        <div className="bar_fill"></div>
                                    </div>

                                    <div className={`step ${getStep1FocusClass()}`}>
                                        <div className="number">1</div>
                                        <div className="text">服務天數</div>
                                    </div>

                                    <div className={`step ${getStep2FocusClass()}`}>
                                        <div className="number">2</div>
                                        <div className="text">付款方式</div>
                                    </div>

                                    <div className={`step ${getStep3FocusClass()}`}>
                                        <div className="number">3</div>
                                        <div className="text">完成購買</div>
                                    </div>
                                </div>
                            </section>
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .step_bar_section{
                        max-width: 700px;
                        margin-top: 20px;
                        margin-left: auto;
                        margin-right: auto;
                        height: 60px;

                        .step_bar{
                            position: relative;
                            display: flex;
                            justify-content: space-between;
                            width: 100%;

                            .bar{
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                background-color: #d7d7d7;
                                width: 100%;
                                height: 3px;
                                transform: translateX(-50%) translateY(-50%);
                                overflow: hidden;

                                .bar_fill{
                                    display: block;
                                    width: ${barFillWidth};
                                    height: 100%;
                                    background-color: #8711aa;
                                    transition: width 0.8s ease;
                                }
                            }

                            .step{
                                position: relative;
                                text-align: center;

                                &.focus{
                                    .number{
                                        background-color: #a415ce;
                                    }

                                    .text{
                                        color: #333;
                                    }
                                }

                                .number{
                                    position: relative;
                                    background-color: #8f8f8f;
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    color: #fff;
                                    line-height: 30px;
                                    font-size: 16px;
                                    font-weight: bold;
                                }

                                .text{
                                    position: absolute;
                                    top: 100%;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    line-height: 30px;
                                    color: #8f8f8f;
                                    font-size: 18px;
                                    font-weight: bold;
                                    white-space: nowrap;
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
