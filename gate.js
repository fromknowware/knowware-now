(function () {
  var KEY = 'kw-auth';
  if (sessionStorage.getItem(KEY) === '1') return;

  var CSS = [
    '#kw-gate{',
      'position:fixed;inset:0;z-index:99999;',
      'display:flex;align-items:center;justify-content:center;',
      'backdrop-filter:blur(32px) saturate(1.05);',
      '-webkit-backdrop-filter:blur(32px) saturate(1.05);',
      'background:rgba(250,250,249,0.22);',
      'transition:opacity 0.65s cubic-bezier(0.19,1,0.22,1);',
    '}',
    'html[data-theme="dark"] #kw-gate{background:rgba(17,17,16,0.22);}',
    'html[data-theme="warm"] #kw-gate{background:rgba(232,229,222,0.22);}',
    '#kw-gate.kw-out{opacity:0;pointer-events:none;}',
    '#kw-gate-label{',
      'display:block;text-align:center;margin-bottom:20px;',
      'font-family:"JetBrains Mono",ui-monospace,monospace;',
      'font-size:10px;letter-spacing:0.18em;text-transform:uppercase;',
      'color:rgba(10,10,10,0.3);',
    '}',
    'html[data-theme="dark"] #kw-gate-label{color:rgba(240,240,234,0.3);}',
    '#kw-gate-input{',
      'display:block;',
      'font-family:"JetBrains Mono",ui-monospace,monospace;',
      'font-size:15px;background:transparent;border:none;',
      'border-bottom:1px solid rgba(10,10,10,0.15);',
      'outline:none;padding:10px 4px;width:172px;',
      'text-align:center;color:rgba(10,10,10,0.6);letter-spacing:0.1em;',
    '}',
    'html[data-theme="dark"] #kw-gate-input{',
      'border-bottom-color:rgba(240,240,234,0.15);',
      'color:rgba(240,240,234,0.6);',
    '}',
    '#kw-gate-input::placeholder{color:rgba(10,10,10,0.15);}',
    'html[data-theme="dark"] #kw-gate-input::placeholder{color:rgba(240,240,234,0.15);}',
    '#kw-gate-input.kw-err{',
      'border-bottom-color:rgba(200,50,30,0.45);',
      'animation:kw-shake 0.28s ease;',
    '}',
    '@keyframes kw-shake{',
      '0%,100%{transform:translateX(0);}',
      '30%{transform:translateX(-7px);}',
      '70%{transform:translateX(7px);}',
    '}',
  ].join('');

  function mount() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var gate = document.createElement('div');
    gate.id = 'kw-gate';

    var inner = document.createElement('div');

    var label = document.createElement('span');
    label.id = 'kw-gate-label';
    label.textContent = 'knowware';

    var input = document.createElement('input');
    input.id = 'kw-gate-input';
    input.type = 'password';
    input.placeholder = '——';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');

    inner.appendChild(label);
    inner.appendChild(input);
    gate.appendChild(inner);
    document.body.insertBefore(gate, document.body.firstChild);

    setTimeout(function () { input.focus(); }, 80);

    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') { input.classList.remove('kw-err'); return; }
      if (input.value.trim().toLowerCase() === 'coordinate') {
        sessionStorage.setItem(KEY, '1');
        gate.classList.add('kw-out');
        setTimeout(function () { gate.remove(); style.remove(); }, 700);
      } else {
        input.value = '';
        input.classList.add('kw-err');
        setTimeout(function () { input.classList.remove('kw-err'); }, 500);
      }
    });
  }

  if (document.body) { mount(); }
  else { document.addEventListener('DOMContentLoaded', mount); }
})();
