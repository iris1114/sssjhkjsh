
import { Provider } from "react-redux";
import { useEffect } from "react";
import { withUserAgent } from "next-useragent";
import { useRouter } from "next/router";
import Head from "next/head";
import "intersection-observer";

import store from "../redux/store.js";
import plugins from "../plugins/index.js";
import head from "../assets/js/head/index.js";

import pkg from "../package.json";

import "normalize.css";

import Header from "../components/header/index.jsx";
import Dialog from "../components/dialog/index.jsx";
import Footer from "../components/footer/index.jsx";
import Loading from "../components/loading/index.jsx";
import Toast from "../components/toast/index.jsx";
import CommonStyle from "../assets/css/global/common.jsx";

if(process.title == "browser"){
    plugins.client.config();
    plugins.client.menu();
    plugins.client.generateDeviceId();
    plugins.client.gtag();
    plugins.client.installPrompt();
    plugins.client.watchLogin();
    plugins.client.referringPartner();
    plugins.client.resize();
    plugins.client.visibilityState();
    plugins.client.beforeUnload();
    plugins.client.scroll();
    plugins.client.beacon();
    plugins.client.bulletin();
    plugins.client.mktDialog();
    plugins.client.fullscreenChange();
    plugins.client.oneSignal();
    plugins.client.facebookPixel();
    plugins.client.facebookAsyncInit();
    plugins.client.gtm();
    plugins.client.puid();
    plugins.client.routerChangeLoading();
    plugins.client.ua();
    plugins.client.auth();
    plugins.client.scrollRestoration();
    plugins.client.publicIp();
    plugins.client.webVitals();
    plugins.client.uidSDK();
    plugins.client.valid();
    plugins.client.utag();
    plugins.client.audienceId();
}

const App = ({Component, pageProps, ...etc}) => {
    const router = useRouter();

    useEffect(() => {
        store.dispatch({
            type: "ready",
            value: true
        });
    }, []);

    useEffect(() => {
        store.dispatch({
            type: "router",
            value: router
        });
    }, [router]);

    return (
        <Provider store={store}>
            <Head>
                <title key="title">{pkg.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" key="viewport" />
                <meta name="description" content={pkg.description} key="description" />
                <meta name="author" content={pkg.author} key="author" />
                <meta name="keywords" content={pkg.keywords.join(",")} key="keywords" />
                <meta property="fb:admins" content={litv.config.facebookAdmins} key="fb:admins" />
                <meta property="fb:app_id" content={litv.config.facebookAppId} key="fb:app_id" />
                <meta property="og:url" content="https://www.litv.tv" key="og:url" />
                <meta property="og:type" content="website" key="og:type" />
                <meta property="og:title" content={pkg.title} key="og:title" />
                <meta property="og:description" content={pkg.description} key="og:description" />
                <meta property="og:site_name" content={pkg.siteName} key="og:site_name" />
                <meta property="og:image" content="https://www.litv.tv/multiDeviceIntro.png" key="og:image-0" />
                <meta property="og:image" content="https://www.litv.tv/channelsIntro.png" key="og:image-1" />
                <meta property="og:image" content="https://www.litv.tv/seriesIntro.png" key="og:image-2" />
                <meta name="theme-color" content="#ffffff" key="themeColor"></meta>
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" key="shortcut_icon"></link>
                <link rel="icon" type="image/png" size="192x192" href="/icon/icon@192.png" key="icon"></link>
                <link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.litv.tv" key="alternate"></link>
                <link rel="manifest" href="/manifest.json" key="manifest"></link>
                <link rel="apple-touch-icon" type="image/png" size="512x512" href="/icon/icon@512.png" key="appleTouchIcon"></link>
                <script type="text/javascript" dangerouslySetInnerHTML={head.alexa} key="alexa"></script>
                
                <link rel="preload" href={litv.config.flowplayerStyle} as="style"></link>
                <link rel="preload" href={litv.config.playerStyle} as="style"></link>
                <link rel="preload" href="https://connect.facebook.net/zh_TW/sdk.js" as="script"></link>
                <link rel="preload" href="//imasdk.googleapis.com/js/sdkloader/ima3.js" as="script"></link>
                <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.8.9/hls.light.min.js" as="script"></link>
                <link rel="preload" href="/library/streamsense/streamsense.5.0.2.160107.min.js" as="script"></link>
                <link rel="preload" href={litv.config.flowplayerScript} as="script"></link>
                <link rel="preload" href={litv.config.playerScript} as="script"></link>
            </Head>

            <CommonStyle {...pageProps} />
            <Header />
            <Component {...pageProps} />
            <Footer />
            <Dialog {...pageProps} />
            <Toast {...pageProps} />
            <Loading {...pageProps} />

            <link href={litv.config.flowplayerStyle} type="text/css" rel="stylesheet"></link>
            <link href={litv.config.playerStyle} type="text/css" rel="stylesheet"></link>
            <script src="https://connect.facebook.net/zh_TW/sdk.js"></script>
            <script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.8.9/hls.light.min.js"></script>
            <script type="text/javascript" src="/library/streamsense/streamsense.5.0.2.160107.min.js"></script>
            <script type="text/javascript" src={litv.config.flowplayerScript}></script>
            <script type="text/javascript" src={litv.config.playerScript}></script>
        </Provider>
    );
};

App.getInitialProps = async (ctx) => {
    if(process.title == "node"){
        plugins.server.redirectByUserAgent(ctx);
        plugins.server.robots(ctx);

        return {
            config: plugins.server.config(),
            deviceId: await plugins.server.generateDeviceId(ctx),
            ua: plugins.server.userAgent(ctx),
            publicIp: plugins.server.publicIp(ctx),
            //menu: await plugins.server.menu()
        };
    }
};

export default withUserAgent(App);
