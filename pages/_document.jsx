
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class App extends Document{
    static async getInitialProps(ctx){
        const initialProps = await Document.getInitialProps(ctx);
        
        return {...initialProps};
    };

    render(){
        return (
            <Html lang="zh-Hant-TW" prefix="og: http://ogp.me/ns#">
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    };
};
