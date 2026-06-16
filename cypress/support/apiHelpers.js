export const createToken = () => {
    return cy.request({
      method: 'POST',
      url: '/auth',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: 'admin',
        password: 'password123'
      }
    });
  };
  
  export const createBooking = (bookingPayload) => {
    return cy.request({
      method: 'POST',
      url: '/booking',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: bookingPayload
    });
  };
  
  export const deleteBooking = (bookingId, token) => {
    return cy.request({
      method: 'DELETE',
      url: `/booking/${bookingId}`,
      headers: {
        Cookie: `token=${token}`
      },
      failOnStatusCode: false
    });
  };