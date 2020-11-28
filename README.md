Folders:
context (React context files)
auth
pages (pages in the app):
...

All apis are declared withing pages itself, In a prod app, this would be handled using Redux or some other state management library.
Bootstrap is used for styling in the whole project.

# Before starting

Make sure all dependencies are installed with `npm install`

# To run

Once all dependencies are installed, run `npm start` to launch the app

# Pages

There are currently 6 pages in the app:

Admin: This view allows editing and deleting existing movies
Home: This view displays all movies and allows searching using movie/director name
Login: Click here to login or go to sign up
NewMovie: This page is for create operation
PrivateRoute: This isn't really a page but an HOC to prevent non-admins from accessing admin pages
Signup: Can be accessed through Login.
