// var browserify = require('browserify'),
//     tsify = require('tsify'),
//     stringify = require('stringify'),
//     fs = require('fs');

// let bundle = browserify({ debug: true })
//     .transform(stringify, {
//         appliesTo: { includeExtensions: ['.html'] },
//     })
//     .add('./scripts/ts/dynamic-dom/dynamic-dom.ts')
//     .add('./scripts/ts/tracker/tracker.ts')
//     .plugin(tsify, { noImplicitAny: true })
//     .on('error', (err) => {
//         this.emit('end');
//     });

// bundle.pipeline.on('package', (pkg) => console.log('Built: ' + pkg.name));
// bundle.bundle().pipe(fs.createWriteStream('./scripts/js/app.js'));

const esbuild = require('esbuild');
const path = require('path');

async function build() {
  try {
    await esbuild.build({
      stdin: {
        contents: `
          import './scripts/ts/dynamic-dom/dynamic-dom.ts';
          import './scripts/ts/tracker/tracker.ts';
        `,
        resolveDir: path.resolve(__dirname, '..'), // Resolves relative paths from project root
      },
      outfile: './scripts/js/app.js',
      bundle: true,
      sourcemap: true,
      loader: {
        '.html': 'text', // Inlines HTML files imported in html-imports.ts as plain text
      },
      target: ['es2020'],
    });

    console.log('Built successfully to ./scripts/js/app.js');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
