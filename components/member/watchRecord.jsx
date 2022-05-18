
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import LazyLoad from "react-lazyload";

import watch from "../../assets/js/watch/index.js";
import tools from "../../assets/js/tools/index.js";

import PosterBannerStyle from "../../assets/css/posterBanner/posterBannerStyle.jsx";
import Placeholder from "../placeholder/index.jsx";

const mapStateToProps = (state) => {
    return {
        accountVarUpdate: state.player.accountVarUpdate
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLoading: (value) => {
            dispatch({
                type: "loading",
                value: value
            });
        },
        dispatchAccountVarUpdate: (value) => {
            dispatch({
                type: "player/accountVarUpdate",
                value: value
            });
        },
        dispatchToast: (message) => {
            dispatch({
                type: "toast",
                value: message
            });
        }
    };
};

const App = (props) => {
    const router = useRouter();

    const [records, setResords] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [select, setSelect] = useState([]);

    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const editToggleBtnClickHandler = useCallback((event) => {
        setEditMode(!editMode);
        setSelect([]);
    }, [editMode]);

    const removeBtnClickHandler = useCallback((event) => {
        props.dispatchLoading(true);

        let promise = Promise.resolve();

        promise = promise.then(() => {
            return watch.vod.accountVar.init();
        });

        promise = promise.then((_accountVar) => {
            _accountVar = watch.vod.accountVar.remove(_accountVar, select);

            return watch.vod.accountVar.update(_accountVar);
        });

        promise = promise.then(() => {
            editToggleBtnClickHandler();
            props.dispatchLoading(false);
            props.dispatchAccountVarUpdate(new Date().getTime());
            props.dispatchToast("已刪除");
        });
    }, [select]);

    const getHref = useCallback((item) => {
        return `/${item.content_type}/${item.content_id}?time=${item.time}`;
    }, []);

    const recordItemClickHandler = useCallback((event, item) => {
        event.preventDefault();

        if(editMode){
            let index = select.indexOf(item);

            if(index == -1){
                setSelect((_select) => {
                    return [..._select, item];
                });
            }
            else{
                setSelect((_select) => {
                    return _select.filter((_item, _index) => {
                        if(index != _index){
                            return true;
                        }
    
                        return false;
                    });
                });
            }
        }
        else{
            router.push(getHref(item));
        }
    }, [editMode, select]);

    const getPoster = useCallback((item) => {
        if(item.picture){
            return `${cdnstatic}/${item.picture}`;
        }

        return "";
    }, [cdnstatic]);

    const getWatchTime = useCallback((item) => {
        return `觀看至${tools.formattedTime(item.time / 1000)}`;
    }, []);

    useEffect(() => {
        props.dispatchLoading(true);

        let promise = Promise.resolve();

        promise = promise.then(() => {
            return watch.vod.accountVar.init();
        });

        promise = promise.then((_accountVar) => {
            return watch.vod.accountVar.getAll(_accountVar);
        });

        promise = promise.then((_accountVar) => {
            setResords(_accountVar.data);
            props.dispatchLoading(false);
        });
    }, [props.accountVarUpdate]);

    return (
        <>
            <PosterBannerStyle />

            <div className="watch_record_section">
                <h2 className="title">觀看紀錄</h2>
                <div className="description">最近在隨選觀看過的影片及時間紀錄。</div>

                {
                    (() => {
                        if(records){
                            if(records.length){
                                return (
                                    <>
                                        <div className="control_btn_section">
                                            {
                                                (() => {
                                                    if(!editMode){
                                                        return (
                                                            <button className="control_btn edit_btn" title="編輯" onClick={(event) => editToggleBtnClickHandler(event)}>編輯</button>
                                                        );
                                                    }
                                                    else{
                                                        return (
                                                            <>
                                                                <button className="control_btn cancel_btn" title="取消" onClick={(event) => editToggleBtnClickHandler(event)}>取消</button>
    
                                                                {
                                                                    (() => {
                                                                        if(select && select.length){
                                                                            return (
                                                                                <button className="control_btn remove_btn" title="刪除" onClick={(event) => removeBtnClickHandler(event)}>刪除</button>
                                                                            );
                                                                        }
                                                                    })()
                                                                }
                                                            </>
                                                        );
                                                    }
                                                })()
                                            }
                                        </div>
    
                                        <div className="records_section">
                                            {
                                                records.map((item, index) => {
                                                    return (
                                                        <a className="record_item" href={getHref(item)} onClick={(event) => recordItemClickHandler(event, item)} title={item.title} key={index}>
                                                            <div className="img_container">
                                                                <div className="padding_box"></div>

                                                                <LazyLoad placeholder={<Placeholder type="landscape" alt={item.title} />}>
                                                                    <img className="record_img" src={getPoster(item)} alt={item.title} />
                                                                </LazyLoad>

                                                                {
                                                                    item.poster_banners.map((_item, _index) => {
                                                                        return(
                                                                            <span className="poster_banner_poster_icon" data-poster-banner={_item} key={_index}></span>
                                                                        );
                                                                    })
                                                                }

                                                                {
                                                                    (() => {
                                                                        if(editMode){
                                                                            return (
                                                                                <button className="edit_mask">
                                                                                    <div className="checkbox">
                                                                                        {
                                                                                            (() => {
                                                                                                if(select.indexOf(item) != -1){
                                                                                                    return(
                                                                                                        <img className="checkbox_icon" src={require("../../assets/image/checkbox/checkedCheckboxOrange.png")} alt="勾選" />
                                                                                                    );
                                                                                                }else{
                                                                                                    return(
                                                                                                        <img className="checkbox_icon" src={require("../../assets/image/checkbox/uncheckedCheckboxWhite.png")} alt="取消勾選" />
                                                                                                    );   
                                                                                                }
                                                                                            })()
                                                                                        }
                                                                                    </div>
                                                                                </button>
                                                                            );
                                                                        }
                                                                    })()
                                                                }
                                                            </div>

                                                            <div className="detail_container">
                                                                <h3 className="title">{item.title}</h3>
                                                                <h4 className="watch_time">{getWatchTime(item)}</h4>
                                                            </div>
                                                        </a>
                                                    );
                                                })
                                            }
                                        </div>
                                    </>
                                );
                            }
                            else{
                                return (
                                    <div className="no_record_msg">您尚未有觀看紀錄</div>
                                );
                            }
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .watch_record_section{
                        .title{
                            font-size: 22px;
                            line-height: 30px;
                        }

                        .description{
                            font-size: 16px;
                            line-height: 30px;
                            color: #666;
                        }

                        .control_btn_section{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: nowrap;
                            justify-content: flex-start;
                            align-items: center;
                            margin-top: 10px;
                            margin-bottom: 10px;

                            .control_btn{
                                line-height: 30px;
                                padding-left: 10px;
                                padding-right: 10px;
                                margin-right: 10px;
                                color: #fff;
                                border-radius: 5px;

                                &.edit_btn{
                                    background-color: #f60;
                                    border: 1px solid #f60;
                                }

                                &.cancel_btn{
                                    color: #f60;
                                    border: 1px solid #f60;
                                }

                                &.remove_btn{
                                    background-color: #f60;
                                    border: 1px solid #f60;
                                }
                            }
                        }

                        .records_section{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: wrap;
                            justify-content: space-between;
                            align-items: center;

                            &:after{
                                content: "";
                                flex: auto;
                            }

                            .record_item{
                                position: relative;
                                display: block;
                                margin-left: .5%;
                                margin-right: .5%;
                                margin-top: 10px;
                                margin-bottom: 10px;
                                width: 19%;

                                .img_container{
                                    position: relative;
                                    border-radius: 5px;
                                    overflow: hidden;
                                    box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);

                                    .padding_box{
                                        padding-bottom: 143.33%;
                                    }

                                    .record_img{
                                        display: block;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                    }

                                    .edit_mask{
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        display: block;
                                        background-color: rgba(0, 0, 0, .5);

                                        .checkbox{
                                            position: absolute;
                                            top: 5px;
                                            left: 5px;

                                            .checkbox_icon{
                                                display: block;
                                                width: 45px;
                                            }
                                        }
                                    }
                                }

                                .detail_container{
                                    padding-left: 5px;
                                    padding-right: 5px;

                                    .title{
                                        line-height: 30px;
                                        font-size: 15px;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                    }

                                    .watch_time{
                                        line-height: 25px;
                                        font-size: 14px;
                                        color: #666;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                    }
                                }
                            }
                        }

                        .no_record_msg{
                            line-height: 30px;
                            margin-top: 10px;
                            margin-left: 10px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
