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

function main() {
  chrome.tabs.getSelected(function(tab) {
    chrome.storage.local.get(tab.id.toString(), function(result) {
      var _list = document.getElementById('feeds');
      var feeds = result[tab.id];

      for (var i = 0; i < feeds.length; ++i) {

        var feedURL = feeds[i].href;
        var feedTitle = feeds[i].title;
        var encodedFeedURL = encodeURIComponent(feedURL);
        var galleryPath = "/podcast/gallery.html?feed=" + encodedFeedURL;

        var _item = document.createElement('li');
        _list.appendChild(_item);

        var _block = document.createElement('a');
        _block.href = galleryPath;
        _item.appendChild(_block);

        var _h1 = document.createElement('h1');
        _h1.appendChild(document.createTextNode(feedTitle));
        _block.appendChild(_h1);

        var _url = document.createElement('span');
        _url.innerHTML = feedURL;
        _block.appendChild(_url);

        var _p = document.createElement('p');
        _block.appendChild(_p);

        var _rssLink = document.createElement('a');
        _rssLink.href = feedURL;
        _rssLink.innerHTML = 'RSS'
        _p.appendChild(_rssLink);

        var _podcastLink = document.createElement('a');
        _podcastLink.href = galleryPath;
        _podcastLink.innerHTML = 'Podcast'
        _p.appendChild(_podcastLink);

        _block.addEventListener("click", function(e) {
          chrome.tabs.create({ url: this.getAttribute('href') });
        });

        _podcastLink.addEventListener("click", function(e) {
          chrome.tabs.create({ url: this.getAttribute('href') });
          e.stopPropagation();
        });

        _rssLink.addEventListener("click", function(e) {
          chrome.tabs.create({ url: this.getAttribute('href') });
          e.stopPropagation();
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', main);
