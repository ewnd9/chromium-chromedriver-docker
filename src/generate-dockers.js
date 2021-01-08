'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(`${__dirname}/../data.json`);

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const data = require(dataPath);

  for (const [version, params] of Object.entries(data.versions)) {
    if (version === params.template) {
      continue;
    }

    fs.mkdirSync(`docker/${version}`, { recursive: true });
    fs.copyFileSync(
      `docker/${params.template}/entrypoint.sh`,
      `docker/${version}/entrypoint.sh`
    );

    const dockerfile = fs.readFileSync(
      `docker/${params.template}/Dockerfile`,
      'utf-8'
    );
    fs.writeFileSync(
      `docker/${version}/Dockerfile`,
      dockerfile
        .replace(
          /CHROMIUM_VERSION=[\d\w._\/-]+/,
          `CHROMIUM_VERSION=${params.CHROMIUM_VERSION}`
        )
        .replace(
          /CHROMIUM_CODECS_VERSION=[\d\w._\/-]+/,
          `CHROMIUM_CODECS_VERSION=${params.CHROMIUM_CODECS_VERSION}`
        )
        .replace(
          /CHROMEDRIVER_VERSION=[\d.]+/,
          `CHROMEDRIVER_VERSION=${params.CHROMEDRIVER_VERSION}`
        )
    );
  }
}
