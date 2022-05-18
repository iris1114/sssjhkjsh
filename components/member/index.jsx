
import { connect } from "react-redux";
import { useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

import WatchRecord from "./watchRecord.jsx";
import ChangePassword from "./changePassword.jsx";
import EnableCoupon from "./enableCoupon/index.jsx";
import AvailableService from "./availableService.jsx";
import ConsumptionRecord from "./consumptionRecord.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLogin: (value) => {
            dispatch({
                type: "login",
                value: value
            });
        }
    };
};

const App = (props) => {
    const getLinkFocusClass = useCallback((item) => {
        if(item == props.service){
            return "focus";
        }

        return "";
    }, [props.service]);

    const logoutBtnClickHandler = useCallback((event) => {
        props.dispatchLogin(false);
    }, []);

    return (
        <>
            <div className="personal_center">
                <div className="control_btn_section">
                    <h1 className="title">個人中心</h1>

                    <div className="control_btns">
                        {
                            Object.keys(props.components).map((item, index) => {
                                return (
                                    <Link href={`/member?service=${item}`} as={`/member?service=${item}`} key={index}>
                                        <a className={`control_btn ${getLinkFocusClass(item)}`} title={props.components[item]}>{props.components[item]}</a>
                                    </Link>
                                );
                            })
                        }

                        <a className="control_btn" href="https://support.litv.tv" target="_blank" title="常見問題" rel="noopener">常見問題</a>
                        <button className="control_btn" onClick={(event) => logoutBtnClickHandler(event)} title="登出">登出</button>
                    </div>
                </div>

                <div className="member_content_section">
                    {
                        (() => {
                            if(props.service == "watchRecord"){
                                return (
                                    <WatchRecord />
                                );
                            }
                            else if(props.service == "changePassword"){
                                return (
                                    <ChangePassword />
                                );
                            }
                            else if(props.service == "enableCoupon"){
                                return (
                                    <EnableCoupon />
                                );
                            }
                            else if(props.service == "availableService"){
                                return (
                                    <AvailableService />
                                );
                            }
                            else if(props.service == "consumptionRecord"){
                                return (
                                    <ConsumptionRecord />
                                );
                            }
                        })()
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .personal_center{
                        display: flex;
                        flex-direction: row;
                        max-width: 1150px;
                        margin: 20px auto;

                        .control_btn_section{
                            width: 15%;
                            background-color: #fff;
                            height: fit-content;

                            .title{
                                font-size: 20px;
                                font-weight: bold;
                                padding: 10px 20px;
                                border-bottom: 1px solid #bbb;
                            }

                            .control_btn{
                                display: block;
                                width: 100%;
                                padding: 10px 20px;
                                text-align: left;

                                &:hover{
                                    background-color: #a664aa;
                                    color: #fff;
                                }

                                &.focus{
                                    background-color: #8c4593;
                                    color: #fff;
                                }
                            }
                        }

                        .member_content_section{
                            width: 83%;
                            margin-left: 2%;
                            background-color: #fff;
                            padding: 30px 15px;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    components: PropTypes.object.isRequired,
    service: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
