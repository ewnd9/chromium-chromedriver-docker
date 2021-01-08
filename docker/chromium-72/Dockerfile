ARG IMAGE=ubuntu:18.04

FROM ${IMAGE}

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y wget unzip gdebi-core xvfb

ARG CHROMIUM_VERSION=413871155/chromium-browser_72.0.3626.121-0ubuntu0.18.04.1_amd64
ARG CHROMIUM_CODECS_VERSION=413871157/chromium-codecs-ffmpeg-extra_72.0.3626.121-0ubuntu0.18.04.1_amd64
ARG CHROMEDRIVER_VERSION=72.0.3626.69

RUN wget -q --continue -O chrome-codecs.deb "http://launchpadlibrarian.net/${CHROMIUM_CODECS_VERSION}.deb" \
  && wget -q --continue -O chrome.deb "http://launchpadlibrarian.net/${CHROMIUM_VERSION}.deb" \
  && gdebi --non-interactive chrome-codecs.deb \
  && gdebi --non-interactive chrome.deb

RUN wget -q --continue "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" \
  && unzip "chromedriver_linux64.zip" -d /usr/local/bin \
  && rm "chromedriver_linux64.zip"

COPY entrypoint.sh /entrypoint.sh
CMD ["/bin/bash", "/entrypoint.sh"]
