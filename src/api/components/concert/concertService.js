const concertRepo = require('./concertRepo');

async function createConcert(payload) {
    const {
        name,
        description,
        venue_id: venueId,
        artists,
        date,
        open_gate_time: openGateTime,
        show_time: showTime,
        ticket_categories: ticketCategories,
        poster_url: posterUrl,
        min_age: minAge,
    } = payload;

    if (!name || !venueId || !date || !openGateTime || !showTime) {
        throw new Error('Semua field wajib diisi (name, venue_id, date, open_gate_time, show_time)');
    }

    const concert = await concertRepo.createConcert({
        name,
        description,
        venueId,
        artists: artists || [],
        date: new Date(date),
        openGateTime: new Date(openGateTime),
        showTime: new Date(showTime),
        ticketCategories: ticketCategories || [],
        posterUrl,
        minAge,
        status: 'draft',
    });

    return {
        message: 'Konser berhasil dibuat',
        data: concert,
    };
}

async function getAllConcerts(payload) {
    const { status } = payload;

    const filter = {};
    if (status) filter.status = status;

    const concerts = await concertRepo.findAllConcerts(filter);

    return {
        message: 'Daftar konser berhasil diambil',
        data: concerts,
    };
}

async function getConcertDetail(payload) {
    const { concert_id: concertId } = payload;

    if (!concertId) throw new Error('concert_id wajib diisi');

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    return {
        message: 'Detail konser berhasil diambil',
        data: concert,
    };
}

async function updateConcert(payload) {
    const {
        concert_id: concertId,
        name,
        description,
        venue_id: venueId,
        date,
        open_gate_time: openGateTime,
        show_time: showTime,
        poster_url: posterUrl,
        min_age: minAge,
        status,
    } = payload;

    if (!concertId) throw new Error('concert_id wajib diisi');

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    if (concert.status === 'selesai' || concert.status === 'dibatalkan') {
        throw new Error('Konser yang sudah selesai atau dibatalkan tidak bisa diupdate');
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (venueId) updateData.venueId = venueId;
    if (date) updateData.date = new Date(date);
    if (openGateTime) updateData.openGateTime = new Date(openGateTime);
    if (showTime) updateData.showTime = new Date(showTime);
    if (posterUrl !== undefined) updateData.posterUrl = posterUrl;
    if (minAge !== undefined) updateData.minAge = minAge;
    if (status) updateData.status = status;

    const updated = await concertRepo.updateConcertById(concertId, updateData);

    return {
        message: 'Konser berhasil diupdate',
        data: updated,
    };
}

async function publishConcert(payload) {
    const { concert_id: concertId } = payload;

    if (!concertId) throw new Error('concert_id wajib diisi');

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    if (concert.status !== 'draft') {
        throw new Error('Hanya konser berstatus draft yang bisa dipublish');
    }
    if (concert.artists.length === 0) {
        throw new Error('Tambahkan minimal 1 artist sebelum publish konser');
    }
    if (concert.ticketCategories.length === 0) {
        throw new Error('Tambahkan minimal 1 kategori tiket sebelum publish konser');
    }

    const updated = await concertRepo.updateConcertById(concertId, { status: 'published' });

    return {
        message: 'Konser berhasil dipublish',
        data: updated,
    };
}

async function cancelConcert(payload) {
    const { concert_id: concertId } = payload;

    if (!concertId) throw new Error('concert_id wajib diisi');

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    if (concert.status === 'selesai' || concert.status === 'dibatalkan') {
        throw new Error('Konser ini sudah selesai atau sudah dibatalkan');
    }

    const updated = await concertRepo.updateConcertById(concertId, { status: 'dibatalkan' });

    return {
        message: 'Konser berhasil dibatalkan',
        data: updated,
    };
}

async function addArtist(payload) {
    const {
        concert_id: concertId,
        name,
        genre,
        set_duration: setDuration,
        order_appearance: orderAppearance,
    } = payload;

    if (!concertId || !name) {
        throw new Error('concert_id dan name artist wajib diisi');
    }

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    if (concert.status === 'selesai' || concert.status === 'dibatalkan') {
        throw new Error('Tidak bisa menambah artist ke konser yang sudah selesai atau dibatalkan');
    }

    const artist = { name, genre, setDuration, orderAppearance };
    const updated = await concertRepo.addArtistToConcert(concertId, artist);

    return {
        message: `Artist "${name}" berhasil ditambahkan ke konser`,
        data: updated,
    };
}

async function removeArtist(payload) {
    const { concert_id: concertId, artist_id: artistId } = payload;

    if (!concertId || !artistId) {
        throw new Error('concert_id dan artist_id wajib diisi');
    }

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    if (concert.status === 'selesai' || concert.status === 'dibatalkan') {
        throw new Error('Tidak bisa menghapus artist dari konser yang sudah selesai atau dibatalkan');
    }

    const updated = await concertRepo.removeArtistFromConcert(concertId, artistId);

    return {
        message: 'Artist berhasil dihapus dari konser',
        data: updated,
    };
}

async function addTicketCategory(payload) {
    const { concert_id: concertId, name, price, quota } = payload;

    if (!concertId || !name || price === undefined || !quota) {
        throw new Error('concert_id, name, price, dan quota wajib diisi');
    }

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    if (concert.status !== 'draft') {
        throw new Error('Kategori tiket hanya bisa ditambahkan saat konser masih berstatus draft');
    }

    const isDuplicate = concert.ticketCategories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) throw new Error(`Kategori tiket "${name}" sudah ada`);

    const updated = await concertRepo.addTicketCategory(concertId, { name, price, quota, sold: 0 });

    return {
        message: `Kategori tiket "${name}" berhasil ditambahkan`,
        data: updated,
    };
}

async function deleteConcert(payload) {
    const { concert_id: concertId } = payload;

    if (!concertId) throw new Error('concert_id wajib diisi');

    const concert = await concertRepo.findConcertById(concertId);
    if (!concert) throw new Error('Konser tidak ditemukan');

    if (concert.status !== 'draft') {
        throw new Error('Hanya konser berstatus draft yang bisa dihapus permanen');
    }

    await concertRepo.deleteConcertById(concertId);

    return {
        message: 'Konser berhasil dihapus',
    };
}

module.exports = {
    createConcert,
    getAllConcerts,
    getConcertDetail,
    updateConcert,
    publishConcert,
    cancelConcert,
    addArtist,
    removeArtist,
    addTicketCategory,
    deleteConcert,
};