// ==UserScript==
// @name        Link Warning
// @namespace   Joshleblanc94@gmail.com
// @include     http://chat.stackoverflow.com/rooms/1*
// @version     1
// @grant       none
// ==/UserScript==
function exec(fn) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = '(' + fn + ')()';
  document.body.appendChild(script);
}
exec(function () {
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AnchorTester = (function () {
  function AnchorTester(a) {
    _classCallCheck(this, AnchorTester);

    this.a = a;
  }

  _createClass(AnchorTester, [{
    key: 'title',
    value: function title(d) {
      var hitTerms = ['rlemon', 'rebecca', 'black', 'friday', 'rebecca.blackfriday', 'astley'];
      var regex = hitTerms.join('|');
      return d.title.match(new RegExp(regex, 'i'));
    }
  }, {
    key: 'embeddedFrame',
    value: function embeddedFrame(d) {
      return d.querySelector('frame');
    }
  }, {
    key: 'test',
    value: function test() {
      var tests = [this.title, this.embeddedFrame];
      return fetch('http://crossorigin.me/' + this.a.href).then(function (r) {
        return r.text();
      }).then(function (s) {
        var doc = new DOMParser().parseFromString(s, 'text/html');
        return !tests.every(function (t) {
          return !t(doc);
        });
      });
    }
  }]);

  return AnchorTester;
})();

var ChatWatcher = (function () {
  function ChatWatcher(chat, fn) {
    _classCallCheck(this, ChatWatcher);

    this.chat = chat;
    this.mutationObserver = new MutationObserver(fn);
  }

  _createClass(ChatWatcher, [{
    key: 'watch',
    value: function watch() {
      var options = {
        childList: true,
        subtree: true
      };
      this.mutationObserver.observe(this.chat, options);
    }
  }], [{
    key: 'filterAnchors',
    value: function filterAnchors(mutations) {
      var anchors = [];
      mutations.forEach(function (mutation) {
        var addedNodes = mutation.addedNodes;
        anchors = map(addedNodes, function (a) {
          if (a.classList.contains('user-container') || a.classList.contains('message')) {
            return a.querySelectorAll('.content a');
          } else return null;
        }).filter(Boolean);
      });
      if (anchors.length > 0) anchors = [].reduce.call(anchors, function (a, b) {
        return [].concat(_toConsumableArray(a), _toConsumableArray(b));
      });
      return [].slice.call(anchors);
    }
  }]);

  return ChatWatcher;
})();

function flatten(thing) {
  return [].reduce.call(thing, function (a, b) {
    return [].concat.call(a, b);
  });
}
function map(target, fn) {
  return [].map.call(target, fn);
}
function markAnchor(a) {
  a.style.background = 'red';
}
var chatWatcher = new ChatWatcher(chat, function (mutations) {
  ChatWatcher.filterAnchors(mutations).forEach(function (a) {
    new AnchorTester(a).test().then(function (b) {
      if (b) markAnchor(a);
    });
  });
});
chatWatcher.watch();
});



/* RAW


class AnchorTester {
    constructor(a) {
      this.a = a;
    }
    title(d) {
      let hitTerms = [
        'rlemon',
        'rebecca',
        'black',
        'friday',
        'rebecca.blackfriday',
        'astley'
      ]
      let regex = hitTerms.join('|');
      return d.title.match(new RegExp(regex, 'i'));
    }
    embeddedFrame(d) {
      return d.querySelector('frame');
    }
    test() {
      let tests = [this.title, this.embeddedFrame];
      return fetch('http://crossorigin.me/' + this.a.href).then(r => r.text()).then(s => {
        let doc = new DOMParser().parseFromString(s, "text/html");
        return !tests.every(t => !t(doc));
      });
    
    }
  }
  class ChatWatcher {
    constructor(chat, fn) {
      this.chat = chat;  
      this.mutationObserver = new MutationObserver(fn);
    }
    static filterAnchors(mutations) {
      let anchors = [];
      mutations.forEach(mutation => {
        let addedNodes = mutation.addedNodes;
        anchors = map(addedNodes, a => {
          if(a.classList.contains("user-container") || a.classList.contains("message")) {
            return a.querySelectorAll('.content a')
          } else return null;
        }).filter(Boolean);
      });
      if(anchors.length > 0) anchors = [].reduce.call(anchors, (a,b) => [...a, ...b]);
      return [].slice.call(anchors);
    }
    watch() {
      let options = {
        childList: true,
        subtree: true
      }
      this.mutationObserver.observe(this.chat, options);
    }
  }
  function flatten (thing) {
  return [].reduce.call(thing,(a,b) => [].concat.call(a, b));
  }
  function map(target, fn) {
    return [].map.call(target, fn)
  }
  function markAnchor(a) {
    a.style.background = "red";
  }
  let chatWatcher = new ChatWatcher(chat, mutations => {
    ChatWatcher.filterAnchors(mutations).forEach(a => {
      new AnchorTester(a).test().then(b => {
        if(b) markAnchor(a);
      });
    });
  });
  chatWatcher.watch();

*/
