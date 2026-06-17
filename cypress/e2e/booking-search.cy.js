import { createBooking, createToken, deleteBooking } from '../support/apiHelpers';

describe('Booking Search API', () => {
  let bookingData;
  let token;

  before(() => {
    cy.fixture('bookingData').then((data) => {
      bookingData = data;
    });

    createToken().then((response) => {
      token = response.body.token;
    });
  });

  it('should return a list of booking IDs', () => {
    cy.request({
      method: 'GET',
      url: '/booking'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');

      if (response.body.length > 0) {
        expect(response.body[0]).to.have.property('bookingid');
        expect(response.body[0].bookingid).to.be.a('number');
      }
    });
  });

  it('should return created booking when filtering by firstname and lastname', () => {
    createBooking(bookingData.validBooking).then((createResponse) => {
      const bookingId = createResponse.body.bookingid;

      cy.request({
        method: 'GET',
        url: `/booking?firstname=${bookingData.validBooking.firstname}&lastname=${bookingData.validBooking.lastname}`
      }).then((searchResponse) => {
        expect(searchResponse.status).to.eq(200);
        expect(searchResponse.body).to.be.an('array');

        const createdBooking = searchResponse.body.find((booking) => booking.bookingid === bookingId);
        expect(createdBooking).to.not.be.undefined;
      });

      deleteBooking(bookingId, token);
    });
  });

  it('should return booking IDs when filtering by checkin and checkout dates', () => {
    cy.request({
      method: 'GET',
      url: '/booking?checkin=2026-01-01&checkout=2026-12-31'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');

      response.body.forEach((booking) => {
        expect(booking).to.have.property('bookingid');
        expect(booking.bookingid).to.be.a('number');
      });
    });
  });
});



