
import { connect } from "react-redux";
import { useMemo } from "react";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const alt = useMemo(() => {
        if(props.alt){
            return props.alt;
        }

        return "picture";
    }, [props.alt]);
    
    return (
        <>
            {
                (() => {
                    if(props.type == "portrait"){
                        return (
                            <img className="placeholder" src={require("../../assets/image/poster/default/posterPortrait.svg")} alt={alt} />
                        );
                    }
                    else{
                        return (
                            <img className="placeholder" src={require("../../assets/image/poster/default/posterLandscape.svg")} alt={alt} />
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .placeholder{
                        position: absolute;
                        top: 0;
                        left: 0;
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
