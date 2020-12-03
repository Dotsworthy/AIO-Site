<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<h1 align="center">
  ALL IN ONE EDUCATION
</h1>

## 🚀 Quick start

1.  **Start developing.**

    Navigate into your site’s directory and start it up. This app is built in Gatsby.

    ```shell
    cd path/
    npm install
    gatsby develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    The All in One Education website is an app for both consumers and administration. We have a traditional Gatsby front-end utilising links to send users to each       individual page of the site with a page utilising firebase to retrieve and download teaching resources, and a front end utilising Gatsby, Reach Router, and         Firebase to log admins into a front end which communicates with firebase to add, edit, and delete teaching resources.

    **Backend Database**

    Firebase.

    This app currently utilises the following aspects of firebase:

- firebase authentication
- Firebase Cloud Firestore: 
  
    This is a non-sql relational database that contains information on all the teaching resources, catagories, education levels, and tags. 
  
    Each educational resource in the database contains a category, educational level, and up to four tags. The app has been designed to be filtered by the resources     name, category, level, or tag. 
    
    Catagories, levels, and tags are their own database items, and are used for two reasons, one to update all resources with said item at once, and also within the     resource catalogue to render a list of items that the user can select to filter resources by that item.
    
    Teaching resources contain the following information:
    - ID number
    - Name
    - Description
    - Category
    - Level
    - Tags
    - Image (a profile image used for the catalogue)
    - Downloads (downloadable content attached to the resource for users to download on the front end).

    **firebase storage**
    
    Firebase storage contains all of the profile images for resources in the database, as well as the downloads attached to those resources.
    
    On creation of a teaching resource, the app will create a folder in the images and downloads folders contained within firebase storage. The folder name will be     the ID number of the resource, which the app utilises in functions to locate images and downloads when they are retrieved within the app. 
    
    For each teaching resource, image will contain the name of the file assigned, and downloads will contain an array of all the file names. functions within the       app will use these names.
    
    File Integrity.
    When creating or updating a teaching resource, to ensure database integrity and prevent problems with filetypes, the app uses async/await functions when
    uploading files. The process is as follows:
    
    1. Firebase creates the teaching resource with empty strings for images and downloads. If updating, it will update all fields with the exception of images and
    downloads
    2. Firebase uploads all images and downloads. The app renders a simple uploader to provide notifcation on download progress.
    3. On completion of upload, Firebase updates the teaching resource with the updated images and downloads information.
    
    This means that if a upload is interrupted and is unable to complete, the process with end after step one. The app is designed so the user can try the upload
    again by updating the resource.
    

<!-- AUTO-GENERATED-CONTENT:END -->
