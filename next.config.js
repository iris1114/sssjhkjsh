
const withPlugins = require("next-compose-plugins");
const withOptimizedImages = require("next-optimized-images");
const withPWA = require("next-pwa");
const withFonts = require("next-fonts");
const cache = require("./cache.js");

module.exports = withPlugins([
    [withOptimizedImages, {
        // these are the default values so you don"t have to provide them if they are good enough for your use-case.
        // but you can overwrite them here with any valid value you want.
        inlineImageLimit: 8192,
        imagesFolder: "images",
        imagesName: "[name]-[hash].[ext]",
        handleImages: ["jpeg", "png", "svg", "webp", "gif"],
        removeOriginalExtension: false,
        optimizeImages: true,
        optimizeImagesInDev: false,
        mozjpeg: {
            quality: 80,
        },
        optipng: {
            optimizationLevel: 3,
        },
        pngquant: false,
        gifsicle: {
            interlaced: true,
            optimizationLevel: 3,
        },
        svgo: {
            // enable/disable svgo plugins here
            
        },
        webp: {
            preset: "default",
            quality: 75,
        },
    }],
    [withPWA, {
        pwa: {
            disable: process.env.NODE_ENV !== "production",
            dest: "public",
            //swSrc: "service-worker.js",
            runtimeCaching: cache
        }
    }],
    [withFonts, {
        inlineFontLimit: 8192
    }]
], 
{
    async redirects() {
        return [
            {
                source: "/channel/introduction.do",
                destination: "/channel",
                permanent: true
            },
            {
                source: "/channel/list.do",
                destination: "/channel/list",
                permanent: true
            },
            {
                source: "/vod",
                destination: "/",
                permanent: true
            },
            {
                source: "/vod/:slug",
                destination: "/:slug",
                permanent: true
            },
            {
                source: "/vod/:slug/advanced_filter.do",
                destination: "/:slug/filter",
                permanent: true
            },
        ]
    }
});

