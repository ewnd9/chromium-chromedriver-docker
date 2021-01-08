'use strict';

const execa = require('execa');
const { Readable } = require('stream');

const fs = require('fs');
const { run } = require('./docker');

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  await dockerLogin();
  await dockerInitExperimental();

  for (const input of fs.readdirSync('docker')) {
    const image = `${process.env.DOCKER_REGISTRY_IMAGE}:${input}`;
    console.log({ input, image });

    const isExists = await dockerIsImageExists(image);
    if (isExists) {
      continue;
    }

    const isSuccess = await run({ input, image });

    if (isSuccess) {
      await execa(`docker push ${image}`, { shell: true, stdio: 'inherit' });
    }
  }
}

async function dockerLogin() {
  // https://github.com/feuertiger/feuertiger/blob/cf79a11413118465e66d4a7ac822475ed579bbec/cli/src/dockerize.ts
  const dockerLoginProcess = execa(
    `docker login ghcr.io --username ${process.env.DOCKER_REGISTRY_USERNAME} --password-stdin`,
    {
      shell: true,
      stdout: 'inherit',
      stderr: 'inherit',
    }
  );

  Readable.from([process.env.DOCKER_REGISTRY_PASSWORD]).pipe(
    dockerLoginProcess.stdin
  );

  await dockerLoginProcess;
}

async function dockerInitExperimental() {
  const configPath = `${process.env.HOME}/.docker/config.json`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  config.experimental = 'enabled';
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

async function dockerIsImageExists(image) {
  try {
    await execa(`docker manifest inspect ${image}`, {
      shell: true,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
