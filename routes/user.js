/**
 * Created by Administrator on 2016/11/25.
 */
var express = require('express');
var router = express.Router();
router.get('/:name', function (req, res) {
    res.render('user', {
        name:req.params.name,
        supplies: ['mop', 'broom', 'duster']
    })
});
module.exports = router;