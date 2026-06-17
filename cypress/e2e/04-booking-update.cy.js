import { createBooking, createToken, deleteBooking } from '../support/apiHelpers';

describe('Booking Update API', () => {
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

  it('should fully update an existing booking with valid token', () => {
    createBooking(bookingData.validBooking).then((createResponse) => {
      const bookingId = createResponse.body.bookingid;
      createdBookingIds.push(bookingId);

      cy.request({
        method: 'PUT',
        url: `/booking/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Cookie: `token=${token}`
        },
        body: bookingData.updatedBooking
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.firstname).to.eq(bookingData.updatedBooking.firstname);
        expect(updateResponse.body.lastname).to.eq(bookingData.updatedBooking.lastname);
        expect(updateResponse.body.totalprice).to.eq(bookingData.updatedBooking.totalprice);
        expect(updateResponse.body.depositpaid).to.eq(bookingData.updatedBooking.depositpaid);
        expect(updateResponse.body.bookingdates.checkin).to.eq(bookingData.updatedBooking.bookingdates.checkin);
        expect(updateResponse.body.bookingdates.checkout).to.eq(bookingData.updatedBooking.bookingdates.checkout);
        expect(updateResponse.body.additionalneeds).to.eq(bookingData.updatedBooking.additionalneeds);
      });
    });
  });

  it('should partially update selected booking fields with valid token', () => {
    createBooking(bookingData.validBooking).then((createResponse) => {
      const bookingId = createResponse.body.bookingid;
      createdBookingIds.push(bookingId);

      cy.request({
        method: 'PATCH',
        url: `/booking/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Cookie: `token=${token}`
        },
        body: bookingData.partialUpdate
      }).then((patchResponse) => {
        expect(patchResponse.status).to.eq(200);
        expect(patchResponse.body.firstname).to.eq(bookingData.partialUpdate.firstname);
        expect(patchResponse.body.additionalneeds).to.eq(bookingData.partialUpdate.additionalneeds);

        expect(patchResponse.body.lastname).to.eq(bookingData.validBooking.lastname);
        expect(patchResponse.body.totalprice).to.eq(bookingData.validBooking.totalprice);
        expect(patchResponse.body.depositpaid).to.eq(bookingData.validBooking.depositpaid);
        expect(patchResponse.body.bookingdates.checkin).to.eq(bookingData.validBooking.bookingdates.checkin);
        expect(patchResponse.body.bookingdates.checkout).to.eq(bookingData.validBooking.bookingdates.checkout);
      });
    });
  });
});

