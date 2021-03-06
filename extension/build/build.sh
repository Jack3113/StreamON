#!/usr/bin/env bash
rm -rf dist

mkdir -p dist/_locales
mkdir -p dist/lib
mkdir -p dist/options
mkdir -p dist/assets

rsync -a _locales/ dist/_locales/
rsync -a lib/ dist/lib/
rsync -a options/ dist/options/
rsync -a assets/ dist/assets/
rsync -a *.js dist/
rsync -a *.css dist/
rsync -a *.html dist/
cp LICENSE.md dist/
cp manifest.json dist/

npx replace-in-file dist/lib/twitch.js --configFile=build/disable-devKey.js  --verbose --encoding=utf-8
npx replace-in-file dist/lib/tools.js --configFile=build/disable-devKey.js  --verbose --encoding=utf-8
npx replace-in-file dist/lib/twitch.js --configFile=build/enable-publishedKey.js  --verbose --encoding=utf-8
npx replace-in-file dist/lib/tools.js --configFile=build/enable-publishedKey.js  --verbose --encoding=utf-8
npx replace-in-file dist/**/*.js --configFile=build/remove-console.js  --verbose --encoding=utf-8

npx uglifyjs --verbose dist/background.js -o dist/background.js
npx uglifyjs --verbose dist/locales.js -o dist/locales.js
npx uglifyjs --verbose dist/popup.js -o dist/popup.js
npx uglifyjs --verbose dist/options/options.js -o dist/options/options.js
npx uglifyjs --verbose dist/options/advanced.js -o dist/options/advanced.js
npx uglifyjs --verbose dist/lib/twitch.js -o dist/lib/twitch.js
npx uglifyjs --verbose dist/lib/tools.js -o dist/lib/tools.js

find dist/ -name ".DS_Store" -delete

rm -f archives/*.zip
cd dist; zip -r ../archives/extension.zip *


