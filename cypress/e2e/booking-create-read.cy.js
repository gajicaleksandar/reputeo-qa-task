import { createBooking, createToken, deleteBooking } from '../support/apiHelpers';

describe('Booking Create and Read API', () => {
  let bookingData;
  let token;
  const createdBookingIds = [];

  before(() => {
    cy.fixture('bookingData').then((data) => {
      bookingData = data;
    });

    createToken().then((response) => {
      token = response.body.token;
    });
  });

  after(() => {
    createdBookingIds.forEach((bookingId) => {
      deleteBooking(bookingId, token);
    });
  });

  it('should create a booking with valid data', () => {
    createBooking(bookingData.validBooking).then((response) => {
      const bookingId = response.body.bookingid;
      createdBookingIds.push(bookingId);

      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('bookingid');
      expect(response.body.bookingid).to.be.a('number');

      expect(response.body).to.have.property('booking');
      expect(response.body.booking.firstname).to.eq(bookingData.validBooking.firstname);
      expect(response.body.booking.lastname).to.eq(bookingData.validBooking.lastname);
      expect(response.body.booking.totalprice).to.eq(bookingData.validBooking.totalprice);
      expect(response.body.booking.depositpaid).to.eq(bookingData.validBooking.depositpaid);
      expect(response.body.booking.bookingdates.checkin).to.eq(bookingData.validBooking.bookingdates.checkin);
      expect(response.body.booking.bookingdates.checkout).to.eq(bookingData.validBooking.bookingdates.checkout);
      expect(response.body.booking.additionalneeds).to.eq(bookingData.validBooking.additionalneeds);
    });
  });

  it('should retrieve a newly created booking by ID', () => {
    createBooking(bookingData.validBooking).then((createResponse) => {
      const bookingId = createResponse.body.bookingid;
      createdBookingIds.push(bookingId);

      cy.request({
        method: 'GET',
        url: `/booking/${bookingId}`,
        headers: {
          Accept: 'application/json'
        }
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.firstname).to.eq(bookingData.validBooking.firstname);
        expect(getResponse.body.lastname).to.eq(bookingData.validBooking.lastname);
        expect(getResponse.body.totalprice).to.eq(bookingData.validBooking.totalprice);
        expect(getResponse.body.depositpaid).to.eq(bookingData.validBooking.depositpaid);
        expect(getResponse.body.bookingdates.checkin).to.eq(bookingData.validBooking.bookingdates.checkin);
        expect(getResponse.body.bookingdates.checkout).to.eq(bookingData.validBooking.bookingdates.checkout);
        expect(getResponse.body.additionalneeds).to.eq(bookingData.validBooking.additionalneeds);
      });
    });
  });
});