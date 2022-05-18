
import tools from "../../assets/js/tools/index.js";
import aes128 from "../../assets/js/hash/aes128.js";
import api from "../../assets/js/api/index.js";
import cookie from "../../assets/js/cookie/index.js";

import message from "../../assets/json/message/passcode.json";

const app = async (req, res, next) => {
    if(req.method != "POST"){
        res.writeHead(400, "Bad Request");
        res.end();

        return;
    }

    let setCookies = new Array();

    let head = [
        ["Content-Type", "application/json"],
        ["Set-Cookie", setCookies]
    ];

    let env = process.env.NEXT_PUBLIC_ENV;

    if(env == "development"){
        head.push(
            ["Access-Control-Allow-Origin", req.headers.origin],
            ["Access-Control-Allow-Credentials", true]
        );
    }

    let body = "";

    try{
        let post = req.body;
        let cookies = tools.parseCookies(req);
        let Passcode = post.Passcode;
        let MobileNumber = aes128.decrypt(cookies.l_r_mo);
        let BirthYear = null;
        let Sex = null;
        let DeviceId = cookies.l_de;
        let ReferringPartner = null;

        if(typeof post == "string"){
            post = JSON.parse(post);
        }

        if(cookies.l_r_bi){
            BirthYear = aes128.decrypt(cookies.l_r_bi);
        }

        if(cookies.l_r_se){
            Sex = aes128.decrypt(cookies.l_r_se);
        }

        post.DeviceId = DeviceId;

        if(cookies.l_r_re){
            ReferringPartner = aes128.decrypt(cookies.l_r_re);
        }
        
        let status = await api.server.accountStatus.getFetch(MobileNumber);

        status = status.result;

        if(!status.Registered){
            await api.server.register.getFetch({
                Passcode: Passcode,
                CustomerInformation: {
                    BirthYear: Number(BirthYear),
                    Sex: Sex
                },
                DeviceId: post.DeviceId,
                MobileNumber: MobileNumber,
                ReferringPartner: ReferringPartner
            });
            
            status = await api.server.accountStatus.getFetch(MobileNumber);
            status = status.result;
        }
        
        if(!status.Activated){
            let response = await api.server.confirmMobileNumber.getFetch(MobileNumber, post.DeviceId, Passcode);
            
            if(response.error){
                cookie.passcode.clear(setCookies);

                body = JSON.stringify({
                    error: message["passcode.error.badpasscode"]
                });
            }
            else{
                cookie.passcode.set(setCookies, post);

                body = JSON.stringify({
                    error: ""
                });
            }
        }
        else{
            let response = await api.server.resetPassword.getFetch({
                MobileNumber: MobileNumber,
                Passcode: Passcode,
                NewPassword: Passcode
            });

            if(response.error){
                cookie.passcode.clear(setCookies);

                body = JSON.stringify({
                    error: message["passcode.error.badpasscode"]
                });
            }
            else{
                cookie.passcode.set(setCookies, post);

                body = JSON.stringify({
                    error: ""
                });
            }
        }

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);
        
        cookie.passcode.clear(setCookies);

        body = JSON.stringify({
            error: message["passcode.error.other"]
        });

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
