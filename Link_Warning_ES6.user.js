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