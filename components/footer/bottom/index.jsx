
import { connect } from "react-redux";
import { useMemo } from "react";

import tools from "../../../assets/js/tools/index.js";

import ReferringPartner from "./referringPartner/index.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const referringPartner = useMemo(() => {
        return tools.url.getReferringPartner();
    }, []);

    const year = useMemo(() => {
        return new Date().getFullYear();
    }, []);

    return (
        <>
            <div className="copyright_section">
                {
                    (() => {
                        if(referringPartner){
                            return (
                                <ReferringPartner referringPartner={referringPartner} />
                            );
                        }
                    })()
                }

                <div className="copyright_container">
                    <div className="info_wrap">
                        <img  className="ott_img" src={require("../../../assets/image/footer/goldOtt.png")} alt="ott"/>
 
                        <div className="info">
                            <p className="copyright">Copyright © 2011-{year} LiTV 立視科技 All Rights Reserved</p> 
                            <p className="support">本服務使用中華電信影音平台遞送</p>
                        </div>
                    </div>

                    <div className="contact_wrap">
                        <p className="phone">客服專線：02-7707-0708</p>
                        <p className="time">週一至週五/09:00-21:00，例假日/10:00-18:00</p>
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .copyright_section{
                        border-top: 1px solid #dadada;

                        .copyright_container{
                            padding: 10px 20px;
                            display: flex;
                            justify-content: space-between;
                            flex-wrap: wrap;

                            @media (max-width: 767px){
                                flex-direction: column-reverse;  
                                align-content: center;
                            }

                            .info_wrap{
                                display: flex;
                                align-items: center;

                                @media (max-width: 767px){
                                    align-items: flex-start;
                                }

                                .ott_img{
                                    height: 32px;
                                    margin-right: 10px
                                }

                                .info{
                                    .copyright{
                                        font-size: 12px;
                                        line-height: 16px;
                                    }
                                    .support{
                                        font-size: 11px;
                                        line-height: 18px;
                                        opacity: 0.3;
                                    }
                                }

                            }

                            .contact_wrap{
                                display: flex;
                                align-items: center;

                                @media (max-width: 767px){
                                    flex-direction: column;
                                    align-items: flex-start;
                                    margin-bottom: 20px;
                                }
                               
                                .phone{
                                    font-size: 15px;
                                    font-weight: 700;
                                    margin-right: 10px;
                                    line-height: 24px;  
                                }
                                .time{
                                    font-size: 12px;
                                    line-height: 24px;  
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
