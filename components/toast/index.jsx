
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";

const App = connect((state) => {
    return {};
}, (dispatch) => {
    return {};
})((props) => {
    const [key, setKey] = useState("");

    useEffect(() => {
        setKey(`v${new Date().getTime()}`);
    }, [props.toast]);

    return (
        <>
            <section className={`toast_message_background ${key}`} >
                <div className="message">{props.toast.message}</div>
            </section>

            <style jsx>
                {`
                    .toast_message_background.${key}{
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translateX(-50%) translateY(-50%);
                        z-index: 100;
                        background-color: #444444;
                        border-radius: 50px;
                        box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);
                        overflow: hidden;
                        animation: fade_out 5s forwards;

                        @keyframes fade_out{
                            0%{ 
                                opacity: 1;
                            }
                            50%{ 
                                opacity: 1;
                            }
                            100%{ 
                                opacity: 0;
                            }
                        }
                    }

                    .message{
                        padding: 5px 20px;
                        font-size: 14px;
                        color: #fff;    
                    }
                `}
            </style>
        </>
    );
});

App.propTypes = {
    toast: PropTypes.object.isRequired
};

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {
            toast: state.toast
        };
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {
            dispatchToast: (message) => {
                dispatch({
                    type: "toast",
                    value: message
                });
            }
        };
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            const timeout = useRef(null);

            useEffect(() => {
                timeout.current = setTimeout(() => {
                    props.dispatchToast(null);
                }, 5000);

                return () => {
                    clearTimeout(timeout.current);
                };
            }, [props.toast]);

            return (
                <>
                    {
                        (() => {
                            if(props.toast){
                                return (
                                    <App toast={props.toast} />
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
