ARG IMAGE=ubuntu:16.04

FROM ${IMAGE}

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y wget unzip gdebi-core xvfb
RUN apt-get install -y libgconf2-4

ARG CHROMIUM_VERSION=250398841/chromium-browser_49.0.2623.108-0ubuntu1.1233_amd64
ARG CHROMIUM_CODECS_VERSION=250398843/chromium-codecs-ffmpeg-extra_49.0.2623.108-0ubuntu1.1233_amd64
ARG CHROMEDRIVER_VERSION=2.22

RUN wget -q --continue -O chrome-codecs.deb "http://launchpadlibrarian.net/${CHROMIUM_CODECS_VERSION}.deb" \
  && wget -q --continue -O chrome.deb "http://launchpadlibrarian.net/${CHROMIUM_VERSION}.deb" \
  && gdebi --non-interactive chrome-codecs.deb \
  && gdebi --non-interactive chrome.deb

RUN wget -q --continue "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" \
  && unzip "chromedriver_linux64.zip" -d /usr/local/bin \
  && rm "chromedriver_linux64.zip"

COPY entrypoint.sh /entrypoint.sh
CMD ["/bin/bash", "/entrypoint.sh"]
