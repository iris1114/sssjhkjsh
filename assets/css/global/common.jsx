
const App = () => {
    return (
        <>
            <style jsx global>
                {`
                    *{
                        box-sizing: border-box;
                    }

                    body{
                        color: #333;
                        
                        *{	
                            &::-webkit-scrollbar {
                                width: 10px;
                            }
                            
                            &::-webkit-scrollbar-track {
                                box-shadow: inset 0 0 5px #4f4f4f; 
                                border-radius: 10px;
                                background-color: #4f4f4f;
                            }
                            
                            &::-webkit-scrollbar-thumb {
                                background: #272727; 
                                border-radius: 10px;
                                
                                &:hover{
                                    background: #000000; 
                                }
                            }
                        }
                    }

                    *:not(body){
                        color: inherit;
                    }

                    html{
                        font-family: Microsoft JhengHei, Heiti TC, WenQuanYi Zen Hei, Arial;
                    }

                    body{
                        background-color: #fcfcfc;
                    }

                    button{
                        background-color: transparent;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        padding: 0px;
                        -webkit-tap-highlight-color: rgba(0,0,0,0);
                    }

                    h1, h2, h3, h4, h5, h6, p{
                        margin: 0px;
                        font-weight: normal;
                        font-style: normal;
                    }

                    a{
                        text-decoration: none;
                        -webkit-tap-highlight-color: rgba(0,0,0,0);
                    }

                    table, th, td{
                        border: 1px solid #ccc;
                    }

                    table{
                        border-spacing: 0;
                        border-collapse: collapse;
                    }

                    .lazyload-wrapper{
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }

                    .ssr_only{
                        display: none;
                    }
                `}
            </style>
        </>
    );
};

export default App;
