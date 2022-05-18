
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

const App = (props) => {
    const router = useRouter();

    const buttonClickHandler = useCallback(() => {
        router.reload();
    }, []);

    useEffect(() => {
        if(props.statusCode == 404 && router.asPath != "/"){
            router.replace("/", "/");
        }
    }, [props.statusCode, router]);

    return (
        <>
            <section className="error_page">
                <img className="logo" src={require("../../public/logo.png")} alt="logo"/>
                <div className="status_code">抱歉，這個頁面無法取得</div>

                {
                    (() => {
                        if(props.statusCode){
                            return (
                                <div className="status_code">{props.statusCode}</div>
                            );
                        }
                    })()
                }   

                {
                    (() => {
                        if(props.exception){
                            return(
                                <div className="error_message">Error Message: {props.exception}</div>
                            );
                        }
                    })()
                }

                <img className="error_image" src={require("../../assets/image/error/error.png")} />
                <div className="info">Oops！出了點問題，請稍後再試。</div>
                <button className="reload_btn" onClick={buttonClickHandler}>重新整理</button>
            </section>

            <style jsx>
                {`
                    .error_page{
                        text-align: center;
                        margin: 20px auto 50px;
                        width: 80%;
                        
                        .logo{
                            width: 80px;
                            margin: 10px auto;
                        }

                        .status_code{
                            font-size: 24px;
                            color: #666666;
                            margin: 20px auto;
                            font-weight: 500;
                        }

                        .error_message{
                            font-size: 18px;
                            color: #999999;
                            margin-bottom: 30px;
                        }

                        .error_image{
                            width: 250px;
                            display: block;
                            margin: 10px auto;
                        }

                        .info{
                            font-size: 20px;
                            color: #666666;
                            margin: 25px 0px 30px; 
                        }

                        .reload_btn{    
                            background-color: #B88FF9;
                            color: #fff;
                            font-size: 20px;
                            cursor: pointer;
                            border-radius: 5px;
                            padding: 10px 30px;
                            border-width: 0px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default App;
