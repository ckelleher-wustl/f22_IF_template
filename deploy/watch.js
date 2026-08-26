// // "watchify --debug ./scripts/ts/dynamic-dom/dynamic-dom.ts ./scripts/ts/tracker/tracker.ts -p tsify -v -o ./scripts/js/app.js"
// var browserify = require('browserify'),
//     tsify = require('tsify'),
//     stringify = require('stringify'),
//     watchify = require('watchify'),
//     fs = require('fs');
// const { timeStamp } = require('console');

// let bundle = browserify({
//     debug: true,
//     cache: {},
//     packageCache: {},
// })
//     .plugin(watchify, {
//         delay: 100,
//         ignoreWatch: [
//             '**/node_modules/**',
//             '**/deploy/**',
//             '**/downloads/**',
//             '**/files/**',
//             '**/scenarios/**',
//             '**/wrappers/**',
//         ],
//     })
//     .transform(stringify, {
//         appliesTo: { includeExtensions: ['.html'] },
//     })
//     .add('./scripts/ts/dynamic-dom/dynamic-dom.ts')
//     .add('./scripts/ts/tracker/tracker.ts')
//     .plugin(tsify, { noImplicitAny: true })
//     .on('error', console.error);

// bundle.pipeline.on('package', (pkg) => console.log('Built: ' + pkg.name));

// function doBundle() {
//     const d = new Date();
//     console.error(
//         `[${d.getDate()}/${
//             d.getMonth() + 1
//         }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] Rebuilding app. Hang on...`
//     );
//     const fsws = fs.createWriteStream('./scripts/js/app.js.tmp');
//     fsws.on('finish', () =>
//         fs.renameSync('./scripts/js/app.js.tmp', './scripts/js/app.js')
//     );
//     bundle.bundle().pipe(fsws);
// }

// bundle.on('update', doBundle);
// doBundle();

const esbuild = require('esbuild');
const path = require('path');

async function watch() {
  try {
    const ctx = await esbuild.context({
      stdin: {
        contents: `
          import './scripts/ts/dynamic-dom/dynamic-dom.ts';
          import './scripts/ts/tracker/tracker.ts';
        `,
        resolveDir: path.resolve(__dirname, '..'),
      },
      outfile: './scripts/js/app.js',
      bundle: true,
      sourcemap: true,
      loader: {
        '.html': 'text',
      },
      target: ['es2020'],
      plugins: [
        {
          name: 'rebuild-notify',
          setup(build) {
            build.onEnd((result) => {
              const d = new Date();
              const timestamp = `[${d.toLocaleTimeString()}]`;
              if (result.errors.length > 0) {
                console.error(`${timestamp} Rebuild failed with errors.`);
              } else {
                console.log(`${timestamp} Rebuilt successfully to ./scripts/js/app.js`);
              }
            });
          },
        },
      ],
    });

    await ctx.watch();
    console.log('Watching for file changes...');
  } catch (err) {
    console.error('Watch setup failed:', err);
    process.exit(1);
  }
}

watch();
