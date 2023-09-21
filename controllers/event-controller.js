/**
 * Controller handling Event API Endpoint 
 * @author Phuong Do
 */
/**
 * Category model of Mongoose
 * @const
 */
 const Category = require("../models/category");
 /**
  * Counter model of Mongoose
  * @const
  */
 const Counter = require("../models/counter");
 /**
  * Event model of Mongoose
  * @const
  */
  const Event = require("../models/event");

module.exports = {
    /**
     * Add a new Event and update "Record Created" counter
     * @function
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    addEvent: async function (req, res) {
        let newEventDetail = req.body;

        //see array of category
        console.log(newEventDetail.categories.split(","));

        //find all categories  given in array and retrieved a list of those _id (reference)
        categories = await Category.find({"id": {$in: newEventDetail.categories.split(",") } });
        console.log (categories);
        categoryReference = [];
        categories.forEach(category => {
            categoryReference.push(category._id);
        });
        console.log(categoryReference);

        let newEvent = new Event({
            name: newEventDetail.name,
            description: newEventDetail.description,
            startDateTime: newEventDetail.startDateTime,
            durationInMinutes: newEventDetail.durationInMinutes,
            isActive: newEventDetail.isActive,
            image: newEventDetail.image,
            capacity: newEventDetail.capacity,
            ticketsAvailable: newEventDetail.ticketsAvailable,
            categoryList: categoryReference // reference list
        });
        await newEvent.save();

        //add this event to given category
        categories.forEach(async function(category) {
            console.log(category); //see the current category
            category.eventList.push(newEvent._id);
            console.log(newEvent._id); //see the id that will be added to eventlist
            console.log(category); // see the changed category
            await category.save(); //remember to save after change
        });

        await Counter.updateOne({ name: "Category-Event counter" },  { $inc: { addCount: 1 }});
        res.json({ eventId: newEvent.id }); //respond by new id
    },

    /**
     * List all events
     * @function
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    getAllEvent: async function (req, res) {
        let events = await Event.find({}).populate("categoryList");
        res.json(events)
    },

    /**
     * Delete an event & Update "Records Deleted" counter
     * @function
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    deleteEvent: async function (req, res) {
        let eventId = req.body.eventId;
        let event = await Event.findOne({ id: eventId });
        if (event == null) { // if no Event found
            res.json({//acknowledge = false if sth goes wrong)
                acknowledged: false,
                deletedCount: 0,
            });
        }
        else{ 
            const categoryIds = event.categoryList;

            // Delete the Event 
            deleteEvent = await Event.deleteOne({ id: eventId });

            // Delete the Event ID from the Categories associated
            if (categoryIds && categoryIds.length > 0) {
                await Category.updateMany(
                    { _id: { $in: categoryIds } },
                    { $pull: { eventList: event._id } }
                );
            }
            //Update "Records Deleted" counter
            await Counter.updateOne({ name: "Category-Event counter" },  { $inc: { deleteCount: 1 }});
            res.json({//acknowledge = false if sth goes wrong)
                acknowledged: deleteEvent.acknowledged,
                deletedCount: deleteEvent.deletedCount,
            });
        }
    },
    /**
    * Update category's name and capacity by using ID for filtering
    * @function
    * @async
    * @param {Object} req - Express request object.
    * @param {Object} res - Express response object.
    */
    updateEvent: async function (req, res) {
        let eventID = req.body.eventId;
        let name = req.body.name;
        let capacity = req.body.capacity;

        // Validation for name and capacity
        if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
            return res.json({ status: 'Invalid name format. Name must be alphanumeric.' });
        }

        if (typeof capacity !== 'number' || capacity < 10 || capacity > 2000) {
            return res.json({ status: 'Invalid capacity. Capacity must be a number between 10 and 2000 inclusive.' });
        }

        // Update the event
        //updateOne = return info of update operation such as nModified
        //findOneAndUpdate = return original of modified one unless set new:true to return new one
        let result = await Event.updateOne(
            { id: eventID },
            {
                $set: {
                    name: name,
                    capacity: capacity
                }
            }
        );
        
        if (result.modifiedCount === 0) {
            return res.json({ status: 'Invalid field or ID not found' });
        }
        await Counter.updateOne({ name: "Category-Event counter" }, { $inc: { updateCount: 1 } });
        res.json({ status: "Update sucessfully" });
    }
}