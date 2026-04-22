const db = require('../../../models');

const Concert = db.concert;

async function createConcert(payload) {
    return Concert.create(payload);
}

async function findAllConcerts(filter = {}) {
    return Concert.find(filter).populate('venueId').sort({ date: 1 });
}

async function findConcertById(concertId) {
    return Concert.findById(concertId).populate('venueId');
}

async function updateConcertById(concertId, payload) {
    return Concert.findByIdAndUpdate(concertId, payload, { new: true });
}

async function deleteConcertById(concertId) {
    return Concert.findByIdAndDelete(concertId);
}

async function addArtistToConcert(concertId, artist) {
    return Concert.findByIdAndUpdate(
        concertId,
        { $push: { artists: artist } },
        { new: true }
    );
}

async function removeArtistFromConcert(concertId, artistId) {
    return Concert.findByIdAndUpdate(
        concertId,
        { $pull: { artists: { _id: artistId } } },
        { new: true }
    );
}

async function addTicketCategory(concertId, category) {
    return Concert.findByIdAndUpdate(
        concertId,
        { $push: { ticketCategories: category } },
        { new: true }
    );
}

async function incrementTicketSold(concertId, categoryName, qty) {
    return Concert.findOneAndUpdate(
        { _id: concertId, 'ticketCategories.name': categoryName },
        { $inc: { 'ticketCategories.$.sold': qty } },
        { new: true }
    );
}

module.exports = {
    createConcert,
    findAllConcerts,
    findConcertById,
    updateConcertById,
    deleteConcertById,
    addArtistToConcert,
    removeArtistFromConcert,
    addTicketCategory,
    incrementTicketSold,
};