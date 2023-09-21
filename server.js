/**
 *  Assignment 2 group task
 *  @author Phuong Anh Chu <pchu0023@student.monash.edu>
 *  @author Phuong Do <ldoo0010@student.monash.edu>
 */

/**
 * Express router handling file for path "localhost:8080/studentID/32667817"
 * @requires express
 * @requires path
 */

/**
 * Express model 
 * @const
 */
const express = require("express");

/**
 * Node.js module for working with file paths.
 * @const 
 */
const path = require("path");

/**
 * The path to the directory containing view templates.
 * @type {string}
 * @const
 */
const VIEWS_PATH = path.join(__dirname, "/views/");

/**
 * Port number 
 * @const
 */
const PORT_NUMBER = 8080;

/**
 * app instance
 * @const
 */
const app = express();

/**
 * Set up the EJS engine for rendering HTML files.
 * @function
*/
app.engine("html", require("ejs").renderFile);

/**
 * Set the default view engine for rendering templates.
 * @function
 */
app.set("view engine", "html");

/**
 * Middleware for serving static files from the "css" directory.
 * @function
 */
app.use(express.static("css"));

/**
 * Middleware for serving static files from the "node_modules/bootstrap/dist/css" directory.
 * @function
 */
app.use(express.static("node_modules/bootstrap/dist/css"));

/**
 * Middleware for serving static files from the "images" directory.
 * @function
 */
app.use(express.static("images"));


/**
 * Start server and listen on a specified port.
 * @name listen
 * @function
 * @param {number} port - Express port number
 * @param {Function} callback - Express callback
 */
app.listen(PORT_NUMBER, function (req, res) {
    console.log(`Listen on port ${PORT_NUMBER}`)
});

/**
 * Mongoose module
 * @const
 */
const mongoose = require('mongoose');

/**
 * Custome model of category api path router handling
 * @const
 */
const categoryRoute = require('./routes/category-route');
/**
 * Custome model of event api path router handling
 * @const
 */
const eventRoute = require('./routes/event-route');

/**
 * Custome model of id path router handling
 * @const
 */
const idRoutes = require('./routes/id-route')

/**
 * Custome model of name path router handling 
 * @const
 */
const nameRoutes = require('./routes/name-route')

/**
 * Middleware to parse incoming JSON data.
 * @function
 */
app.use(express.json());

/**
 * Middleware to parse incoming URL-encoded data with extended options.
 * @function
 */
app.use(express.urlencoded({ extended: true }));

/**
 * The MongoDB connection URL.
 * @type {string}
 * @const
 */
const url = "mongodb://127.0.0.1:27017/assignment2";

/**
 * Establishes a connection to a MongoDB database using the provided URL.
 *
 * @async
 * @function
 * @name connect
 * @param {string} url - The URL for the MongoDB database connection.
 * @returns {string} A success message upon successful connection.
 */

async function connect(url) {
	await mongoose.connect(url);
	return "Connected Successfully";
}

/**
 * Direct the category routers of assignment2 api endpoint to handling "/32667817/api/category" path.
 * @function
 * @param {string} path - The base path for the mounted routes.
 * @param {Router} idRoutes - The router containing ID and api-related routes.
 */
app.use('/32667817/api/category', categoryRoute);
/**
 * Direct the event routers of assignment2 api endpoint to handling "/phuong/api/event" path.
 * @function
 * @param {string} path - The base path for the mounted routes.
 * @param {Router} idRoutes - The router containing name and api-related routes.
 */
app.use('/phuong/api/v1', eventRoute);


/**
 * Direct the ID routers of assignment1 endpoint to handling "/studentID/32667817" path.
 * @function
 * @param {string} path - The base path for the mounted routes.
 * @param {Router} idRoutes - The router containing ID-related routes.
 */
app.use('/studentID/32667817', idRoutes);

/**
 * Direct the name routers of assignment1 endpoint to handling "/studentName/phuong" path.
 * @function
 * @param {string} path - The base path for the mounted routes.
 * @param {Router} nameRoutes - The router containing ID-related routes.
 */
app.use('/studentName/phuong', nameRoutes);

/**
 * Establishes a connection to a database using the provided URL.
 * @param {string} url - The URL for the database connection.
 */
connect(url)
	.then(console.log)
	.catch((err) => console.log(err));

/**
 * Category model of mongoose
 * @const
 */
const Category = require("./models/category");
/**
 * Event model of mongoose
 * @const
 */
const Event = require("./models/event");
/**
 * Counter model of mongoose
 * @const
 */
const Counter = require("./models/counter");

//initialize counter
// let counter = new Counter({name: "Category-Event counter"});
// counter.save();

/**
 * Route handler for Home page. Find counter document and display.
 * @function
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 */
app.get('/', async function (req, res) {
    let catgTotal = await Category.countDocuments();
    let eventTotal = await Event.countDocuments();
    let counter = await Counter.findOne({name: "Category-Event counter"});
    res.render("index", {catgTotal: catgTotal, eventTotal:eventTotal, counter: counter  });
});

/**
 * Route handler for 404 or Invalid Handling page.
 * @function
 * @param {string} path - Express path
 * @param {function} callback - Express callback
 */
app.get("*", function (request, response) {
    response.render("404");
});

