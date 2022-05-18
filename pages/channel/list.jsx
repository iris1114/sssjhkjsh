
import { connect } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";

import api from "../../assets/js/api/index.js";
import seo from "../../assets/js/seo/index.js";
import ChannelList from "../../components/channel/list/index";

export const getServerSideProps = async (context) => {
    const list = await api.fino.list.getFetch();

    return {
        props: {
            list: list
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
            sub: "/channel/list"
        });
    }, []);

    return (
        <>
            <Head>
                <title key="title">{seo.channel.list.getTitle(props.list)}</title>
                <meta name="description" content={seo.channel.list.getDescription(props.list)} key="description" />
                <meta name="keywords" content={seo.channel.list.getKeywords(props.list)} key="keywords" />
                <meta property="og:url" content={seo.channel.list.getUrl()} key="og:url" />
                <meta property="og:title" content={seo.channel.list.getTitle(props.list)} key="og:title" />
                <meta property="og:description" content={seo.channel.list.getDescription(props.list)} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.channel.list.getAlternate()} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.list.getBreadcrumbList()} key="BreadcrumbList"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.list.getArticle(props.list)} key="Article"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.list.getItemList(props.list)} key="ItemList"></script>

                {
                    seo.channel.list.getImage(props.list).map((item, index) => {
                        return (
                            <meta property="og:image" content={item} key={`og:image-${index}`} />
                        );
                    })
                }
            </Head>

            <ChannelList list={props.list} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);