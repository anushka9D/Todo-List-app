// Tests for user authentication functionality

describe('Authentication Tests', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      cy.clearLocalStorage();
      cy.visit('/');
    });
  
    it('should navigate to login page when not authenticated', () => {
      // User should be redirected to login when accessing dashboard without auth
      cy.url().should('include', '/login');
    });
  
    it('should register a new user successfully', () => {
      // Generate a unique email to avoid duplicate registration errors
      const uniqueEmail = `user${Date.now()}@example.com`;
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.newUser;
        testUser.email = uniqueEmail;
        
        // Register the new user
        cy.visit('/register');
        cy.get('[data-testid=name-input]').type(testUser.name);
        cy.get('[data-testid=email-input]').type(testUser.email);
        cy.get('[data-testid=password-input]').type(testUser.password);
        cy.get('[data-testid=confirm-password-input]').type(testUser.password);
        cy.get('[data-testid=register-submit]').click();
        
        // Verify registration was successful by checking for redirect to dashboard
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.contains(`Welcome ${testUser.name}`);
      });
    });
  
    it('should login with valid credentials', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Try to register the user first (in case it doesn't exist)
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/users`,
          body: testUser,
          failOnStatusCode: false // Don't fail if user already exists
        });
        
        // Login with valid credentials
        cy.visit('/login');
        cy.get('[data-testid=email-input]').type(testUser.email);
        cy.get('[data-testid=password-input]').type(testUser.password);
        cy.get('[data-testid=login-submit]').click();
        
        // Verify login was successful
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.contains('Welcome');
      });
    });
  
    it('should fail login with invalid credentials', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const invalidUser = users.invalidUser;
        
        // Try to login with invalid credentials
        cy.visit('/login');
        cy.get('[data-testid=email-input]').type(invalidUser.email);
        cy.get('[data-testid=password-input]').type(invalidUser.password);
        cy.get('[data-testid=login-submit]').click();
        
        // Verify login failed
        cy.url().should('include', '/login');
      });
    });
  
    it('should logout successfully', () => {
      cy.fixture('../../fixtures/users').then((users) => {
        const testUser = users.validUser;
        
        // Login first
        cy.login(testUser.email, testUser.password);
        
        // Logout
        cy.get('[data-testid=logout-button]').click();
        
        // Verify logout was successful
        cy.url().should('include', '/login');
      });
    });
  });