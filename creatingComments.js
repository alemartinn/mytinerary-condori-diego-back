require('dotenv').config();
const db = require('./config/database');

const Comment = require('./models/Comment');

const ourComments = [
    {
        comment: "It's Awesome",
        user: "6319b98af587b99d89bf4e20",
        itinerary: "6319d9d9d227c639cd7b6733"
    },
    {
        comment: "GREAT!!",
        user: "6319b98af587b99d89bf4e20",
        itinerary: "63191e5019e820ede7918c5e"
    }
]

ourComments.forEach(commentary => Comment.create(commentary));