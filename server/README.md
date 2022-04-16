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

#### /posts/:pageNum

provides the list of posts (max N at a time) to be displayed. Ordered by most recent

#### /metrics

provides the metrics data for the current cycle

#### /metrics/:cycleId

provides the metrics data for the cycle with given `cycleId`

### POST

#### /users/signIn

handle storing a session cookie and working with firebase auth as an admin

#### /users/signUp

might be the same as login depending on how firebase works? We'll see when we start coding it

#### /users/signOut

telling firebase you are logging out and to remove authtoken from request headers

#### /cycles

makes a new cycle for the current user

#### /cycles/finish

finish the current cycle

#### /application

make a new application in the current cycle for the current user

#### /application/event/:applicationId

adds a new event to the application in the current cycle

#### /application/contact/:applicationId

adds a new contact to the application in the current cycle

#### /posts

Create a post to be added to the list of posts for the current user and their current cycle analytics.

### PATCH

#### /users/settings

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

#### /users

Deletes the user and all of their information

#### /application/event/:applicationId/:eventId

Deletes the event from the current cycle's specified application

#### /application/contact/:applicationId/:contactId

deletes the contact from the current cycle's specified application.
