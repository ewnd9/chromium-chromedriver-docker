'use strict';

const axios = require('axios');

const fs = require('fs');
const path = require('path');
const { parseHtml } = require('./parse-html');

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const release = process.argv[2];

  if (!release) {
    console.error(`pass release`);
    process.exit(1);
  }

  const dataPath = path.resolve(
    `${__dirname}/../data-launchpad-${release}.json`
  );

  const data = {
    chromium: await parseChromiumVersions({
      release,
    }),
    chromiumCodecs: await parseChromiumCodecsVersions({
      release,
    }),
  };

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');

  console.log(data);
}

async function parseChromiumVersions({ release }) {
  const versions = {};
  const url = `https://launchpad.net/ubuntu/${release}/amd64/chromium-browser`;

  await parseHtml({
    url,
    regex: new RegExp(
      `href="/ubuntu/${release}/amd64/chromium-browser/([\\d\\w./-]+)"`,
      'g'
    ),
    async onMatch(version) {
      const majorVersion = version.split('.')[0];

      if (!versions[majorVersion]) {
        const { data: html } = await axios(`${url}/${version}`);
        const regex = /href="http:\/\/launchpadlibrarian.net\/([\d\w.\/_-]+)\.deb"/g;
        const match = regex.exec(html);
        versions[majorVersion] = match[1];
      }
    },
  });

  return versions;
}

async function parseChromiumCodecsVersions({ release }) {
  const versions = {};
  const url = `https://launchpad.net/ubuntu/${release}/amd64/chromium-codecs-ffmpeg-extra`;

  await parseHtml({
    url,
    regex: new RegExp(
      `href="/ubuntu/${release}/amd64/chromium-codecs-ffmpeg-extra/([\\d\\w./-]+)"`,
      'g'
    ),
    async onMatch(version) {
      const majorVersion = version.split('.')[0];

      if (!versions[majorVersion]) {
        const { data: html } = await axios(`${url}/${version}`);
        const regex = /href="http:\/\/launchpadlibrarian.net\/([\d\w.\/_-]+)\.deb"/g;
        const match = regex.exec(html);
        versions[majorVersion] = match[1];
      }
    },
  });

  return versions;
}
