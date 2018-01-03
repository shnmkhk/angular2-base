# angular2-base

A simple base project for Angular 2 apps, using Gulp to automate tasks and SystemJS to bundle the app.

![Demo View](./docs/demo.png)

## Usage

To generate the output directory `dist/` run the command `gulp`.

If you add more `@angular` packages, you will need to update the `system.config.js` file to include them in the bundle during the build process.

## Production

For a production setup, uncomment the lines in `main.ts` to put Angular in production mode. Then, run the minification task to minify vendor files `gulp minify`.
