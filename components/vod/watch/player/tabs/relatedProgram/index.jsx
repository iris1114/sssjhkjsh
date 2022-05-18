
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Landscape from "./landscape.jsx";
import Portrait from "./portrait.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            {
                (() => {
                    if(props.relatedProgram.program_publish_pic_type == "p"){
                        return (
                            <Portrait relatedProgram={props.relatedProgram} />
                        );
                    }
                    else if(props.relatedProgram.program_publish_pic_type == "l"){
                        return (
                            <Landscape relatedProgram={props.relatedProgram} />
                        );
                    }
                })()
            }
        </>
    );
};

App.propTypes = {
    relatedProgram: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
