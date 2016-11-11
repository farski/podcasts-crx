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

const DOM_CONTENT_LOADED = 'DOMContentLoaded';
const CLICK = 'click';

function onContentLoaded() {
  chrome.tabs.getSelected(tab => {
    chrome.storage.local.get(tab.id.toString(), result => {
      const list = document.getElementById('feeds');

      for (let feed of result[tab.id]) {
        const encodedFeedURL = encodeURIComponent(feed.href);
        const galleryPath = "/podcast/gallery.html?feed=" + encodedFeedURL;

        const item = document.createElement('li');
        list.appendChild(item);

        const content = document.createElement('a');
        content.href = galleryPath;
        item.appendChild(content);

        const h1 = document.createElement('h1');
        h1.appendChild(document.createTextNode(feed.title));
        content.appendChild(h1);

        const url = document.createElement('span');
        url.innerHTML = feed.href;
        content.appendChild(url);

        const p = document.createElement('p');
        content.appendChild(p);

        const rssLink = document.createElement('a');
        rssLink.href = feed.href;
        rssLink.innerHTML = 'RSS'
        p.appendChild(rssLink);

        const itunesLink = document.createElement('a');
        itunesLink.href = feed.iTunesURL;
        itunesLink.innerHTML = 'iTunes'
        p.appendChild(itunesLink);

        const podcastLink = document.createElement('a');
        podcastLink.href = galleryPath;
        podcastLink.innerHTML = 'Preview'
        p.appendChild(podcastLink);

        const copy = document.createElement('button');
        copy.addEventListener(CLICK, event => {
          event.preventDefault();
          const textArea = document.createElement('textarea');
          textArea.value = feed.href;
          content.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          content.removeChild(textArea);
          event.stopPropagation();
        });
        content.appendChild(copy);

        content.addEventListener(CLICK, function (e) {
          chrome.tabs.create({ url: this.getAttribute('href') });
        });

        podcastLink.addEventListener(CLICK, function (e) {
          chrome.tabs.create({ url: this.getAttribute('href') });
          e.stopPropagation();
        });

        rssLink.addEventListener(CLICK, function (e) {
          chrome.tabs.create({ url: this.getAttribute('href') });
          e.stopPropagation();
        });

        itunesLink.addEventListener(CLICK, function (e) {
          chrome.tabs.create({ url: this.getAttribute('href') });
          e.stopPropagation();
        });
      }
    });
  });
}

document.addEventListener(DOM_CONTENT_LOADED, onContentLoaded);
