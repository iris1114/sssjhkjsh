
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Portrait from "./portrait.jsx";
import Landscape from "./landscape.jsx";

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
                    if(props.rank.program_publish_pics_type == "p"){
                        return (
                            <Portrait rank={props.rank} />
                        );
                    }
                    else{
                        return (
                            <Landscape rank={props.rank} />
                        );
                    }
                })()
            }
        </>
    );
};

App.propTypes = {
    rank: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
