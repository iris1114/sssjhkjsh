
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Yahoo from "./yahoo.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <div className="referring_partner_section">
                {
                    (() => {
                        if(props.referringPartner == "yahoo"){
                            return (
                                <Yahoo />
                            );
                        }
                    })()
                }
            </div>
        </>
    );
};

App.propTypes = {
    referringPartner: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
