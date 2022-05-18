
import { connect } from "react-redux";
import { useCallback } from "react";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const maskClickHandler = useCallback(() => {
        props.setMaskClick({
            component: props.mask
        });
    }, [props.mask]);

    return (
        <>  
            <button className="mask_btn" onClick={maskClickHandler}>
                {
                    (() => {
                        if(props.mask == "vodLogin"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerVodLoginMask.jpg")} alt="登入"></img>
                            );
                        }
                        else if(props.mask == "channelLogin"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerChannelLoginMask.jpg")} alt="登入"></img>
                            );
                        }
                        else if(props.mask == "deluxPurchase"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerDeluxPurchaseMask.jpg")} alt="購買"></img>
                            );
                        }
                        else if(props.mask == "vodPurchase"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerVodPurchaseMask.jpg")} alt="購買"></img>
                            );
                        }
                        else if(props.mask == "tvodPurchase"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerTvodPurchaseMask.jpg")} alt="購買"></img>
                            );
                        }
                        else if(props.mask == "channelPurchase"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerChannelPurchaseMask.jpg")} alt="購買"></img>
                            );
                        }
                        else if(props.mask == "channelTrial"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerChannelTrialMask.jpg")} alt="試用"></img>
                            );
                        }
                        else if(props.mask == "idleOverHours"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerIdleOverHoursMask.jpg")} alt="播放"></img>
                            );
                        }
                        else if(props.mask == "outsideRegion"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerOutsideRegionMask.jpg")} alt="無法播放"></img>
                            );
                        }
                        else if(props.mask == "pcParental"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerParentalMask.jpg")} alt="年齡限制"></img>
                            );
                        }
                        else if(props.mask == "multipleStream"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerMultipleStreamMask.jpg")} alt="相同帳號登入"></img>
                            );
                        }
                        else if(props.mask == "notAvailable"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerNotAvailableMask.jpg")} alt="無法播放"></img>
                            );
                        }
                        else if(props.mask == "shelves"){
                            return (
                                <img className="mask_img" src={require("../../assets/image/player/mask/playerShelvesMask.jpg")} alt="已下架"></img>
                            );
                        }
                        else if(props.mask == "playerError"){
                            return (
                                <>
                                    <img className="mask_img" src={require("../../assets/image/player/mask/playerErrorMask.jpg")} alt="無法播放"></img>
                                    <div class="error_code">{props.errorCode}</div>
                                </>
                            );
                        }
                    })()
                }
            </button>

            <style jsx>
                {`
                    .mask_btn{
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0px;
                        left: 0px;
                        z-index: 99;
                
                        .mask_img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                
                        .error_code{
                            position: absolute;
                            right: 0px;
                            bottom: 0px;
                            font-size: 13px;
                            line-height: 25px;
                            padding-left: 5px;
                            padding-right: 5px;
                            color: #fff;
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    mask: PropTypes.string.isRequired,
    setMaskClick: PropTypes.func.isRequired,
    errorCode: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
