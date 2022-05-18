
import { connect } from "react-redux";

import Left from "./left.jsx";
import Right from "./right.jsx";

import homeObject from "../../../assets/json/purchase/home.json";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <section className="home_section">
                <div className="left_section">
                    <Left content={homeObject.left} />
                </div>

                <div className="right_section">
                    <Right content={homeObject.right} />
                </div>
            </section>

            <style jsx>
                {`
                    .home_section{
                        max-width: 1150px;
                        margin-top: 10px;
                        margin-bottom: 10px;
                        margin-left: auto;
                        margin-right: auto;
                        overflow: hidden;

                        .left_section{
                            width: 16%;
                            float: left;
                            margin: 0.5%;
                            background-color: #fff;
                            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
                        }

                        .right_section{
                            width: 82%;
                            float: left;
                            margin: 0.5%;
                            background-color: #fff;
                            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
                            padding: 10px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
