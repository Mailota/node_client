var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')



var IOTA = require('iota.lib.js')
var curl = require('curl.lib.js')
var IotaEngine = require('iota-engine')

const IOTANODE = 'http://eugene.iota.community:14265'

var iota = new IOTA({
    'provider': 'http://eugene.iota.community:14265'
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


app.post('/mail', (req, res) => {
    var mailToSend = {
        'subject': req.body.subject,
        'message': req.body.message
    }
    var mailStringified = JSON.stringify(mailToSend)
    var mailTrytes = iota.utils.toTrytes(mailStringified)
        var transfer = [{
            'address': req.body.address,
            'value': 0,
            'message': mailTrytes
        }]
        IotaEngine.initServer(req.body.seed, IOTANODE)
        IotaEngine.initClient(IOTANODE)
        IotaEngine.createBundle(0, req.body.address, mailTrytes)
        .then((result) => {
            IotaEngine.attachBundle(result).then((result) => {
                console.log(result)
                res.send(result)
            }).catch((err) => console.log(err))
        })
        .catch((err)=> console.log(err))  
})

app.get('/mails/address/:seed', (req, res) => {
    iota.api.getNewAddress(req.params.seed, (err, address) => {
        if(err) return res.send(err)
        return res.send(address)
    })
})

app.get('/mails/:seed', (req, res) => {
    var mails = []
    iota.api.getAccountData(req.params.seed, {}, (err, accountData) => {
        if(err) return res.send(err)
        var i = 1
        if(!accountData.transfers.length) {
            return res.send(mails)
        }
        accountData.transfers.forEach(transfer => {
            var mail = iota.utils.extractJson(transfer);
            mail = JSON.parse(mail);
                console.log(mail)
            mails.push(mail)
            if(i == accountData.transfers.length) {
                res.send(mails)
            } else {
                i++
            }
        })
    })
})


app.listen(8000, () => console.log('Example app listening on port 8000!'))

