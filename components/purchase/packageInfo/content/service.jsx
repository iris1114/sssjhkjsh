
import { connect } from "react-redux";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <section className="service_section">
                <div className="service">選購服務：<span className="package_name">{props.packageInfo.title}</span></div>
                <div className="description">{props.packageInfo.description}</div>
            </section>

            <style jsx>
                {`
                    .service_section{
                        overflow: hidden;

                        .service{
                            font-size: 16px;
                            line-height: 30px;

                            .package_name{
                                font-size: 24px;
                                font-weight: bold;
                                color: #8711aa;;
                            }
                        }

                        .description{
                            font-size: 16px;
                            line-height: 30px;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    packageInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
