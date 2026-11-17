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
  { id:"energie",     name:"Énergie",           fam:"infu", ing:"Miel, gingembre & citron",  price:16.90, color:"#E93F62",
    text:"Un miel vif et pétillant, relevé de gingembre et d'un zeste de citron.", tagline:"Vif, épicé et zesté", tags:["Épicé", "Zesté", "Vif"], profile:{douceur:3,intensite:4,floral:1}, pairings:["Eau chaude citronnée", "Smoothie", "Marinade"], fx:["slice","drop"] },
  { id:"respiration", name:"Respiration",       fam:"infu", ing:"Miel, propolis & thym",     price:16.90, color:"#2859B8",
    text:"Un miel aromatique, avec la propolis et le thym des collines.", tagline:"Aromatique et résineux", tags:["Aromatique", "Résineux", "Herbacé"], profile:{douceur:3,intensite:4,floral:2}, pairings:["Infusion de thym", "Tisane du soir", "Tartine"], fx:["blossom","tiny"] },
  { id:"digestion",   name:"Digestion",         fam:"infu", ing:"Miel, fenouil & anis",      price:16.90, color:"#A7BA32",
    text:"Un miel doux aux notes anisées du fenouil et de l'anis vert.", tagline:"Doux et anisé", tags:["Anisé", "Doux", "Rond"], profile:{douceur:4,intensite:3,floral:2}, pairings:["Fin de repas", "Tisane", "Yaourt"], fx:["seed","blossom"] },
  { id:"relaxation",  name:"Relaxation",        fam:"infu", ing:"Miel, safran & verveine",   price:16.90, color:"#9D38A8",
    text:"Un miel floral, avec quelques pistils de safran et la douceur de la verveine.", tagline:"Floral et velouté", tags:["Floral", "Velouté", "Safrané"], profile:{douceur:4,intensite:3,floral:4}, pairings:["Lait chaud", "Tisane du soir", "Riz au lait"], fx:["thread","blossom"] },
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
<div class="menu" id="menu" aria-hidden="true">
  <div class="top"><span class="logo" style="font-size:1.6rem">KŌMI</span><button class="icon" id="menuClose" aria-label="Fermer le menu"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
  <nav><a class="big" href="index.html#boutique">Boutique</a><a class="big" href="index.html#coffrets">Coffrets</a><a class="big" href="index.html#recettes">Recettes</a><a class="big" href="index.html#histoire">Notre histoire</a></nav>
</div>`;
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
    if(t.closest(".burger")){ $("#menu").classList.add("on"); $("#menu").setAttribute("aria-hidden","false"); return; }
    if(t.closest("#menuClose") || t.closest("#menu a")){ $("#menu").classList.remove("on"); $("#menu").setAttribute("aria-hidden","true"); }
  });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ closeDrawer(); $("#menu").classList.remove("on"); } });
});
