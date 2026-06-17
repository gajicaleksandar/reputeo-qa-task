# Test Cases

This document lists the automated test scenarios implemented for the Restful Booker API task.

The suite contains 12 test scenarios. The focus is on the main API flows, positive and negative coverage, and one validation scenario that demonstrates a defect found during testing.

## Test case list

| ID     | Area               | Type              | Test case                                                 | Expected result                                                                                                       | Spec file                       |
| ------ | ------------------ | ----------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| TC-001 | Health             | Positive          | Verify that the API health endpoint is available          | API returns the expected health check status                                                                          | `health-auth.cy.js`             |
| TC-002 | Authentication     | Positive          | Create auth token with valid username and password        | API returns successful response with auth token                                                                       | `health-auth.cy.js`             |
| TC-003 | Authentication     | Negative          | Try to create auth token with invalid password            | API returns bad credentials response                                                                                  | `health-auth.cy.js`             |
| TC-004 | Booking search     | Positive          | Get list of booking IDs                                   | API returns an array of booking ID objects                                                                            | `booking-search.cy.js`          |
| TC-005 | Booking search     | Positive          | Search booking by firstname and lastname                  | Created booking is returned in filtered search results                                                                | `booking-search.cy.js`          |
| TC-006 | Booking search     | Positive          | Search booking by checkin and checkout date range         | API returns booking ID objects for the selected date filter                                                           | `booking-search.cy.js`          |
| TC-007 | Booking create     | Positive          | Create booking with valid data                            | Booking is created and response contains matching booking data                                                        | `booking-create-read.cy.js`     |
| TC-008 | Booking read       | Positive          | Retrieve newly created booking by ID                      | API returns created booking data for the provided ID                                                                  | `booking-create-read.cy.js`     |
| TC-009 | Booking update     | Positive          | Fully update existing booking with valid token            | All booking fields are updated using PUT                                                                              | `booking-update.cy.js`          |
| TC-010 | Booking update     | Positive          | Partially update selected booking fields with valid token | Selected fields are updated using PATCH and other fields remain unchanged                                             | `booking-update.cy.js`          |
| TC-011 | Booking delete     | Positive          | Delete existing booking with valid token                  | Booking is deleted and cannot be retrieved afterwards                                                                 | `booking-delete-negative.cy.js` |
| TC-012 | Booking validation | Negative / Defect | Create booking with invalid checkin date format           | API should reject the request with validation error. Current API returns `200 OK`, so this test demonstrates a defect | `booking-delete-negative.cy.js` |

## Notes

Some tests create their own booking data before performing search, read, update or delete actions. This makes the suite more reliable because Restful Booker is a shared public API and existing data can change or be reset.

Where test data is created during the test, cleanup is performed where needed.

TC-012 is intentionally kept as a failing test because it represents the expected API behaviour and documents the validation defect.
