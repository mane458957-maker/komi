/* KŌMI — script partagé (= produits Shopify + panier en tiroir Horizon).
   Sur Shopify, PRODUCTS vient du catalogue et le panier de l'API /cart.js. Ici, tout est simulé. */

const PRODUCTS = [
  { id:"oranger",     name:"Miel d'Oranger",    fam:"mono", ing:"Fleur d'oranger · Espagne", price:14.90, color:"#F59A23",
    text:"Doux et très parfumé, avec les notes florales des vergers d'orangers en fleur.", tagline:"Le plus floral de la collection", tags:["Floral", "Doux", "Délicat"], profile:{douceur:4,intensite:2,floral:5}, pairings:["Yaourt grec", "Thé noir", "Crêpes"], fx:["blossom","drop"] },
  { id:"romarin",     name:"Miel de Romarin",   fam:"mono", ing:"Romarin · Espagne",         price:14.90, color:"#8DAA4B",
    text:"Clair et délicat, avec la fraîcheur herbacée du romarin en fleur.", tagline:"Clair, frais et délicat", tags:["Herbacé", "Doux", "Clair"], profile:{douceur:4,intensite:2,floral:3}, pairings:["Fromage frais", "Tisane", "Vinaigrette"], fx:["needle","blossom"] },
  { id:"thym",        name:"Miel de Thym",      fam:"mono", ing:"Thym · Espagne",            price:14.90, color:"#A94FAD",
    text:"Un miel de garrigue, puissant et légèrement épicé.", tagline:"Puissant et aromatique", tags:["Aromatique", "Puissant", "Épicé"], profile:{douceur:2,intensite:5,floral:3}, pairings:["Fromage de chèvre", "Figues rôties", "Pain grillé"], fx:["tiny","drop"] },
  { id:"jujubier",    name:"Miel de Jujubier",  fam:"mono", ing:"Jujubier · Espagne",        price:16.90, color:"#C2185B",
    text:"Ambré et intense, avec des notes boisées et chaudes.", tagline:"Ambré, boisé et intense", tags:["Ambré", "Boisé", "Intense"], profile:{douceur:3,intensite:5,floral:2}, pairings:["Thé à la menthe", "Pâtisseries", "Fruits secs"], fx:["leaf","drop"] },
  { id:"eucalyptus",  name:"Miel d'Eucalyptus", fam:"mono", ing:"Eucalyptus · Espagne",      price:14.90, color:"#58AEB4",
    text:"Frais et balsamique, avec une finale légèrement mentholée.", tagline:"Frais et balsamique", tags:["Frais", "Balsamique", "Ambré"], profile:{douceur:3,intensite:4,floral:2}, pairings:["Infusion", "Citron chaud", "Pain de seigle"], fx:["leaf","blossom"] },
  { id:"lavande",     name:"Miel de Lavande",   fam:"mono", ing:"Lavande · Espagne",         price:14.90, color:"#F6BD21",
    text:"Fin et floral, avec le parfum des champs de lavande en été.", tagline:"Fin et parfumé", tags:["Floral", "Fin", "Crémeux"], profile:{douceur:4,intensite:2,floral:5}, pairings:["Fromage blanc", "Madeleines", "Fruits rouges"], fx:["tiny","drop"] },
  { id:"energie",     name:"Énergie",           fam:"infu", ing:"Miel, ginseng, pollen & goji",  price:16.90, color:"#E93F62",
    text:"Un miel gourmand et intense, associé au ginseng, au pollen et aux baies de goji.", tagline:"Vif, épicé et zesté", tags:["Épicé", "Zesté", "Vif"], profile:{douceur:3,intensite:4,floral:1}, pairings:["Eau chaude citronnée", "Smoothie", "Marinade"], fx:["slice","drop"] },
  { id:"respiration", name:"Respiration",       fam:"infu", ing:"Miel, eucalyptus, menthe & thym",     price:16.90, color:"#2859B8",
    text:"Un miel aromatique et frais, aux notes d'eucalyptus, de menthe et de thym.", tagline:"Aromatique et résineux", tags:["Aromatique", "Résineux", "Herbacé"], profile:{douceur:3,intensite:4,floral:2}, pairings:["Infusion de thym", "Tisane du soir", "Tartine"], fx:["blossom","tiny"] },
  { id:"digestion",   name:"Digestion",         fam:"infu", ing:"Miel, gingembre, menthe & fenouil",      price:16.90, color:"#A7BA32",
    text:"Un miel doux et épicé, avec le gingembre, la menthe et la graine de fenouil.", tagline:"Doux et anisé", tags:["Anisé", "Doux", "Rond"], profile:{douceur:4,intensite:3,floral:2}, pairings:["Fin de repas", "Tisane", "Yaourt"], fx:["seed","blossom"] },
  { id:"relaxation",  name:"Relaxation",        fam:"infu", ing:"Miel, lavande, camomille & passiflore",   price:16.90, color:"#9D38A8",
    text:"Un miel floral et rond, avec la lavande, la camomille et la fleur de passiflore.", tagline:"Floral et velouté", tags:["Floral", "Velouté", "Safrané"], profile:{douceur:4,intensite:3,floral:4}, pairings:["Lait chaud", "Tisane du soir", "Riz au lait"], fx:["thread","blossom"] },
];
/* Photos d'ingrédients détourées : ajouter ici img/ing/<id>-1.webp, -2… dès qu'elles existent. */
const INGREDIENT_IMAGES = {};
const FAM = { mono:"Miel monofloral", infu:"Miel & plantes" };

const $ = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];
const byId = id => PRODUCTS.find(p=>p.id===id);
const jarSrc = p => `img/jar-${p.id}.webp`;
const euro = n => n.toFixed(2).replace(".",",") + " €";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function textOn(hex){
  const n = parseInt(hex.slice(1),16), c = [n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});
  return (.2126*c[0]+.7152*c[1]+.0722*c[2]) > .32 ? "#111111" : "#FFFFFF";
}

/* ---------- panier ---------- */
const Cart = {
  key:"komi-cart",
  items:[],
  load(){ try{ this.items = JSON.parse(localStorage.getItem(this.key)) || []; }catch(e){ this.items = []; } },
  save(){ try{ localStorage.setItem(this.key, JSON.stringify(this.items)); }catch(e){} },
  count(){ return this.items.reduce((s,i)=>s+i.q,0); },
  total(){ return this.items.reduce((s,i)=>s+i.q*(i.bundle ? i.price : byId(i.id).price),0); },
  addBundle(name, ids, price){ this.items.push({ id:"b"+Date.now(), q:1, name, bundle:ids, price }); this.save(); renderCart(); },
  add(id,q=1){ const it = this.items.find(i=>i.id===id); if(it) it.q += q; else this.items.push({id,q}); this.save(); renderCart(); },
  set(id,q){ if(q<=0) this.items = this.items.filter(i=>i.id!==id); else this.items.find(i=>i.id===id).q = q; this.save(); renderCart(); },
};

function menuCat(title, badge, cls, ids, trio){
  const minis = ids.map(id=>{ const p = byId(id); return `<a class="mini" href="produit.html?p=${p.id}" style="--c:${p.color}"><span class="sq"><img src="${jarSrc(p)}" alt="" loading="lazy"></span><small>${p.name.replace(/^Miel (d'|de )/,"")}</small></a>`; }).join("");
  return `<details class="cat"><summary>${title}${badge?`<span class="b ${cls}">${badge}</span>`:""}<span class="pl"><svg viewBox="0 0 18 18"><path d="M9 3v12M3 9h12"/></svg></span></summary>
    <div class="minis">${minis}</div>${trio?`<a class="all" href="produit.html?p=lavande">Composer un coffret trio</a>`:`<a class="all" href="index.html#boutique">Tout voir</a>`}</details>`;
}
function shellHTML(){
  return `
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-label="Panier" aria-hidden="true">
  <div class="dh"><h2 id="drawerTitle">Panier</h2><button class="icon" id="drawerClose" aria-label="Fermer le panier"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
  <div class="lines" id="lines"></div>
  <div class="df" id="drawerFoot">
    <div class="sub"><span>Sous-total</span><span id="subtotal">0,00 €</span></div>
    <small>Taxes incluses. Frais d'expédition calculés à l'étape du paiement. Prix d'exemple pour la maquette.</small>
    <a class="btn dark block" href="paiement.html">Procéder au paiement</a>
  </div>
</aside>
<div class="menu-scrim" id="menuScrim"></div>
<nav class="menu" id="menu" aria-hidden="true" aria-label="Menu">
  <div class="top"><a class="logo" href="index.html">KŌMI</a><span class="r"><button class="mi" aria-label="Rechercher"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg></button><button class="mi x" id="menuClose" aria-label="Fermer le menu"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></span></div>
  <div class="loc"><span class="pill"><i class="fl"></i>France · EUR</span><span class="lg"><b>Français</b><span>English</span></span></div>
  <a class="promo" href="produit.html?p=lavande"><span><b>Coffret trio −10 %</b><span>Composez votre trio parmi les 10 miels</span></span><i><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></i></a>
  <div class="cats">
    ${menuCat("Meilleures ventes", "Top 4", "", ["oranger","thym","lavande","relaxation"])}
    ${menuCat("Monofloraux", "", "", PRODUCTS.filter(p=>p.fam==="mono").map(p=>p.id))}
    ${menuCat("Miels & plantes", "", "", PRODUCTS.filter(p=>p.fam==="infu").map(p=>p.id))}
    ${menuCat("Coffrets", "Nouveau", "n", ["lavande","oranger","thym"], true)}
    ${menuCat("Toute la collection", "", "", PRODUCTS.map(p=>p.id))}
  </div>
  <div class="more"><p class="lbl">Plus de KŌMI</p>
    <div class="grid2">
      <a href="#"><svg viewBox="0 0 24 24"><path d="M12 3 4 7v10l8 4 8-4V7Z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg>Suivre ma commande</a>
      <a href="#"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>Aide &amp; FAQ</a>
      <a href="#"><svg viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" rx="2"/><path d="M12 9v11M4 13h16M12 9c-2-4-6-4-6-1s6 1 6 1Zm0 0c2-4 6-4 6-1s-6 1-6 1Z"/></svg>Cartes cadeaux</a>
      <a href="#"><svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/></svg>Avis clients</a>
      <a href="index.html#recettes"><svg viewBox="0 0 24 24"><path d="M4 20 14 10M14 10l3-6 3 3-6 3Z"/><path d="M6 14l4 4"/></svg>Recettes</a>
      <a href="index.html#histoire"><svg viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>Notre histoire</a>
      <a href="#"><svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.4-3.6 4.2-5.3 7.5-5.3s6.1 1.7 7.5 5.3"/></svg>Se connecter</a>
      <a href="#"><svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>Contact</a>
    </div>
    <div class="card"><b>Livraison en France</b><p>Paiement sécurisé, expédition soignée dans la boîte KŌMI. Une question ? Notre équipe vous répond par email.</p>
      <span class="pay"><span>CB</span><span>Visa</span><span>Mastercard</span><span>Apple Pay</span><span>Google Pay</span><span>PayPal</span></span></div>
    <div class="soc"><a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a><a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6"/></svg></a></div>
    <p class="foot">© 2026 KŌMI · Le miel, en couleurs.</p>
  </div>
</nav>`;
}
function renderCart(){
  const n = Cart.count();
  $$(".cart .n").forEach(b=>{ b.textContent = n; b.classList.toggle("on", n>0); });
  $$(".cart").forEach(b=>b.setAttribute("aria-label", `Panier, ${n} article${n>1?"s":""}`));
  const lines = $("#lines"); if(!lines) return;
  $("#drawerTitle").textContent = n ? `Panier (${n})` : "Panier";
  $("#drawerFoot").hidden = !n;
  if(!n){ lines.innerHTML = `<div class="empty"><p>Votre panier est vide</p><a class="btn dark" href="index.html#boutique" data-close>Continuer les achats</a></div>`; return; }
  lines.innerHTML = Cart.items.map(i=>{
    if(i.bundle){ const ps = i.bundle.map(byId); return `
    <div class="line" style="--c:${ps[0].color}">
      <div class="th stack">${ps.slice(0,3).map(p=>`<img src="${jarSrc(p)}" alt="">`).join("")}</div>
      <div><h3>${i.name}</h3><div class="meta">${ps.map(p=>p.name.replace(/^Miel /,"")).join(" · ")}</div>
        <div class="qty"><button data-q="${i.id}" data-d="-1" aria-label="Retirer un coffret">−</button><span>${i.q}</span><button data-q="${i.id}" data-d="1" aria-label="Ajouter un coffret">+</button></div></div>
      <div class="pr">${euro(i.price*i.q)}<button class="rm" data-rm="${i.id}">Supprimer</button></div>
    </div>`; }
    const p = byId(i.id); return `
    <div class="line" style="--c:${p.color}">
      <a class="th" href="produit.html?p=${p.id}"><img src="${jarSrc(p)}" alt=""></a>
      <div><h3>${p.name}</h3><div class="meta">250 g · ${euro(p.price)}</div>
        <div class="qty"><button data-q="${p.id}" data-d="-1" aria-label="Retirer un ${p.name}">−</button><span>${i.q}</span><button data-q="${p.id}" data-d="1" aria-label="Ajouter un ${p.name}">+</button></div></div>
      <div class="pr">${euro(p.price*i.q)}<button class="rm" data-rm="${p.id}">Supprimer</button></div>
    </div>`; }).join("");
  $("#subtotal").textContent = euro(Cart.total());
}
function openMenu(){ $("#menu").classList.add("on"); $("#menu").setAttribute("aria-hidden","false"); $("#menuScrim").classList.add("on"); document.body.classList.add("lock"); }
function closeMenu(){ const m = $("#menu"); if(!m || !m.classList.contains("on")) return; m.classList.remove("on"); m.setAttribute("aria-hidden","true"); $("#menuScrim").classList.remove("on"); document.body.classList.remove("lock"); }
function openDrawer(){ $("#drawer").classList.add("on"); $("#drawer").setAttribute("aria-hidden","false"); $("#scrim").classList.add("on"); document.body.classList.add("lock"); }
function closeDrawer(){ $("#drawer").classList.remove("on"); $("#drawer").setAttribute("aria-hidden","true"); $("#scrim").classList.remove("on"); document.body.classList.remove("lock"); }

function cardHTML(p){
  return `<article class="card" data-fam="${p.fam}" style="--c:${p.color}">
    <a class="ph" href="produit.html?p=${p.id}" aria-label="${p.name}"><img src="${jarSrc(p)}" alt="${p.name}, pot de 250 g" loading="lazy"></a>
    <div class="bd"><h3><a href="produit.html?p=${p.id}">${p.name}</a></h3><p class="ing">${p.ing}</p>
    <div class="ft"><span class="price">${euro(p.price)}</span><button class="add" data-add="${p.id}">Ajouter</button></div></div></article>`;
}

document.addEventListener("DOMContentLoaded", ()=>{
  document.body.insertAdjacentHTML("beforeend", shellHTML());
  Cart.load(); renderCart();
  document.addEventListener("click", e=>{
    const t = e.target;
    const add = t.closest("[data-add]"); if(add){ Cart.add(add.dataset.add, +(add.dataset.qty||1)); openDrawer(); return; }
    if(t.closest(".cart")){ openDrawer(); return; }
    if(t.closest("#drawerClose") || t.closest("#scrim") || t.closest("[data-close]")){ closeDrawer(); return; }
    const q = t.closest("[data-q]"); if(q){ const it = Cart.items.find(i=>i.id===q.dataset.q); Cart.set(q.dataset.q, it.q + +q.dataset.d); return; }
    const rm = t.closest("[data-rm]"); if(rm){ Cart.set(rm.dataset.rm, 0); return; }
    if(t.closest(".burger")){ openMenu(); return; }
    if(t.closest("#menuClose") || t.closest("#menuScrim") || t.closest("#menu a")){ closeMenu(); }
  });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ closeDrawer(); closeMenu(); } });
});
