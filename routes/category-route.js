/**
 * Express Router for managing Category api endpoints and passing to category controller
 * @author Phuong Anh Chu
 */

/**
 * Mongoose module 
 * @const
 */
const mongoose = require('mongoose');
/**
 * Mongoose model of Category documents 
 * @const
 */
const Category = require('../models/category');
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
 * Controller for category api endpoint
 * @const
 */
const catgController = require('../controllers/category-controller');


/**
 * RESTFUL add a new category handler
 * @function
 * @name post/ Add Category - api
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */

router.post('/add', catgController.addCategory);


/**
 * RESTFUL get all category handler
 * @function
 * @name get/ List Category - api
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.get('/list', catgController.getAllCategory);

/**
 * RESTFUL delete a category handler
 * @function
 * @name delete/ Delete Category - api
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.delete('/delete', catgController.deleteCategory);

/**
 * RESTFUL update a category handler
 * @function
 * @name put/ Update Category - api
 * @param {string} path - Express path
 * @param {Function} callback - Express callback
 */
router.put('/update', catgController.updateCategory);

/**
 * Export the  module as router
 */
module.exports = router;
