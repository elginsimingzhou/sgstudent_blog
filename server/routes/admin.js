const express = require("express");
const Assignment = require("../models/Assignment");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/admin", (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple web app for tutors to find the right students!",
    };

    const token = req.cookies.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
          res.redirect('/dashboard');
      } catch (err) {
        res.status(401).json({ error: "Invalid token" });
      }
    }

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

router.get("/register", (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Register an account now",
    };

    res.render("admin/register", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      //res.status(201).json({ message: "User Created", user });
      res.redirect("/admin");
    } catch (err) {
      console.log(err.code);
      if (err.code === 11000) {
        res.status(409).json({ message: "User already in use" }); //indicates a conflict between a client's request and the current state of a resource on the server
        return;
      }
      res.status(500).json({ message: "Internal Server Error" }); //generic server-side error that indicates an issue with the server.
      return;
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Dashboard for tutors to find the right students!",
    };
    const data = await Assignment.find({}).sort("-createdAt").exec();

    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Dashboard for tutors to find the right students!",
    };

    res.render("admin/add-post", { locals, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Dashboard for tutors to find the right students!",
    };

    const { title, author, hours, body, location, rates, gender } = req.body;

    await Assignment.create({
      title: title,
      author: author,
      hours: hours,
      body: body,
      location: location,
      rates: rates,
      gender: gender,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

router.get("/edit-post/:title", authMiddleware, async (req, res) => {
  try {
    const title = req.params.title;

    const data = await Assignment.findOne({ title: title });

    res.render("admin/edit-post", { data, layout: adminLayout });
  } catch (err) {
    console.log(err);
  }
});

router.put("/edit-post/:title", authMiddleware, async (req, res) => {
  try {
    const title_id = req.params.title;
    const { title, author, hours, body, location, rates, gender } = req.body;

    const update = {
      title: title_id,
      author: author,
      hours: hours,
      body: body,
      location: location,
      rates: rates,
      gender: gender,
      updatedAt: Date.now(),
    };

    await Assignment.findOneAndUpdate({ title: title_id }, update);

    res.redirect(`/edit-post/${title}`);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete-post/:title", authMiddleware, async (req, res) => {
  try {
    const title = req.params.title;
    await Assignment.findOneAndDelete({ title: title });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", authMiddleware, (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
