ARG IMAGE=ubuntu:14.04

FROM ${IMAGE}

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y wget unzip gdebi-core xvfb

ARG CHROMIUM_VERSION=149997247/chromium-browser_29.0.1547.65-0ubuntu2_amd64
ARG CHROMIUM_CODECS_VERSION=149997251/chromium-codecs-ffmpeg-extra_29.0.1547.65-0ubuntu2_amd64
ARG CHROMEDRIVER_VERSION=2.6

RUN wget -q --continue -O chrome-codecs.deb "http://launchpadlibrarian.net/${CHROMIUM_CODECS_VERSION}.deb" \
  && wget -q --continue -O chrome.deb "http://launchpadlibrarian.net/${CHROMIUM_VERSION}.deb" \
  && gdebi --non-interactive chrome-codecs.deb \
  && gdebi --non-interactive chrome.deb

# libnss3.deb trick http://forums.debian.net/viewtopic.php?f=6&t=129904
RUN wget -q --continue -O libnss3.deb "http://launchpadlibrarian.net/194157262/libnss3_3.17.2-1.1ubuntu1_amd64.deb" \
  && dpkg-deb -R libnss3.deb libnss3-deb \
  && sed -i s~export\ LD_LIBRARY_PATH~export\ LD_LIBRARY_PATH=/libnss3-deb/usr/lib/x86_64-linux-gnu/:/libnss3-deb/usr/lib/x86_64-linux-gnu/nss/~ /usr/bin/chromium-browser

RUN wget -q --continue "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" \
  && unzip "chromedriver_linux64.zip" -d /usr/local/bin \
  && rm "chromedriver_linux64.zip"

COPY entrypoint.sh /entrypoint.sh
CMD ["/bin/bash", "/entrypoint.sh"]
