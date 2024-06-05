const express = require('express')
const router = express.Router();

router.get("/", (req, res)=>{
    const locals = {
        title : "SGStudent Assignments",
        description: "Simple web app for tutors to find the right students!"
    };

    res.render("index", {locals})
})

module.exports = router;