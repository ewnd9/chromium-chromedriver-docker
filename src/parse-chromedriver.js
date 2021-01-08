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
  const dataPath = path.resolve(`${__dirname}/../data-chromedriver.json`);
  const chromedriver = await parseChromedriverVersions();
  const data = { chromedriver };

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
  console.log(data);
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
