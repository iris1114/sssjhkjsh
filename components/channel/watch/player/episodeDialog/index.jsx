
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";

import Channel from "./channel.jsx";
import VodChannel from "./vodChannel/index.jsx";
import PlayoutChannel from "./playoutChannel.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchEpisodeDialog: (value) => {
            dispatch({
                type: "channel/watch/player/episodeDialog",
                value: value
            });
        },
    };
};

const App = (props) => {
    const channel = useMemo(() => {
        let channels =  props.channels;

        for(let i = 0; i < channels.length; i++){
            let channel = channels[i];

            if(channel.content_id == props.channel.content_id){
                return channel;
            }
        }
    },[props.channel, props.channels]);

    const closeBtnClickHandler = useCallback(() => {
        props.dispatchEpisodeDialog(null);
    }, []);

    return (
        <>
            <div className="episode_dialog">
               <div className="close_btn" onClick={closeBtnClickHandler}></div>
               {
                   (() => {
                    if(props.channel.content_type == "channel"){
                        return (
                            <Channel channel={channel} />
                        );
                    }
                    else if(props.channel.content_type == "vod-channel"){
                        return (
                            <VodChannel channel={channel} />
                        );
                    }
                    else if(props.channel.content_type == "playout-channel"){
                        return (
                            <PlayoutChannel channel={channel} />
                        );
                    }
                   })()
               }
            </div>

            <style jsx>
                {`
                  .episode_dialog{
                      position: absolute;
                      top: 0px;
                      width: 100%;
                      height: 100%;
                      background-color: #343434;
                      color: #fff;
                      z-index: 3;
                    
                    .close_btn{
                        position: absolute;
                        top: 17px;
                        right: 25px;
                        width: 22px;
                        height: 22px;
                        background-image: url(${require("../../../../../assets/image/channel/player/episodeDialog/btn_close.svg")});
                        background-size: cover;
                        cursor: pointer;
                        z-index: 2;
                    }
                  }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    channel: PropTypes.object.isRequired,
    channels: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);