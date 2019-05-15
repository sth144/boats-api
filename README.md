Sean Hinds
11 May, 2019
# Boats API
An API for managing the docking of boats in a marina
## URLs
Base url for all requests is
```https://hindss-assign4.appspot.com```
### boats
#### GET /boats
Returns the entire collection of boats.
##### Example request
```
GET /boats
```
##### Example response
```
(status 200 OK)
[
	{
		"id": "23847298347",
		"length: 10,
		"self": "https://hindss-assign4.appspot.com/23847298347"
		"name": "Sean's Dingy",
		"type": "Dingy"
	},
	{
		"id": "17847283944",
		"length: 20,
		"self": "https://hindss-assign4.appspot.com/17847283944"
		"name": "Sean's Sloop",
		"type": "Sloop"
	},
	...
]
```
#### GET /boats/{boat_id} (JSON response)
Returns a single boat data object as JSON.
##### Example request
```
GET /boats/19275438475
```
##### Example response
```
(status 200 OK)
{
	"id": 19275438475,
	"length": 30
	"self": "https://hindss-assign4.appspot.com/19275438475",
	"name": "Sean's Catamaran",
	"type": "Catamaran"
}
```
#### GET /boats/{boat_id}/cargo
Returns a paginated list of cargo on a boat.
##### Example response
```
(status 200 OK)
{
	items: // array of references to cargo { self: string, id: string }
	next: // link containing cursor to next page. null if end of list
}
```
#### GET /boats/{boat_id} (HTML response)
Returns a single boat data object as html
##### Example requestt
```
GET /boats/123455678
(headers): {
	"accept": "text/html"
}
```
##### Example response
```
(status 200 OK)
{
	"id": "abcd",
	"name": "fdsa",
	"type": "qwerty",
	"length: 32,
	"self": "https://hindss-assign5.appspot.com/123345567"
}
```
#### POST /boats
Creates a new boat object and returns id, or returns a 403 forbidden error if supplied name is not unique, else 201 Created.
##### Example request
```
POST /boats
(body): {
	"length": 32,
	"type": "Sunfish",
	"name": "Sean's Racing Boat"
}
```
##### Example response
```
(status 201 created)
{
	"id": 487273029384
}
```
#### DELETE /boats/{boat_id}
Delete an existing boat object. Returns 204 No Content on successful deletion, otherwise 404 Not Found.
##### Example request
```
DELETE /boats/{boat_id}
```
##### Example response
(No response body, status 204 or 404)
#### PATCH /boats/{boat_id}
Edit an existing boat object. Returns 303 with link in header if successful, otherwise 404 Not Found. Client may supply one or more properties to update. Properties not specified will remain unmodified in the datastore. ID cannot be edited, will return 403 forbidden if client attempts.
##### Example request
```
PATCH /boats/12345
(body): {
	"name": "Jim's Boat"
}
```
##### Example response
```
(status 303 redirect)
(headers): {
	"location": "https://hindss-assign5.appspot.com/12345"
}
```
#### PUT /boats/{boat_id}
Edit an existing boat object. Returns 303 with link in header if successful, otherwise 404 Not Found. Client may supply one or more properties to update. Properties not specified will remain unmodified in the datastore. ID cannot be edited, will return 403 forbidden if client attempts.
##### Example request
```
PUT /boats/12345
(body): {
	"name": "Jim's Boat"
}
```
##### Example response
```
(status 303 redirect)
(headers): {
	"location": "https://hindss-assign5.appspot.com/12345"
}
```
#### PUT /boats/{boat_id}/cargo/{cargo_id}
Put a piece of cargo on a boat. Returns code 403 if cargo is already assigned to another boat
##### Example request
```
PUT /boats/{boat_id}/cargo/{cargo_id}
```
##### Example response
```
(No response body, status 200 or 400 or 403)
```
#### DELETE /boats/{boat_id}/cargo/{cargo_id}
Remove a piece of cargo from boat. Deletes neither boat nor cargo.
##### Example request
```
DELETE /boats/{boat_id}/cargo/{cargo_id}
```
##### Example response
```
(No response body, status 204 No content or 404)
```
### slips
#### GET /slips
Get the entire slips collection.
##### Example request
```
GET /slips
```
##### Example response
```
(status 200 OK)
[
	{
		"id": "34274838",
		"number": 38,
		"current_boat": null,
		"boat_link": null,
		"arrival_date: null,
		"self": "https://hindss-boats.appspot.com/slips/34274838"
	},
	{
		"id": "47283322",
		"number": 24,
		"current_boat": "92738449"
		"boat_link": "https://hindss-boats.appspot.com/boats/92738449,
		"arrival_date": "2019-04-28",
		"self": "https://hindss-boats.appspot.com/slips/47283322" 
	},
	...
]
```
#### GET /slips/{slip_id}
Get a single slip object. Returns status 404 Not Found if boat does not exist.
##### Example request
```
GET /slips/347272983
```
##### Example response
```
(status 200 OK)
{
	"id": "347272983",
	"number": 42,
	"current_boat": "282834442",
	"boat_link": "https://hindss-boats.appspot.com/boats/282834442",a
	"arrival_date": "2019-03-28",
	"self": "https://hindss-boats.appspot.com/slips/34727283"
}
```
#### POST /slips
Create a new slip and returns id. Returns status code 403 Forbidden if number is not unique, else 201 Created.
##### Example request
```
POST /slips

(body): {
	"number": 21
}
```
##### Example response
```
(status code 201 Created)
{
	"id": "2847674322"
}
```
#### DELETE /slips/{slip_id}
Delete a slip. Returns status code 204 No Content if successful, 404 Not found otherwise.
##### Example request
```
DELETE /slips/2871910393
```
##### Example response
```
(no response body, status code 204 No Content)
```
#### PATCH /slips/{slip_id}
Edit an existing slip object. Returns 200 OK on successful edit, otherwise 404 Not Found. Client may supply one or more properties to update. Properties not specified will remain unmodified in the datastore. ID cannot be edited, will return 403 forbidden if client attempts.
##### Example request
```
PATCH /slips/392720111
(body): {
	"number": 33
}
```
##### Example response
```
(no response body, status 200 OK)
```
#### PUT /slips/{slip_id}/boats/{boat_id}
Dock a boat at a slip. Returns 200 OK on successful docking. If there is another boat occupying the slip, returns 403 Forbidden. If boat or dock does not exist, returs 404 Not Found.
##### Example request
```
PUT /slips/384728374/boats/238974622
```
##### Example response
```
(no response body, status 200 OK)
```
#### DELETE /slips/{slip_id}/boats/{boat_id}
Remove a boat from a slip. Returns 204 No Content on success. Returns 404 not found if slip or boat does not exist, of if boat is not docked at slip.
##### Example request
```
DELETE /slips/384728374/boats/238974622
```
##### Example response
```
(no response body, status 204 No Content)
```
### cargo
#### GET /cargo
Get paginated list of all cargo
##### Example request
```
GET /cargo
```
##### Example response
```
{
	items: [
		{
			self: // link
			id: // id
		},
		// ... more items
	]
	next: // link to next set of results, or null if end of list
}
```
#### GET /cargo/{cargo_id}
Get information on a particular piece of cargo
##### Example request
```
GET /cargo/1234
```
##### Example response
```
{
	weight: 1000
	content: "furbies"
	delivery_date: "2 Jan, 2018",
	id: 1234,
	self: "https://hindss-assign4.appspot.com/cargo/1234"
}
```
#### POST /cargo
Add a new cargo item to the datastore
##### Example request
```
POST /cargo
(body): {
	"weight": 32,
	"content": "fish",
	"delivery_date": "2 Jan, 2018"
}
```
##### Example response
```
(status 201 Created)
{
	id: 12345	// return cargo id
}
```
#### PATCH /cargo/{cargo_id}
Edit an existing cargo item. Returns 200 OK or 404 not found.
##### Example request
```
PATCH /cargo/1234
(body): {
	"weight": 0.33,
	"content": "dog food",
	"delivery_date": "3 Jan, 2018"
}
```
##### Example response
```
(no response body, status 200)
```
#### DELETE /cargo/{cargo_id}
Delete an existing cargo item. Returns 204 No Content or 404 Not Found.
##### Example request
```
DELETE /cargo/1234
```
##### Example response
```
(no response body, status 204)
```

