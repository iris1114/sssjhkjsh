
const App = () => {
    return (
        <>
            <style jsx global>
                {`
                    .poster_banner_episode_tag{
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center center;
                        background-repeat: no-repeat;
                        height: 26px;
                        display: none;

                        &[data-poster-banner=A]{
                            width: 95px;
                            background-image: url(${require("../../image/posterBanner/tagAllFree@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=E]{
                            width: 62px;
                            background-image: url(${require("../../image/posterBanner/tagFree@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=B]{
                            width: 114px;
                            background-image: url(${require("../../image/posterBanner/tagOneFree@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=U]{
                            width: 62px;
                            background-image: url(${require("../../image/posterBanner/tagVip@2x.png")});
                            display: block;
                        }
                    }

                    .poster_banner_episode_icon{
                        position: absolute;
                        width: 35px;
                        height: 20px;
                        top: -10px;
                        right: -10px;
                        background-size: 100% 100%;
                        display: none;

                        &[data-poster-banner=B]{
                            &[data-charge-mode=C], &[data-charge-mode=F]{
                                background-image: url(${require("../../image/posterBanner/iconFree@2x.png")});
                                display: block;
                            }
                        }

                        &[data-poster-banner=U][data-charge-mode=P]{
                            background-image: url(${require("../../image/posterBanner/iconVip@2x.png")});
                            display: block;
                        }
                    }

                    .poster_banner_episode_triangle_icon{
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        top: 0px;
                        left: 0px;
                        background-size: 100% 100%;
                        display: none;
                        
                        &[data-poster-banner=U][data-charge-mode=P]{
                            background-image: url(${require("../../image/posterBanner/iconVipTriangle@2x.png")});
                            display: block;
                        }
                    }

                    .poster_banner_poster_icon{
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        top: 0px;
                        left: 0px;
                        background-size: 100% 100%;
                        display: none;

                        &[data-poster-banner=H]{
                            background-image: url(${require("../../image/posterBanner/iconPosterHot@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=N]{
                            background-image: url(${require("../../image/posterBanner/iconPosterNew@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=C]{
                            background-image: url(${require("../../image/posterBanner/iconPosterSync@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=I]{
                            background-image: url(${require("../../image/posterBanner/iconPosterTvod@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=W]{
                            width: 80px;
                            height: 80px;
                            top: auto;
                            bottom: 0px;
                            left: auto;
                            right: 0px;
                            background-image: url(${require("../../image/posterBanner/iconPosterWeekend.png")});
                            display: block;
                        }

                        &[data-poster-banner=A]{
                            width: 45px;
                            height: 25px;
                            top: auto;
                            bottom: 5px;
                            left: 5px;
                            right: auto;
                            background-image: url(${require("../../image/posterBanner/iconFree@2x.png")});
                            display: block;
                        }

                        &[data-poster-banner=U]{
                            width: 45px;
                            height: 25px;
                            top: auto;
                            bottom: 5px;
                            left: 5px;
                            right: auto;
                            background-image: url(${require("../../image/posterBanner/iconPosterVip@2x.png")});
                            display: block;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default App;
