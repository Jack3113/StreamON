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
 */

/* global chrome, modules, tools */

async function checkStreams(silent = false) {
    chrome.storage.sync.get(
        {
            background: true,
        },
        async (options) => {
            if (options.background) {
                await modules.twitch.checkStreams(false, silent);
            }
        },
    );
}

function openMiniPlayer(info, tab) {
    if (info.frameUrl)
        // is a embed player
        tools.openMiniPlayer(info.linkURL, true);
    else if (info.linkUrl)
        // is a link
        tools.openMiniPlayer(info.linkURL, true);
    else tools.openMiniPlayer(tab.url, true);
}

async function main() {
    chrome.storage.sync.get(
        {
            contextMenu: true,
            launched: false,
        },
        (options) => {
            if (options.contextMenu) {
                const menu = chrome.contextMenus.create({
                    title: 'stream[on]',
                    contexts: ['all'],
                });
                const miniPlayerMenu = chrome.contextMenus.create({
                    title: chrome.i18n.getMessage('openMiniPlayer'),
                    contexts: ['page', 'link', 'selection', 'audio', 'video', 'frame'],
                    parentId: menu,
                    onclick: openMiniPlayer,
                });
            }

            if (!options.launched) {
                chrome.storage.sync.set(
                    {
                        launched: true,
                    },
                    () => {
                        tools.displayNotification(
                            chrome.i18n.getMessage('welcomeMessage'),
                            'assets/icon512.png',
                            chrome.i18n.getMessage('clickHereToOpenOptions'),
                            chrome.runtime.openOptionsPage,
                        );
                    },
                );
            }
        },
    );

    chrome.storage.sync.get(
        {
            refreshTime: 60,
        },
        (options) => {
            checkStreams(true);
            setInterval(checkStreams, 1000 * options.refreshTime);
        },
    );
}

main();
