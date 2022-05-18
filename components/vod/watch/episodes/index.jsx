
import { connect } from "react-redux";
import { useMemo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import Normal from "./normail.jsx";
import VideoImage from "./videoImage.jsx";
import Season from "./season.jsx";
import Blessedlife from "./blessedlife.jsx";
import Rule from "./rule.jsx";
import Trailer from "../trailer.jsx";

import watch from "../../../../assets/js/watch/index.js";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [tabFocus, setTabFocus] = useState("films");

    const ruleId = useMemo(() => {
        return props.programInfo.rule_id;
    }, [props.programInfo]);

    const films = useMemo(() => {
        if(ruleId){
            return watch.vod.episodes.rulePlayList(props.episodes);
        }
        else{
            return watch.vod.episodes.films(props.episodes);
        }
    }, [props.episodes, ruleId]);

    const trailers = useMemo(() => {
        return watch.vod.episodes.trailers(props.episodes);
    }, [props.episodes]);

    const getTabClass = useCallback((target) => {
        if(target == tabFocus){
            return "focus";
        }

        return "";
    }, [tabFocus]);

    const listClickHandler = useCallback((event, type) => {
        setTabFocus(type);
    }, []);

    useEffect(() => {
        if(!films){
            setTabFocus("trailers");
        }
        else{
            setTabFocus("films");
        }
    }, [films]);

    return (
        <>  
            {
                (() => {
                    if(films || trailers){
                        return (
                            <div className="episodes_section">
                                <div className="list_section">
                                    <div className="under_line"></div>

                                    {
                                        (() => {
                                            if(films){
                                                return (
                                                    <span className={`list ${getTabClass("films")}`} onClick={(event) => listClickHandler(event, "films")}>
                                                        <div className="text">劇集列表</div>
                                                        <div className="under_line"></div>
                                                    </span>
                                                );
                                            }
                                        })()
                                    }

                                    {
                                        (() => {
                                            if(trailers){
                                                return (
                                                    <span className={`list ${getTabClass("trailers")}`} onClick={(event) => listClickHandler(event, "trailers")}>
                                                        <div className="text">預告花絮</div>
                                                        <div className="under_line"></div>
                                                    </span>
                                                )
                                            }
                                        })()
                                    }
                                </div>

                                <div className="pane_section">
                                    {
                                        (() => {
                                            if(films && tabFocus == "films"){
                                                return (
                                                    <div className="pane">
                                                        {
                                                            (() => {
                                                                if(props.programInfo.is_series){
                                                                    if(props.episodes.has_seasons){
                                                                        if(props.programInfo.is_event){
                                                                            return (
                                                                                <Blessedlife episodes={films} programInfo={props.programInfo} />
                                                                            );
                                                                        }
                                                                        else if(props.programInfo.content_type == "blessedlife"){
                                                                            return (
                                                                                <Blessedlife episodes={films} programInfo={props.programInfo} />
                                                                            );
                                                                        }
                                                                        else if(props.programInfo.content_type == "show"){
                                                                            return (
                                                                                <Blessedlife episodes={films} programInfo={props.programInfo} />
                                                                            );
                                                                        }
                                                                        else{
                                                                            return (
                                                                                <Season episodes={films} programInfo={props.programInfo} />
                                                                            );
                                                                        }
                                                                    }
                                                                    else{
                                                                        if(props.programInfo.is_event){
                                                                            return (
                                                                                <VideoImage episodes={films} programInfo={props.programInfo} />
                                                                            );
                                                                        }
                                                                        else if(props.programInfo.content_type == "show"){
                                                                            return (
                                                                                <VideoImage episodes={films} programInfo={props.programInfo} />
                                                                            );
                                                                        }
                                                                        else if(props.programInfo.content_type == "blessedlife"){
                                                                            return (
                                                                                <VideoImage episodes={films} programInfo={props.programInfo} />
                                                                            );
                                                                        }
                                                                    }
                                                                }
                                                                else if(ruleId){
                                                                    return (
                                                                        <Rule episodes={films} programInfo={props.programInfo} />
                                                                    );
                                                                }
                                                                
                                                                return (
                                                                    <Normal episodes={films} programInfo={props.programInfo} />
                                                                );
                                                            })()
                                                        }
                                                    </div>
                                                );
                                            }
                                        })()
                                    }

                                    {
                                        (() => {
                                            if(trailers && tabFocus == "trailers"){
                                                return (
                                                    <div className="pane">
                                                        <Trailer episodes={trailers} programInfo={props.programInfo} />
                                                    </div>
                                                )
                                            }
                                        })()
                                    }
                                </div>
                            </div>
                        );
                    }
                })()
            }

            <style jsx>
                {`
                    .episodes_section{
                        overflow: hidden;
                        max-width: 1150px;
                        margin-left: auto;
                        margin-right: auto;
                        margin-top: 20px;

                        .list_section{
                            padding-left: 0.5%;
                            padding-right: 0.5%;
                            overflow: hidden;
                            position: relative;

                            & > .under_line{
                                position: absolute;
                                bottom: 0px;
                                left: 0.5%;
                                right: 0.5%;
                                height: 3px;
                                background-color: #999;
                            }

                            .list{
                                position: relative;
                                float: left;
                                padding-left: 30px;
                                padding-right: 30px;
                                cursor: pointer;

                                &.focus{
                                    .text{
                                        color: #5e0b75;
                                    }

                                    .under_line{
                                        display: block;
                                    }
                                }

                                .text{
                                    font-size: 20px;
                                    line-height: 40px;
                                    font-weight: bold;
                                    color: #999;
                                }

                                .under_line{
                                    display: none;
                                    position: absolute;
                                    width: 100%;
                                    left: 0px;
                                    bottom: 0px;
                                    height: 3px;
                                    background-color: #5e0b75;
                                }
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    programInfo: PropTypes.object.isRequired,
    episodes: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
