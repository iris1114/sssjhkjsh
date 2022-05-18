
import { connect } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDiversionRank: (value) => {
            dispatch({
                type: "diversion/rank",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [posterDetail, setPosterDetail] = useState(null);
    const [monseEnterBool, setMonseEnterBool] = useState(false);

    const cdnStatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const itemLinkClickHandler = useCallback((event, item) => {
        event.preventDefault();
        props.dispatchDiversionRank(item);
    }, []);

    const itemLinkMouseEnterHandler = useCallback((event, item, index) => {
        setPosterDetail({
            index: index,
            data: item
        });

        setMonseEnterBool(true);
    }, []);

    const itemLinkMouseLeaveHandler = useCallback((event) => {
        setMonseEnterBool(false);
    }, []);

    useEffect(() => {
        if(!posterDetail){
            return;
        }

        let timeout = null;

        if(monseEnterBool){
            return;
        }

        timeout = setTimeout(() => {
            setPosterDetail((result) => {
                let index = result.index + 1;

                if(index >= props.meta.content.length){
                    index = 0;
                }

                return {
                    index: index,
                    data: props.meta.content[index]
                };
            });
        }, 5 * 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [posterDetail, monseEnterBool]);

    useEffect(() => {
        setPosterDetail({
            index: 0,
            data: props.meta.content[0]
        });
    }, []);

    return (
        <>
                <div className="rank_program_section">
                    <div className="title_section">
                        <img className="icon" width="25" height="24" src={require("../../../assets/image/diversion/star.png")} alt="star" />
                        <div className="text">{props.meta.title}</div>
                    </div>

                    <div className="content_section">
                        {
                            (() => {
                                if(posterDetail && posterDetail.data){
                                    return (
                                        <a className="poster_link" href={`/${props.meta.content_type}/${posterDetail.data.content_id}`} onClick={(event) => itemLinkClickHandler(event, posterDetail.data)} target="_self" title={posterDetail.data.title}>
                                            <img className="poster" src={`${cdnStatic}/${posterDetail.data.poster_pic}`} alt={posterDetail.data.title} />
                                        </a>
                                    );
                                }
                            })()
                        }

                        {
                            props.meta.content.map((item, index) => {
                                return (
                                    <a className="item_link" href={`/${props.meta.content_type}/${item.content_id}`} onClick={(event) => itemLinkClickHandler(event, item)} onMouseEnter={(event) => itemLinkMouseEnterHandler(event, item, index)} onMouseLeave={(event) => itemLinkMouseLeaveHandler(event)} target="_self" title={item.title} key={index}>
                                        <span className="index">{index + 1}</span>
                                        <span className="text">{item.title}</span>
                                    </a>
                                );
                            })
                        }                        
                    </div>
                </div>

            <style jsx>
                {`
                    .rank_program_section{
                        margin-left: .5%;
                        margin-right: .5%;
                        width: 49%;

                        .title_section{
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            align-items: center;
                            height: 50px;
                            border-bottom: 2px solid #fff;

                            .icon{
                                display: block;
                                width: 25px;
                            }

                            .text{
                                color: #fff;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-size: 22px;
                                line-height: 30px;
                                margin-left: 5px;
                            }
                        }

                        .content_section{
                            .poster_link{
                                display: block;
                                position: relative;
                                float: right;
                                width: 234px;
                                height: 330px;

                                .poster{
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            .item_link{
                                display: block;
                                overflow: hidden;
                                position: relative;
                                height: 24px;
                                margin-top: 10px;
                                margin-bottom: 10px;

                                &:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(4){
                                    &:hover{
                                        background-image: url(${require("../../../assets/image/diversion/hoverOrange.png")});
                                        background-size: cover;
                                        background-position: center center;

                                        .text{
                                            color: #fff;
                                        }
                                    }

                                    .index{
                                        background-color: #f60;
                                        color: #fff;
                                    }                                        
                                }

                                &:hover{
                                    background-image: url(${require("../../../assets/image/diversion/hoverWhite.png")});
                                    background-size: cover;
                                    background-position: center center;
                                    
                                    .text{
                                        color: #f60;
                                    }
                                }

                                .index{
                                    display: block;
                                    width: 25px;
                                    height: 25px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    line-height: 25px;
                                    text-align: center;
                                    float: left;
                                    font-size: 16px;
                                    background-color: #fff;
                                    color: #f60;
                                }

                                .text{
                                    display: block;
                                    height: 25px;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    line-height: 25px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    font-size: 16px;
                                    padding-left: 10px;
                                    color: #fff;
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
    meta: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
