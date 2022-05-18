
import { connect } from "react-redux";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import _ from "lodash";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const App = (props) => {
    const getHref = useCallback((element) => {
        return `/channel/watch?contentId=${element.cdn_code}`;
    }, []);

    const groupData = useMemo(() => {
        let categoryTable = _.cloneDeep(props.list.category_table);
        let lists = categoryTable.list;
    

        for(let i = 0; i < lists.length; i ++){
            let list = lists[i];
            let categories = list.categories;
            let _channels = new Array();
            let count = 0;

            for(let j = 0; j < categories.length; j ++){
                let category = categories[j];
                let channels = category.channels;

                if(channels.length <= 0){
                    continue;
                }

                for(let k = 0; k < channels.length; k ++){
                    if(count % 17 <= 0){
                        _channels.push(new Array());
                    }

                    let channel = channels[k];
                    let arr = _channels[_channels.length - 1];

                    if(k <= 0 || count % 17 <= 0){
                        arr.push({
                            type: "category",
                            name: category.name
                        });
                    }

                    channel.type = "channel";

                    arr.push(channel);

                    count ++;
                }
            }

            list.channels = _channels;
        }
        
        return categoryTable;
    }, [props.list]);

    return (
        <>
            <section className="category_section">
                <div className="article_section">
                    <h2 className="title">{props.list.category_table.title}</h2>
                    <a className="download_btn" href={props.list.download} title="下載頻道列表" target="_blank">下載頻道列表</a>

                    {
                        props.list.category_table.descriptions.map((element, index) => {
                            return (
                                <p className="desc" key={index}>{element}</p>
                            );
                        })
                    }

                    {
                        props.list.category_table.list.map((element, index) => {
                            return (
                                <section className="ssr_only" key={index}>
                                    <h3>{element.name}</h3>

                                    <div>
                                        {
                                            element.categories.map((_element, _index) => {
                                                return (
                                                    <div key={_index}>
                                                        <h4>{_element.name}</h4>    

                                                        {
                                                            _element.channels.map((__element, __index) => {
                                                                return (
                                                                    <a href={getHref(__element)} title={__element.title} key={__index}>
                                                                        <h5>{__element.title}</h5>
                                                                    </a>
                                                                );
                                                            })
                                                        } 
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </section>
                            );
                        })
                    }
                </div>

                <div className="segment"></div>

                <div className="table_Section">
                    {
                        groupData.list.map((element, index) => {
                            return (
                                <div className="category_table_section" key={index}>
                                    <div className="category_title">{element.name}</div>

                                    <div className="tables">
                                        {
                                            element.channels.map((_element, _index) => {
                                                return (
                                                    <table className="table" key={_index}>
                                                        <thead className="head">
                                                            <tr className="row">
                                                                <th className="theme">頻道</th>
                                                                <th className="theme">頻道名稱</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="body">
                                                            {
                                                                _element.map((__element, __index) => {
                                                                    return (
                                                                        <React.Fragment key={__index}>
                                                                            {
                                                                                (() => {
                                                                                    if(__element.type == "category"){
                                                                                        return (
                                                                                            <tr className="row">
                                                                                                <td className="cell category" colSpan="2">
                                                                                                    <div>{__element.name}</div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        );
                                                                                    }
                                                                                    else{
                                                                                        return (
                                                                                            <tr className="row">
                                                                                                <td className="cell">
                                                                                                    <Link href="/channel/watch" as={getHref(__element)}>
                                                                                                        <a className="link" title={__element.title} >{__element.no}</a>
                                                                                                    </Link>
                                                                                                </td>

                                                                                                <td className="cell">
                                                                                                    <Link href="/channel/watch" as={getHref(__element)}>
                                                                                                        <a className="link" title={__element.title} >
                                                                                                            {
                                                                                                                (() => {
                                                                                                                    if(__element.quality){
                                                                                                                        return (
                                                                                                                            <div className="quality">{__element.quality}</div>
                                                                                                                        );
                                                                                                                    };
                                                                                                                })()
                                                                                                            }
                                                                                                            <div className="title">{__element.title}</div>
                                                                                                        </a>
                                                                                                    </Link>
                                                                                                </td>
                                                                                            </tr>
                                                                                        );
                                                                                    }
                                                                                })()
                                                                            }
                                                                        </React.Fragment>
                                                                    );
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </section>

            <style jsx>
                {`
                    .category_section{
                        padding-left: 10px;
                        padding-right: 10px;

                        .article_section{
                            overflow: hidden;
                            margin-top: 20px;
                            padding-left: 0.5%;
                            padding-right: 0.5%;

                            .title{
                                color: #333;
                                font-size: 25px;
                                line-height: 40px;
                            }

                            .download_btn{
                                float: right;
                                line-height: 35px;
                                font-size: 16px;
                                padding-left: 10px;
                                padding-right: 10px;
                                background-color: #f60;
                                color: #fff;
                                border-radius: 4px;
                                margin-top: 15px;
                                margin-left: 5px;
                            }

                            .desc{
                                overflow: hidden;
                                font-size: 15px;
                                line-height: 25px;
                                margin-top: 15px;
                                color: #333333;
                
                                &:first-of-type{
                                    margin-top: 15px;
                                }
                            }
                        }

                        .segment{
                            width: 99%;
                            height: 1px;
                            background-color: #ccc;
                            margin-top: 15px;
                            margin-left: auto;
                            margin-right: auto;
                        }

                        .table_Section{
                           .category_table_section{
                               .category_title{
                                   margin-top: 10px;
                                   font-size: 24px;
                                   line-height: 40px;
                                   padding-left: 0.5%;
                                   padding-right: 0.5%;
                               }

                               .tables{
                                    display: flex;
                                    flex-flow: row;
                                    flex-wrap: wrap;
                                    align-items: flex-start;

                                    .table{
                                        width: 32.33%;
                                        margin-top: 15px;
                                        margin-bottom: 15px;
                                        line-height: 30px;
                                        font-size: 15px;
                                        margin-left: 0.5%;
                                        margin-right: 0.5%;

                                        @media screen and (max-width: 1023px) {
                                            width: 49%;
                                        }
        
                                        .head{
                                            background-image: -webkit-linear-gradient(90deg,#e6e6e6,#f6f6f6);
        
                                            .row{
                                                .theme{
                                                    width: 15%;
        
                                                    &:nth-of-type(2){
                                                        width: 85%;
                                                        text-align: left;
                                                        padding-left: 5px;
                                                        padding-right: 5px;
                                                    }
                                                }
                                            }
                                        }
        
                                        .body{
                                            .row{
                                                &:hover{
                                                    color: #f60;
                                                }
        
                                                .cell{
                                                    &.category{
                                                        text-align: center;
                                                        color: #f1f1f1;
                                                        background-color: #3e85c7;
                                                        font-weight: bold;
                                                    }

                                                    .link{
                                                        display: block;
                                                        text-align: center;
                                                        overflow: hidden;
                                                        padding-left: 5px;
                                                        padding-right: 5px;
        
                                                        .quality{
                                                            float: right;
                                                        }
        
                                                        .title{
                                                            overflow: hidden;
                                                            font-weight: normal;
                                                            text-align: left;
                                                            font-size: 15px;
                                                            text-overflow: ellipsis;
                                                            white-space: nowrap;
                                                        }
                                                    }
                                                }
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
    list: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
