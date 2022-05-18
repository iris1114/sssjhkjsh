
import { connect } from "react-redux";
import { useEffect, useState, useCallback } from "react";

import couponFaq from "../../../../assets/json/member/couponFaq.json";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [answerDisplays, setAnswerDisplays] = useState([]);

    const questionBtnClickHandler = useCallback((event, index) => {
        let _answerDisplays = [];

        for(let i = 0; i < couponFaq.faq.length; i ++){
            if(i == index){
                if(answerDisplays[index]){
                    _answerDisplays.push(false);
                }
                else{
                    _answerDisplays.push(true);
                }
            }
            else{
                _answerDisplays.push(false);
            }
        }

        setAnswerDisplays(_answerDisplays);
    }, [answerDisplays]);

    const getQuestionBtnClass = useCallback((index) => {
        if(answerDisplays[index]){
            return "focus";
        }

        return "";
    }, [answerDisplays]);

    useEffect(() => {
        let _answerDisplays = [];

        for(let i = 0; i < couponFaq.faq.length; i ++){
            _answerDisplays.push(false);
        }

        setAnswerDisplays(_answerDisplays);
    }, []);

    return (
        <>
            <div className="faq_section">
                <div className="faq_title">最常問的問題</div>

                <div className="content_items">
                    {
                        couponFaq.faq.map((item, index) => {
                            return (
                                <div className="content_item" key={index}>
                                    <button className={`question_btn ${getQuestionBtnClass(index)}`} onClick={(event) => questionBtnClickHandler(event, index)} title={item.question}>{item.question}</button>

                                    {
                                        (() => {
                                            if(answerDisplays[index]){
                                                return (
                                                    <div className="answer">{item.answer}</div>
                                                );
                                            }
                                        })()
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .faq_section{
                        background-color: #f9f9f9;
                        padding-top: 60px;

                        .faq_title{
                            font-size: 24px;
                            line-height: 30px;
                            color: #333333;
                            text-align: center;
                            padding-top: 20px;
                            font-weight: bold;
                        }

                        .content_items{
                            display: flex;
                            flex-direction: column;
                            flex-wrap: wrap;
                            justify-content: center;
                            align-items: start;
                            width: 95%;
                            margin-top: 30px;
                            margin-left: auto;
                            margin-right: auto;

                            .content_item{
                                border-bottom: 1px solid #e0e0e0;
                                width: 100%;

                                &:first-child{
                                    border-top: 1px solid #e0e0e0;
                                }

                                .question_btn{
                                    line-height: 30px;
                                    font-size: 16px;
                                    font-weight: bold;
                                    padding: 15px;
                                    width: 100%;
                                    text-align: left;

                                    &:hover{
                                        background-color: rgba(135, 17, 170, .1);
                                    }

                                    &.focus{
                                        background-color: #e1f0e2;
                                    }
                                }

                                .answer{
                                    line-height: 25px;
                                    font-size: 15px;
                                    color: #666;
                                    border-left: 4px solid #8711aa;
                                    margin: 0 15px;
                                    padding: 10px 15px;
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
