describe('Health and Auth API', () => {
    it('should confirm that the API is up and running', () => {
      cy.request({
        method: 'GET',
        url: '/ping'
      }).then((response) => {
        expect(response.status).to.eq(201);
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
  
    it('should not create a valid token with invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          username: 'admin',
          password: 'wrong-password'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('reason');
        expect(response.body.reason).to.eq('Bad credentials');
      });
    });
  });