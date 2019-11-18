let express = require("express");
let router = express.Router();
var base62 = require("base62/lib/ascii");

const Meta = require("../models/metaModel");
const Url = require("../models/urlModel");
const Visit = require("../models/visitModel");

router.post("/shortenUrl", async (req, res, next) => {

    const longUrl = req.body.longUrl;

    const isUnique = await Url.findOne({
        longUrl: longUrl
    }).select().exec();

    console.log(isUnique)
    if (isUnique) {
        res.status(200).send({
            isSuccess: true,
            isUnique: false,
            shortUrl: isUnique.shortUrl
        });
    } else {
        var metaData = await Meta.findOne({
                meta: 1
            })
            .select("count -_id")
            .exec();
        var count = ++metaData.count;
      
        const shortUrl = await base62.encode(count);
        const url = new Url({
            longUrl: longUrl,
            shortUrl: shortUrl
        });

        const status = await url.save();
        if (!status) {
            res.status(200).send({
                isSuccess: false,
                isUnique: true
            });
        } else {
            const result = await Meta.findOneAndUpdate({
                meta: 1
            }, {
                $set: {
                    count: count
                }
            });
            if (!result) {
                res.status(200).send({
                    isSuccess: false,
                    isUnique: true
                });
            } else {
                res.status(201).send({
                    isSuccess: true,
                    isUnique: true,
                    shortUrl: shortUrl
                });
            }
        }
    }

});

router.post("/getLongUrl", async (req, res, next) => {
    const shortUrl = req.body.shortUrl;
    var url = await Url.findOne({
        shortUrl: shortUrl
    }).select().exec();

    if (!url) {
        res.status(200).send({
            isSuccess: false
        });
    }

    const timestamp = (new Date()).getTime();
    const visit = new Visit({
        shortUrl: shortUrl,
        timestamp: timestamp
    })
    
    const status = await visit.save();
    if (!status) {
        res.status(200).send({
            isSuccess: false
        });
    }
    res.status(201).send({
        isSuccess: true,
        url: url
    });
});

router.post("/getStats", async (req, res, next) => {
    const shortUrl = req.body.shortUrl;
    var url = await Url.findOne({
        shortUrl: shortUrl
    }).select().exec();

    if (!url) {
        res.status(200).send({
            isSuccess: false
        });
    }

    const visit = await Visit.find({
        shortUrl: shortUrl
    }).select("-v -_id").exec();

    res.status(200).send({
        isSuccess: true,
        longUrl: url.longUrl,
        visit: visit
    });
});

module.exports = router;