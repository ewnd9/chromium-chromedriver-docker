ARG IMAGE=ubuntu:16.04

FROM ${IMAGE}

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y wget unzip gdebi-core xvfb
RUN apt-get install -y libgconf2-4

ARG CHROMIUM_VERSION=259435891/chromium-browser_50.0.2661.102-0ubuntu0.16.04.1.1237_amd64
ARG CHROMIUM_CODECS_VERSION=259435893/chromium-codecs-ffmpeg-extra_50.0.2661.102-0ubuntu0.16.04.1.1237_amd64
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
