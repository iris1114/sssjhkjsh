
import { connect } from "react-redux";
import Link from "next/link";
import PropTypes from "prop-types";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <section className="ranks_section">
                <h3 className="ssr_only">熱門排行</h3>

                {
                    props.rank.programs.map((item, index) => {
                        return (
                            <Link href="/[contentType]/[contentId]" as={`/${item.content_type}/${item.content_id}`} key={index}>
                                <a className="rank_item" title={item.title}>
                                    <div className="index">{index + 1}</div>
                                    <h4 className="title">{item.title}</h4>
                                </a>
                            </Link>
                        );
                    })
                }
            </section>

            <style jsx>
                {`
                    .ranks_section{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;

                        .rank_item{
                            display: block;
                            height: 10%;
                            overflow: hidden;
    
                            &:nth-of-type(n + 4){
                                .index{
                                    color: #f60;
                                    background-color: #fcfcfc;
                                }
                            }
    
                            &:hover{
                                .title{
                                    color: #f60;
                                }
                            }
    
                            .index{
                                width: 20px;
                                height: 20px;
                                text-align: center;
                                color: #fff;
                                font-size: 14px;
                                float: left;
                                line-height: 18px;
                                border: 1px solid #f60;
                                background-color: #f60;
                                position: relative;
                                top: 50%;
                                transform: translateY(-50%);                              
                            }
    
                            .title{
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                padding-left: 10px;
                                font-size: 15px;
                                line-height: 20px;
                                overflow: hidden;
                                position: relative;
                                top: 50%;
                                transform: translateY(-50%);
                                color: #666;
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
