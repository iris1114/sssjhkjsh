
import { connect } from "react-redux";
import { useState } from "react";

import Content from "./content/index.jsx";
import Success from "./success.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    const [successMessage, setSuccessMessage] = useState(null);

    return (
        <>
            <div className="enable_coupon_section">
                {
                    (() => {
                        if(successMessage){
                            return (
                                <Success successMessage={successMessage} />
                            );
                        }
                        else{
                            return (
                                <Content setSuccessMessage={setSuccessMessage} />
                            );
                        }
                    })()
                }
            </div>

            <style jsx>
                {`
                    .enable_coupon_section{
                        overflow: hidden;
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
