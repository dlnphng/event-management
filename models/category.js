/**
 * Mongoose model for Category documents.
 * @author Phuong Anh Chu
 */

/**
 * Mongoose module for applying mongodb
 * @const
 */
const mongoose = require("mongoose");
/**
 * randomstring module for generating random id 
 * @const
 */
const randString = require("randomstring");


/**
 * Mongoose schema for Category documents.
 * @Class Category 
 * @property {string} id - A unique identifier for the category (automatically generated).
 * @property {string} name - The name of the category (alphanumeric).
 * @property {string} description - A brief description of the category.
 * @property {string} image - The image associated with the category (default: "image1.jpg").
 * @property {Date} createdAt - The date when the category was created (default: current date).
 * @property {Array<ObjectId>} eventList - An array of ObjectIDs referencing associated events.
 */
let categorySchema = mongoose.Schema({
    id: {
        type: String,
        unique: true, // Ensure uniqueness of id values
        required: true, // Make sure id is always present
        default: function () {
            return generatedID(); // Use your generatedID function
        }
    },
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (nameVal) {
                return /^[a-zA-Z0-9 ]+$/.test(nameVal);//only alphanumeric
            },
            message: 'Name must be alphanumeric.'
        }
    },
    description: String,
    image: {
        type: String,
        default: "image1.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    eventList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]

});
/**
 * Generates category ID in the format "C{2 uppercase letters}-{4 digits}".
 * @function generatedID
 * @returns {string} The generated category ID.
 */
function generatedID() {
    let randChar = randString.generate({
        length: 2,
        charset: 'ABCDEFGHJKLMNOPQRSTUVWXYZ'
    });
    let randNum = randString.generate({
        length: 4,
        charset: '0123456789'
    });
    return `C${randChar}-${randNum}`;
}

/**
 * Export the Mongoose model for Category documents.
 * @type {CategoryModel}
 */
module.exports = mongoose.model('Category', categorySchema);