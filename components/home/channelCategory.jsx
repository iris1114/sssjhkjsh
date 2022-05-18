
import { useState, useEffect, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import _ from "lodash";
import PropTypes from "prop-types";

import Placeholder from "../placeholder/index.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const cdnstatic = useMemo(() => {
        return litv.config.cdnstatic;
    }, []);

    const header = useMemo(() => {
        return props.homeChannel.header;
    }, [props.homeChannel]);

    const promote = useMemo(() => {
        return props.homeChannel.promote;
    }, [props.homeChannel]);

    const refresh = useCallback((list) => {
        list = _.cloneDeep(list)

        for(let i = 0; i < list.length; i ++){
            let schedule = list[i].Schedule;
            let schedules = new Array();

            for(let j = 0; j < schedule.length; j ++){
                let next = schedule[j + 1];

                if(!next){
                    schedules.push(schedule[j]);

                    break;
                }

                let nextTime = new Date(next.AirDateTime).getTime();
                let now = new Date().getTime();

                if(nextTime > now){
                    schedules.push(schedule[j]);
                }
            }

            list[i].Schedule = schedules;
        }

        return list;
    }, []);

    const [list, setList] = useState(() => {
        let _list = props.homeChannel.list.slice(0, 10);

        return refresh(_list);
    });

    const getHref = useCallback((item) => {
        return `/channel/watch?contentId=${item.content_id}`;
    }, []);

    const getAs = useCallback((item) => {
        return `/channel/watch?contentId=${item.content_id}`;
    }, []);

    const getProgram = useCallback((item) => {
        let schedule = item.Schedule;

        item = schedule[0]

        let program = item.Program;
        let airDateTime = item.AirDateTime;

        airDateTime = new Date(airDateTime);
        airDateTime = airDateTime.toString().substring(16, 21);

        let content = `${airDateTime} `;

        content = content + program.Title;

        if(program.SubTitle){
            content = `${content}-${program.SubTitle}`;
        }

        return content;
    }, []);

    useEffect(() => {
        setList(refresh);
        
        let refreshListInterval = setInterval(() => {
            setList(refresh);
        }, 60000);

        return () => {
            clearInterval(refreshListInterval);
        };
    }, []);

    return (
        <>
            <section className="channel_category_section">
                <div className="info_section">
                    <Link href="/channel" as="/channel">
                        <a className="category_link_section" title={header.left.title}>
                            <h2 className="title">{header.left.title}</h2>
                            <div className="segment"></div>
                            <div className="more">更多...</div>
                        </a>
                    </Link>

                    <div className="category_des">{header.left.subTitle}</div>
                </div>

                <div className="content_items">
                    {
                        (() => {
                            if(promote.left){
                                return (
                                    <a className="content_item" href={promote.left.href} target={promote.left.target} title={promote.left.title}>
                                        <div className="padding_box"></div>
            
                                        <LazyLoad placeholder={<Placeholder type="landscape" alt={promote.left.title} />}>
                                            <img className="poster" src={promote.left.src} alt={promote.left.title} />
                                        </LazyLoad>
                                    </a>
                                );
                            }
                        })()                                        
                    }

                    {
                        (() => {
                            if(promote.right){
                                return (
                                    <a className="content_item right" href={promote.right.href} target={promote.right.target} title={promote.right.title}>
                                        <div className="padding_box"></div>
            
                                        <LazyLoad placeholder={<Placeholder type="landscape" alt={promote.right.title} />}>
                                            <img className="poster" src={promote.right.src} alt={promote.right.title} />
                                        </LazyLoad>
                                    </a>
                                );
                            }
                        })()
                    }

                    {
                        list.map((item, index) => {
                            return (
                                <Link href={getHref(item)} as={getAs(item)} key={index}>
                                    <a className="content_item" title={item.title}>
                                        <div className="padding_box"></div>
    
                                        <div className="content">
                                            <div className="channel">
                                                <div className="logo_section">
                                                    <LazyLoad placeholder={<Placeholder type="landscape" alt={item.title} />}>
                                                        <img className="logo" src={`${cdnstatic}/${item.picture}`} alt={item.title} />
                                                    </LazyLoad>
                                                </div>
    
                                                <div className="no">
                                                    <div className="item">CH {item.no}</div>
                                                </div>
    
                                                <div className="title">
                                                    <h3 className="item">{item.title}</h3>
                                                </div>
                                            </div>
    
                                            <div className="program">
                                                <div className="play_now">
                                                    <div className="btn">現正播出</div>
                                                </div>
    
                                                <div className="program_now">
                                                    <div className="item">{getProgram(item)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </Link>
                            );
                        })
                    }
                </div>
            </section>

            <style jsx>
                {`
                    .channel_category_section{
                        max-width: 1150px;
                        margin-top: 20px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;

                        .info_section{
                            overflow: hidden;
                            display: block;
                            width: 99%;
                            margin-left: auto;
                            margin-right: auto;
                            border-bottom: 1px solid #ccc;
                            padding-bottom: 5px;

                            .category_link_section{
                                overflow: hidden;
                                margin-right: 10px;
                                display: block;
                                float: left;
                                position: relative;
                                height: 35px;

                                &:hover{
                                    .title, .more{
                                        color: #f60;
                                    }
                                }

                                .title{
                                    color: #5e0b75;
                                    font-size: 25px;
                                    line-height: 35px;
                                    font-weight: bold;
                                    display: block;
                                    float: left;
                                }

                                .segment{
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    width: 1px;
                                    height: 25px;
                                    background-color: #ccc;
                                    margin-left: 10px;
                                    margin-right: 10px;
                                    display: block;
                                    float: left;
                                }

                                .more{
                                    color: #666;
                                    font-size: 15px;
                                    line-height: 35px;
                                    font-weight: bold;
                                    display: block;
                                    float: left;
                                }
                            }

                            .category_des{
                                color: #666;
                                font-size: 15px;
                                font-weight: bold;
                                line-height: 35px;
                                display: block;
                                float: left;
                            }
                        }

                        .content_items{
                            overflow: hidden;

                            .content_item{
                                margin-left: 0.5%;
                                margin-right: 0.5%;
                                margin-top: 10px;
                                margin-bottom: 10px;
                                width: 19%;
                                display: block;
                                float: left;
                                position: relative;
                                border-radius: 5px;
                                overflow: hidden;
                                box-shadow: 0 2px 6px 0 rgba(150, 150, 150, 0.5);

                                @media screen and (max-width: 1023px) {
                                    width: 24%;

                                    &:nth-of-type(n + 9){
                                        display: none;
                                    }
                                }

                                &.right{
                                    float: right;
                                }

                                &:nth-of-type(n + 11){
                                    display: none;
                                }

                                .padding_box{
                                    padding-bottom: 56.25%;
                                }

                                .poster{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                }

                                .content{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                    overflow: hidden;

                                    .channel{
                                        height: 50%;
                                        background-image: url(${require("../../assets/image/home/channel/channelBackground.png")});
                                        background-size: cover;

                                        .logo_section{
                                            float: right;
                                            width: 35%;
                                            height: 100%;
                                            position: relative;

                                            .logo{
                                                display: block;
                                                position: absolute;
                                                max-width: 95%;
                                                max-height: 95%;
                                                top: 50%;
                                                left: 50%;
                                                transform: translateX(-50%) translateY(-50%);
                                            }
                                        }

                                        .no, .title{
                                            position: relative;
                                            height: 50%;
                                            overflow: hidden;

                                            .item{
                                                position: absolute;
                                                width: 100%;
                                                left: 0px;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                overflow: hidden;
                                                font-size: 18px;
                                                padding-left: 5px;
                                                padding-right: 5px;
                                                font-weight: bold;
                                            }
                                        }

                                        .no{
                                            .item{
                                                bottom: 0px;
                                            }
                                        }

                                        .title{
                                            .item{
                                                top: 4px;
                                                font-size: 14px;
                                            }
                                        }
                                    }

                                    .program{
                                        height: 50%;

                                        .play_now{
                                            position: relative;
                                            height: 50%;
                                            overflow: hidden;

                                            .btn{
                                                position: absolute;
                                                bottom: 2px;
                                                left: 5px;
                                                font-size: 12px;
                                                padding-left: 5px;
                                                padding-right: 5px;
                                                box-shadow: 0 0 0 1px #999;
                                                line-height: 20px;
                                                border-radius: 3px;
                                            }
                                        }

                                        .program_now{
                                            position: relative;
                                            height: 50%;
                                            overflow: hidden;

                                            .item{
                                                position: absolute;
                                                width: 100%;
                                                top: 2px;
                                                left: 0px;
                                                color: #f60;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                overflow: hidden;
                                                font-size: 14px;
                                                padding-left: 5px;
                                                padding-right: 5px;
                                                line-height: 25px;
                                            }
                                        }
                                    }
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
    homeChannel: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
