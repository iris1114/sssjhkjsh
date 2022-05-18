
import { connect } from "react-redux";
import { useMemo } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

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

    return (
        <>
            <div className="ranks_section">
                <div className="poster_items_section">
                    {
                        props.rank.programs.map((item, index) => {
                            if(index <= 2){
                                return (
                                    <Link href="/[contentType]/[contentId]" as={`/${item.content_type}/${item.content_id}`} key={index}>
                                        <a className="rank_item" title={item.title}>
                                            <div className="poster_section">
                                                <div className="padding_box"></div>
                                                <img className="poster" src={`${cdnstatic}/${item.picture}`} alt={item.title} />
                                                <div className="index">{index + 1}</div>
                                            </div>
                                            
                                            <div className="title">{item.title}</div>
                                        </a>
                                    </Link>
                                );
                            }
                        })
                    }
                </div>
                
                <div className="text_items_section">
                    {
                        props.rank.programs.map((item, index) => {
                            if(index > 2){
                                return (
                                    <Link href="/[contentType]/[contentId]" as={`/${item.content_type}/${item.content_id}`} key={index}>
                                        <a className="rank_item" title={item.title}>
                                            <div className="index">{index + 1}</div>
                                            <div className="title">{item.title}</div>
                                        </a>
                                    </Link>
                                );
                            }
                        })
                    }
                </div>
            </div>

            <style jsx>
                {`
                    .ranks_section{
                        .poster_items_section{
                            overflow: hidden;

                            .rank_item{
                                margin-left: 1%;
                                margin-right: 1%;
                                margin-top: 10px;
                                margin-bottom: 10px;
                                width: 31.33%;
                                display: block;
                                float: left;
                                position: relative;

                                .poster_section{
                                    position: relative;
                                    border-radius: 5px;
                                    overflow: hidden;
    
                                    .padding_box{
                                        padding-bottom: 143.33%;
                                    }
    
                                    .poster{
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        display: block;
                                        width: 100%;
                                        height: 100%;
                                    }

                                    .index{
                                        position: absolute;
                                        top: 0px;
                                        left: 0px;
                                        width: 30px;
                                        height: 30px;
                                        text-align: center;
                                        color: #fff;
                                        font-size: 15px;
                                        line-height: 30px;
                                        background-color: #f60;
                                    }
                                }

                                .title{
                                    font-weight: normal;
                                    line-height: 30px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    font-size: 15px;
                                    color: #ccc;
                                }
                            }
                        }

                        .text_items_section{
                            .rank_item{
                                display: block;
                                height: 40px;
                                overflow: hidden;
        
                                &:hover{
                                    .title{
                                        color: #f60;
                                    }
                                }
        
                                .index{
                                    width: 25px;
                                    height: 25px;
                                    text-align: center;
                                    color: #f60;
                                    font-size: 15px;
                                    float: left;
                                    line-height: 23px;
                                    border: 1px solid #f60;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);                              
                                }
        
                                .title{
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    padding-left: 10px;
                                    font-size: 15px;
                                    line-height: 28px;
                                    overflow: hidden;
                                    position: relative;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    color: #ccc;
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
    rank: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
