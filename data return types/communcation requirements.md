
# Profile Interface

## Creating a User

* Front end will send the following information via POST in the following format:

```
body: {
  email: <email@email.com>
  password: <password as plain text (minimum 8 characters)>
  name: <user's name (not to exceed 25 characters, but > 1 character)>
  bio: <user's bio (not to exceed 150 characters)>
  username: <username (not to exceed 15 characters)>
}
```

**Note:** Images will be uploaded somehow. As of yet this is undetermined

### Server response

* **Successful creation:** A header 'username' will be set with the username returned from the creation and the following cookies will be set:```
cookies: { 
  uid : <some arbitary hash value>
  loggedIn: true
}```

* **Creation Failed due to user existing:** a header 'error' will be set and 406 will be returned ex
  error: 'user exists'

* **Creation Failed due to invalid data input:** a header 'error' will be set with the invalid input and status 406 will be returned

## Logging out

* Front end will `GET /logout`
* This will delete the user session and browser cookies, and will redirect to the root page

## Logging In

1. Client will `GET /login` 
2. Server will verify that user is not logged in already
    * If user is logged in already, redirect to timeline
3. User will input information into login fields
4. Client will send username or email and password in the following format:
`POST /login`
```
body: {
  [username: <username>] or [email: <email@email.com>]
  password: <password>
}
```
5. Server will compare input and return
* __Under error conditions server will set status "401" and send "Unauthorized"
  * __If username is invalid:__ server will set header 'error' with message 'Username invalid
  * __If password is invalid:__ server will set header 'error' with message 'Incorrect Password'
  * __If, for whatever reason, the login time could not be updated:__ server will set header 'error' with message 'Login time could not be updated'

* __Successful login:__ a cookie `loggedIn` will be set true and `uid` cookie will be set with the hash of the user's username, and a header `username: <username>` will be set.

## Getting a user's profile

1. Client will `POST /api/user/` with the username as a URL parameter ex `username=steve`
    * If an error occurs, an 'error' header will be set and 406 will be returned
3. Server will reply with JSON of user's information


## Updating a profile

1. Client will `POST /api/update/:username` with the username as a URL parameter ex `username=steve` and the following fields in the body of the html request:
```
body: {
  [password: <password>] // ONLY IF UPDATING PASSWORD
  bio: <bio (not to exceed 150 characters)>
  name: <name (not to exceed 25 characters)>
  interests: <current interests plus any new ones (interest names not to exceed 19 characters)>
  accessibility_features: <any accessibility features that front end will decide the names and values of>
  //TODO PROFILE PIC
}
```

2. Server will check that user is logged in
3. Assuming user is logged in, server will respond in the following ways:
  * __Errors:__ If an error occurs, header 'error' will be set with some arbitrary error message
  * __Success:__ If the updating is successful, header 'username' will be set with the username of the person updated

## Deleting an account

1. Client will `POST /api/delete/` with the following parameters in the body:
```
body: {
  username: <username>
  email: <email>
  password: <password>
}
```
  __NOTE: All 3 fields are required.__
* If user is not logged in, Server will redirect to home page
* if there was a problem with deletion, header 'error' will be set with message 'deletion failed' and 406 will be returned
2. Server will delete client cookie and local session and redirect to `/`


# Follow Interface
## **TODO:** Figure out how the frick to do updates for new posts when not following that topic.

## Following A User

## Following A User:Topic

## Unfollowing A user

## Unfollowing A User:Topic


# Spins Interface

## Getting a single user's spins
 1. Client will `POST /api/posts/` with the username as a URL parameter ex `username=steve`
    * if the user is not found an 'error' header will be set with message 'user not found' and 404 will be returned
    * if there are no spins from the user header 'alert' will be set with message 'no spins found :('
 2. Server will respond with JSON of all posts made by the user in chronological order

## Getting a user's timeline

1. Client will `POST /api/timeline/` with the username as a URL parameter ex `username=steve`
    * if the user is not found an 'error' header will be set with message 'user not found' and 404 will be returned
    * if there are no spins from the user or any of the users they follow header 'alert' will be set with message 'no spins found :('

2. Server will return JSON of all spins in chronological order

## Adding a Spin

__Note__ This functionality requires integration testing with client
1. Client will `POST /api/add_spin` with the following parameters in the body:
  ```
  body: {
    spinBody: [some arbitary text here. <= 90 characters in length],
    tags: [list of tags i.e. ['tag1', 'tag2']],
    is_quote: [boolean. True if quoted, false if not],
    quote_origin: [username: post_id (front end will have a list of the post IDs available to it so this is possible)]
  }; 
  ```

2. Server will validate user session
3. server will attempt to add the post to the user's post table.
    * __Error:__ If the post was not able to be added, the server will set response header `error: unable to add spin` and will return status `418: I'm a teapot`
    * __Error:__ If the post does not fit within the length bounds of 1 <= length <= 90, server will set response header `error: ` with some arbitrary error message which I don't know and will return status `418: I'm a teapot`
    * __Error:__ If the post is a quote, but no quote origin is specified, server will set response header `error: no quote origin specified` and will return status `418: I'm a teapot`
    * __Success:__ If the post was successfully added, the server will set response header `spinId: [id]` and will send the index file.

##Deleting a Spin
__NOTE:__ This functionality has not been implemented yet.
__NOTE:__ Only 1 post may be deleted at a time. No plans to implement bulk removal.
1. Client will `POST /api/deleteSpin/` with the `spinId` being a URL parameter.
2. Server will validate the user session. 
3. If the user session is valid, the username will be gathered from the `clientSession.uid` cookie in the request object. 
4. Server will attempt to remove the post from the user's post table
    * __Errors:__ If an error occurs, server will set response header `error: unable to delete spin` and return `418: I'm a teapot`
    * __Success:__ if the post is added successfully, server will set response header `spinId: [id]` and return the index.


