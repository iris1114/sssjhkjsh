
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Normal from "./normal.jsx";
import VideoImage from "./videoImage.jsx";
import Rule from "./rule.jsx";
import Blessedlife from "./blessedlife.jsx";
import Season from "./season.jsx";

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
                    if(props.programInfo.is_series){
                        if(props.episodes.has_seasons){
                            if(props.programInfo.is_event){
                                return (
                                    <Blessedlife episodes={props.episodes} programInfo={props.programInfo} />
                                );
                            }
                            else if(props.programInfo.content_type == "blessedlife"){
                                return (
                                    <Blessedlife episodes={props.episodes} programInfo={props.programInfo} />
                                );
                            }
                            else if(props.programInfo.content_type == "show"){
                                return (
                                    <Blessedlife episodes={props.episodes} programInfo={props.programInfo} />
                                );
                            }
                            else{
                                return (
                                    <Season episodes={props.episodes} programInfo={props.programInfo} />
                                );
                            }
                        }
                        else{
                            if(props.programInfo.is_event){
                                return (
                                    <VideoImage episodes={props.episodes} programInfo={props.programInfo} />
                                );
                            }
                            else if(props.programInfo.content_type == "show"){
                                return (
                                    <VideoImage episodes={props.episodes} programInfo={props.programInfo} />
                                );
                            }
                            else if(props.programInfo.content_type == "blessedlife"){
                                return (
                                    <VideoImage episodes={props.episodes} programInfo={props.programInfo} />
                                );
                            }
                        }
                    }
                    else if(props.programInfo.rule_id){
                        return (
                            <Rule episodes={props.episodes} programInfo={props.programInfo} />
                        );
                    }
                    
                    return (
                        <Normal episodes={props.episodes} programInfo={props.programInfo} />
                    );
                })()
            }
        </>
    );
};

App.propTypes = {
    programInfo: PropTypes.object.isRequired,
    episodes: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
