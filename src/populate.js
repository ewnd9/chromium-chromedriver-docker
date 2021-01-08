'use strict';

const axios = require('axios');

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const chromiumVersions = await parseChromiumVersions();
  console.log(chromiumVersions);

  const chromedriverVersions = await parseChromedriverVersions();
  console.log(chromedriverVersions);

  const data = require('../data.json');
  console.log(data);
}

async function parseChromiumVersions() {
  const { data: html } = await axios(
    'https://launchpad.net/ubuntu/bionic/amd64/chromium-browser'
  );

  const versions = {};
  let match;
  const regex = /href="\/ubuntu\/bionic\/amd64\/chromium-browser\/([\d\w.\/-]+)"/g;
  while ((match = regex.exec(html)) != null) {
    const version = match[1];
    const majorVersion = version.split('.')[0];

    if (!versions[majorVersion]) {
      versions[majorVersion] = version;
    }
  }

  return versions;
}

async function parseChromedriverVersions() {
  const { data: html } = await axios(
    'https://chromedriver.storage.googleapis.com/?delimiter=/&prefix='
  );

  console.log(html);
  const versions = {};
  let match;
  const regex = /<Prefix>([\d.]+)/g;
  while ((match = regex.exec(html)) != null) {
    const version = match[1];
    const majorVersion = version.split('.')[0];

    if (!versions[majorVersion]) {
      versions[majorVersion] = version;
    }
  }

  return versions;
}
