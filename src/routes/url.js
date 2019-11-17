let express = require("express");
let router = express.Router();
var base62 = require("base62/lib/ascii");

const Meta = require("../models/metaModel");
const Url = require("../models/urlModel");
// const Meta = require("../models/MetaModel");

router.post("/shortenUrl", async (req, res, next) => {
    var metaData = await Meta.findOne({
        meta: 1
    }).select("count -_id").exec();
    var count = ++metaData.count;
    new Meta({
        count: 10000
    }).save()
    const shortUrl = await base62.encode(count);
    const longUrl = req.body.longUrl;
    console.log(shortUrl)

    const url = new Url({
        'longUrl': longUrl,
        'shortUrl': shortUrl
    })

    const status = await url.save();
    if (!status) {
        res.status(200).send({
            isSuccess: false,
        });
    } else {
        const result = await Meta.findOneAndUpdate({
            meta: 1
        }, {
            $set: {
                count: count
            }
        })
        if (!result) {
            res.status(200).send({
                isSuccess: false,
            });
        } else {
            res.status(201).send({
                isSuccess: true,
                shortUrl: shortUrl
            });
        }
    }

});

module.exports = router;