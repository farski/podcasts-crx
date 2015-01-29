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

chrome.extension.onMessage.addListener(function(request, sender) {
  if (request.msg == "iTunesIDPopUpShowMessage") {
    var iTunesIDs = request.iTunesIDs;
    var param = iTunesIDs.join(',');

    // Get the podcasts' RSS feed URLs from the iTunes API
    // eg: https://itunes.apple.com/lookup?id=12345,67890

    var url = "https://itunes.apple.com/lookup?id=" + param;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = JSON.parse(xhr.responseText);

        if (resp && resp.results && resp.results.length > 0) {
          var feeds = {};
          var input = [];

          for (var i = 0; i < resp.results.length; i++) {
            var result = resp.results[i];
            var feedURL = result.feedUrl;
            var trackName = result.trackName;

            var feed = { "href": feedURL, "title": trackName, "rel": "Podcast" };
            input.push(feed);
          }

          if (input.length == 0) {
            return;
          }

          feeds[sender.tab.id] = input;

          chrome.storage.local.set(feeds, function() {
            chrome.pageAction.show(sender.tab.id);
          });
        }
      }
    }
    xhr.send();
  }

  if (request.msg == "pageActionPopUpShowMessage") {

    var input = [];

    for (var i = 0; i < request.feeds.length; ++i) {
      var a = document.createElement('a');
      a.href = request.feeds[i].href;
      if (a.protocol == "http:" || a.protocol == "https:") {
        input.push(request.feeds[i]);
      }
    }

    if (input.length == 0) {
      return;
    }

    var feeds = {};
    feeds[sender.tab.id] = input;

    chrome.storage.local.set(feeds, function() {
      chrome.pageAction.show(sender.tab.id);
    });
  }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.storage.local.remove(tabId.toString());
});
