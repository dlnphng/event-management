/**
 * Mongoose model for Category documents.
 * @author Phuong Do
 */

/**
 * Mongoose module for applying Mongodb
 * @const
 */
 const mongoose = require("mongoose");
 /**
  * randomstring module for generating random ID
  * @const
  */
 const randString = require("randomstring");
 
/**
 * Mongoose schema for Event documents.
 * @Class Event 
 * @property {string} id - A unique identifier for the Event (automatically generated).
 * @property {string} name - The name of the Event (alphanumeric).
 * @property {string} description - A brief description of the Event.
 * @property {Date} startDateTime - The start Date Time of the Event.
 * @property {Number} durationInMinutes - The duration of the Event (minutes).
 * @property {Date} endDateTime - The end Date Time of the Event. (value: start Date Time + duration)
 * @property {Boolean} isActive - The status of the Event.
 * @property {string} image - The image associated with the Event (default: "image1.jpg").
 * @property {Number} capacity - The capacity of the Event (default: 1000 - between 10 and 2000 inclusively)
 * @property {Number} ticketsAvailable - The remaining tickets available of the Event (default: capacity)
 * @property {Array<ObjectId>} categoryList - An array of ObjectIDs referencing associated categories.
 */
let eventSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true, // Ensure uniqueness of id values
        required: true, // Make sure id is always present
        default: function () {
            return generatedID(); // Use generatedID function
        }
    },
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (nameVal) {
                return /^[a-zA-Z0-9 ]+$/.test(nameVal); //only alphanumeric
            },
            message: 'Name must be alphanumeric.'
        }
    },
    description: String,
    startDateTime: {
        type: Date,
        required: true
    },
    durationInMinutes: {
        type: Number,
        required: true
    },
    endDateTime:{
        type: Date,
        default: function (){
            const startDateTime = new Date(this.startDateTime);
            const endDateTime = new Date(startDateTime.getTime() + this.durationInMinutes * 60000);
            return (new Date(endDateTime)); 
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: "image1.jpg"
    },
    capacity: {
        type: Number,
        default: 1000,
        validate: {
			validator: function (value) {
				return value >= 10 && value <= 2000;
			},
			message: "Capacity must be between 10 and 2000 (inclusive)",
		},
    },
    ticketsAvailable: {
        type: Number,
        default: function () {
            return this.capacity; // Default to capacity
        },
    },
    categoryList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]

});
/**
 * Generates category ID in the format "E{2 uppercase letters}-{4 digits}".
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
    return `E${randChar}-${randNum}`;
}

module.exports = mongoose.model('Event', eventSchema);