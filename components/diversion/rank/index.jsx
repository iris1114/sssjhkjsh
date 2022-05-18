
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
            <div className="rank_section">
                {
                    props.meta.map((item, index) => {
                        return (
                            <Program meta={item} key={index} />
                        );
                    })
                }
            </div>

            <style jsx>
                {`
                    .rank_section{
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
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
