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

// This is run in the context of a webpage. It detects podcasts in several
// ways:
// * If the current page is an iTunes Preview page for a podcast
// * Finding links to iTunes Preview pages for podcasts
// If any podcasts are found, the data is passed to the event page script

function iTunesIdFromApplePreviewPage() {
  // See if this is an iTunes Preview page for a podcast
  if (document.location.hostname === 'itunes.apple.com') {
    if (document.location.pathname.includes('podcast')) {
      // Extract the iTunes ID from the URL
      const result = /\/id([0-9]+)/.exec(document.location.pathname)
      if (result) {
        return [result[1]];
      }
    }
  }

  return [];
}

function iTunesIdsFromApplePreviewLinks() {
  const iTunesIDs = new Set();

  // Look for anchor tags pointing to iTunes Preview pages
  const xpath = '//a[contains(@href, "apple.com")]';
  const anchors = document.evaluate(xpath, document, null, 0, null);

  let anchor;
  while (anchor = anchors.iterateNext()) {
    var result = /podcast\/.*\/id([0-9]+)/.exec(anchor.getAttribute('href'));
    if (result) {
      iTunesIDs.add(result[1]);
    }
  }

  return [...iTunesIDs];
}

function iTunesIds() {
  const page = iTunesIdFromApplePreviewPage();
  const links = iTunesIdsFromApplePreviewLinks();
  const all = page.concat(links);
  const uniq = new Set(all);
  return [...uniq];
}

// Return all link tags (as a node list) that have a podcast type
function linkTags() {
  const mediaType = 'application/rss+xml;syndication=podcast'
  const xpath = `//*[local-name()="link"][contains(@type, "${mediaType}")]`;
  return document.evaluate(xpath, document, null, 0, null);
}

// Return an object of podcast data derived from the link tags
function podcastsFromLinkTags() {
  const feeds = {};

  let link;
  while (link = linkTags().iterateNext()) {
    feeds[link.getAttribute('href')] = {
      href: link.getAttribute('href'),
      title: link.getAttribute('title'),
      rel: 'Alternate'
    }
  };

  return feeds;
}

(async () => {
  chrome.runtime.sendMessage({
    podcasts: podcastsFromLinkTags(),
    iTunesIds: iTunesIds()
  });
})();
