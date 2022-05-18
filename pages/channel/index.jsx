
import { connect } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";

import api from "../../assets/js/api/index.js";
import seo from "../../assets/js/seo/index.js";
import channel from "../../assets/js/channel/index.js";

import ChannelHome from "../../components/channel/home/index.jsx";

export const getServerSideProps = async (context) => {
    const banner = api.fino.banner.getFetch();
    const introduction = api.fino.channelIntroduction.getFetch();
    const data = await Promise.all([banner, introduction]);

    return {
        props: {
            banner: data[0]["channel"],
            introduction: channel.introduction(data[1])
        }
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
        }
    };
};

const App = (props) => {
    useEffect(() => {
        props.dispatchHeaderFocus({
            main: "/channel/watch",
            sub: "/channel"
        });
    }, []);

    return (
        <>
            <Head>
                <title key="title">{seo.channel.home.getTitle(props.introduction)}</title>
                <meta name="description" content={seo.channel.home.getDescription(props.introduction)} key="description" />
                <meta name="keywords" content={seo.channel.home.getKeywords(props.introduction)} key="keywords" />
                <meta property="og:url" content={seo.channel.home.getUrl()} key="og:url" />
                <meta property="og:title" content={seo.channel.home.getTitle(props.introduction)} key="og:title" />
                <meta property="og:description" content={seo.channel.home.getDescription(props.introduction)} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.channel.home.getAlternate()} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.home.getBreadcrumbList()} key="BreadcrumbList"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.home.getArticle(props.introduction, props.banner)} key="Article"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.home.getItemList(props.introduction)} key="ItemList"></script>

                {
                    (() => {
                        if(props.banner){
                            return (
                                <>
                                    {
                                        seo.channel.home.getImage(props.banner).map((item, index) => {
                                            return (
                                                <meta property="og:image" content={item} key={`og:image-${index}`} />
                                            );
                                        })
                                    }
                                </>
                            );
                        }
                    })()
                }
            </Head>

            <ChannelHome banner={props.banner} introduction={props.introduction}/>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);