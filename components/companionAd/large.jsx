
import { connect } from "react-redux";
import { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {
        resize: state.resize
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const companionAdSection = useRef(null);
    const companionAdElement = useRef(null);

    const [scale, setScale] = useState(1);

    const getHtml = useCallback(() => {
        return {
            __html: props.companionAd.value.element
        }
    }, [props.companionAd]);

    useEffect(() => {
        let width = 300;
        let computedStyle = getComputedStyle(companionAdSection.current);
        let _width = parseInt(computedStyle.width);

        if(_width < 300){
            let _scale = _width / width;

            _scale = Math.floor(_scale * 1000) / 1000;

            setScale(_scale);
        }
        else{
            setScale(1);
        }
    }, [props.resize]);

    useEffect(() => {
        if(props.companionAd.value.resourceType == "HTML"){
            let iframeDocument = companionAdElement.current.contentWindow.document;

            iframeDocument.open();
            iframeDocument.write(props.companionAd.value.resourceValue);
            iframeDocument.close();
        }
    }, [props.companionAd]);

    return (
        <>
            <div className="companion_ad_section" ref={companionAdSection}>
                <div className="padding_box">
                    {
                        (() => {
                            if(props.companionAd.value.resourceType == "HTML"){
                                return (
                                    <iframe className="companion_ad_element" width="300" height="250" ref={companionAdElement}></iframe>
                                );
                            }
                            else{
                                return (
                                    <div className="companion_ad_element" dangerouslySetInnerHTML={getHtml()}></div>
                                );
                            }
                        })()
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .companion_ad_section{
                        width: 100%;
                        max-width: 300px;
                        margin-left: auto;
                        margin-right: auto;

                        .padding_box{
                            position: relative;
                            padding-bottom: 83.33%;
                            overflow: hidden;

                            .companion_ad_element{
                                position: absolute;
                                width: 300px;
                                height: 250px;
                                top: 50%;
                                left: 50%;
                                transform: translateX(-50%) translateY(-50%) scaleX(${scale}) scaleY(${scale});
                                background-image: linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5));
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    companionAd: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
