
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
            <div className="mkt_dialog">
                <a className="mkt_dialog_link" href={props.dialog.information.href} target={props.dialog.information.target} title={props.dialog.information.title}>
                    <img className="poster" src={props.dialog.information.src} alt={props.dialog.information.title} />
                </a>
            </div>

            <style jsx>
                {`
                    .mkt_dialog{
                        overflow: hidden;

                        .mkt_dialog_link{
                            display: block;

                            .poster{
                                display: block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
