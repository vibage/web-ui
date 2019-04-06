// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:3000",
  firebase: {
    apiKey: "AIzaSyBZRS-Py46LVz7Qdia25h6EQjlCnVliB9c",
    authDomain: "fizzle-83733.firebaseapp.com",
    databaseURL: "https://fizzle-83733.firebaseio.com",
    projectId: "fizzle-83733",
    storageBucket: "fizzle-83733.appspot.com",
    messagingSenderId: "974573355861"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
