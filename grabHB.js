//只是一个构思没写具体实现,下面是分析接受数据

client.on("internal.sso", function (cmd, payload, seq) {
    try {
        if (cmd == "OnlinePush.PbPushGroupMsg") {
            let proto = core.pb.decode(payload)
            let GroupMsg = {};

            if (proto[1][3][1][2][0][8]) {
                //console.log("图片消息");
            } else {
                GroupMsg.typeface = proto[1][3][1][1][9].toString();
                //proto[1][3][1][2][0][2]   1为文本消息 2为表情消息
                if (proto[1][3][1][2][0][1]) {
                    GroupMsg.msg = proto['1']['3']['1']['2'][0]['1']['1'].toString()
                    if (GroupMsg.typeface == "Times New Roman" && GroupMsg.msg.indexOf("[QQ红包]") != -1) { 
                        GroupMsg.SenderQQ = proto['1']['1']['1']
                        GroupMsg.SenderName = proto['1']['1']['9']['4'].toString()
                        GroupMsg.GroupNumber = proto['1']['1']['9']['1']
                        GroupMsg.GroupName = proto['1']['1']['9']['8'].toString()
                        GroupMsg.HB_red_ID = proto['1']['3']['1']['2'][1]['24']['1']['3']['14'].toString()
                        GroupMsg.HB_Title = proto['1']['3']['1']['2'][1]['24']['1']['3']['3'].toString()
                        GroupMsg.HB_Type = proto['1']['3']['1']['2'][1]['24']['1']['8']
                        GroupMsg.HB_Style = proto['1']['3']['1']['2'][1]['24']['1']['12']
                        GroupMsg.HB_ID = proto['1']['3']['1']['2'][1]['24']['1']['9'].toString()
                        GroupMsg.HB_authkey = proto['1']['3']['1']['2'][1]['24']['1']['10'].toString()
                        switch (GroupMsg.HB_Type) {
                            case 2:
                                GroupMsg.HB_TypeTitle = "";
                                switch (GroupMsg.HB_Style) {
                                    case 6:
                                        GroupMsg.HB_TypeTitle += '[拼手气]';
                                        break;
                                    case 12:
                                        GroupMsg.HB_TypeTitle += '[文字口令]';
                                        break;
                                    case 16:
                                        GroupMsg.HB_TypeTitle += '[专属]';
                                        GroupMsg.HB_ToUin = String(proto[1][3][1][2][1][24][1][20]);
                                        break;
                                    case 26:
                                        GroupMsg.HB_TypeTitle += '[语音口令]';
                                        break;
                                    case 40:
                                        GroupMsg.HB_TypeTitle += '[一笔画]';
                                        break;
                                    default:
                                        GroupMsg.HB_TypeTitle += '[未知：' + GroupMsg.HB_Style + ']';
                                }
                                break;
                            case 4:
                                GroupMsg.HB_TypeTitle = '[普通红包]';
                                switch (GroupMsg.HB_Style) {
                                    case 4:
                                        break
                                    default:
                                        GroupMsg.HB_TypeTitle += '[未知：' + GroupMsg.HB_Style + ']';
                                }
                                break;
                            default:
                                GroupMsg.HB_TypeTitle = '未知红包：' + GroupMsg.HB_Type + '[未知：' + GroupMsg.HB_Style + ']';
                        }
                        GroupMsg.HB_RawData = proto['1']['3']['1']['2'][1]['24'].encoded.toString("hex").toUpperCase()

                        let qun = client.pickGroup(GroupMsg.GroupNumber);
                        //编写抢红包代码
                        const url = "https://mqq.tenpay.com/cgi-bin/hongbao/qpay_hb_na_grap.cgi?ver=2.0&chv=3"
                        let body = {
                            "authkey": GroupMsg.HB_authkey,
                            "hb_from": "0",
                            "agreement": "0",
                            "pay_flag": "0",
                            "groupid": String(GroupMsg.GroupNumber),
                            "channel": "1",
                            "pre_grap_token": "rand=53b48b24565872e7fd6a1e95b16e3f5f&sign=86988f1d3e7e61ca242ea424be98bab5&ts=1674736734&ver=1",
                            "senderuin": String(GroupMsg.SenderQQ),
                            "listid": GroupMsg.HB_ID,
                            "skey_type": "2",
                            "grouptype": "1",
                            "trans_seq": "13",
                            "groupuin": String(GroupMsg.SenderQQ),
                            "name": Bot.nickname,
                            "skey": "xxxx",
                            "uin": Bot.uin
                        }

                        //qun.sendMsg(JSON.stringify(body, null, "\t"));

                        if (GroupMsg.SenderQQ == 1341806518) {
                            const message = [
                                segment.at(Number(GroupMsg.SenderQQ)),
                                `\n发送了一个${GroupMsg.HB_TypeTitle}红包\n`,
                            ]
                            //qun.sendMsg(message);
                            let as = []
                            as.push({ user_id: GroupMsg.SenderQQ, nickname: "小叶子", message: JSON.stringify(GroupMsg, null, "\t") })
                            qun.makeForwardMsg(as).then((forwardMsg) => {
                                let message = [
                                    segment.xml(forwardMsg.data)
                                ]
                                qun.sendMsg(message);
                            })
                        }
                    }
                }
            }
            decodePb(payload).then((json) => {
                fs.writeFile("test.txt", JSON.stringify(json) + payload.toString("hex").toUpperCase(), (err, data) => { if (err) throw err; });
            });


            return

            decodePb(payload).then((json) => {
                /*
                图片消息数据
                {"1":{"1":{"1":1341806518,"2":1341806518,"3":82,"4":0,"5":625719,"6":1674397435,"7":72057595497732200,"9":{"1":148651459,"2":1,"3":66454,"4":"<%ĀĀ\u0007Ð>","6":6,"7":1,"8":"幻叶萌"},"10":1001,"11":537147618,"12":0,"17":8},"2":{"1":1,"2":0,"3":0},"3":{"1":{"1":{"1":0,"2":1674397435,"3":1459804248,"4":0,"5":10,"6":0,"7":134,"8":2,"9":"宋体"},"2":[{"8":{"2":"C21F38258FB3F63C540AAD2647DA4179.jpg","6":"\u00156 86eA1B8d321c34b7c0c4cd      50Sk9gegExaaeqhgsSC21F38258FB3F63C540AAD2647DA4179.jpgA","7":2368871476,"8":3082863821,"9":80,"10":66,"11":"Sk9gegExaaeqhgsS","12":1,"13":"�\u001f8%���<T\n�&G�Ay","14":"/gchatpic_new/1341806518/2091651459-2368871476-C21F38258FB3F63C540AAD2647DA4179/198?term=2&is_origin=0","16":"/gchatpic_new/1341806518/2091651459-2368871476-C21F38258FB3F63C540AAD2647DA4179/0?term=2&is_origin=0","20":1000,"22":60,"23":60,"24":104,"25":1699,"26":0,"27":60,"28":60,"29":0,"30":0,"31":"/gchatpic_new/1341806518/2091651459-2368871476-C21F38258FB3F63C540AAD2647DA4179/400?term=2&is_origin=0","32":60,"33":60,"34":{"1":1,"2":0,"3":0,"4":0,"6":{},"9":"你已被移除本群","10":0,"15":4,"31":"�\u001f8%���<T\n�&G�Ay"}}},{"37":{"1":165,"10":1,"12":0,"13":0,"17":21908,"19":{"1":11,"4":10315,"15":65536,"18":1,"25":0,"30":0,"31":0,"34":0,"36":0,"41":0,"51":337,"52":128,"54":1,"56":20071,"58":0,"61":8,"65":{"1":[{},{},{}],"2":100},"66":8192,"71":2,"72":0,"73":{"2":0,"4":1,"6":106},"79":131592,"80":76,"81":16}}},{"9":{"1":2276,"8":1}},{"16":{"2":"<%ĀĀ\u0007Ð>","3":6,"4":8,"5":1,"7":"小叶子🅥"}}]}}},"9":0}
    
                红包消息数据
                {"1":{"1":{"1":3220300337,"2":3220300337,"3":82,"4":0,"5":3039,"6":1674322446,"7":72057594725628830,"9":{"1":705602939,"2":1,"3":139,"4":"⠆","6":2,"7":2,"8":"借用二下"},"10":2046,"11":1,"12":0},"2":{"1":1,"2":0,"3":0},"3":{"1":{"1":{"1":1,"2":1674322445,"3":687700894,"4":0,"5":10,"6":0,"7":78,"8":90,"9":"Times New Roman"},"2":[{"1":{"1":"[QQ红包]请使用新版手机QQ查收红包。"}},{"24":{"1":{"1":0,"3":{"1":14235648,"2":4,"3":"大吉大利","4":"赶紧点击拆开吧","5":"QQ红包","6":{},"7":{},"8":"[QQ红包]大吉大利","9":16777215,"10":16777215,"11":"3","14":"red?id=10000466012301221500117909634900","21":{"1":{},"2":{},"4":0,"5":0,"6":0,"7":-1,"9":1,"10":0,"11":0,"12":0,"14":{},"15":0}},"4":2,"5":10,"6":0,"7":3,"8":2,"9":"10000466012301221500117909634900","10":"948e60cbe5f81f03fc6469fa8a4086b4op","11":2,"12":6,"18":"876f7875130bd23f4ddcd824dd31f5f6","19":1,"21":{"2":{},"3":0,"5":"{\"skin_type\":\"0\"}","7":0,"8":0,"9":0,"10":0,"11":"2bbe065c605021409df1136842f30bba"}}}},{"9":{"1":0,"12":0}},{"37":{"1":0,"10":0,"12":0,"13":0,"17":0,"19":{"1":6,"4":10315,"15":0,"25":0,"30":0,"31":0,"34":0,"51":0,"52":0,"54":1,"56":0,"58":0,"61":0,"65":{"2":15},"66":3072,"71":2,"72":1,"73":{"4":1},"79":8,"81":0}}},{"16":{"1":"⠆","3":2,"5":1}}]}}},"9":0}
    
    
    
    {"1":{"1":0,"3":{"1":14235648,"2":4,"3":"红鲤鱼与绿鲤鱼与驴","4":"赶紧点击拆开吧
","5":"QQ红包","6":{},"7":{},"8":"[QQ红包]红鲤鱼与绿鲤鱼与驴","9":16777215,"10":
16777215,"11":"3","14":"red?id=10000452012301231400103635560500","21":{"1":{},"2
":{},"3":9,"4":0,"5":0,"6":0,"7":-1,"9":1,"10":0,"11":0,"12":0,"14":{},"15":0}},
"4":2,"5":10,"6":0,"7":3,"8":2,"9":"10000452012301231400103635560500","10":"b7c7
54e34bff5d2d753825c71f9b9dffv1","11":2,"12":26,"18":"337bf4adb92092decd6be98b26f
5c735","19":65536,"21":{"2":{},"3":0,"5":{},"7":0,"8":0,"9":0,"10":0,"11":"b00a4
e2e1e86cad7f509fa078da5896c"}}}

{"1":{"1":0,"3":{"1":14235648,"2":4,"3":"大吉大利","4":"赶紧点击拆开吧","5":"QQ
红包","6":{},"7":{},"8":"[QQ红包]大吉大利","9":16777215,"10":16777215,"11":"3","
14":"red?id=10000452012301231500117962025500","21":{"1":{},"2":{},"4":0,"5":0,"6
":0,"7":-1,"9":1,"10":0,"11":0,"12":0,"14":{},"15":0}},"4":2,"5":10,"6":0,"7":3,
"8":2,"9":"10000452012301231500117962025500","10":"0f0f6a51411b71cbf74f5e09dd878
e5eje","11":2,"12":6,"18":"f9f3250472903827ff500e79adeff01f","19":1,"21":{"2":{}
,"3":0,"5":"{\"skin_type\":\"0\"}","7":0,"8":0,"9":0,"10":0,"11":"b00a4e2e1e86ca
d7f509fa078da5896c"}}}

                */
                
            })

        }


    } catch (err) {
        console.log(err)
    }
})