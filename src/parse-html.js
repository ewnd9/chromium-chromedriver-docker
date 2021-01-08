'use strict';

const axios = require('axios');

module.exports = {
  parseHtml,
};

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
