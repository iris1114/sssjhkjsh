
import { connect } from "react-redux";
import { useMemo } from "react";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const contractHref = useMemo(() => {
        return `${litv.config.fino}/tos/pc.html`;
    }, []);

    return (
        <>
            <section className="remind_section">付款即表示同意 LiTV <a className="link" href={contractHref} target="_blank">服務條款</a> 及 <a className="link" href="/service/privacy" target="_blank">隱私權政策</a></section>

            <style jsx>
                {`
                    .remind_section{
                        margin-top: 10px;
                        font-size: 14px;
                        color: #666;
                        line-height: 30px;
                        text-align: center;

                        .link{
                            text-decoration: underline;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
