# Bug Reports

## BUG-001: Booking is created when checkin date format is invalid

### Severity

Medium

### Priority

Medium

### Environment

* Application: Restful Booker public API
* API version: 1.0.0
* Environment: Public shared test environment
* Endpoint: `POST /booking`
* API documentation: https://restful-booker.herokuapp.com/apidoc/index.html

### Preconditions

* Restful Booker API is available.
* Booking creation endpoint is accessible.
* Authentication token is not required for `POST /booking`.

### Steps to reproduce

1. Send a `POST` request to `/booking`.
2. Set request headers:

   * `Content-Type: application/json`
   * `Accept: application/json`
3. In the request body, use an invalid value for the `checkin` date field.
4. Keep the rest of the booking data valid.
5. Send the request.

Request body:

```json
{
  "firstname": "Invalid",
  "lastname": "Date",
  "totalprice": 100,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "not-a-date",
    "checkout": "2026-07-05"
  },
  "additionalneeds": "Breakfast"
}
```


### Actual result

The API returns a successful response and creates a booking.

Actual status code:

```text
200 OK
```

The response contains a `bookingid`, which means the booking was created.

The returned `checkin` value is converted into an invalid date value:

```text
0NaN-aN-aN
```

### Expected result

The API should reject the request because `not-a-date` is not a valid date value.

Expected status code:

```text
400 Bad Request
```

The booking should not be created.

### Evidence

The issue is reproducible with the request body provided above.

Observed response:

```text
Status: 200 OK
bookingid: returned
checkin: 0NaN-aN-aN
```

The same behaviour is also covered by the automated test:

```text
booking-delete-negative.cy.js
should reject booking creation with invalid checkin date format
```
