
const express = require("express");
//const Sequelize = require('sequelize');
const bodyParser = require("body-parser")
const exphbs = require('express-handlebars');
const path = require("path");
const data = require("./modules/serverDataModule.js");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

data.initialize().then(function () {

    //Fixing the Navigation Bar to Show the correct "active" item
    /*app.use(function (req, res, next) {
        let route = req.baseUrl + req.path;
        app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
        next();
    });*/

    app.use(express.static("public"));

    app.use(bodyParser.urlencoded({ extended: true }));

    //custom helpers
    app.engine('.hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main',
        helpers: {
            /*helper automatically renders the correct <li> element add the class "active" if
            app.locals.activeRoute matches the provided url*/

            navLink: function (url, options) {
                return '<li' +
                    ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                    '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            },
            /*gives us the ability to evaluate conditions for equality, ie {{#equals "a" "a"}} … {{/equals}}
renders the contents, since "a" equals "a". It's exactly like the "if" helper, but with the added benefit of
evaluating a simple expression for equality
 */
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }
        }
    }))


    //to handle HTML files that are formatted using handlebars/
    app.set('view engine', '.hbs');

    //Routes
    app.get("/", (req, res) => {
        res.render(path.join(__dirname, "/views/home.hbs"));
    });

    app.get("/about", (req, res) => {
        res.render(path.join(__dirname, "/views/about.hbs"));
    });
    // app.get("/about", (req,res) => {
    //     res.sendFile(path.join(__dirname, "/views/about.html"));
    // });


    app.get("/cupcakes/add", (req, res) => {
        res.render(path.join(__dirname, "/views/addCupcake.hbs"));
    });

    //Fill the cupcake details and post it to cupcakes
    app.post("/cupcakes/add", (req, res, next) => {
        data.addCupcake(req.body).then(data => {
            res.redirect("/cupcake");
        }).catch(err => {
            res.send(err);
        });
    })


    //Display all CupCakes
    app.get("/cupcake", (req, res) => {
        data.getAllCupckes().then((data) => {
            res.render("cupcakes", { cupcakes: data });
        }).catch((err) => {
            res.render("cupcakes", { message: "no results" });
        });
    });

    //Display Cupcakes By Last Modified Date by Shop owner
    app.get("/cupcake/:dateEntered", (req, res) => {
        data.getCupCakesByLastModifiedDate(req.params.last).then((data) => {
            res.render("cupcakes", { cupcakes: data });
        }).catch((err) => {
            res.render("cupcakes", { message: "no results" });

        });
    });

    //Edit cupcake 
    app.post("/cupcake/update", (req, res) => {
        console.log(req.body);
        data.updateCupCake(req.body).then(data => {
            res.redirect("/cupcake");
        }).catch(err => {
            res.send(err);
        });

    });

    // Route to Show cupcake details when clicked on the name of the cupcake
    app.get("/cupcake/cupcakeName", (req, res) => {
        data.getCupcakesByName(req.params.cupcakeName).then((data) => {
            res.render("cupcake", { cupcake: data });
        }).catch((err) => {
            res.render("cupcake", { message: "no results" });
        });
    });














    app.listen(HTTP_PORT, function () {
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function (err) {
    console.log("unable to start server: " + err);
});
