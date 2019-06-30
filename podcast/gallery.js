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

document.addEventListener(DOM_CONTENT_LOADED, onContentLoaded);

function onContentLoaded() {
  const encodedURL = /\?feed\=(.*)/.exec(window.location.search)[1];
  const feedURL = decodeURIComponent(encodedURL);

  fetch(feedURL)
    .then(response => response.text())
    .then(xml => (new DOMParser()).parseFromString(xml, 'application/xml'))
    .then(load);
}

function load(xmlDocument) {
  document.getElementById('title').innerText = xmlDocument.querySelector('channel > title').textContent;
  document.getElementById('description').innerHTML = xmlDocument.querySelector('channel > description').textContent;

  const list = document.getElementById('episodes');
  Array.from(xmlDocument.querySelectorAll('channel > item')).forEach((item, i, a) => {
    let li = list.appendChild(document.createElement('li'));

    li.appendChild(document.createElement('h1')).innerText = item.querySelector('title').textContent;
    li.appendChild(document.createElement('p')).innerHTML = item.querySelector('description').textContent;
    li.appendChild(document.createElement('h3')).innerText = item.querySelector('pubDate').textContent;
    li.appendChild(document.createElement('h4')).innerText = (a.length - i);

    const div = li.appendChild(document.createElement('div'));

    const audio = div.appendChild(document.createElement('audio'))
    audio.setAttribute('preload', 'none');
    audio.setAttribute('controls', 'controls');
    audio.setAttribute('src', item.querySelector('enclosure').getAttribute('url'));
  });
}
