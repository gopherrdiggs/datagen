# DataGen.app

DataGen.app is a Progressive Web App that is used to generate Excel spreadsheets based on template data.
The generated spreadsheets can be used as import files into other systems, or you can use them as seed data for reporting.

## Technical Features

* `@ionic/core` for the UI.
* Stencil for the application logic and routing
* Pre-rendering
* Lazy-loading and code splitting
* Intelligent Polyfills
* Modern mode: ES6/ESM for new browser, ES5 for older
* Service Worker, App manifest, iOS meta tags
* Theming using CSS variables

## To run the app locally:

* Clone this repository to a local directory
* Run `git remote rm origin`
* Run `npm install`
* Run `npm start` to start the application

## Troubleshooting tips

While attempting to start the application, you may get a build error in reference to `node_modules\@ionic\core\dist\types\utils\overlays.d.ts`.
Simply open the file in question and change `keyof B` to `string` on line 9.
Save your changes, and then try to start the application again.