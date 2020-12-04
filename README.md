<h1 align="center">
  ALL IN ONE EDUCATION
</h1>

## 🚀 Quick start

1.  **Start developing.**

Navigate into your site’s directory and start it up. This app is built in Gatsby.

```shell
cd create-path-here/
npm install
gatsby develop
```

1.  **Open the source code and start editing!**

Your site is now running at `http://localhost:8000`!

<h2 align="center">Introduction</h2>

The All in One Education website is an app for both consumers and administration. We have a traditional Gatsby front-end utilising links to send users to each       individual page of the site with a page utilising firebase to retrieve and download teaching resources, and a front end utilising Gatsby, Reach Router, and         Firebase to log admins into a front end which communicates with firebase to add, edit, and delete teaching resources.

<h2>Tech Stack</h2>

- React Gatsby
- Firebase
- SASS
- JSZip
- Reach Router

<h2 align="center">Backend Database</h2>

All of the AIO apps data and storage is handled by firebase. The app is currently utilising the following features:

<h2>Firebase Authentication</h2>

This handles user accounts for the admins to login to the administrative side of the AIO app. User accounts can be created within the firebase console for admin but not within the app itself. 

As the app evolves, AIO may want to incorporate user accounts for visitors to the site. In this case, a new authentication system for administrators will need to be used.

<h2>Firebase Cloud Firestore</h2> 
  
This is a non-sql relational database that contains information on all the teaching resources, catagories, education levels, and tags. 

Each educational resource in the database contains a category, educational level, and up to four tags. The app has been designed to be filtered by the resource's name, category, level, or tag. 

Catagories, levels, and tags are their own database items, and are used for two reasons, one to update all resources with said item at once, and also within the resource catalogue to render a list of items that the user can select to filter resources by that item.

Teaching resources contain the following information:
- ID number
- Name
- Description
- Category
- Level
- Tags
- Image (a profile image used for the catalogue)
- Downloads (downloadable content attached to the resource for users to download on the front end).

This is the diagram structure of the database:

![Database Diagram](/src/images/database-diagram.png)

<h2>Firebase Storage</h2>
    
Firebase storage contains all of the profile images for resources in the database, as well as the downloads attached to those resources.

On creation of a teaching resource, the app will create a folder in the images and downloads folders contained within firebase storage. The folder name will be the ID number of the resource, which the app utilises in functions to locate images and downloads when they are retrieved within the app. 

For each teaching resource, image will contain the name of the file assigned, and downloads will contain an array of all the file names. functions within the app will use these names.

File Integrity.
When creating or updating a teaching resource, to ensure database integrity and prevent problems with filetypes, the app uses async/await functions when uploading files. The process is as follows:

1. Firebase creates the teaching resource with empty strings for images and downloads. If updating, it will update all fields with the exception of images and downloads
2. Firebase uploads all images and downloads. The app renders a simple uploader to provide notifcation on download progress.
3. On completion of upload, Firebase updates the teaching resource with the updated images and downloads information.

This means that if a upload is interrupted and is unable to complete, the process with end after step one. The app is designed so the user can try the upload again by updating the resource.

<h2 align="center">Frontend Resource Catalogue</h2>
    
The frontend of the app has one page that is accessible for anyone visiting AIO. The resource catalogue fetches the Cloud Firestore database and renders this information in a catalogue. The catalogue also user firebase storage allowing the user to download a resource.

The remainder of the front end does not utilise firebase.

<h2 align="center">Safety Rules for Firebase</h2>
  
Firebase has the current security rules set for users and visitors to the app:

- Visitors to the site have full read access to Firebase Cloud Firestore and Firebase Storage. This is so users can see the teaching resources available and download content.
- Firebase user accounts have full read and write access to Firebase Authentication, Firebase Cloud Firestore, and Firebase Storage. 

If any of the functionality of the app changes (for example, allowing visitors to create user accounts) security rules should be reviewed and changed as appropriate.

