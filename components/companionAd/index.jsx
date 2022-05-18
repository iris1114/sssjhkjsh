
import { connect } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";

import api from "../../assets/js/api/index.js";

import Large from "./large.jsx";
import Promo from "./promo.jsx";
import Small from "./small.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchCompanioAd: (value) => {
            dispatch({
                type: "companionAd/ad",
                value: value
            });
        }
    };
};

const App = (props) => {
    const unmounted = useRef(false);

    const [promoBanner, setPromoBanner] = useState(null);
    const [companionAd, setCompanionAd] = useState(null);

    const getBanner = useCallback(() => {
        api.acs.promoBanner.getFetch(props.programInfo.content_id, props.programInfo.content_type).then((res) => {
            let banners = res.data;

            if(props.playAds == false){
                banners = banners.filter((item) => {
                    if(item.users == "All"){
                        return true;
                    }

                    return false;
                });
            }

            if(banners.length <= 0){
                return;
            }

            let index = Math.floor(Math.random() * banners.length);
            let banner = banners[index];
            
            if(!unmounted.current){
                setPromoBanner(banner);
            }
        });
    }, [props.programInfo, props.playAds]);

    useEffect(() => {
        if(!props.impression){
            return;
        }

        if(promoBanner || (props.companionAd && props.companionAd.value)){
            return;
        }

        getBanner();
    }, [props.impression]);

    useEffect(() => {
        if(!props.companionAd){
            return;
        }

        let value = props.companionAd.value;

        if(!value){
            setCompanionAd(null);
            getBanner();
        }
        else{
            setPromoBanner(null);
            setCompanionAd(props.companionAd);
        }
    }, [props.companionAd]);

    useEffect(() => {
        if(!promoBanner && !companionAd){
            props.dispatchCompanioAd(null);
        }
        else{
            if(promoBanner){
                props.dispatchCompanioAd({
                    type: "promoBanner",
                    value: promoBanner
                });
            }
            else if(companionAd){
                props.dispatchCompanioAd({
                    type: "companionAd",
                    value: companionAd
                });
            }
        }
    }, [promoBanner, companionAd]);

    useEffect(() => {
        return () => {
            unmounted.current = true;

            props.dispatchCompanioAd(null);
        };
    }, []);

    return (
        <>
            {
                (() => {
                    if(promoBanner){
                        return (
                            <Promo promoBanner={promoBanner} programInfo={props.programInfo} />
                        );
                    }
                    else if(companionAd){
                        if(companionAd.value.size.fixed){
                            return (
                                <Small companionAd={companionAd} />
                            );
                        }
                        else{
                            return (
                                <Large companionAd={companionAd} />
                            );
                        }
                    }
                })()
            }
        </>
    );
};

App.propTypes = {
    impression: PropTypes.number,
    companionAd: PropTypes.object,
    programInfo: PropTypes.object.isRequired,
    playAds: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);