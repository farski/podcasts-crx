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

var _store = {};

chrome.tabs.onRemoved.addListener(tabId => delete _store[tabId]);

chrome.extension.onMessage.addListener((podcasts, sender) => {
  const map = {};
  for (let podcast of podcasts) { map[podcast.href] = podcast; }
  _store[sender.tab.id] = map;

  if (Object.keys(_store[sender.tab.id]).length) {
    chrome.pageAction.show(sender.tab.id);
  }
});
