const firebase = require("@firebase/testing");
const fs = require("fs");
const { italics } = require("../__mocks__/file-mock");

const DATABASE_NAME = "database-emulator-example";

const COVERAGE_URL = `http://${process.env.FIREBASE_DATABASE_EMULATOR_HOST}/.inspect/coverage?ns=${DATABASE_NAME}`;


function getAdminDatabase() {
    return firebase
      .initializeAdminApp({ databaseName: DATABASE_NAME })
      .database();
  }

beforeEach(async () => {
  // Clear the database between tests
  await getAdminDatabase().ref().set(null);
});

after(async () => {
  // Close any open apps
  await Promise.all(firebase.apps().map((app) => app.delete()));
  console.log(`View rule coverage information at ${COVERAGE_URL}\n`);
});

Promise.all(firebase.apps().map(app => app.delete()))