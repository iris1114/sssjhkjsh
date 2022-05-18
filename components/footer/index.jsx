
import { connect } from "react-redux";
import dynamic from "next/dynamic";

import Top from "./top/index.jsx";
import Bottom from "./bottom/index.jsx";

const App = connect((state) => {
    return {
        topShow: state.footer.top.show
    };
}, (dispatch) => {
    return {};
})((props) => {
    return (
        <>
            <footer className="footer_section">
                {
                    (() => {
                        if(props.topShow){
                            return (
                                <Top menu={props.menu} />
                            );
                        }
                    })()
                }
                
                <Bottom />
            </footer>

            <style jsx>
                {`
                    .footer_section{
                        overflow: hidden;
                    }
                `}
            </style>
        </>
    );
});

export default dynamic(() => {
    const mapStateToProps = (state) => {
        return {
            menu: state.menu,
            show: state.footer.show
        };
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {};
    };

    return new Promise((resolve) => {
        resolve(connect(mapStateToProps, mapDispatchToProps)((props) => {
            return (
                <>
                    {
                        (() => {
                            if(props.show && props.menu){
                                return (
                                    <App menu={props.menu} />
                                );
                            }
                        })()
                    }
                </>
            );
        }));
    });
}, {
    ssr: false
});
