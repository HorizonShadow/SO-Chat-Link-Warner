// ==UserScript==
// @name        Link Warning
// @namespace   ~
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
        var doc = new DOMParser().parseFromString(s, "text/html");
        return tests.some(function (t) {
          return t(doc);
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
      mutations = mapcat(mutations, function (mutation) {
        return mutation.addedNodes;
      });
      return mapcat(mutations, function (addedNode) {
        return addedNode.querySelectorAll('.content a');
      });
    }
  }]);

  return ChatWatcher;
})();

function mapcat(thing, fn) {
  return thing.reduce(function (prev, curr) {
    var _Array$from;

    return (_Array$from = Array.from(prev)).concat.apply(_Array$from, _toConsumableArray(fn(curr)));
  }, fn(thing[0]), 0);
}

function markAnchor(a) {
  a.style.background = "red";
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
