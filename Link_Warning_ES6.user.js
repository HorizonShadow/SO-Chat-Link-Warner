class AnchorTester {
  constructor(a) {
    this.a = a;
  }
  title(d) {
    let hitTerms = [
      'rlemon',
      'rebecca',
      'black,'
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
      return tests.some(t => t(doc));
    });
  }
}
class ChatWatcher {
  constructor(chat, fn) {
    this.chat = chat;  
    this.mutationObserver = new MutationObserver(fn);
  }
  
  static filterAnchors(mutations) {
    mutations = mapcat(mutations, mutation => mutation.addedNodes)
    return mapcat(mutations, addedNode => addedNode.querySelectorAll('.content a'));
  }

  watch() {
    let options = {
      childList: true,
      subtree: true
    }
    this.mutationObserver.observe(this.chat, options);
  }
}


function mapcat(thing, fn) {
  return thing.reduce((prev, curr) => Array.from(prev).concat(...fn(curr)), fn(thing[0]), 0);
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