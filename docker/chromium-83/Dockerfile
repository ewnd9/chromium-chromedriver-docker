ARG IMAGE=ubuntu:18.04

FROM ${IMAGE}

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y wget unzip gdebi-core xvfb

ARG CHROMIUM_VERSION=480826523/chromium-browser_83.0.4103.61-0ubuntu0.18.04.1_amd64
ARG CHROMIUM_CODECS_VERSION=480826529/chromium-codecs-ffmpeg-extra_83.0.4103.61-0ubuntu0.18.04.1_amd64
ARG CHROMEDRIVER_VERSION=83.0.4103.14

RUN wget -q --continue -O chrome-codecs.deb "http://launchpadlibrarian.net/${CHROMIUM_CODECS_VERSION}.deb" \
  && wget -q --continue -O chrome.deb "http://launchpadlibrarian.net/${CHROMIUM_VERSION}.deb" \
  && gdebi --non-interactive chrome-codecs.deb \
  && gdebi --non-interactive chrome.deb

RUN wget -q --continue "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" \
  && unzip "chromedriver_linux64.zip" -d /usr/local/bin \
  && rm "chromedriver_linux64.zip"

COPY entrypoint.sh /entrypoint.sh
CMD ["/bin/bash", "/entrypoint.sh"]
