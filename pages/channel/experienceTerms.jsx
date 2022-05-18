
import { connect } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";

import seo from "../../assets/js/seo/index.js";

export const getServerSideProps = async (context) => {
    return {
        props: {}
    };
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchHeaderFocus: (value) => {
            dispatch({
                type: "header/focus",
                value: value
            });
        },
        dispatchFooterTopShow: (bool) => {
            dispatch({
                type: "footer/top/show",
                value: bool
            });
        }
    };
};

const App = (props) => {
    useEffect(() => {
        props.dispatchHeaderFocus({
            main: "",
            sub: ""
        });
    }, []);

    useEffect(() => {
        props.dispatchFooterTopShow(false);

        return () => {
            props.dispatchFooterTopShow(true);
        };
    }, []);

    return (
        <>
            <Head>
                <title key="title">{seo.channel.experience.getTitle()}</title>
                <meta property="og:url" content={seo.channel.experience.getUrl()} key="og:url" />
                <meta property="og:title" content={seo.channel.experience.getTitle()} key="og:title" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.channel.experience.getAlternate()} key="alternate"></link>
            </Head>

            <div className="rule_section">
                <h1 className="rule_title">《LiTV 線上影視》頻道 7 天免費體驗活動條款</h1>
                <p className="rule_text">《LiTV 線上影視》「頻道 7 天免費體驗活動」(以下簡稱本活動)係《LiTV 線上影視》提供給用戶之優惠活動。只要您新註冊成為《LiTV 線上影視》會員，或您已是《LiTV 線上影視》之註冊會員，但從未使用過本活動或購買任何頻道套餐服務，即可享 7 天免費收看頻道節目，每位註冊會員限獨享一次。</p>
                <p className="rule_text">本公司非常尊重客戶之隱私權，故您的註冊及其他特定資料皆依 LiTV【隱私權政策】受到保護及規範。《LiTV 線上影視》之 【隱私權政策】及【服務條款】均揭露在官網 (<a className="link" href="www.litv.tv">www.litv.tv</a>)，請詳細閱讀。</p>
                <p className="rule_text rule_mail">若您對本活動尚有其他疑問，歡迎來信 <a className="link" href="mailto:csr@litv.tv">csr@litv.tv</a>。</p>                   
            </div>

            <style jsx>
            {`
                .rule_section{
                    background-color: #fff;
                    padding: 50px 20px;
                    max-width: 1000px;
                    margin: 15px auto;

                    .rule_title{
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 15px;
                    }

                    .rule_text{
                        font-size: 16px;
                        line-height: 24px;
                        margin-bottom: 10px;

                        .link{
                            color: #666
                        }

                        &.rule_mail{
                            margin-top: 30px;
                        }
                    }
                }
            `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);