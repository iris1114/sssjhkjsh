
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import _ from "lodash";

import api from "../../../assets/js/api/index.js";
import seo from "../../../assets/js/seo/index.js";
import channel from "../../../assets/js/channel/index.js";
import watch from "../../../assets/js/watch/index.js";
import tools from "../../../assets/js/tools/index.js";

import Channel from "../../../components/channel/watch/index.jsx";

export const getServerSideProps = async (context) => {
    const res = {
        lineup: null,
        introduction: null,
        seoDictionary: null,
        programInfo: null
    };

    const bsmPackageCategory = context.query.bsmPackageCategory;
    let lineup = api.fino.lineup.getFetch("");

    if(bsmPackageCategory){
        lineup = api.fino.lineup.getFetch(bsmPackageCategory);
    }
    
    const introduction = api.fino.channelIntroduction.getFetch();
    const seoDictionary = api.fino.seoDictionary.getFetch();
    const data = await Promise.all([lineup, introduction, seoDictionary]);

    res.lineup = data[0].result.data;
    res.introduction = channel.introduction(data[1]);
    res.seoDictionary = data[2];

    res.lineup.channels = res.lineup.channels.sort((a, b) => {
        return a.no - b.no;
    });

    const contentId = context.query.contentId;

    if(contentId){
        const map = watch.channel.meta.getChannelMap(res.lineup);

        res.programInfo = map[contentId];
    }

    if(!res.programInfo){
        const list = watch.channel.meta.getChannelList(res.lineup);
        const channel = list[0];

        res.programInfo = channel;
    }

    return {
        props: {
            lineup: res.lineup,
            introduction: res.introduction,
            seoDictionary: res.seoDictionary,
            programInfo: res.programInfo,
            bsmPackageCategory: bsmPackageCategory || null
        }
    };
};

const mapStateToProps = (state) => {
    return {
        login: state.login,
        programInfoByDispatch: state.channel.watch.programInfo
    };
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
        },
        dispatchProgramInfo: (value) => {
            dispatch({
                type: "channel/watch/programInfo",
                value: value
            });
        }
    };
};

const App = (props) => {
    const [programInfo, setProgramInfo] = useState(props.programInfo);
    
    const prePropsLogin = tools.hook.usePrevious(props.login);

    const router = useRouter();

    useEffect(() => {
        if(props.bsmPackageCategory){
            props.dispatchHeaderFocus({
                main: "/channel/watch",
                sub: `/channel/watch/${props.bsmPackageCategory}`
            });
        }
        else{
            props.dispatchHeaderFocus({
                main: "/channel/watch",
                sub: "/channel/watch"
            });
        }
    }, [props.bsmPackageCategory]);

    useEffect(() => {
        props.dispatchFooterTopShow(false);

        return () => {
            props.dispatchFooterTopShow(true);
        };
    }, []);

    useEffect(() => {
        if(!props.programInfoByDispatch){
            return;
        }

        setProgramInfo(props.programInfoByDispatch);
    }, [props.programInfoByDispatch]);

    useEffect(() => {
        return () => {
            props.dispatchProgramInfo(null);
        };
    }, []);

    useEffect(() => {
        if(prePropsLogin == false && props.login == true){
            let programInfo = watch.channel.meta.getPrograms(props.programInfoByDispatch);

            programInfo = _.cloneDeep(programInfo);

            props.dispatchProgramInfo(programInfo);
        }
        else if(prePropsLogin == true && props.login == false){
            router.push("/", "/");
        }
    }, [props.login]);

    return (
        <>
            <Head>
                <title key="title">{seo.channel.watch.getTitle(programInfo, props.seoDictionary)}</title>
                <meta name="description" content={seo.channel.watch.getDescription(programInfo, props.introduction)} key="description" />
                <meta name="keywords" content={seo.channel.watch.getKeywords(programInfo, props.introduction)} key="keywords" />
                <meta property="og:url" content={seo.channel.watch.getUrl(programInfo)} key="og:url" />
                <meta property="og:type" content="video.other" key="og:type" />
                <meta property="og:title" content={seo.channel.watch.getTitle(programInfo, props.seoDictionary)} key="og:title" />
                <meta property="og:description" content={seo.channel.watch.getDescription(programInfo, props.introduction)} key="og:description" />
                <link rel="alternate" media="only screen and (max-width: 640px)" href={seo.channel.watch.getAlternate(programInfo)} key="alternate"></link>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.watch.getBreadcrumbList(programInfo)} key="BreadcrumbList"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.watch.getVideoObject(programInfo, props.introduction, props.seoDictionary)} key="VideoObject"></script>
                <script type="application/ld+json" dangerouslySetInnerHTML={seo.channel.watch.getItemList(props.lineup)} key="ItemList"></script>

                {
                    seo.channel.watch.getThumbnailUrl(programInfo, props.introduction).map((item, index) => {
                        return (
                            <meta property="og:image" content={item} key={`og:image-${index}`} />
                        );
                    })
                }
            </Head>

            <Channel lineup={props.lineup} introduction={props.introduction} programInfo={programInfo} bsmPackageCategory={props.bsmPackageCategory} seoDictionary={props.seoDictionary} />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);