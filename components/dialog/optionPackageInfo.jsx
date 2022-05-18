
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
            <section className="option_package_info_dialog">
                <div className="dialog_title">{props.dialog.information.title}</div>

                <ul className="dialog_description">
                    {
                        props.dialog.information.description.map((item, index) => {
                            return (
                                <li className="list" key={index} dangerouslySetInnerHTML={{ __html:item}}></li>
                            );
                        })
                    }
                </ul>
            </section>

            <style jsx>
                {`
                    .option_package_info_dialog{
                        width: 480px;
                        background-color: #fff;
                        padding: 15px;

                        .dialog_title{
                            font-size: 18px;
                            line-height: 35px;
                            font-weight: bold;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            border-bottom: 1px solid #ddd;
                        }

                        .dialog_description{
                            padding-left: 20px;
                            line-height: 30px;
                            font-size: 14px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
