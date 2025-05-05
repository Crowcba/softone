# PromocaoQr API Documentation

This document provides information about the PromocaoQr API endpoints.

## Base URL

```
/api/PromocaoQr
```

## Endpoints

### Get All Promotions

Retrieves a list of all QR code promotions.

- **URL:** `/api/PromocaoQr`
- **Method:** `GET`
- **Response Codes:**
  - `200 OK`: Successfully retrieved the list of promotions
- **Response Body Example:**
  ```json
  [
    {
      "id": 1,
      "promotor": "Promotor 1",
      "codigo": "QR001"
    },
    {
      "id": 2,
      "promotor": "Promotor 2",
      "codigo": "QR002"
    }
  ]
  ```

### Get Promotion by ID

Retrieves a specific QR code promotion by its ID.

- **URL:** `/api/PromocaoQr/{id}`
- **Method:** `GET`
- **URL Parameters:** 
  - `id`: The ID of the promotion to retrieve
- **Response Codes:**
  - `200 OK`: Successfully retrieved the promotion
  - `404 Not Found`: Promotion with the specified ID was not found
- **Response Body Example:**
  ```json
  {
    "id": 1,
    "promotor": "Promotor 1",
    "codigo": "QR001"
  }
  ```

### Create Promotion

Creates a new QR code promotion.

- **URL:** `/api/PromocaoQr`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "id": 0,
    "promotor": "New Promotor",
    "codigo": "QRNEW"
  }
  ```
- **Response Codes:**
  - `201 Created`: Successfully created the promotion
  - `400 Bad Request`: Invalid promotion data
- **Response Headers:**
  - `Location`: URL to the newly created resource
- **Response Body Example:**
  ```json
  {
    "id": 3,
    "promotor": "New Promotor",
    "codigo": "QRNEW"
  }
  ```

### Update Promotion

Updates an existing QR code promotion.

- **URL:** `/api/PromocaoQr/{id}`
- **Method:** `PUT`
- **URL Parameters:**
  - `id`: The ID of the promotion to update
- **Request Body:**
  ```json
  {
    "id": 1,
    "promotor": "Updated Promotor",
    "codigo": "QRUPD"
  }
  ```
- **Response Codes:**
  - `204 No Content`: Successfully updated the promotion
  - `400 Bad Request`: ID in URL doesn't match ID in request body
  - `404 Not Found`: Promotion with the specified ID was not found
- **Response Body:** None

### Delete Promotion

Deletes a specific QR code promotion.

- **URL:** `/api/PromocaoQr/{id}`
- **Method:** `DELETE`
- **URL Parameters:**
  - `id`: The ID of the promotion to delete
- **Response Codes:**
  - `204 No Content`: Successfully deleted the promotion
  - `404 Not Found`: Promotion with the specified ID was not found
- **Response Body:** None

## Data Model

The PromocaoQr entity has the following properties:

| Property  | Type   | Description                         | Constraints        |
|-----------|--------|-------------------------------------|-------------------|
| Id        | int    | Unique identifier for the promotion | Primary Key       |
| Promotor  | string | Name of the promoter                | Required, Max: 50 |
| Codigo    | string | QR code identifier                  | Required, Max: 50 |