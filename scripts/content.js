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

(function() {
  // See if it's a iTunes Preview page for a podcast
  if (document.location.hostname == "itunes.apple.com" && document.location.pathname.search("podcast") != -1) {
    // Extract the iTunes ID from the URL
    var result = /\/id([0-9]+)/.exec(document.location.pathname);
    if (result) {
      var iTunesID = result[1];
      chrome.extension.sendMessage({msg: "iTunesIDPopUpShowMessage", iTunesIDs: [iTunesID]});
    }
    return;
  } else {
    var iTunesLinks = document.evaluate('//a[contains(@href, "itunes")]', document, null, 0, null);
    var iTunesIDs = [];

    while (anchor = iTunesLinks.iterateNext()) {
      var href = anchor.getAttribute('href');
      var result = /podcast\/.*\/id([0-9]+)/.exec(href);
      if (result) {
        var iTunesID = result[1];
        iTunesIDs.push(iTunesID);
      }
    }

    if (iTunesIDs.length > 0) {
      chrome.extension.sendMessage({msg: "iTunesIDPopUpShowMessage", iTunesIDs: iTunesIDs});
      return;
    }
  }






  // var result = document.evaluate(
  //     '//*[local-name()="link"][contains(@rel, "alternate")] ' +
  //     '[contains(@type, "rss")]', document, null, 0, null);
  //
  // var feeds = [];
  // var el;
  //
  // while (el = result.iterateNext()) {
  //   var feed = { "href": el.href, "title": el.title, "mimetype": el.type, "rel": el.rel };
  //   feeds.push(feed);
  // }
  //
  // if (feeds.length > 0) {
  //   chrome.extension.sendMessage({msg: "pageActionPopUpShowMessage", feeds: feeds});
  // }
})();
