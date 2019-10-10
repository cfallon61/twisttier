##Creating a User

###Front end will send the following information via POST in the following format:

```body: {
  email: <email@email.com>
  password: <password as plain text (minimum 8 characters)>
  name: <user's name (not to exceed 25 characters, but > 1 character)>
  bio: <user's bio (not to exceed 150 characters)>
  username: <username (not to exceed 15 characters)>
}```

**Images will be uploaded somehow. As of yet this is undetermined**

### Server response

**Successful creation:** A header 'username' will be set with the username returned from the creation and the following cookies will be set:```
cookies: { 
  uid : <some arbitary hash value>
  loggedIn: true
}```

**Creation Failed due to user existing:** a header 'error' will be set and 406 will be returned ex
  error: 'user exists'

**Creation Failed due to invalid data input:** a header 'error' will be set with the invalid input and status 406 will be returned

##Logging out

###Front end will GET /logout
This will delete the user session and browser cookies, and will redirect to the root page

##Logging In

1. Client will `GET /login` 
2. Server will verify that user is not logged in already
  * If user is logged in already, redirect to timeline
3. User will input information into login fields
4. Client will send username or email and password in the following format:
`POST /login`
```body: {
  [username: <username>] or [email: <email@email.com>]
  password: <password>
}```
5. Server will compare input and return
* __Under error conditions server will set status "401" and send "Unauthorized"
  * __If username is invalid:__ server will set header 'error' with message 'Username invalid
  * __If password is invalid:__ server will set header 'error' with message 'Incorrect Password'
  * __If, for whatever reason, the login time could not be updated:__ server will set header 'error' with message 'Login time could not be updated'

* __Successful login:__ a cookie `loggedIn` will be set true and `uid` cookie will be set with the hash of the user's username

##Getting a user's profile

1. Client will `POST /api/user/` with the username as a URL parameter ex `username=steve`
  * If an error occurs, an 'error' header will be set and 406 will be returned
3. Server will reply with JSON of user's information

##Getting a user's timeline

1. Client will `POST /api/timeline/` with the username as a URL parameter ex `username=steve`
  * if the user is not found an 'error' header will be set with message 'user not found' and 404 will be returned
  * if there are no spins from the user or any of the users they follow header 'alert' will be set with message 'no spins found :('

2. Server will return JSON of all spins in chronological order

##Getting a single user's posts
 1. Client will `POST /api/posts/` with the username as a URL parameter ex `username=steve`
  * if the user is not found an 'error' header will be set with message 'user not found' and 404 will be returned
   * if there are no spins from the user header 'alert' will be set with message 'no spins found :('
 2. Server will respond with JSON of all posts made by the user in chronological order

##Deleting an account

1. Client will `POST /api/delete/` with the following parameters in the body:
```body: {
  username: <username>
  email: <email>
  password: <password>
}```
  __NOTE: All 3 fields are required.__
  * If user is not logged in, Server will redirect to home page
  * if there was a problem with deletion, header 'error' will be set with message 'deletion failed' and 406 will be returned
2. Server will delete client cookie and local session and redirect to `/`

##Updating a profile

1. Client will `POST /api/update/` with the username as a URL parameter ex `username=steve` and the following fields in the body of the html request:
```body: {
  [password: <password>] // ONLY IF UPDATING PASSWORD
  bio: <bio (not to exceed 150 characters)>
  name: <name (not to exceed 25 characters)>
  interests: <current interests plus any new ones (interest names not to exceed 19 characters)>
  accessibility_features: <any accessibility features that front end will decide the names and values of>
  //TODO PROFILE PIC
}```

2. Server will check that user is logged in
3. Assuming user is logged in, server will respond in the following ways:
  * __Errors:__ If an error occurs, header 'error' will be set with some arbitrary error message
  * __Success:__If the updating is successful, header 'username' will be set with the username of the person updated