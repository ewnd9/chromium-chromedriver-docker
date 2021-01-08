'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(`${__dirname}/../data.json`);

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const { chromedriver } = require('../data-chromedriver.json');

  const data = require(dataPath);
  const ranges = [
    {
      from: 87,
      to: 62,
      image: 'ubuntu:18.04',
      template: 'chromium-87',
      chromeVersions: require('../data-launchpad-bionic.json').chromium,
      chromeCodecsVersion: require('../data-launchpad-bionic.json')
        .chromiumCodecs,
    },
    {
      from: 61,
      to: 61,
      image: 'ubuntu:18.04',
      template: 'chromium-61',
      chromeVersions: require('../data-launchpad-bionic.json').chromium,
      chromeCodecsVersion: require('../data-launchpad-bionic.json')
        .chromiumCodecs,
    },
    {
      from: 60,
      to: 47,
      image: 'ubuntu:16.04',
      template: 'chromium-61',
      chromeVersions: require('../data-launchpad-xenial.json').chromium,
      chromeCodecsVersion: require('../data-launchpad-xenial.json')
        .chromiumCodecs,
    },
    {
      from: 45, // 46 is missing in launchpad
      to: 29,
      image: 'ubuntu:14.04',
      template: 'chromium-45',
      chromeVersions: require('../data-launchpad-trusty.json').chromium,
      chromeCodecsVersion: require('../data-launchpad-trusty.json')
        .chromiumCodecs,
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
        CHROMEDRIVER_VERSION: chromedriver[majorVersion],
        userAgent: '',
        template: range.template,
      };
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
  console.log(data);
}
