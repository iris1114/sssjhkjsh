
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
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

    const [scale, setScale] = useState(1);

    const html = useMemo(() => {
        return {
            __html: props.companionAd.value.element
        }
    }, [props.companionAd]);

    useEffect(() => {
        let width = 640;
        let computedStyle = getComputedStyle(companionAdSection.current);
        let _width = parseInt(computedStyle.width);
        let _scale = _width / width;

        _scale = Math.floor(_scale * 1000) / 1000;

        setScale(_scale);
    }, [props.resize]);

    return (
        <>
            <div className="companion_ad_section" ref={companionAdSection}>
                <div className="padding_box">
                    <div className="companion_ad_element" dangerouslySetInnerHTML={html}></div>
                </div>
            </div>

            <style jsx>
                {`
                    .companion_ad_section{
                        .padding_box{
                            position: relative;
                            padding-bottom: 15.63%;
                            overflow: hidden;

                            .companion_ad_element{
                                position: absolute;
                                width: 640px;
                                height: 100px;
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
