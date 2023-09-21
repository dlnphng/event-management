/**
 * Individual group task 1 - assignment 2 path update
 *  @author Phuong Anh Chu <pchu0023@student.monash.edu>
 */


/**
 * Node.js module for working with the file system.
 * @const
 */
const fs = require('fs');

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
 * mongoose model representing an event category.
 * @const
 * @see Category
 */
const Category = require("../models/category");

/**
 * mongoose model representing an event.
 * @const
 * @see Event
 */
const Event = require("../models/event");

/**
 * mongoose model representing a counter.
 * @const
 * @see Counter
 */
const Counter = require("../models/counter");

/**
 * Mongoose module for applying mongodb
 * @const 
 */
const mongoose = require('mongoose');


/**
 * The path to the directory containing view templates.
 * @type {string}
 * @const
 */
const VIEWS_PATH = path.join(__dirname, "../views/");

/**
 * Express Router responsible for defining and managing event category routes.
 * @type {express.Router}
 * @const
 */
const router = express.Router();

/**
 * The path to the directory containing event images.
 * @type {string}
 * @const
 */
const IMG_PATH = path.join(__dirname, "../images/");

/**
 * Middleware for parsing URL-encoded data from incoming requests.
 * @function
 */
router.use(express.urlencoded({ extended: true }));

/**
 * Middleware for serving static files from the "css" directory.
 * @function
 */
router.use(express.static("css"));

/**
 * Middleware for serving static files from the "images" directory.
 * @function
 */
router.use(express.static("images"));

/**
 * Middleware for serving static files from the "node_modules/bootstrap/dist/css" directory.
 * @function
  */
router.use(express.static("node_modules/bootstrap/dist/css"));


/**
 * GET route to display the form for adding a new event category.
 * @name get/ Add Category
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/add-category', function (req, res) {
    res.render("add-catg", { errorMessage: "" });

});
/**
 * POST route to handle adding a new event category to the category collection after the form is submitted.
 * @name post/Add Category 
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.post('/add-catg-post', async function (req, res) {
    let reqBody = req.body;

    let catgImage = reqBody.catgImage;
    // this allows to use default img for invalid path file
    if (!fs.existsSync(IMG_PATH + reqBody.catgImage) || catgImage == '') {//existsSync for checking file existence
        catgImage = "default.jpg" //set to default if no matching path
    }

    let anEventCatg = new Category({
        name: reqBody.catgName,
        description: reqBody.catgDesc,
        image: catgImage
    }
    )
    await anEventCatg.save() //add Category
    await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { addCount: 1 } });
    res.redirect("/studentID/32667817/list-event-categories") //red to listCatg when button submit
});

/**
 * GET route to list all event categories.
 * @name get/List Event Categories
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/list-event-categories', async function (req, res) {
    let db = await Category.find({});
    res.render("list-catg", { catgDB: db, keyword: "" });
});

/**
 * GET route to search for event categories by keyword existing within the description of a category.
 * @name get/Search Category
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/search-category', async function (req, res) {
    let keyword = req.query.keyword.toLowerCase();
    let filterCatgDB = await Category.find({ description: new RegExp(keyword, 'i') });
    res.render("list-catg", { catgDB: filterCatgDB, keyword: req.query.keyword });
});
/**
 * POST route to perform a search by redirecting to the search-category route attached with a keyword parameter.
 * @name post/Search Category Post
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.post('/search-catg-post', function (req, res) {
    res.redirect("/studentID/32667817/search-category?keyword=" + req.body.keyword);
});


/**
 * GET route to render the details of a specific event.
 * @name get/Event by ID
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/event/:eventID', async function (req, res) {
    let displayEvent = await Event.findOne({ id: req.params.eventID });
    let categories = [];
    if (req.params.eventID === "sampleID") {
        displayEvent = new Event({
            name: "Sample Event",
            description: "This event is an example of a detail template page for events",
            startDateTime: new Date('10/08/2023, 14:15'),
            durationInMinutes: 45,
            isActive: true,
            image: "image1.jpg",
            capacity: 999,
            ticketsAvailable: 499,
            categoryList: categories
        });
        categories = ["CSE-3434"];
    }
    else{
        let catgList = await Category.find({"_id": {$in: displayEvent.categoryList } });
        catgList.forEach(category => {
            categories.push(category.id);
        });
    }
    res.render("event-detail", { event: displayEvent, category: categories });

});

/**
 * GET route to display the form receiving an ID as input for deleting an event category and all events linked to it.
 * @name get/Delete Category
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/delete-category', function (req, res) {
    fileName = VIEWS_PATH + "delete-catg.html";
    res.sendFile(fileName);
});
/**
 * POST route to delete an event category from the category collection after the delete form is submitted.
 * @name post/Delete Category Post
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.post('/delete-catg-post', async function (req, res) {
    let catgID = req.body.catgId;
    let category = await Category.findOne({ id: catgID });
    console.log(category);
    let eventIds = category.eventList;
    console.log(eventIds);
    if (eventIds) {
        let deleteEvents = await Event.deleteMany({ _id: { $in: eventIds } });
        console.log(deleteEvents);
    }
    let deleteCategory = await Category.deleteOne({ id: catgID })
    await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { deleteCount: 1 } });
    res.redirect("/studentID/32667817/list-event-categories") //red to listCatg when button submit
});
//export router
module.exports = router;


