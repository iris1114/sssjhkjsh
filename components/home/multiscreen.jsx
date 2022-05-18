
import { connect } from "react-redux";
import Link from "next/link";
import dynamic from "next/dynamic";
import LazyLoad from "react-lazyload";

import Placeholder from "../placeholder/index.jsx";

const App = connect((state) => {
    return {};
}, (dispatch) => {
    return {};
})((props) => {
    return (
        <>
            <div className="multiscreen_section">
                <div className="multiscreen_container">
                    <div className="left_section">
                        <div className="padding_box"></div>
                        
                        <LazyLoad placeholder={<Placeholder type="landscape" alt="devices" />}>
                            <img className="poster" src={require("../../assets/image/home/multiscreen/devices.png")} alt="devices" />
                        </LazyLoad>
                    </div>

                    <div className="right_section">
                        <div className="item">
                            <div className="title">
                                <img className="icon" width="25" height="25" src={require("../../assets/image/home/multiscreen/iconPhone.png")} alt="phone" />
                                <div className="text">手機 / 平板</div>
                            </div>

                            <div className="content">
                                <a className="qr_link" href="http://smarturl.it/litvsitedlpage" target="_blank">
                                    <LazyLoad placeholder={<Placeholder type="landscape" alt="QRcode" />}>
                                        <img className="img" src={require("../../assets/image/home/multiscreen/QRcode.jpg")} alt="QRcode" />
                                    </LazyLoad>
                                </a>

                                <div className="text">支援 Android 5 以上、iOS 9 以上行動裝置。</div>
                            </div>
                        </div>

                        <div className="item">
                            <div className="title">
                                <img className="icon" width="25" height="25" src={require("../../assets/image/home/multiscreen/iconPc.png")} alt="pc" />
                                <div className="text">電腦</div>
                            </div>

                            <div className="content">直接開啟瀏覽器輸入網址 <Link href="/" as="/"><a className="link">www.litv.tv</a></Link> 即可觀賞，建議使用 Chrome / Safari / Firefox 瀏覽觀看，以達到最佳觀看體驗。</div>
                        </div>

                        <div className="item">
                            <div className="title">
                                <img className="icon" width="25" height="25" src={require("../../assets/image/home/multiscreen/iconTv.png")} alt="tv" />
                                <div className="text">TV</div>
                            </div>

                            <div className="content">LiTV 支援多款硬體，只要電視或機上盒內建 LiTV，登入帳號即可在大螢幕繼續享受，多螢串聯很容易。<Link href={{pathname: "/service", query: {anchor: "downloadapp"}}} as="/service?anchor=downloadapp"><a className="link">瞭解更多</a></Link></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .multiscreen_section{
                        position: relative;
                        background-color: #ddd;

                        .multiscreen_container{
                            max-width: 1150px;
                            margin-left: auto;
                            margin-right: auto;
                            padding-top: 50px;
                            padding-bottom: 50px;
                            overflow: hidden;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;

                            .left_section{
                                position: relative;
                                overflow: hidden;
                                flex-basis: 30%;

                                .padding_box{
                                    padding-bottom: 50%;
                                }

                                .poster{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            .right_section{
                                position: relative;
                                overflow: hidden;
                                flex-basis: 68%;
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                align-items: flex-start;

                                .item{
                                    position: relative;
                                    flex-basis: 31.33%;
                                    overflow: hidden;

                                    .title{
                                        position: relative;
                                        height: 35px;
                                        overflow: hidden;
                                        border-bottom: 2px solid #ccc;
                                        padding-bottom: 5px;
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: flex-start;
                                        align-items: center;

                                        .icon{
                                            display: block;
                                            width: 25px;
                                            height: 25px;
                                        }

                                        .text{
                                            padding-left: 5px;
                                            line-height: 35px;
                                            font-size: 25px;
                                        }
                                    }

                                    .content{
                                        position: relative;
                                        font-size: 15px;
                                        line-height: 25px;
                                        margin-top: 5px;
                                        overflow: hidden;

                                        .qr_link{
                                            width: 45%;
                                            display: block;
                                            float: left;
                                            padding-bottom: 45%;
                                            position: relative;

                                            .img{
                                                display: block;
                                                width: 100%;
                                                height: 100%;
                                                position: absolute;
                                                top: 0px;
                                                left: 0px;
                                            }
                                        }

                                        .text{
                                            overflow: hidden;
                                            padding-left: 3%;
                                            display: block;
                                        }

                                        .link{
                                            color: #06c;
                                            text-decoration: underline;
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
});

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {};
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {};
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            return (
                <>
                    <App />
                </>
            );
        }));
    });
}, {
    ssr: false
});
