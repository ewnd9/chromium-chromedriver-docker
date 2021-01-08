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
  const chromiumVersions = await parseChromiumVersions({ release: 'bionic' });
  console.log(chromiumVersions);

  const chromiumCodecsVersions = await parseChromiumCodecsVersions({
    release: 'bionic',
  });

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
      IMAGE: getImage(Number(majorVersion)),
      CHROMIUM_VERSION: version,
      CHROMIUM_CODECS_VERSION: chromiumCodecsVersion,
      CHROMEDRIVER_VERSION: chromedriverVersion,
      userAgent: '',
      template: getTemplate(Number(majorVersion)),
    };
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

  return versions;
}

function getImage(majorVersion) {
  if (majorVersion >= 61) {
    return 'ubuntu:18.04';
  } else {
    throw new Error(`unsupported version "${majorVersion}"`);
  }
}

function getTemplate(majorVersion) {
  if (majorVersion > 61) {
    return 'chromium-87';
  } else if (majorVersion === 61) {
    return 'chromium-61';
  } else {
    throw new Error(`unsupported version "${majorVersion}"`);
  }
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
