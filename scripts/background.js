'use strict';

//  Copyright (c) 2015 Christopher Kalafarski.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

// When the content script finds iTunes ID's it passes them in a message, which
// this event script will listen for. The event script queries the iTunes lookup
// API to get the RSS feed URL associated with each iTunes ID. That data gets
// placed in local storage so other parts of the extension can access it. Data
// may also be passed as a raw feed URL, in which case the iTunes lookup is not
// done.

chrome.tabs.onRemoved.addListener(purge);
chrome.runtime.onMessage.addListener(receive);

var data = {};

// Removes data about the given tab from the data store
function purge(tabId) { delete data[tabId]; }

async function lookup(ids) {
  return new Promise((resolve, reject) => {
    if (!ids.length) { resolve({}); return; }

    fetch(`https://itunes.apple.com/lookup?id=${ids.join(',')}`)
      .then(response => response.json())
      .then(data => {
        resolve(data.results.reduce((agg, result) => {
          return Object.assign(agg, {
            [result.feedUrl]: {
              href: result.feedUrl,
              title: result.trackName,
              rel: 'iTunes',
              iTunesURL: result.collectionViewUrl
            }
          });
        }, {}));
      });
  });
}

async function receive(message, sender) {
  data[sender.tab.id] = {};

  const podcasts = await lookup(message.iTunesIds);
  Object.assign(data[sender.tab.id], podcasts, message.podcasts)

  if (Object.keys(data[sender.tab.id]).length) {
    const n = Object.keys(data[sender.tab.id]).length;
    chrome.browserAction.setBadgeText({text: `${n}`, tabId: sender.tab.id});
    chrome.browserAction.enable(sender.tab.id);
  } else {
    chrome.browserAction.setBadgeText({text: '', tabId: sender.tab.id});
    chrome.browserAction.disable(sender.tab.id);
  }
}
