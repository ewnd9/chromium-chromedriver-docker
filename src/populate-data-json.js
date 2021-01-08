'use strict';

const axios = require('axios');

const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(`${__dirname}/../data.json`);

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const chromiumVersions = await parseChromiumVersions();
  console.log(chromiumVersions);

  const chromiumCodecsVersions = await parseChromiumCodecsVersions();
  console.log(chromiumCodecsVersions);

  const chromedriverVersions = await parseChromedriverVersions();
  console.log(chromedriverVersions);

  const data = require(dataPath);

  for (const [majorVersion, version] of Object.entries(
    chromiumVersions
  ).reverse()) {
    const chromedriverVersion = chromedriverVersions[majorVersion];
    const chromiumCodecsVersion = chromiumCodecsVersions[majorVersion];

    if (!chromedriverVersion || !chromiumCodecsVersion) {
      break;
    }

    data.versions[`chromium-${majorVersion}`] = {
      IMAGE: 'ubuntu:18.04',
      CHROMIUM_VERSION: version,
      CHROMIUM_CODECS_VERSION: chromiumCodecsVersion,
      CHROMEDRIVER_VERSION: chromedriverVersion,
      userAgent: '',
      template: 'chromium-87',
    };
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
  console.log(data);
}

async function parseChromiumVersions() {
  const versions = {};
  const url = 'https://launchpad.net/ubuntu/bionic/amd64/chromium-browser';

  await parseHtml({
    url,
    regex: /href="\/ubuntu\/bionic\/amd64\/chromium-browser\/([\d\w.\/-]+)"/g,
    async onMatch(version) {
      const majorVersion = version.split('.')[0];

      if (!versions[majorVersion]) {
        const { data: html } = await axios(
          `${url}/${version}`
        );
        const regex = /href="http:\/\/launchpadlibrarian.net\/([\d\w.\/_-]+)\.deb"/g;
        const match = regex.exec(html);
        versions[majorVersion] = match[1];
      }
    },
  });

  return versions;
}

async function parseChromiumCodecsVersions() {
  const versions = {};
  const url = 'https://launchpad.net/ubuntu/bionic/amd64/chromium-codecs-ffmpeg-extra';

  await parseHtml({
    url,
    regex: /href="\/ubuntu\/bionic\/amd64\/chromium-codecs-ffmpeg-extra\/([\d\w.\/-]+)"/g,
    async onMatch(version) {
      const majorVersion = version.split('.')[0];

      if (!versions[majorVersion]) {
        const { data: html } = await axios(
          `${url}/${version}`
        );
        const regex = /href="http:\/\/launchpadlibrarian.net\/([\d\w.\/_-]+)\.deb"/g;
        const match = regex.exec(html);
        versions[majorVersion] = match[1];
      }
    },
  });

  return versions;
}

async function parseChromedriverVersions() {
  const versions = {};

  await parseHtml({
    url: 'https://chromedriver.storage.googleapis.com/?delimiter=/&prefix=',
    regex: /<Prefix>([\d.]+)/g,
    onMatch(version) {
      const majorVersion = version.split('.')[0];

      if (!versions[majorVersion]) {
        versions[majorVersion] = version;
      }
    },
  });

  return versions;
}

async function parseHtml({ url, regex, onMatch }) {
  const { data: html } = await axios(url);

  const versions = {};
  let match;
  while ((match = regex.exec(html)) != null) {
    const group = match[1];
    await onMatch(group);
  }

  return versions;
}
