
import { connect } from "react-redux";
import { useMemo } from "react";
import PropTypes from "prop-types";

import Service from "./service.jsx";
import Step1 from "./step1.jsx";
import Step2 from "./step2.jsx";

const mapStateToProps = (state) => {
    return {
        step: state.purchase.step
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const contentSectionStyle = useMemo(() => {
        let obj = {
            marginTop: "20px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.2)"
        };

        if(props.groupId){
            obj.marginTop = "0px";
            obj.marginBottom = "0px";
            obj.boxShadow = "none";
        }

        return obj;
    }, []);

    return (
        <>
            <section className="content_section">
                <Service packageInfo={props.packageInfo} />

                {
                    (() => {
                        if(props.step == 1){
                            return (
                                <Step1 packageInfo={props.packageInfo} />
                            );
                        }
                        else if(props.step == 2){
                            return (
                                <Step2 packageInfo={props.packageInfo} groupId={props.groupId} />
                            );
                        }
                    })()
                }
            </section>

            <style jsx>
                {`
                    .content_section{
                        overflow: hidden;
                        background-color: #fff;
                        margin-top: ${contentSectionStyle.marginTop};
                        margin-bottom: ${contentSectionStyle.marginBottom};
                        padding: 20px;
                        box-shadow: ${contentSectionStyle.boxShadow};
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    packageInfo: PropTypes.object.isRequired,
    groupId: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
