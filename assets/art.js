/* KŌMI — ingrédients dessinés (provisoires, remplacés par les photos détourées dès qu'elles existent) */
let gid = 0;
const ART = {
  drop: () => { const g = "g"+(gid++); return `<svg viewBox="0 0 100 100"><defs><radialGradient id="${g}" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#FFE7AE"/><stop offset=".45" stop-color="#E6A23C"/><stop offset="1" stop-color="#A9620C"/></radialGradient></defs><path d="M50 6C66 32 80 48 80 64a30 30 0 0 1-60 0c0-16 14-32 30-58Z" fill="url(#${g})"/><ellipse cx="40" cy="58" rx="7" ry="11" fill="#fff" opacity=".45"/></svg>`; },
  blossom: (c="#fff") => `<svg viewBox="0 0 100 100"><g transform="translate(50 50)">${[0,72,144,216,288].map(a=>`<ellipse rx="17" ry="26" cy="-24" fill="${c}" transform="rotate(${a})"/>`).join("")}<circle r="11" fill="#F6BD21"/><circle r="5" fill="#E6A23C"/></g></svg>`,
  leaf: (c="#5E8C3A") => `<svg viewBox="0 0 100 100"><path d="M12 82C14 40 44 14 88 12 86 56 58 86 12 82Z" fill="${c}"/><path d="M14 80 84 16" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/></svg>`,
  sprig: (c="#6E8F45", f="#B98BD6") => `<svg viewBox="0 0 100 100"><path d="M50 96C50 70 48 40 52 6" stroke="#5a6b3a" stroke-width="3" fill="none"/>${[18,30,42,54,66,78].map((y,i)=>`<ellipse cx="${i%2?60:41}" cy="${y}" rx="9" ry="4" fill="${c}" transform="rotate(${i%2?-35:35} ${i%2?60:41} ${y})"/>`).join("")}<circle cx="52" cy="8" r="6" fill="${f}"/><circle cx="45" cy="15" r="4.5" fill="${f}"/><circle cx="58" cy="16" r="4.5" fill="${f}"/></svg>`,
  lavender: () => `<svg viewBox="0 0 100 100"><path d="M50 98V30" stroke="#6E8F45" stroke-width="3"/>${[8,16,24,32,40,48].map((y,i)=>`<ellipse cx="${i%2?56:44}" cy="${y+4}" rx="6" ry="8" fill="${i%3?"#8B6CC7":"#A98BDE"}"/>`).join("")}</svg>`,
  berry: (c="#A8231C") => `<svg viewBox="0 0 100 100"><path d="M50 22c3-10 10-14 18-14" stroke="#6b4a2a" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="58" rx="30" ry="36" fill="${c}"/><ellipse cx="39" cy="44" rx="8" ry="12" fill="#fff" opacity=".3"/></svg>`,
  slice: () => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#F4D23C"/><circle cx="50" cy="50" r="38" fill="#FFF3B0"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M50 50 L${50+34*Math.cos(i*Math.PI/4+.2)} ${50+34*Math.sin(i*Math.PI/4+.2)} A34 34 0 0 1 ${50+34*Math.cos((i+1)*Math.PI/4-.2)} ${50+34*Math.sin((i+1)*Math.PI/4-.2)}Z" fill="#F7DC5A"/>`).join("")}<circle cx="50" cy="50" r="5" fill="#fff"/></svg>`,
  chunk: (c="#D9B36C") => `<svg viewBox="0 0 100 100"><path d="M18 52c-4-18 10-30 24-28 6-12 24-14 32-2 14 2 20 18 12 30 6 14-6 28-22 24-10 10-28 8-34-4-12-2-16-12-12-20Z" fill="${c}"/><path d="M34 40c8-4 20-4 30 2" stroke="#fff" stroke-opacity=".3" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  seed: (c="#9BA84A") => `<svg viewBox="0 0 100 100">${[[40,40,20],[60,36,-30],[52,58,60],[34,62,10],[66,60,-10],[48,24,40]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join("")}</svg>`,
  thread: () => `<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round"><path d="M20 84C30 60 40 40 58 14" stroke="#C4241C" stroke-width="5"/><path d="M38 90C44 64 56 46 80 26" stroke="#D8402A" stroke-width="4.5"/><path d="M14 64C32 52 50 46 72 46" stroke="#B51B14" stroke-width="4"/></svg>`,
};
const PIECES = {
  oranger:     [["blossom"],["leaf","#5E8C3A"],["blossom"],["drop"],["leaf","#4E7A30"],["blossom"],["drop"]],
  romarin:     [["sprig","#6E8F45","#B9A3E3"],["drop"],["sprig","#6E8F45","#B9A3E3"],["blossom","#D9C9F2"],["drop"],["sprig","#6E8F45","#B9A3E3"],["drop"]],
  thym:        [["sprig","#5F7F3A","#C79BDE"],["drop"],["sprig","#5F7F3A","#C79BDE"],["drop"],["sprig","#5F7F3A","#C79BDE"],["sprig","#5F7F3A","#C79BDE"],["drop"]],
  jujubier:    [["berry"],["leaf","#4E7A30"],["berry","#8E1C16"],["drop"],["berry"],["berry"],["leaf","#4E7A30"]],
  eucalyptus:  [["leaf","#6F9C9F"],["drop"],["leaf","#7FA9A4"],["leaf","#5E8E91"],["drop"],["leaf","#6F9C9F"],["drop"]],
  lavande:     [["lavender"],["drop"],["lavender"],["lavender"],["drop"],["lavender"],["drop"]],
  energie:     [["berry","#D7262B"],["seed","#E9B526"],["chunk","#E8D3A6"],["drop"],["berry","#D7262B"],["chunk","#E8D3A6"],["seed","#E9B526"]],
  respiration: [["leaf","#7FA9A4"],["leaf","#4E9A4A"],["sprig","#5F7F3A","#C79BDE"],["drop"],["leaf","#7FA9A4"],["sprig","#5F7F3A","#C79BDE"],["drop"]],
  digestion:   [["chunk","#E2C27E"],["leaf","#4E9A4A"],["seed","#B39A5E"],["drop"],["chunk","#E2C27E"],["seed","#B39A5E"],["drop"]],
  relaxation:  [["lavender"],["blossom"],["leaf","#4E9A4A"],["drop"],["blossom"],["lavender"],["drop"]],
};
