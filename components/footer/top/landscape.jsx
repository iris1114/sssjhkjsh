
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Link from "next/link";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <div className="landscape_section">
                <div className="content_section">
                    <div className="title">內容服務</div>

                    {
                        props.menu.map((element, index) => {
                            return (
                                <div className="list_section" key={index}>
                                    <div className="list_title">
                                        <div className="text">{element.description}</div>
                                        
                                        <div className="icon">
                                            <div className="element"></div>
                                        </div>
                                    </div>

                                    {
                                        element.submenu.map((_element, _index) => {
                                            return(
                                                <Link href={_element.href} as={_element.as} key={_index}>
                                                    <a className="list_item" title={_element.title}>{_element.title}</a>
                                                </Link>  
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>

                <div className="content_section">
                    <div className="title">關於 LiTV</div>

                    <div className="list_section">
                        <Link href="/purchase/introduction" as="/purchase/introduction">
                            <a className="list_item" title="服務介紹">服務介紹</a>
                        </Link>  

                        <Link href="/purchase" as="/purchase">
                            <a className="list_item" title="購買專區">購買專區</a>
                        </Link>  

                        <Link href="/service/copyright" as="/service/copyright">
                            <a className="list_item" title="版權聲明">版權聲明</a>
                        </Link> 

                        <Link href="/service/privacy" as="/service/privacy">
                            <a className="list_item" title="隱私權政策">隱私權政策</a>
                        </Link> 

                        <a className="list_item" href={`${litv.config.fino}/tos/pc.html`} title="服務條款" target="_blank">服務條款</a>
                    </div>
                </div>

                <div className="content_section">
                    <div className="title">下載</div>

                    <div className="list_section">
                        <Link href="/service#downloadapp" as="/service#downloadapp">
                            <a className="list_item" title="Android">Android</a>
                        </Link>  

                        <Link href="/service#downloadapp" as="/service#downloadapp">
                            <a className="list_item" title="iOS">iOS</a>
                        </Link>  

                        <Link href="/service#tvstb" as="/service#tvstb">
                            <a className="list_item" title="TV">TV</a>
                        </Link> 

                        <Link href="/service#downloadapp" as="/service#downloadapp">
                            <a className="list_item" title="HUAWEI">HUAWEI</a>
                        </Link>
                    </div>
                </div>

                <div className="content_section">
                    <div className="title">用戶幫助</div>

                    <div className="list_section">
                        <a className="list_item focus" href={`${litv.config.promo}/freechannel/`} title="免費試用" target="_blank">免費試用</a>

                        <Link href="/member?service=enableCoupon" as="/member?service=enableCoupon">
                            <a className="list_item focus" title="啟用兌換券">啟用兌換券</a>
                        </Link> 

                        <a className="list_item" href="https://support.litv.tv/hc/zh-tw" title="常見問題" target="_blank">常見問題</a>

                        <Link href="/service/contactus" as="/service/contactus">
                            <a className="list_item" title="聯絡我們">聯絡我們</a>
                        </Link> 

                        <a className="list_item" href="https://www.facebook.com/LiTVfans/" title="Facebook" target="_blank">
                            <div className="text">Facebook</div>
                            <div className="icon"></div>
                        </a>

                        <a className="list_item" href="http://bit.ly/2ROGn0C" title="Line" target="_blank">
                            <div className="text">Line</div>
                            <div className="icon"></div>
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .landscape_section{
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        align-items: stretch;

                        .content_section{
                            flex-basis: 12.5%;
                            padding-top: 10px;
                            padding-bottom: 10px;
                            border-right: 1px solid #ddd;
                            overflow: hidden;

                            &:nth-of-type(1){
                                flex-basis: 62.5%;

                                .list_section{
                                    width: 20%;
                                    float: left;
                                }
                            }

                            &:last-of-type{
                                border-right: none;
                            }

                            .title{
                                font-size: 20px;
                                line-height: 30px;
                                font-weight: bold;
                                padding-left: 20px;
                                padding-right: 10px;
                            }

                            .list_section{
                                padding-left: 10px;
                                padding-right: 10px;

                                .list_title{
                                    display: flex;
                                    flex-direction: row;
                                    flex-wrap: nowrap;
                                    justify-content: flex-start;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    margin-top: 5px;

                                    .text{
                                        font-size: 16px;
                                        line-height: 30px;
                                        font-weight: bold;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        overflow: hidden;
                                    }
                                    
                                    .icon{
                                        width: 30px;
                                        height: 30px;
                                        position: relative;
                                        flex-shrink: 0;

                                        .element{
                                            width: 25px;
                                            height: 1px;
                                            position: relative;
                                            top: 50%;
                                            left: 5px;
                                            transform: translateY(-50%);
                                            background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
                                        }
                                    }
                                }

                                .list_item{
                                    display: block;
                                    float: left;
                                    max-width: 100%;
                                    line-height: 30px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    clear: both;
                                    font-size: 15px;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    margin-top: 5px;
                                    height: 30px;
                                    position: relative;

                                    &:hover, &.focus{
                                        border-radius: 15px;
                                        background-color: #5e0b75;
                                        color: #f1f1f1;

                                        .icon{
                                            background-image: url(${require("../../../assets/image/footer/social_link_icon_hover.svg")});
                                        }
                                    }

                                    .text{
                                        float: left;
                                    }

                                    .icon{
                                        width: 20px;
                                        height: 30px;
                                        float: left;
                                        background-image: url(${require("../../../assets/image/footer/social_link_icon.svg")});
                                        background-size: 10px 10px;
                                        background-repeat: no-repeat;
                                        background-position: center center;
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
    menu: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);