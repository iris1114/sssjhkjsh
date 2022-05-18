
import { connect } from "react-redux";

import PackageInfo from "../purchase/packageInfo/index.jsx";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <section className="package_info_dialog">
                <PackageInfo groupId={props.dialog.information} />
            </section>

            <style jsx>
                {`
                    .package_info_dialog{
                        background-color: #fcfcfc;
                        width: 750px;
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
