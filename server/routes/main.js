const express = require("express");
const Assignment = require("../models/Assignment");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "SGStudent Assignments",
      description: "Simple web app for tutors to find the right students!",
    };
    const data = await Assignment.find().sort({ createdAt: -1 });
    res.render("index", { locals, data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/assignments/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const data = await Assignment.findOne({ title: title });
    console.log(data);
    res.render("assignment", { data });
  } catch (err) {
    console.log(err);
  }
});

router.get("/apply/:title", (req, res) => {
  const title = req.params.title;
  res.send(`You have successfully applied for assignment ${title}`);
});

router.post("/search", async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    const data = await Assignment.find({ body: { "$regex": searchTerm, "$options": "i" } });
    res.render('search', {data})
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", (req, res) => {
  const locals = {
    title: "SGStudent Assignments",
    description: "Simple web app for tutors to find the right students!",
  };
  res.render("about", { locals });
});

router.get("/contact", (req, res) => {
  const locals = {
    title: "SGStudent Assignments",
    description: "Simple web app for tutors to find the right students!",
  };
  res.render("contact", { locals });
});

//Mass insertion of assignments
// router.post("/assignments", (req, res) => {
//   Assignment.insertMany([
//     {
//       title: "G12345A",
//       author: "Mdm Siti",
//       hours: "1.5 Hr, 1x A Week",
//       body: "Sec 3 NA Comb Bio/Chem (Presbyterian High Sch)",
//       location: "Belgravia Drive",
//       rates: "$45-60/Hr (FT), $65-75/Hr Max (MOE)",
//       gender: "Male only",
//     },
//     {
//       title: "G16845J",
//       author: "Mdm Nurul",
//       hours: "1.5 Hr, 1x A Week",
//       body: "P4 & P5 Science (ACSP)",
//       location: "11 Chancery Lane, Chancery Park, (S)309502",
//       rates: "$35-50/Hr (FT), $50-80/Hr (MOE)",
//       gender: "Male only",
//     },

//     {
//       title: "G17445D",
//       author: "Mdm Sam",
//       hours: "1.5 Hr, 1x A Week",
//       body: "K1 Chinese",
//       location: "485A Choa Chu Kang Avenue 5 (S)681485",
//       rates: "$40-50/Hr",
//       gender: "Female only",
//     },

//     {
//       title: "G19235I",
//       author: "Mdm Tan",
//       hours: "1.5 Hr, 2x A Week",
//       body: "JC1 H1 General Paper (NYJC)",
//       location: "906 Sims Avenue, Parc Esta (S)408969",
//       rates: "$90-130/Hr",
//       gender: "Female only",
//     },

//     {
//       title: "G29235T",
//       author: "Mdm Lee",
//       hours: "2 Hr, 2x A Week",
//       body: "	Sec 1 G3 English (TKGS)",
//       location: "Near Hougang",
//       rates: "$60-80/Hr",
//       gender: "Female or Male",
//     },
//   ]).then(function () {
//     console.log("Data inserted") // Success
// }).catch(function (error) {
//     console.log(error)     // Failure
// }); ;
// });

module.exports = router;
