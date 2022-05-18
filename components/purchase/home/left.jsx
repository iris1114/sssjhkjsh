
import { connect } from "react-redux";
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
            <section className="left_content">
                <div className="title_section">
                    <img className="icon" src={require("../../../assets/image/purchase/home/iconGift.png")} alt="好康優惠" />
                    <div className="text">好康優惠</div>
                </div>

                {
                    props.content.map((item, index) => {
                        return (
                            <a className="link_item" href={item.href} target="_blank" key={index}>
                                <div className="title">{item.title}</div>
                                <div className="subtitle">{item.subtitle}</div>

                                {
                                    (() => {
                                        if(item.promoLabel){
                                            return (
                                                <img className="promo_label" src={require(`../../../assets/image/purchase/home/${item.promoLabel}`)} alt={item.title} />
                                            );
                                        }
                                    })()
                                }
                            </a>
                        );
                    })
                }
            </section>

            <style jsx>
                {`
                    .left_content{
                        overflow: hidden;

                        .title_section{
                            background-color: #5e0b75;
                            height: 50px;
                            padding: 15px;

                            .icon{
                                position: relative;
                                float: left;
                                height: 23px;
                                top: 50%;
                                transform: translateY(-50%);
                                margin-right: 10px;
                            }

                            .text{
                                position: relative;
                                font-size: 18px;
                                font-weight: bold;
                                color: #fff;
                                top: 50%;
                                transform: translateY(-50%);
                            }
                        }

                        .link_item{
                            display: block;
                            border-bottom: 1px solid #ccc;
                            padding: 10px;
                            line-height: 25px;
                            position: relative;

                            &:last-child{
                                border-bottom: none;
                            }

                            &:hover{
                                background-color: #a664aa;

                                .title, .subtitle{
                                    color: #fff;
                                }
                            }

                            .title{
                                font-size: 16px;
                            }

                            .subtitle{
                                font-size: 13px;
                                color: #f60;
                            }

                            .promo_label{
                                position: absolute;
                                right: 0;
                                bottom: 5px;
                                width: 62px;
                            }
                        }
                    }
                `}
            </style>
        </>
    );
};

App.propTypes = {
    content: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
