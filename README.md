# amd-brunch

Advanced AMD builds for Brunch.

Brunch's CommonJS support is superb.  But for one reason or another, some of us
use AMD instead.  This plugin offers more advanced AMD dependency tracing and
module definitions.

- Includes dependencies from `node_modules`
- Supports [simplified CommonJS wrapping][]

[simplified CommonJS wrapping]: https://github.com/amdjs/amdjs-api/wiki/AMD#simplified-commonjs-wrapping-

Example configuration:

```js
module.exports = {
  // Module configuration is disabled since we are using plain JS and
  // amd-brunch handles the definition.
  modules: {wrapper: false, definition: false},
  npm: {enabled: false},
  plugins: {
    amd: {
      // Options are reminiscent of r.js
      baseUrl: 'app',
      name: 'node_modules/almond/almond',
      include: ['main'],
      mainConfigFile: 'app/main.js',
      // The following configuration is passed to the loader during the build,
      // merged into the config from mainConfigFile (if any).
      buildConfig: {
        paths: {
          // Treat node_modules as if it were in the same directory as baseUrl.
          'node_modules': '../node_modules'
        }
      }
    }
  }
};
```

This is a production plugin.  I expect that, to capitalize on AMD for iterative
development, one would serve the filesystem `app/` and `node_modules/`
directories as `/` and `/node_modules/` on his local server, and use a dynamic
AMD loader to inject `<script>` elements into the page.
