const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { 
    const url =[
        {origin: 'https://www.goo2gle.com', shortURL:'fjadsk1'},
        {origin: 'https://www.goog1le.com', shortURL:'fjadsk2'},
        {origin: 'https://www.goo3gle.com', shortURL:'fjadsk3'},
        {origin: 'https://www.goo3gle.com', shortURL:'fjadsk4'},
    ]

    res.render('home',{url: url});
})

module.exports = router;