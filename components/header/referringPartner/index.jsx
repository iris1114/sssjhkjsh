
import { connect } from "react-redux";
import { useMemo, forwardRef } from "react";

import tools from "../../../assets/js/tools/index.js";

import Yahoo from "./yahoo.jsx";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props, ref) => {
    const referringPartner = useMemo(() => {
        return tools.url.getReferringPartner();
    }, []);
    
    return (
        <>
            <section className="referring_partner_section" ref={ref}>
                {
                    (() => {
                        if(referringPartner == "yahoo"){
                            return (
                                <Yahoo />
                            );
                        }
                    })()
                }
            </section>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(forwardRef(App));
