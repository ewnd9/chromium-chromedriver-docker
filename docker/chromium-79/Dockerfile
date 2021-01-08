ARG IMAGE=ubuntu:18.04

FROM ${IMAGE}

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y wget unzip gdebi-core xvfb

ARG CHROMIUM_VERSION=462455281/chromium-browser_79.0.3945.130-0ubuntu0.18.04.1_amd64
ARG CHROMIUM_CODECS_VERSION=462455283/chromium-codecs-ffmpeg-extra_79.0.3945.130-0ubuntu0.18.04.1_amd64
ARG CHROMEDRIVER_VERSION=79.0.3945.16

RUN wget -q --continue -O chrome-codecs.deb "http://launchpadlibrarian.net/${CHROMIUM_CODECS_VERSION}.deb" \
  && wget -q --continue -O chrome.deb "http://launchpadlibrarian.net/${CHROMIUM_VERSION}.deb" \
  && gdebi --non-interactive chrome-codecs.deb \
  && gdebi --non-interactive chrome.deb

RUN wget -q --continue "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" \
  && unzip "chromedriver_linux64.zip" -d /usr/local/bin \
  && rm "chromedriver_linux64.zip"

COPY entrypoint.sh /entrypoint.sh
CMD ["/bin/bash", "/entrypoint.sh"]
