describe('Restful Booker API - Smoke and Auth', () => {
    it('should confirm that the API is up and running', () => {
      cy.request({
        method: 'GET',
        url: '/ping'
      }).then((response) => {
        expect(response.status).to.eq(201);
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
  
    it('should create an auth token with valid credentials', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          username: 'admin',
          password: 'password123'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        expect(response.body.token).to.be.a('string');
        expect(response.body.token.length).to.be.greaterThan(0);
      });
    });
});