
import { connect } from "react-redux";
import PropTypes from "prop-types";

import EpNumber from "./epNumber.jsx";
import SecondaryMark from "./secondaryMark.jsx";

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
                    if(props.channel.menu_type == 0){
                        return (
                            <SecondaryMark channel={props.channel}/>
                        );
                    }
                    else{
                        return (
                            <EpNumber channel={props.channel}/> 
                        );
                    }
                })()
            }

            <style jsx>
                {`
                `}
            </style>
        </>
    );
};

App.propTypes = {
    channel: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);