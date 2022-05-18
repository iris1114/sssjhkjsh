
import { connect } from "react-redux";
import { useMemo, useCallback } from "react";

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
    const bulletinUrl = useMemo(() => {
        return litv.config.bulletin;
    }, []);

    const information = useMemo(() => {
        return props.dialog.information;
    }, [props.dialog]);

    const imgSrc = useMemo(() => {
        if(information.img){
            return `${bulletinUrl}${information.img}`;
        }

        return null;
    }, [bulletinUrl, information]);

    const closeBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: null
        });
    }, []);

    return (
        <>
            <div className="bulletin_dialog">
                <div className="title">{information.title}</div>
                <div className="message">{information.message}</div>

                {
                    (() => {
                        if(imgSrc){
                            return (
                                <img className="img" src={imgSrc} alt={information.title} />
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(information.uri && information.uri_caption){
                            return (
                                <a className="url" href={information.uri} target="_self" title={information.uri_caption}>{information.uri_caption}</a>
                            );
                        }
                    })()
                }

                {
                    (() => {
                        if(!imgSrc && !information.uri && !information.uri_caption){
                            return (
                                <button className="close_btn" onClick={(event) => closeBtnClickHandler(event)} title="關閉">關閉</button>
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .bulletin_dialog{
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

                        .img{
                            display: table;
                            margin-top: 10px;
                            margin-left: auto;
                            margin-right: auto;
                        }

                        .url{
                            color: #8711aa;
                            text-decoration: underline;
                            font-size: 14px;
                            text-align: center;
                            line-height: 30px;
                            display: table;
                            margin-top: 10px;
                            margin-left: auto;
                            margin-right: auto;
                        }

                        .close_btn{
                            border: none;
                            display: table;
                            outline: none;
                            background-color: #8711aa;
                            color: #fff;
                            cursor: pointer;
                            border-radius: 4px;
                            width: 90px;
                            line-height: 35px;
                            font-size: 16px;
                            margin-left: auto;
                            margin-right: auto;
                            margin-top: 30px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
