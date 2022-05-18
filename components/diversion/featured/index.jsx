
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Program from "./program.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <div className="featured_section">
                {
                    props.meta.map((item, index) => {
                        return (
                            <Program meta={item} index={index} key={index} />
                        );
                    })
                }
            </div>

            <style jsx>
                {`
                    .featured_section{
                        overflow: hidden;
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    meta: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
