
import { connect } from "react-redux";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";

const App = connect((state) => {
    return {
        resize: state.resize
    };
}, (dispatch) => {
    return {};
})((props) => {
    return (
        <>
            {
                (() => {
                    if(props.resize.width >= 1024){
                        if(props.banner.pc){
                            return (
                                <div className="promote_banner_section">
                                    <a className="link" href={props.banner.pc.url} title={props.banner.pc.title} target="_blank">
                                        <img className="image" src={props.banner.pc.image} />
                                    </a>
                                </div>
                            );
                        }
                    }
                    else{
                        if(props.banner.mobile){
                            return (
                                <div className="promote_banner_section">
                                    <a className="link" href={props.banner.mobile.url} title={props.banner.mobile.title} target="_blank">
                                        <img className="image" src={props.banner.mobile.image} />
                                    </a>
                                </div>
                            );
                        }
                    }
                })()
            }
           
            <style jsx>
                {`
                    .promote_banner_section{
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        margin-top: 20px;

                        .link{
                            display: block;

                            .image{
                                display: block;
                                width: 100%;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
});

App.propTypes = {
    banner: PropTypes.object.isRequired
};

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {
            resize: state.resize
        };
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {};
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            return (
                <>
                    {
                        (() => {
                            if(props.banner && props.resize){
                                return (
                                    <App banner={props.banner} />
                                );
                            }
                        })()
                    }
                </>
            );
        }));
    });
}, {
    ssr: false
});
