# Restful Booker API QA Task

This repository contains automated API tests for the Restful Booker public API.

API documentation:
https://restful-booker.herokuapp.com/apidoc/index.html

The goal of this task was to create a focused API test suite, cover the main booking flows, document the approach, and report defects found during testing.

Restful Booker is a shared public test API, so I tried not to depend on fixed existing data. For the important flows, tests create their own booking data and clean it up where needed.

## Tech stack

* Cypress
* JavaScript
* Mochawesome reporter
* Node.js / npm

## Setup

Install dependencies:

```bash
npm install
```

The project was created and tested with:

```text
Node.js: v22.12.0
npm: 10.9.0
Cypress: 15.17.0
```

## Running tests

Run the full test suite:

```bash
npm run cy:run
```

or:

```bash
npm test
```

Open Cypress UI:

```bash
npm run cy:open
```

Run one spec file:

```bash
npx cypress run --spec "cypress/e2e/booking-search.cy.js"
```

## Current expected result

The suite currently contains one known failing test.

Current result:

```text
12 tests total
11 passing
1 failing
```

The failing test is intentional. It shows a validation defect found during testing:

```text
booking-delete-negative.cy.js
should reject booking creation with invalid checkin date format
```

For invalid `checkin` date format, I expect the API to return a validation error, for example `400 Bad Request`.

Actual behaviour is different: the API returns `200 OK` and creates the booking.

I kept this test failing because it represents the expected behaviour of the system. If the test was changed to expect `200 OK`, the automation would hide the bug instead of showing it.

The defect is documented in:

```text
docs/bug-reports.md
```

## Project structure

```text
cypress/
  e2e/
    health-auth.cy.js
    booking-search.cy.js
    booking-create-read.cy.js
    booking-update.cy.js
    booking-delete-negative.cy.js

  fixtures/
    bookingData.json

  support/
    apiHelpers.js

docs/
  test-cases.md
  bug-reports.md
```

## Test strategy

I focused on the main API flows and the highest value checks for this task:

* API health check
* authentication
* booking search and filters
* booking creation
* reading booking by ID
* full booking update
* partial booking update
* booking deletion
* one negative validation scenario that demonstrates a defect

The task asked for 6-12 automated scenarios, so I kept the suite at 12 tests. I did not try to cover every possible field validation combination because that would make the task bigger than needed.

The main idea was to cover the most important CRUD behaviour, include both positive and negative scenarios, and keep the suite readable enough for review.

## Covered areas

### Health and auth

Covered:

* `GET /ping`
* `POST /auth` with valid credentials
* `POST /auth` with invalid credentials

These tests confirm that the API is available and that authentication behaves as expected.

### Booking search

Covered:

* `GET /booking`
* `GET /booking?firstname&lastname`
* `GET /booking?checkin&checkout`

For the firstname/lastname filter, the test first creates a booking and then searches for it. This is more reliable than depending on existing public data.

### Booking create and read

Covered:

* `POST /booking`
* `GET /booking/:id`

The tests verify the response status and compare returned booking data with the test payload.

### Booking update

Covered:

* `PUT /booking/:id`
* `PATCH /booking/:id`

For PATCH, the test checks both changed fields and fields that should remain unchanged.

### Booking delete and negative validation

Covered:

* `DELETE /booking/:id`
* `POST /booking` with invalid `checkin` date format

The invalid date test currently fails and demonstrates a real defect.

## What I left out

I did not automate every possible negative or edge case, such as:

* missing firstname
* missing lastname
* missing totalprice
* invalid totalprice type
* negative totalprice
* zero totalprice
* depositpaid sent as string instead of boolean
* missing bookingdates object
* missing checkin or checkout date
* checkout date before checkin date
* invalid date format for checkout
* very long firstname or lastname
* special characters in firstname or lastname
* empty request body
* unsupported HTTP methods
* invalid booking IDs for every endpoint
* update or delete with missing token
* update or delete with invalid token
* XML response format checks

I left these out because the task asks for a focused 6-12 scenario suite. In a real project, I would add more validation and edge case tests after confirming expected API rules with the team.

## Why Cypress

I chose Cypress because it is simple and effective for this task:

* `cy.request()` works well for direct API testing
* setup is quick
* tests are readable
* JavaScript keeps the project lightweight
* Mochawesome reports are easy to generate
* it gives enough structure without building a heavy framework

I also considered Pytest, Playwright and TestNG.

Pytest would be a good option for API testing, especially for a Python-based test stack. I chose Cypress here because the setup was quick and the final tests are easy to read.

Playwright can also be used for API testing. For this task, I did not need its browser automation strengths, so Cypress felt simpler for the scope.

Java with TestNG was also an option, especially because I have used it before. For API testing it would work well with RestAssured or a similar HTTP client. I chose Cypress here because the task is small, setup is lighter, and the tests stay easy to read without adding a larger Java project structure.

## Implemented test cases

| Spec file                       | Test case                                                              | Short description                                                  |
| ------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `health-auth.cy.js`             | should confirm that the API is up and running                          | Checks `GET /ping`.                                                |
| `health-auth.cy.js`             | should create an auth token with valid credentials                     | Checks valid auth token creation.                                  |
| `health-auth.cy.js`             | should not create a valid token with invalid credentials               | Checks invalid login response.                                     |
| `booking-search.cy.js`          | should return a list of booking IDs                                    | Checks `GET /booking` response structure.                          |
| `booking-search.cy.js`          | should return created booking when filtering by firstname and lastname | Creates booking, filters by name, verifies created ID is returned. |
| `booking-search.cy.js`          | should return booking IDs when filtering by checkin and checkout dates | Checks date filter response structure.                             |
| `booking-create-read.cy.js`     | should create a booking with valid data                                | Creates booking and checks returned data.                          |
| `booking-create-read.cy.js`     | should retrieve a newly created booking by ID                          | Creates booking, reads it by ID, compares data.                    |
| `booking-update.cy.js`          | should fully update an existing booking with valid token               | Checks full update using PUT.                                      |
| `booking-update.cy.js`          | should partially update selected booking fields with valid token       | Checks partial update using PATCH.                                 |
| `booking-delete-negative.cy.js` | should delete an existing booking with valid token                     | Creates, deletes and verifies booking is no longer available.      |
| `booking-delete-negative.cy.js` | should reject booking creation with invalid checkin date format        | Known failing test. Demonstrates validation defect.                |

## Helpers and test data

Reusable API actions are in:

```text
cypress/support/apiHelpers.js
```

Current helper functions:

```text
createToken()
createBooking()
deleteBooking()
```

Test payloads are in:

```text
cypress/fixtures/bookingData.json
```

## Reports

Mochawesome is configured as the test reporter.

To generate a fresh HTML report, run:

```bash
npm run test:report
```

The final HTML report is generated here:

```text
cypress/reports/index.html
```

The report command cleans old report files, runs the Cypress suite, merges Mochawesome JSON files, and generates a single HTML report.

The suite currently contains one known failing test that demonstrates a documented API defect, so the report is expected to show 11 passing tests and 1 failing test.

Reports and screenshots are generated files and are not intended to be committed.

## CI

GitHub Actions workflow is configured in:

```text
.github/workflows/api-tests.yml
```

The workflow runs on:

```text
push to main
pull request to main
daily scheduled run
manual workflow dispatch
```

It installs dependencies, runs the Cypress API suite, generates the Mochawesome HTML report, and uploads the report as a GitHub Actions artifact.

Because the suite contains one known failing test that demonstrates a documented API defect, the workflow uses the report command so the HTML report is still generated and uploaded.
