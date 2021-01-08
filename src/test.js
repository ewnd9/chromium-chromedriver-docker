'use strict';

const execa = require('execa');
const { remote } = require('webdriverio');

const {
  LOG_LEVEL = 'error',
  CHROMEDRIVER_HOST = 'localhost',
  CHROMEDRIVER_PORT = '9515',
  TEST_URL = 'chrome://version',
} = process.env;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const data = require('../data.json');
  const input = process.argv[2];
  const result = Object.entries(data.versions).find(
    ([version]) => version === input
  );

  if (!result) {
    console.error(`no ${input}`);
    process.exit(1);
  }

  const [version] = result;
  const cwd = `docker/${version}`;
  const exec = async (cmd) =>
    execa(cmd, {
      shell: true,
      cwd,
    });

  await exec('docker build -t test .');

  const { stdout: containerId } = await exec('docker run -d -p 9515:9515 test');
  console.log({ containerId });

  try {
    const text = await runTest();
    console.log({ text });
  } catch (err) {
    console.log(err);
  }

  await exec(`docker stop ${containerId} && docker rm ${containerId}`);
}

async function runTest() {
  const browser = await remote({
    logLevel: LOG_LEVEL,
    hostname: CHROMEDRIVER_HOST,
    port: CHROMEDRIVER_PORT ? Number(CHROMEDRIVER_PORT) : undefined,
    path: '/',
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--no-sandbox'],
      },
    },
  });

  await browser.url(TEST_URL);

  // @TODO: use wait in webdriverio
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.saveScreenshot('sc3.png');
  const text = await browser.execute(
    () => document.querySelector('#version').innerText
  );
  await browser.deleteSession();

  return text;
}
