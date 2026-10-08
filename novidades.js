// Career Hub — aviso de novidades (aparece só 1x depois de cada atualização).
// A CADA ATUALIZAÇÃO: mude "versao" (qualquer texto novo) e troque os "itens". Depois: firebase deploy.
(function () {
  var NOVIDADES = {
    versao: "2026-10-07",
    titulo: "O Career Hub atualizou!",
    itens: [
      "Ícone novo, com cantos arredondados",
      "Atualização automática: o app agora se atualiza sozinho",
      "Esta tela de novidades"
    ]
  };

  var CHAVE = "ch-novidades-visto";
  var visto = null;
  try { visto = localStorage.getItem(CHAVE); } catch (e) { return; }

  // Pessoa totalmente nova (nada guardado ainda): não mostra, só guarda a versão atual.
  if (visto === null && localStorage.length === 0) {
    try { localStorage.setItem(CHAVE, NOVIDADES.versao); } catch (e) {}
    return;
  }
  if (visto === NOVIDADES.versao) return;

  var css = document.createElement("style");
  css.textContent =
    ".nv-fundo{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(5,9,14,.72);backdrop-filter:blur(4px)}" +
    ".nv-caixa{width:100%;max-width:420px;background:var(--s1,#131d28);border:1px solid var(--g-line,rgba(56,217,138,.38));border-radius:var(--r-lg,18px);padding:26px 24px 22px;color:var(--tx,#e9eff6);font-family:var(--f-body,system-ui,sans-serif);box-shadow:0 20px 60px rgba(0,0,0,.5)}" +
    ".nv-caixa h2{margin:0 0 4px;font-family:var(--f-head,system-ui,sans-serif);font-size:1.3rem}" +
    ".nv-sub{margin:0 0 16px;color:var(--mut,#8c9db0);font-size:.9rem}" +
    ".nv-caixa ul{margin:0 0 22px;padding:0;list-style:none;display:grid;gap:10px}" +
    ".nv-caixa li{position:relative;padding-left:26px;line-height:1.4}" +
    ".nv-caixa li::before{content:'✓';position:absolute;left:0;top:0;color:var(--g,#38d98a);font-weight:700}" +
    ".nv-btn{width:100%;border:0;border-radius:var(--r-sm,10px);padding:12px;background:var(--g,#38d98a);color:#06140d;font-weight:700;font-size:1rem;cursor:pointer}";
  document.head.appendChild(css);

  function mostrar() {
    var f = document.createElement("div");
    f.className = "nv-fundo";
    var c = document.createElement("div");
    c.className = "nv-caixa";
    var h = document.createElement("h2"); h.textContent = NOVIDADES.titulo;
    var p = document.createElement("p"); p.className = "nv-sub"; p.textContent = "Veja o que chegou de novo:";
    var ul = document.createElement("ul");
    NOVIDADES.itens.forEach(function (t) {
      var li = document.createElement("li"); li.textContent = t; ul.appendChild(li);
    });
    var b = document.createElement("button"); b.className = "nv-btn"; b.textContent = "Entendi";
    function fechar() {
      try { localStorage.setItem(CHAVE, NOVIDADES.versao); } catch (e) {}
      f.remove();
    }
    b.addEventListener("click", fechar);
    f.addEventListener("click", function (e) { if (e.target === f) fechar(); });
    c.append(h, p, ul, b); f.appendChild(c); document.body.appendChild(f);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(mostrar, 800); });
  } else {
    setTimeout(mostrar, 800);
  }
})();