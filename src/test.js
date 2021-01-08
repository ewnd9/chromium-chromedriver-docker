'use strict';

const { run } = require('./docker');

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const input = process.argv[2];
  const image = 'test';
  await run({ input, image });
}
