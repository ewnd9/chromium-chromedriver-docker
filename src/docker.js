'use strict';

const execa = require('execa');
const { remote } = require('webdriverio');

const {
  LOG_LEVEL = 'error',
  CHROMEDRIVER_HOST = 'localhost',
  CHROMEDRIVER_PORT = '9515',
  TEST_URL = 'chrome://version',
} = process.env;

module.exports = {
  run,
};

async function run({ input, image }) {
  const useDocker = input !== 'existing';

  async function fn() {
    const text = await runTest();
    console.log({ text });
  }

  if (useDocker) {
    return runWithDocker(fn, input, image);
  } else {
    return await fn();
  }
}

async function runWithDocker(fn, input, image) {
  const data = require('../data.json');
  const result = Object.entries(data.versions).find(
    ([version]) => version === input
  );

  if (!result) {
    console.error(`no version for ${input}`);
    process.exit(1);
  }

  const cwd = `docker/${result[0]}`;
  const exec = async (cmd) =>
    execa(cmd, {
      shell: true,
      cwd,
    });

  await exec(`docker build -t ${image} .`);

  // unclear how to run without --privileged (https://github.com/jessfraz/dockerfiles/issues/350)
  // chrome 60+ doesn't require it
  const { stdout: containerId } = await exec(
    `docker run --privileged -d -p 9515:9515 ${image}`
  );

  console.log({ containerId });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let isSuccess = true;

  try {
    await fn();
  } catch (err) {
    isSuccess = false;
    console.log(err);
  }

  await exec(`docker stop ${containerId} && docker rm ${containerId}`);

  return isSuccess;
}

async function runTest() {
  const chromeOptions = {
    args: ['--no-sandbox'],
  };

  const browser = await remote({
    logLevel: LOG_LEVEL,
    hostname: CHROMEDRIVER_HOST,
    port: CHROMEDRIVER_PORT ? Number(CHROMEDRIVER_PORT) : undefined,
    path: '/',
    connectionRetryTimeout: 10000,
    capabilities: {
      browserName: 'chrome',
      chromeOptions, // chromeOptions only required for chromium 56 and 57 for some reason
      'goog:chromeOptions': chromeOptions,
    },
  });

  await browser.url(TEST_URL);

  // @TODO: use wait in webdriverio
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  await browser.saveScreenshot('sc3.png');
  const text = await browser.execute(function () {
    return document.querySelector('#version').innerText;
  });
  await browser.deleteSession();

  return text;
}
