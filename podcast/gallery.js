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

$(() => {
  const opts = {
    lines: 13, // The number of lines to draw
    length: 16, // The length of each line
    width: 6, // The line thickness
    radius: 45, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1.3, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };
  const target = document.getElementById('spinner');
  const spinner = new Spinner(opts).spin(target);

  const encodedURL = /\?feed\=(.*)/.exec(window.location.search)[1];
  const feedURL = decodeURIComponent(encodedURL);

  let playbackRate = 1.0;

  $.ajax({
    url: feedURL,
    success: xml => {

      $('h1').text($(xml).find('channel>title').text());
      $('h2').text($(xml).find('channel>description').text());
      // $('h3').text($(xml).find('channel>author').text());

      const list = $('ol');

      $(xml).find('channel>item').each((i, item) => {
        const listItem = document.createElement('li');
        $(list).append($(listItem));

        const title = $('<h1></h1>');
        title.text($(item).find('title').text());
        $(listItem).append($(title));

        const description = $('<p></p>');
        description.text($(item).find('description').text());
        $(listItem).append($(description));

        var date = $('<h3></h3>');
        date.text($(item).find('pubDate').text());
        $(listItem).append($(date));

        const playerWrapper = $('<div></div>');
        $(listItem).append($(playerWrapper));

        const audio = $('<audio controls preload="none"></audio>');
        $(playerWrapper).append($(audio));

        const src = $(item).find('enclosure').attr('url');
        const source = $('<source type="audio/mp3">');
        $(source).attr('src', src);
        $(audio).append($(source));
      });

      $('#playback-rate').change(function (e) {
        playbackRate = this.value;

        $('audio').each((i, audio) => {
          audio.playbackRate = playbackRate;
        });
      });

      $('.overlay').remove();
    },
  });
});
