
import { connect } from "react-redux";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const App = connect((state) => {
    return {};
}, (dispatch) => {
    return {};
})((props) => {
    return (
        <>
            <section className="loading_background">
                <img className="loading_img" src={require("../../assets/image/loading/loading.svg")} alt="loading" />
            </section>

            <style jsx>
                {`
                    .loading_background{
                        position: fixed;
                        top: 0px;
                        bottom: 0px;
                        left: 0px;
                        right: 0px;
                        z-index: 100;
                
                        .loading_img{
                            display: block;
                            width: 65px;
                            height: 65px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translateX(-50%) translateY(-50%);
                        }
                    }
                `}
            </style>
        </>
    );
});

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {
            loading: state.loading
        };
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {
            dispatchLoading: (value) => {
                dispatch({
                    type: "loading",
                    value: value
                });
            }
        };
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            const timeout = useRef(null);

            useEffect(() => {
                clearTimeout(timeout.current);

                if(props.loading.value){
                    timeout.current = setTimeout(() => {
                        props.dispatchLoading(false);
                    }, 10000);
                }
            }, [props.loading]);

            return (
                <>
                    {
                        (() => {
                            if(props.loading.value){
                                return (
                                    <App />
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
