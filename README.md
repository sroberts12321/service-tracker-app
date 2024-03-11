Hello, this is primarily a personal project for a pretty specific use case, but if you really want to get it up and running on your machine here are the steps you need to follow.

The most complicated part of the installation process will be the database setup. You will need to create a firebase account if you do not already have one since this project uses firebase to save all the changes happening in the app.

Pnpm and node.js are also required.

To start using this app follow these instructions:

1. Create a new project on Firebase
2. Create two collections, `customers` and `services`
3. Navigate to your general project settings
4. Locate your "firebaseConfig" object
5. Clone the service-tracker-app repo and open it your favorite text editor
6. Create a .env file in the root of your project
7. Copy the contents of your "firebaseConfig" object to the .env file you made earlier
8. Create separate variables for each value and start each variable name with "PUBLIC_" for example: `PUBLIC_apiKey="1WEsjei25123DIZ9dMJLd994ldFejigp"`
9. Save file
10. Run `pnpm install` 
11. Run `pnpm run tauri dev`
12. Enjoy!

If you did every step correctly you should see the following screen:

![Screenshot of the main page of the service-tracker-app application](/static/images/main_page.png)
