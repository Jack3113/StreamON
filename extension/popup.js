/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Authors :
 * - HackJack https://github.com/Jack3113
 * - AamuLumi https://github.com/AamuLumi
 */

/* global chrome, modules, tools */

async function checkStreams() {

    const twitch = await modules.twitch.getAsyncBulkData();

    if (!twitch.length) {
        const noStreamingText = document.createElement('div');
        noStreamingText.setAttribute('class', 'empty-text');
        noStreamingText.innerHTML = chrome.i18n.getMessage('noStreams');

        document.getElementById('onlineList').appendChild(noStreamingText);
    } else {
        Array.prototype.forEach.call(document.getElementsByClassName('loading'), (element) => {
            element.style.display = 'none';
        });
        twitch.forEach(({game, name, startedAt, thumbnail, title, viewers, embed}, index) =>
            setTimeout(() => addOnlineElement(name, thumbnail, title, name, game, viewers, embed, startedAt), index * 100)
        );
    }
}

/**
 * @deprecated
 * @param profile
 * @param name
 */
function addOfflineElement(profile, name) {
    const e = document.createElement('div');
    e.setAttribute('class', 'streamOff link');
    e.setAttribute('data-profile', profile);
    e.addEventListener(
        'click',
        function () {
            modules.twitch.openStream(this.getAttribute('data-profile'));
        },
        false,
    );
    if (name) e.innerHTML = name;
    else e.innerHTML = profile;

    document.getElementById('offlineList').appendChild(e);
    const offlineNumber = document.getElementById('offline');
    offlineNumber.innerHTML = parseInt(offlineNumber.innerHTML) + 1;
}

function addOnlineElement(profile, _img, _title, _name, _game, _viewers, embed, startedAt) {
    const e = document.createElement('div');
    e.setAttribute('class', 'streamOn component-enter');
    e.setAttribute('data-profile', profile);
    e.addEventListener(
        'click',
        function () {
            modules.twitch.openStream(profile);
        },
        false
    );

    const img = document.createElement('img');
    img.setAttribute('class', 'preview pointer');
    img.setAttribute('alt', 'preview');
    img.setAttribute('src', _img);
    e.appendChild(img);

    const desc = document.createElement('div');
    desc.setAttribute('class', 'infos-container');

    const title = document.createElement('span');
    title.setAttribute('class', 'title');
    title.innerHTML = _title;

    desc.appendChild(title);


    desc.appendChild(createStreamerNameDiv(_name));

    if (_game) {
        desc.appendChild(createGameDiv(_game));
    }

    const lastRowContainer = document.createElement('span');
    lastRowContainer.setAttribute('class', 'flex-row space-between');
    desc.appendChild(lastRowContainer);

    lastRowContainer.appendChild(createTimeDiv(startedAt));

    lastRowContainer.appendChild(createViewersDiv(_viewers));

    /*
  const miniPlayer = document.createElement("div");
  miniPlayer.setAttribute("class", "link");
  miniPlayer.innerHTML = chrome.i18n.getMessage("openMiniPlayer");
  miniPlayer.addEventListener(
    "click",
    function () {
      tools.openMiniPlayer(embed);
    },
    false
  );
  desc.appendChild(miniPlayer);*/

    e.appendChild(desc);

    document.getElementById('onlineList').appendChild(e);
}

function createGameDiv(gameName) {
    const gameContainer = document.createElement('div');
    gameContainer.setAttribute('class', 'icon-text-container');

    const gameIcon = document.createElement('object');
    gameIcon.setAttribute('class', 'icon left');
    gameIcon.setAttribute('data', 'assets/gamepad.svg');
    gameContainer.appendChild(gameIcon);

    const game = document.createElement('span');
    game.setAttribute('class', 'game');
    game.innerHTML = gameName;
    gameContainer.appendChild(game);

    return gameContainer;
}

function createStreamerNameDiv(streamerName) {
    const nameContainer = document.createElement('div');
    nameContainer.setAttribute('class', 'icon-text-container');

    const nameIcon = document.createElement('object');
    nameIcon.setAttribute('class', 'icon left');
    nameIcon.setAttribute('data', 'assets/streamer.svg');
    nameContainer.appendChild(nameIcon);

    const name = document.createElement('span');
    name.setAttribute('class', 'username');
    name.innerHTML = streamerName;
    nameContainer.appendChild(name);

    return nameContainer;
}

function createTimeDiv(startedAt) {
    startedAt = new Date(startedAt);
    const timeContainer = document.createElement('div');
    timeContainer.setAttribute('class', 'icon-text-container');

    const timeIcon = document.createElement('object');
    timeIcon.setAttribute('class', 'icon left');
    timeIcon.setAttribute('data', 'assets/time.svg');
    timeContainer.appendChild(timeIcon);

    const startTime = document.createElement('div');
    startTime.innerHTML = chrome.i18n.getMessage('startedAt') + ' ' + startedAt.toLocaleTimeString();
    timeContainer.appendChild(startTime);

    return timeContainer;
}

function createViewersDiv(viewersNumber) {
    const viewersContainer = document.createElement('div');
    viewersContainer.setAttribute('class', 'icon-text-container');

    const viewers = document.createElement('div');
    viewers.innerHTML = viewersNumber;
    viewersContainer.appendChild(viewers);

    const viewersIcon = document.createElement('object');
    viewersIcon.setAttribute('class', 'icon right');
    viewersIcon.setAttribute('data', 'assets/viewers.svg');
    viewersContainer.appendChild(viewersIcon);

    return viewersContainer;
}

function displayAuthentication() {
    document.getElementById('authenticate').style.display = 'block';
    Array.prototype.forEach.call(document.getElementsByClassName('loading'), (element) => {
        element.style.display = 'none';
    });
}

function hideAuthentication() {
    document.getElementById('authenticate').style.display = 'none';
}

async function main() {
    document.getElementById('settings-button').addEventListener(
        'click',
        () => {
            chrome.runtime.openOptionsPage();
        },
        false
    );
    document.getElementById('authenticate-button').addEventListener(
        'click',
        () => {
            modules.twitch.connect(
                () => {
                    checkStreams();
                    hideAuthentication();
                }
            );
        },
        false
    );

    modules.twitch.syncUser(async () => {
        hideAuthentication();
        await checkStreams();
    }, displayAuthentication);

}

window.addEventListener('DOMContentLoaded', main, false);
