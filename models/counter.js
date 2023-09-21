/**
 * Mongoose model for Counter documents.
 * @author Phuong Anh Chu , Phuong Do
 */

/**
 * mongoose module 
 * @const
 * @see Event
 */
const mongoose = require('mongoose');

/**
 * Mongoose schema for Counter documents.
 * @Class Counter 
 * @property {string} name - The name of the counter (e.g., "Category-Event counter").
 * @property {number} addCount - The count of add operation (default: 0).
 * @property {number} updateCount - The count  update operation (default: 0).
 * @property {number} deleteCount - The count of delte operation (default: 0).
 */
let counterSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    addCount: {
        type: Number,
        default: 0
    },
    updateCount: {
        type: Number,
        default: 0
    },
    deleteCount: {
        type: Number,
        default: 0
    },
});

/**
 * Export the Mongoose model for Counter documents.
 * @type {CounterModel}
 */
module.exports = mongoose.model('Counter', counterSchema);;