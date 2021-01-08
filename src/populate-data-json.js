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
  const bionicChromiumVersions = await parseChromiumVersions({
    release: 'bionic',
  });
  const bionicChromiumCodecsVersions = await parseChromiumCodecsVersions({
    release: 'bionic',
  });
  const xenialChromiumVersions = await parseChromiumVersions({
    release: 'xenial',
  });
  const xenialChromiumCodecsVersions = await parseChromiumCodecsVersions({
    release: 'xenial',
  });

  const chromedriverVersions = await parseChromedriverVersions();

  const data = require(dataPath);
  const ranges = [
    {
      from: 87,
      to: 62,
      image: 'ubuntu:18.04',
      template: 'chromium-87',
      chromeVersions: bionicChromiumVersions,
      chromeCodecsVersion: bionicChromiumCodecsVersions,
    },
    {
      from: 61,
      to: 61,
      image: 'ubuntu:18.04',
      template: 'chromium-61',
      chromeVersions: bionicChromiumVersions,
      chromeCodecsVersion: bionicChromiumCodecsVersions,
    },
    {
      from: 60,
      to: 45,
      image: 'ubuntu:16.04',
      template: 'chromium-61',
      chromeVersions: xenialChromiumVersions,
      chromeCodecsVersion: xenialChromiumCodecsVersions,
    },
  ];

  for (const range of ranges) {
    for (
      let majorVersion = range.from;
      majorVersion >= range.to;
      majorVersion--
    ) {
      if (!range.chromeVersions[majorVersion]) {
        continue;
      }

      data.versions[`chromium-${majorVersion}`] = {
        IMAGE: range.image,
        CHROMIUM_VERSION: range.chromeVersions[majorVersion],
        CHROMIUM_CODECS_VERSION: range.chromeCodecsVersion[majorVersion],
        CHROMEDRIVER_VERSION: chromedriverVersions[majorVersion],
        userAgent: '',
        template: range.template,
      };
    }
  }

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

  versions['69'] = '2.44';
  versions['68'] = '2.42';
  versions['67'] = '2.41';
  versions['66'] = '2.40';
  versions['65'] = '2.38';
  versions['64'] = '2.37';
  versions['63'] = '2.36';
  versions['62'] = '2.35';
  versions['61'] = '2.34';
  versions['60'] = '2.33';
  versions['59'] = '2.32';
  versions['58'] = '2.31';
  versions['57'] = '2.29';
  versions['56'] = '2.29';
  versions['55'] = '2.28';
  versions['54'] = '2.27';
  versions['53'] = '2.26';
  versions['52'] = '2.24';
  versions['51'] = '2.23';
  versions['50'] = '2.22';
  versions['49'] = '2.22';
  versions['48'] = '2.21';
  versions['47'] = '2.21';
  versions['46'] = '2.21';
  versions['45'] = '2.20';

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
