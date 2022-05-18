
import { connect } from "react-redux";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const App = (props) => {
    return (
        <>
            <div className="yahoo_disclaimer">本服務係由「LiTV」(替您錄科技股份有限公司) 提供，請詳閱「LiTV」之服務條款與隱私權政策等相關規定。如果您提供任何個人資料予「LiTV」或參與任何「LiTV」活動，Yahoo! 奇摩不對該等資料之保護或您因此所生的相關損害負任何責任。Yahoo! 奇摩對於本服務內容資料之正確性或合法性，或本服務相關網頁因全部或部分中斷、暫時無法使用、遲延、或造成任何資料內容 (包括影音、圖片、文字、數字、圖形) 傳輸中斷、錯誤、缺漏、更新延誤、或儲存上之錯誤、均不負任何責任。</div>

            <style jsx>
                {`
                    .yahoo_disclaimer{
                        border-bottom: 1px solid #dadada;
                        text-align: center;
                        font-size: 12px;
                        line-height: 20px;
                        padding-top: 20px;
                        padding-bottom: 20px;
                        padding-left: 5%;
                        padding-right: 5%;
                    }
                `}
            </style>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
