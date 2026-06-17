import { createBooking, createToken } from '../support/apiHelpers';

describe('Booking Delete and Defect Scenarios API', () => {
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

  it('should delete an existing booking with valid token', () => {
    createBooking(bookingData.validBooking).then((createResponse) => {
      const bookingId = createResponse.body.bookingid;

      cy.request({
        method: 'DELETE',
        url: `/booking/${bookingId}`,
        headers: {
          Cookie: `token=${token}`
        }
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(201);
      });

      cy.request({
        method: 'GET',
        url: `/booking/${bookingId}`,
        failOnStatusCode: false
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(404);
      });
    });
  });

  it('should reject booking creation with invalid checkin date format', () => {
    cy.request({
      method: 'POST',
      url: '/booking',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: bookingData.invalidDateBooking,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});




