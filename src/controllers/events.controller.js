import { Event } from "../models/events.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createEvent = asyncHandler(async (req, res) => {
    console.log(req.body)

  const { title, description, eventDate, location, maxParticipants } = req.body;

  if (!title || !description || !eventDate || !location) {
    throw new apiError(400, "Title, description, eventDate and location are required");
  }

  const image = req.file ? req.file.path : "";

  const event = await Event.create({
    title,
    description,
    eventDate,
    location,
    image,
    maxParticipants,
    createdBy: req.user._id
  });

  return res.status(201).json(
    new apiResponse(201, event, "Event created successfully (draft)")
  );
});
const publishEvent = asyncHandler(async (req, res) => {

    const { id } = req.params;
  
    const event = await Event.findById(id);
  
    if (!event) {
      throw new apiError(404, "Event not found");
    }
  
    event.status = "published";
  
    await event.save();
  
    return res.status(200).json(
      new apiResponse(200, event, "Event published successfully")
    );
  });
const getAllEvents = asyncHandler(async (req, res) => {

    const events = await Event.find()
      .sort({ createdAt: -1 });
  
    if (!events || events.length === 0) {
      throw new apiError(404, "No events found");
    }
  
    return res.status(200).json(
      new apiResponse(
        200,
        events,
        "All events fetched successfully"
      )
    );
  
  });
const getPublishedEvents = asyncHandler(async (req, res) => {

    const events = await Event.find({ status: "published" })
      .sort({ eventDate: 1 });
  
    const formattedEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      location: event.location,
      image: event.image,
      maxParticipants: event.maxParticipants,
      registeredCount: event.registrations.length,
      seatsLeft: event.maxParticipants
        ? event.maxParticipants - event.registrations.length
        : null
    }));
  
    return res.status(200).json(
      new apiResponse(
        200,
        formattedEvents,
        "Published events fetched successfully"
      )
    );
  
  });
// const getPublishedEvents = asyncHandler(async (req, res) => {

//     const events = await Event.find({ status: "published" })
//       .sort({ eventDate: 1 });
  
//     return res.status(200).json(
//       new apiResponse(
//         200,
//         events,
//         "Published events fetched successfully"
//       )
//     );
  
//   });

const registerForEvent = asyncHandler(async (req, res) => {

    const { eventId } = req.params;
    const userId = req.user._id;
  
    const event = await Event.findById(eventId);
  
    if (!event) {
      throw new apiError(404, "Event not found");
    }
  
    // Only allow published events
    if (event.status !== "published") {
      throw new apiError(400, "Event is not published yet");
    }
  
    // Check if already registered
    const alreadyRegistered = event.registrations.some(
      (reg) => reg.user.toString() === userId.toString()
    );
  
    if (alreadyRegistered) {
      throw new apiError(400, "You already registered for this event");
    }
  
    // Check seat limit
    if (
      event.maxParticipants &&
      event.registrations.length >= event.maxParticipants
    ) {
      throw new apiError(400, "Event is full");
    }
  
    // Register user
    event.registrations.push({
      user: userId
    });
  
    await event.save();
  
    return res.status(200).json(
      new apiResponse(
        200,
        event,
        "Successfully registered for event"
      )
    );
  
  });
const getMyRegisteredEvents = asyncHandler(async (req, res) => {

    const userId = req.user._id;
  
    const events = await Event.find({
      "registrations.user": userId
    }).sort({ eventDate: 1 });
  
    const formattedEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      location: event.location,
      image: event.image
    }));
  
    return res.status(200).json(
      new apiResponse(
        200,
        formattedEvents,
        "My registered events fetched successfully"
      )
    );
  
  });

export {

    createEvent,
    publishEvent,
    getAllEvents,
    getPublishedEvents,
    registerForEvent,
    getMyRegisteredEvents,

}