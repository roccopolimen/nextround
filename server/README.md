# NextRound: Server

## Routes

### GET

#### /cycle

provides all the information about the current users current cycle

#### /cycle/:cycleId

provides all the information about the current users cycle with given `cycleId`

#### /application/:applicationId

provides all the information about the current user's application from the current cycle with given `applicationId`

#### /application/:cycleId/:applicationId

provides all the information about the current user's application from the cycle  with given `cycleId` with given `applicationId`

### POST

#### /signin

handle storing a session cookie and working with firebase auth as an admin

#### /signup

might be the same as login depending on how firebase works? We'll see when we start coding it

#### /logout

telling firebase you are logging out and to remove authtoken from request headers

#### /cycle

makes a new cycle for the current user

#### /application

make a new application in the current cycle for the current user

#### /application/event/:applicationId

add a new event to the application

#### /application/event/:applicationId

adds a new event to the application in the current cycle

#### /application/contact/:applicationId

adds a new contact to the application in the current cycle

### PATCH

#### /settings

send Changes to the Settings for the current user

#### /application/:applicationId

change basic details of the application

#### /application/event/:applicationId/:eventId

change the event from the current cycle's specified application

#### /application/contact/:applicationId/:contactId

change the contact from the current cycle's specified application.

### DELETE

#### /application/:applicationId

Delete a job application from your cycle

#### /user

Deletes the user and all of their information (do we even want this?)

#### /application/event/:applicationId/:eventId

Deletes the event from the current cycle's specified application

#### /application/contact/:applicationId/:contactId

deletes the contact from the current cycle's specified application.