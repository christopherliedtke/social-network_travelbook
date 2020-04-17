# Travelbook &ndash; A social network for travellers around the world

## Description

This social network is made for travellers around the world who want to connect and stay in touch with fellow travellers. Users can register/login(/reset password) to go to the private area of the app. On his/her 'Profile' page a user can upload a profile picture, add/edit his/her short biography in a text field and delete his/her account.

In 'Find People' the user gets displayed the most recently registered users initially (user his-/herself does not show up). It is possible to search for specific users by first or last name. The user can then either navigate to the other user's profile page or change the friend status (make request / cancel request / end friendship) directly. On the 'Other User Profile' page the user can see the profile picture, biography and a 'Make Friend Request'/'Cancel Friend Request'/'End Friendship' button. What the button shows depends on the current status between the user and the other user.

On the 'Friends' page a user can see his/her current friendships and the open friend requests initiated by the user. The user can navigate to the other users' profiles or change the friend status directly.

On the 'Chat' page the user finds an open chatroom for all users. Users who are logged in can read and write messages which will appear instantly for online user in the chatroom.

## Key Features

-   SPA with automatic rerendering without page reload
-   Register / Login / Logout / Reset Password functionality
-   Sending email through AWS SES to fetch code for password reset
-   Profile Picture - Image Upload to AWS S3 bucket
-   Add/Edit own biography text
-   Delete own account incl. all stored data (Postgre) and files (AWS S3)
-   Search for other users and show their profiles
-   Make friend request / cancel friend requests / reject friend requests / end friendship in different components
-   Indication of open friend requests in the header
-   Chatroom for all users with immediate rendering of new messages through socket.io

## Technologies

-   React.js
-   Redux
-   JavaScript
-   HTML
-   CSS
-   Socket.io
-   Node.js/Express
-   Postgre SQL
-   AWS S3, IAM, SES
-   Jest

## Demo

[Live Demo](https://travelbook-network.herokuapp.com/)
