
import { connect } from "react-redux";
import { useCallback } from "react";
import { useRouter } from "next/router";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const router = useRouter();

    const redirectBtnClickHandler = useCallback(() => {
        let href = props.dialog.information.redirect.href;
        let as = props.dialog.information.redirect.as;

        router.push(href, as);
    }, []);

    return (
        <>
            <section className="package_info_promo_dialog">
                <div className="dialog_title">{props.dialog.information.title}</div>

                <div className="dialog_description">
                    {
                        props.dialog.information.description.map((item, index) => {
                            return (
                                <div className="list" key={index}>{item}</div>
                            );
                        })
                    }
                </div>

                {
                    (() => {
                        if(props.dialog.information.redirect){
                            return (
                                <button className="redirect_btn" onClick={redirectBtnClickHandler}>{props.dialog.information.redirect.title}</button>
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .package_info_promo_dialog{
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
                            color: #f60;
                        }

                        .dialog_description{
                            text-align: center;
                            margin-top: 10px;

                            .list{
                                font-size: 16px;
                                line-height: 30px;
                            }
                        }

                        .redirect_btn{
                            display: table;
                            margin-top: 20px;
                            margin-left: auto;
                            margin-right: auto;
                            padding-left: 15px;
                            padding-right: 15px;
                            border-radius: 5px;
                            background-color: #f60;
                            color: #fff;
                            font-size: 16px;
                            line-height: 40px;
                            border: 1px solid #f60;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
