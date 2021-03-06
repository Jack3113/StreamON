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

/* global chrome */

var ids = [
    'title',
    'onlineTitle',
    'offlineTitle',
    'streamsLabel',
    'message',
    'streamsHelp',
    'addTwitch',
    'username',
    'importTwitch',
    'notifLabel',
    'titleNotifLabel',
    'refreshTimeLabel',
];
function fill(id) {
    if (document.getElementById(id)) {
        document.getElementById(id).innerHTML = chrome.i18n.getMessage(id);
    }
}

window.addEventListener(
    'DOMContentLoaded',
    function() {
        for (var i in ids) {
            if (ids.hasOwnProperty(i)) {
                fill(ids[i]);
            }
        }
    },
    false,
);
