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
    .then(x => console.log(x));
}


// $(() => {
//   const encodedURL = /\?feed\=(.*)/.exec(window.location.search)[1];
//   const feedURL = decodeURIComponent(encodedURL);

//   let playbackRate = 1.0;

//   $.ajax({
//     url: feedURL,
//     success: xml => {

//       $('h1').text($(xml).find('channel>title').text());
//       $('h2').text($(xml).find('channel>description').text());
//       // $('h3').text($(xml).find('channel>author').text());

//       const list = $('ol');

//       $(xml).find('channel>item').each((i, item) => {
//         const listItem = document.createElement('li');
//         $(list).append($(listItem));

//         const title = $('<h1></h1>');
//         title.text($(item).find('title').text());
//         $(listItem).append($(title));

//         const description = $('<p></p>');
//         description.text($(item).find('description').text());
//         $(listItem).append($(description));

//         var date = $('<h3></h3>');
//         date.text($(item).find('pubDate').text());
//         $(listItem).append($(date));

//         const playerWrapper = $('<div></div>');
//         $(listItem).append($(playerWrapper));

//         const audio = $('<audio controls preload="none"></audio>');
//         $(playerWrapper).append($(audio));

//         const src = $(item).find('enclosure').attr('url');
//         const source = $('<source type="audio/mp3">');
//         $(source).attr('src', src);
//         $(audio).append($(source));
//       });

//       $('#playback-rate').change(function (e) {
//         playbackRate = this.value;

//         $('audio').each((i, audio) => {
//           audio.playbackRate = playbackRate;
//         });
//       });

//       $('.overlay').remove();
//     },
//   });
// });
