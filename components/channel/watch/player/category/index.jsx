
import { connect } from "react-redux";
import { useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import CategoriesBalloon from "./balloon/index.jsx";

const mapStateToProps = (state) => {
    return {
        categoriesBalloon: state.channel.watch.player.categoriesBalloon
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchCategoriesBalloon: (value) => {
            dispatch({
                type: "channel/watch/player/categoriesBalloon",
                value: value
            });
        }
    }
};

const App = (props) => {
    const [mouseMoveIndex, setMouseMoveIndex] = useState(0);
    const [checkStatus, setCheckStatus] = useState(false);

    const category = useMemo(() => {
        return props.categories[mouseMoveIndex];
    }, [mouseMoveIndex, props.categories]);

    const getCategorybtnClass = useCallback((element) => {
        if(!props.programInfo){
            return "";
        }

        for(let i = 0; i < props.programInfo.station_categories.length; i ++){
            let stationCategory = props.programInfo.station_categories[i];

            if(stationCategory.EngName == element.EngName){
                return "focus";
            }
        }

        return "";
    }, [props.programInfo]);

    const mouseMoveHandler = useCallback((event, index) => {
        setMouseMoveIndex(index);

        props.dispatchCategoriesBalloon({
            target: event.currentTarget
        });
    }, []);

    const catogoryToggleHandler = useCallback(() => {
        let showCategoryList = localStorage.getItem("showCategoryList");  

        if(showCategoryList && !checkStatus){
            setCheckStatus(true);
            localStorage.setItem("showCategoryList", true);
        }
        else{
            setCheckStatus(false);
            localStorage.setItem("showCategoryList", false);
        }
    }, [checkStatus])

    return (
        <>
            <div className="category_section">
                <div className="category_wrap">
                    <div className="title_section">
                        <div className="title">顯示頻道分類</div>
                        <div className="switch">
                            <input type="checkbox" id="toggle" defaultChecked={checkStatus} onChange={catogoryToggleHandler}/>
                            <label className="slider" htmlFor="toggle" defaultChecked={checkStatus}></label>
                        </div>
                    </div>
                    
                        {
                            (() => {
                                if(checkStatus){
                                    return(
                                        props.categories.map((element, index) => {
                                            return (
                                                <button className={`category_btn ${getCategorybtnClass(element)}`} onMouseMove={(event) => mouseMoveHandler(event, index)} key={index}>
                                                    <span className="icon"></span>
                                                    <span className="text">{element.Name}</span>
                                                </button>
                                            );
                                        })
                                    );
                                }
                            })()
                        }
                    {
                        (() => {
                            if(props.categoriesBalloon && props.programInfo && category){
                                return (
                                    <CategoriesBalloon meta={props.categoriesBalloon} programInfo={props.programInfo} category={category} />
                                );
                            }
                        })()
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .category_section{
                        overflow: hidden;
                        background-color: #1b1b1b;
                        padding: 30px 0;

                        .category_wrap{
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            padding-left: 0.5%;
                            padding-right: 0.5%;

                            .title_section{
                                display: flex;
                                align-items: center;

                                .title{
                                    color: #8f8f8f;
                                    font-size: 25px;
                                    margin-right: 15px;
                                    line-height: 50px;
                                }

                                .switch{
                                    position: relative;
                                    width: 34px;
                                    height: 14px;
                    
                                    input{
                                        display: none;
                                    }
                    
                                    .slider{
                                        position: absolute;
                                        cursor: pointer;
                                        top: 0;
                                        left: 0;
                                        right: 0;
                                        bottom: 0;
                                        background-color: rgba(255, 255, 255, 0.3);
                                        transition: .4s;
                                        border-radius: 10px;
                                    }
                    
                                    .slider:after {
                                        position: absolute;
                                        content: "";
                                        height: 20px;
                                        width: 20px;
                                        left: -3px;
                                        top: -3px;
                                        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
                                        background-color: #bdbdbd;
                                        transition: .4s;
                                        border-radius: 50%;
                                      }
                    
                                    input:checked + .slider {
                                        background-color: #521A62;
                                    }
                    
                                    input:checked + .slider:after {
                                        transform: translateX(20px);
                                        background-color: #8711aa;
                                    }
                                }	
                            }

                            .category_btn{
                                diplay: block;
                                float: left;
                                width: 13.28%;
                                margin-right: 1%;
                                margin-top: 15px;
                                margin-bottom: 15px;
                                padding-right: 5px;
                                overflow: hidden;
                                border-radius: 14px;
                                border: 1px solid #8f8f8f;
    
                                @media screen and (max-width: 1023px) {
                                    width: 19%;
                                }
    
                                &:hover, &.focus, &.focus:hover{
                                    border: 1px solid #8711aa;
                                    background-color: #8711aa;
    
                                    .icon{
                                        background-image: url(${require("../../../../../assets/image/channel/player/category/arrow_down_focus.svg")});
                                    }
    
                                    .text{
                                        color: #fff;
                                    }
                                }
    
                                .icon{
                                    float: right;
                                    width: 30px;
                                    height: 30px;
                                    background-image: url(${require("../../../../../assets/image/channel/player/category/arrow_down.png")});
                                    background-size: 20px 20px;
                                    background-repeat: no-repeat;
                                    background-position: center center;
                                }
    
                                .text{
                                    display: block;
                                    font-size: 15px;
                                    line-height: 30px;
                                    text-align: left;
                                    color: #8f8f8f;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    padding-left: 10px;
                                    padding-right: 5px;
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
    categories: PropTypes.array.isRequired,
    programInfo: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);