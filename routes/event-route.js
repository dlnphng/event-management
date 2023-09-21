/**
 * Express Router for managing Event API endpoints and passing to Event controller
 * @author Phuong document
 */
/**
 * Mongoose module 
 * @const
 */
 const mongoose = require('mongoose');
 /**
 * Mongoose model of Event documents 
 * @const
 */
const Event = require('../models/event');
/**
 * Express module
 * @const
 */
 const express = require('express');
 /**
  * Express router 
  * @const
  */
 const router = express.Router();
 /**
 * Controller for Event API endpoint
 * @const
 */
const eventController = require('../controllers/event-controller');

/**
 * RESTFUL add a new Event handler
 * @function
 * @name post/ Add Event - API
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.post('/add-event', eventController.addEvent);
/**
 * RESTFUL list all events handler
 * @function
 * @name get/ List Event - API
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/events', eventController.getAllEvent);
/**
 * RESTFUL delete an Event handler
 * @function
 * @name delete/ Delete Event - API
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.delete('/delete-event', eventController.deleteEvent);
/**
 * RESTFUL update an Event handler
 * @function
 * @name put/ Update Event - API
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.put('/update-event', eventController.updateEvent);
/**
 * Export the  module as router
 */
module.exports = router;
