
import { connect } from "react-redux";
import { useMemo } from "react";
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
    const data = useMemo(() => {
        return props.relatedProgram.data;
    }, [props.relatedProgram]);

    return (
        <>
            {
                (() => {
                    return data.map((item, index) => {
                        if(item.programs && item.programs.length){
                            if(item.program_publish_pic_type == "p"){
                                if(index <= 0){
                                    return (
                                        <Portrait relatedProgram={item} rank={props.rank} key={index} />
                                    );
                                }
                                else{
                                    return (
                                        <Portrait relatedProgram={item} key={index} />
                                    );
                                }
                            }
                            else if(item.program_publish_pic_type == "l"){
                                if(index <= 0){
                                    return (
                                        <Landscape relatedProgram={item} rank={props.rank} key={index} />
                                    );
                                }
                                else{
                                    return (
                                        <Landscape relatedProgram={item} key={index} />
                                    );
                                }
                            }
                        }
                    });
                })()
            }
        </>
    );
};

App.propTypes = {
    relatedProgram: PropTypes.object.isRequired,
    rank: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
