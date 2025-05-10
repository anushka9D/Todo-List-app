// Tests for API endpoints

describe('API Endpoint Tests', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Register test user if doesn't exist
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/users`,
          body: testUser,
          failOnStatusCode: false
        });
      });
    });
  
    it('should register a new user via API', () => {
      const uniqueEmail = `apitest${Date.now()}@example.com`;
      
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/users`,
        body: {
          name: 'API Test User',
          email: uniqueEmail,
          password: '123456'
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('email', uniqueEmail);
      });
    });
  
    it('should login a user via API', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/users/login`,
          body: {
            email: testUser.email,
            password: testUser.password
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('token');
          expect(response.body).to.have.property('email', testUser.email);
        });
      });
    });
  
    it('should create a todo via API', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Login to get token
        cy.apiLogin(testUser.email, testUser.password).then((loginResponse) => {
          const token = loginResponse.body.token;
          const todoText = 'API created todo ' + Date.now();
          
          // Create todo via API
          cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/todos`,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: {
              text: todoText
            }
          }).then((todoResponse) => {
            expect(todoResponse.status).to.eq(201);
            expect(todoResponse.body).to.have.property('text', todoText);
            expect(todoResponse.body).to.have.property('_id');
            expect(todoResponse.body).to.have.property('user');
          });
        });
      });
    });
  
    it('should return correct response for invalid API requests', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Login to get token
        cy.apiLogin(testUser.email, testUser.password).then((loginResponse) => {
          const token = loginResponse.body.token;
          
          // Test with invalid ID
          cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/todos/invalidid123`,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.not.eq(200);
          });
        });
      });
    });
  
    it('should get a list of todos via API', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Login to get token
        cy.apiLogin(testUser.email, testUser.password).then((loginResponse) => {
          const token = loginResponse.body.token;
          
          // Get todos list
          cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/todos`,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
          });
        });
      });
    });
  });