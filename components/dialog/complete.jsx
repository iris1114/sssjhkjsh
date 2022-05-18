
import { connect } from "react-redux";
import { useCallback } from "react";

import Complete from "../purchase/complete/index.jsx";

const mapStateToProps = (state) => {
    return {
        dialog: state.dialog
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDialog: (value) => {
            dispatch({
                type: "dialog",
                value: value
            });
        },
        dispatchPurchasePass: (value) => {
            dispatch({
                type: "purchasePass",
                value: value
            });
        }
    };
};

const App = (props) => {
    const playBtnClickHandler = useCallback(() => {
        props.dispatchPurchasePass(true);

        props.dispatchDialog({
            component: null
        });
    }, []);

    return (
        <>
            <section className="purchase_complete_dialog">
                <Complete groupId={props.dialog.information} />
                <button className="play_btn" onClick={playBtnClickHandler}>確認並播放</button>
            </section>

            <style jsx>
                {`
                    .purchase_complete_dialog{
                        background-color: #fcfcfc;
                        width: 750px;

                        .play_btn{
                            width: 100%;
                            background-color: #f60;
                            color: #fff;
                            font-size: 16px;
                            line-height: 50px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
