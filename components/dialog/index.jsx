
import { connect } from "react-redux";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Login from "./login.jsx";
import Register from "./register.jsx";
import ForgetPassword from "./forgetPassword.jsx";
import Passcode from "./passcode.jsx";
import ResetPassword from "./resetPassword.jsx";
import Rating from "./rating.jsx";
import PackageInfoPromo from "./packageInfoPromo.jsx";
import OptionPackageInfo from "./optionPackageInfo.jsx";
import PayAuth from "./payAuth.jsx";
import PayError from "./payError.jsx";
import Modify from "./modify.jsx";
import PackageInfo from "./packageInfo.jsx";
import Complete from "./complete.jsx";
import Tvod from "./tvod.jsx";
import TvodComplete from "./tvodComplete.jsx";
import Description from "./description.jsx";
import ChannelTrialDialog from "./channelTrial.jsx";
import Search from "./search.jsx";
import Mkt from "./mkt.jsx";
import Valid from "./valid.jsx";
import Bulletin from "./bulletin.jsx";

const App = connect((state) => {
    return {
        dialog: state.dialog
    };
}, (dispatch) => {
    return {
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        }
    };
})((props) => {
    const router = useRouter();

    const exitBtnClickHandler = useCallback((event) => {
        props.dispatchDialog({
            component: null
        });
    }, []);

    useEffect(() => {
        const handleRouteChange = () => {
            props.dispatchDialog({
                component: null
            });
        };
        
        router.events.off("routeChangeStart", handleRouteChange);
        router.events.on("routeChangeStart", handleRouteChange);
    
        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, []);

    return (
        <>
            <div className="dialog_mask">
                <section className="dialog_component">
                    {
                        (() => {
                            if(props.dialog.component == "login"){
                                return (
                                    <Login />
                                );
                            }
                            else if(props.dialog.component == "register"){
                                return (
                                    <Register />
                                );
                            }
                            else if(props.dialog.component == "forgetPassword"){
                                return (
                                    <ForgetPassword />
                                );
                            }
                            else if(props.dialog.component == "passcode"){
                                return (
                                    <Passcode />
                                );
                            }
                            else if(props.dialog.component == "resetPassword"){
                                return (
                                    <ResetPassword />
                                );
                            }
                            else if(props.dialog.component == "rating"){
                                return (
                                    <Rating />
                                );
                            }
                            else if(props.dialog.component == "optionPackageInfo"){
                                return (
                                    <OptionPackageInfo />
                                );
                            }
                            else if(props.dialog.component == "packageInfoPromo"){
                                return (
                                    <PackageInfoPromo />
                                );
                            }
                            else if(props.dialog.component == "payAuth"){
                                return (
                                    <PayAuth />
                                );
                            }
                            else if(props.dialog.component == "payError"){
                                return (
                                    <PayError />
                                );
                            }
                            else if(props.dialog.component == "modify"){
                                return (
                                    <Modify />
                                );
                            }
                            else if(props.dialog.component == "packageInfo"){
                                return (
                                    <PackageInfo />
                                );
                            }
                            else if(props.dialog.component == "complete"){
                                return (
                                    <Complete />
                                );
                            }
                            else if(props.dialog.component == "tvod"){
                                return (
                                    <Tvod />
                                );
                            }
                            else if(props.dialog.component == "tvodComplete"){
                                return (
                                    <TvodComplete />
                                );
                            }
                            else if(props.dialog.component == "description"){
                                return (
                                    <Description />
                                );
                            }
                            else if(props.dialog.component == "channelTrial"){
                                return (
                                    <ChannelTrialDialog />
                                );
                            }
                            else if(props.dialog.component == "search"){
                                return (
                                    <Search />
                                );
                            }
                            else if(props.dialog.component == "mkt"){
                                return (
                                    <Mkt />
                                );
                            }
                            else if(props.dialog.component == "valid"){
                                return (
                                    <Valid />
                                );
                            }
                            else if(props.dialog.component == "bulletin"){
                                return (
                                    <Bulletin />
                                );
                            }
                        })()
                    }

                    {
                        (() => {
                            if(props.dialog.exitIcon){
                                return (
                                    <button className="exit_btn" onClick={exitBtnClickHandler}></button>
                                )
                            }
                        })()
                    }
                </section>
            </div>

            <style jsx>
                {`
                    .dialog_mask{
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        background-color: rgba(0,0,0,.5);
                        z-index: 100;

                        .dialog_component{
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translateX(-50%) translateY(-50%);

                            .exit_btn{
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 35px;
                                height: 35px;
                                opacity: .5;
                                background-image: url(${require("../../assets/image/dialog/exitBtn.png")});
                                background-size: cover;
                            }
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
            dialog: state.dialog
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
                            if(props.dialog.component){
                                return (
                                    <App />
                                );
                            }
                        })()
                    }
                </>
            );
        }));
    })
}, {
    ssr: false
});
