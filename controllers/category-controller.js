/**
 * Controller handling category api endpoint 
 * @author Phuong Anh Chu
 */

/**
 * Category model of mongoose
 * @const
 */
const Category = require("../models/category");
/**
 * Event model of mongoose
 * @const
 */
const Event = require("../models/event");
/**
 * Counter model of mongoose
 * @const
 */
const Counter = require("../models/counter");

/**
 * Controller methods for managing categories api endpoints
 */
module.exports = {
    /**
     * Add a new category and update counter
     * @function
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    addCategory: async function (req, res) {
        let newCatgDetail = req.body;
        let newCategory = new Category({
            name: newCatgDetail.name,
            description: newCatgDetail.description,
            image: newCatgDetail.image
        });
        await newCategory.save();
        await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { addCount: 1 } });
        res.json({ id: newCategory.id }); //respond by new id
    },
    /**
     * Get all categories.
     * @function
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    getAllCategory: async function (req, res) {
        let categories = await Category.find({}).populate("eventList");
        res.json(categories)
    },
    /**
     * Delete a category and its associated events.
     * @function
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    deleteCategory: async function (req, res) {
        let catgID = req.body.categoryId;
        let category = await Category.findOne({ id: catgID });
        console.log(category);

        if (category == null) { // if no category found
            res.json({//acknowledge = false if sth goes wrong)
                acknowledged: false,
                deletedCount: 0,
            });
        }
        // if found, remove this and all events and update others
        else {
            let eventIds = category.eventList;

            if (eventIds.length > 0) {
                // Delete all events with _id in the eventIds array
                await Event.deleteMany({ _id: { $in: eventIds } });
            }

            // Delete the category after deleting associated events
            deleteCategory = await Category.deleteOne({ id: catgID });

            if (deleteCategory.deletedCount != 0) {
                await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { deleteCount: 1 } });
            }
            res.json({//acknowledge = false if sth goes wrong)
                acknowledged: deleteCategory.acknowledged,
                deletedCount: deleteCategory.deletedCount,
            });
        }
    },
    /**
    * Update a category's name and description by using ID for filtering
    * @function
    * @async
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    */
    updateCategory: async function (req, res) {
        let catgID = req.body.categoryId;
        //updateOne = return info of update operation such as nModified
        //findOneAndUpdate = return original of modified one unless set new:true to return new one
        let result = await Category.updateOne(
            { id: catgID }, {
            $set: {
                name: req.body.name,
                description: req.body.description
            }
        });
        if (result.modifiedCount === 0) {
            return res.json({ status: 'Invalid field or ID not found' });
        }
        await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { updateCount: 1 } });
        res.json({ status: "Update sucessfully" });

    },

}