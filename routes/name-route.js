/**
 * Individual group Task 2 - Assignment 2 path update
 *  @author Phuong Do <ldoo0010@student.monash.edu>
 */

/**
 * Express model 
 * @const
 */
const express = require("express");

/**
* Node.js module for working with the file system.
* @const
*/
const fs = require('fs');

/**
 * Node.js module for working with file paths.
 * @const 
 */
const path = require("path");

/**
 * Custom module representing an event category.
 * @const
 * @see Category
 */
const Category = require("../models/category");

/**
 * Custom module representing an event.
 * @const
 * @see Event
 */
const Event = require("../models/event");

/**
 * Mongoose model representing a counter.
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
 * Express Router responsible for defining and managing event routes.
 * @type {express.Router}
 * @const
 */
const router = express.Router();

/**
 * The path to the directory containing Event images.
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
 * GET route to display the form for adding a new event.
 * @name get/ Add Event
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/add-event', function (req, res) {
    res.render("add-event", { errorMessage: "" });
});

/**
 * POST route to handle adding a new event to the event collection after the form is submitted.
 * @name post/Add Event 
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.post('/add-event-post', async function (req, res) {
    let reqBody = req.body;

    //find all categories  given in array and retrieved a list of those _id (reference)
    categories = await Category.find({ "id": { $in: reqBody.eventCategory.split(",") } });
    categoryReference = [];
    categories.forEach(category => {
        categoryReference.push(category._id);
    });
    console.log(categoryReference);
    let eventImage = reqBody.eventImage;
    if (!fs.existsSync(IMG_PATH + reqBody.eventImage) || eventImage == '') {//existsSync for checking file existence
        eventImage = "default.jpg" //set to default if no matching path
    }
    let newCapacity = reqBody.eventCapacity;
    //default capacity 
    if (newCapacity == '') {
        newCapacity = 1000;
    }
    let tickets = reqBody.eventTickets;
    if (tickets == '') {
        tickets = parseInt(newCapacity)
    }
    let newEvent = new Event({
        name: reqBody.eventName,
        description: reqBody.eventDesc,
        startDateTime: reqBody.eventDateTime,
        durationInMinutes: reqBody.eventDuration,
        isActive: reqBody.isActive === "on",
        image: eventImage,
        capacity: parseInt(newCapacity),
        ticketsAvailable: parseInt(tickets),
        categoryList: categoryReference
    });
    await newEvent.save();

    //add this event to given category
    categories.forEach(async function (category) {
        category.eventList.push(newEvent._id);
        await category.save(); //remember to save after change
    });

    await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { addCount: 1 } });
    console.log(newEvent); // recheck on terminal
    res.redirect("/studentName/phuong/events")
});

/**
 * GET route to list all events.
 * @name get/List Event
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/events', async function (req, res) {
    let db = await Event.find({}).populate({
        path: 'categoryList',
        select: 'id',
    });

    let categoryIDs = [];
    for (let i = 0; i < db.length; i++) {
        let currCatgs = db[i].categoryList;
        let currCatgId = [];
        currCatgs.forEach(catg => {
            currCatgId.push(catg.id);
        });
        categoryIDs.push(currCatgId)
    }
    res.render("list-event", { eventDB: db, title: "Event List", route: "sold-out-events", header: "Sold Out Event", catgIds: categoryIDs });
});

/**
 * GET route to display sold out events - events with 0 tickets available
 * @name get/Sold Out Event
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/sold-out-events', async function (req, res) {
    const soldOutEvents = await Event.find({ ticketsAvailable: 0 }).populate({
        path: 'categoryList',
        select: 'id',
    });
    let categoryIDs = [];
    for (let i = 0; i < soldOutEvents.length; i++) {
        let currCatgs = soldOutEvents[i].categoryList;
        let currCatgId = [];
        currCatgs.forEach(catg => {
            currCatgId.push(catg.id);
        });
        categoryIDs.push(currCatgId)
    }
    res.render("list-event", { eventDB: soldOutEvents, title: "Sold Out Event", route: "events", header: "Event List", catgIds: categoryIDs  });
});

/**
 * GET route to delete an event from the event collection by ID using query
 * @name get/Delete Event
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
 router.get('/event/remove', async function (req, res) {
    const eventID = req.query.id;
    let deleteEvent = await Event.deleteOne({ id: eventID });
    console.log(deleteEvent);
    await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { deleteCount: 1 } });
    res.redirect("/studentName/phuong/events");
});

/**
 * GET route to display the form receiving an ID as input for deleting an event.
 * @name get/Delete Event
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/delete-event', function (req, res) {
    fileName = VIEWS_PATH + "delete-event.html";
    res.sendFile(fileName);
});

/**
 * POST route to delete an event from the event collection after the delete form is submitted.
 * @name post/Delete Event
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.post('/event/remove', async function (req, res) {
    let eventID = req.body.id;
    console.log(eventID);
    let deleteEvent = await Event.deleteOne({ id: eventID })
    console.log(deleteEvent);
    await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { deleteCount: 1 } });
    res.redirect("/studentName/phuong/events");
});

/**
 * GET route to render the details of a specific category.
 * @name get/Category by ID
 * @function
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/category/:catgID', async function (req, res) {
    let displayCatg = await Category.findOne({ id: req.params.catgID });
    let events = [];
    console.log(events);
    let status = 'btn btn-primary';
    if (req.params.catgID == "sampleID") { 
        //handle sample category from index page
            let sampleCategory = new Category({
                id: "CXQ-2334",
                name: "Sample Category",
                description: "This category is an example of a detail template page for a Category.",
                image: "background.jpg",
            });
            displayCatg = sampleCategory;

            const sampleEvent1 = new Event({
                id: "EXQ-1224",
                name: "Sample Event 1",
                description: "This event is the first example of a detail template page for events",
                startDateTime: new Date('10/08/2023, 14:15'),
                durationInMinutes: 45,
                isActive: true,
                image: "image1.jpg",
                capacity: 200,
                ticketsAvailable: 100,
            });
            console.log(sampleEvent1);

            const sampleEvent2 = new Event({
                id: "ELR-9641",
                name: "Sample Event 2",
                description: "This event is the second example of a detail template page for events",
                startDateTime: new Date('09/09/2022, 11:25'),
                durationInMinutes: 80,
                isActive: false,
                image: "image2.jpg",
                capacity: 123,
                ticketsAvailable: 10,
            }
            );
            status = "disabled";
            events.push(sampleEvent1, sampleEvent2);
    }
    else {
        let eventList = await Event.find({ "_id": { $in: displayCatg.eventList } });
        eventList.forEach(event => {
            events.push(event);
        });
    }
    res.render("catg-detail", { catg: displayCatg, event: events, status:status });
});

//export router
module.exports = router;
