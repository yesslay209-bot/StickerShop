const OWNER_CODE = "stickerboss";   // change this to your own passcode
const PRICE = 2000;                 // robux per sticker
const KEY = "stickerShop.v1";

const STICKERS = [
  { id:"michigan-1", school:"Michigan", name:"Block M", img:"stickers/crops/michigan-1.png", tag:"Michigan" },
  { id:"michigan-2", school:"Michigan", name:"U-M Script", img:"stickers/crops/michigan-2.png", tag:"Michigan" },
  { id:"michigan-3", school:"Michigan", name:"M Go Blue", img:"stickers/crops/michigan-3.png", tag:"Michigan" },
  { id:"michigan-4", school:"Michigan", name:"Navy Block M", img:"stickers/crops/michigan-4.png", tag:"Michigan" },
  { id:"michigan-5", school:"Michigan", name:"Michigan Wordmark", img:"stickers/crops/michigan-5.png", tag:"Michigan" },
  { id:"michigan-6", school:"Michigan", name:"Michigan Wolverine", img:"stickers/crops/michigan-6.png", tag:"Michigan" },
  { id:"michigan-7", school:"Michigan", name:"Michigan Script", img:"stickers/crops/michigan-7.png", tag:"Michigan" },

  { id:"uchicago-1", school:"UChicago", name:"University of Chicago", img:"stickers/crops/uchicago-1.png", tag:"UChicago" },
  { id:"uchicago-2", school:"UChicago", name:"Maroon C", img:"stickers/crops/uchicago-2.png", tag:"UChicago" },
  { id:"uchicago-3", school:"UChicago", name:"UChicago Shield", img:"stickers/crops/uchicago-3.png", tag:"UChicago" },
  { id:"uchicago-4", school:"UChicago", name:"Eagle Est. 1890", img:"stickers/crops/uchicago-4.png", tag:"UChicago" },
  { id:"uchicago-5", school:"UChicago", name:"Vertical UChicago", img:"stickers/crops/uchicago-5.png", tag:"UChicago" },
  { id:"uchicago-6", school:"UChicago", name:"Maroon Eagle", img:"stickers/crops/uchicago-6.png", tag:"UChicago" },
  { id:"uchicago-7", school:"UChicago", name:"Eagle Wordmark", img:"stickers/crops/uchicago-7.png", tag:"UChicago" },
  { id:"uchicago-8", school:"UChicago", name:"C Chicago", img:"stickers/crops/uchicago-8.png", tag:"UChicago" },
  { id:"uchicago-9", school:"UChicago", name:"Eagle Est. 1890", img:"stickers/crops/uchicago-9.png", tag:"UChicago" },
  { id:"uchicago-10", school:"UChicago", name:"Vertical Est. 1890", img:"stickers/crops/uchicago-10.png", tag:"UChicago" },

  { id:"uci-1", school:"UCI", name:"Anteater UC Irvine", img:"stickers/crops/uci-1.png", tag:"UCI" },
  { id:"uci-2", school:"UCI", name:"UCI", img:"stickers/crops/uci-2.png", tag:"UCI" },
  { id:"uci-3", school:"UCI", name:"Anteater", img:"stickers/crops/uci-3.png", tag:"UCI" },
  { id:"uci-4", school:"UCI", name:"UC Irvine", img:"stickers/crops/uci-4.png", tag:"UCI" },
  { id:"uci-5", school:"UCI", name:"UC Irvine Gold", img:"stickers/crops/uci-5.png", tag:"UCI" },
  { id:"uci-6", school:"UCI", name:"Eaters", img:"stickers/crops/uci-6.png", tag:"UCI" },
  { id:"uci-7", school:"UCI", name:"UCI Interlock", img:"stickers/crops/uci-7.png", tag:"UCI" },

  { id:"ucla-1", school:"UCLA", name:"UCLA Script", img:"stickers/crops/ucla-1.png", tag:"UCLA" },
  { id:"ucla-2", school:"UCLA", name:"UCLA Vertical", img:"stickers/crops/ucla-2.png", tag:"UCLA" },
  { id:"ucla-3", school:"UCLA", name:"Joe Bruin", img:"stickers/crops/ucla-3.png", tag:"UCLA" }
];

const $ = (s) => document.querySelector(s);
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (r) => localStorage.setItem(KEY, JSON.stringify(r));

function stickerArt(s, extra = ""){
  return `<img class="sticker-img ${extra}" src="${s.img}" alt="${s.name} sticker">`;
}

/* ---------- shop ---------- */
function renderShop(school = "all"){
  const grid = $("#grid");
  grid.innerHTML = "";
  const visible = STICKERS.filter((s) => school === "all" || s.school === school);
  for (const s of visible){
    const card = el("div", "item");
    card.innerHTML =
      stickerArt(s) +
      `<div class="name">${s.name}</div><div class="school-label">${s.school}</div>`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.onclick = () => openSheet(s);
    card.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") openSheet(s); };
    grid.append(card);
  }
}

/* ---------- sticker sheet ---------- */
let cur = null, mode = null;

function openSheet(s){
  cur = s;
  $("#sheet-art").innerHTML = stickerArt(s);
  $("#sheet-name").textContent = s.name;
  $("#sheet-tag").textContent = `${s.school} sticker`;
  $("#sheet-actions").hidden = false;
  $("#sheet-form").hidden = true;
  $("#sheet-form").reset();
  $("#sheet").hidden = false;
}

function setMode(m){
  mode = m;
  const buy = m === "buy";
  $("#flabel2").textContent = buy
    ? "Message (optional)"
    : "What are you offering in the trade?";
  $("#f-2").placeholder = buy ? "Anything you want to tell the owner" : "Describe the sticker(s) or Robux you are offering";
  $("#f-2").required = !buy;
  $("#form-note").textContent = buy
    ? `Your request asks for this sticker for ${PRICE.toLocaleString()} Robux and waits for approval.`
    : "Your trade offer waits for the owner to accept or decline it.";
  $("#sheet-actions").hidden = true;
  $("#sheet-form").hidden = false;
  $("#f-1").focus();
}

$("#sheet").addEventListener("click", (e) => {
  const d = e.target.dataset?.do;
  if (d === "buy" || d === "trade") setMode(d);
  else if (d === "back"){
    mode = null;
    $("#sheet-form").hidden = true;
    $("#sheet-actions").hidden = false;
  }
  if (e.target.classList.contains("backdrop") || e.target.id === "sheet-x") closeSheet();
});
function closeSheet(){ $("#sheet").hidden = true; cur = null; mode = null; $("#sheet-form").reset(); }
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#sheet").hidden) closeSheet(); });

$("#sheet-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const who = $("#f-1").value.trim();
  if (!who) return;
  const requestType = mode;
  const reqs = load();
  reqs.push({
    id: Date.now(),
    sticker: cur.id,
    stickerName: cur.name,
    stickerSchool: cur.school,
    stickerImg: cur.img,
    type: requestType,
    buyer: who,
    note: $("#f-2").value.trim(),
    status: "pending",
    created: Date.now()
  });
  save(reqs);
  closeSheet();
  toast(requestType === "buy" ? "Buy request sent!" : "Trade offer sent!");
});

/* ---------- owner ---------- */
let unlocked = false, filter = "pending", requestKind = "all", schoolFilter = "all";

document.querySelectorAll("[data-school]").forEach((button) => {
  button.onclick = () => {
    schoolFilter = button.dataset.school;
    document.querySelectorAll("[data-school]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderShop(schoolFilter);
  };
});

document.querySelectorAll(".tab").forEach((t) => t.onclick = () => {
  document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
  document.querySelectorAll("main section").forEach((x) => x.hidden = true);
  t.classList.add("active");
  $(`#tab-${t.dataset.tab}`).hidden = false;
});

$("#code-go").onclick = () => {
  if ($("#code").value === OWNER_CODE){ unlocked = true; $("#owner-login").hidden = true; renderRequests(); }
  else $("#login-err").hidden = false;
};
$("#code").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#code-go").click(); });

["all","pending","approved","declined"].forEach((f) => {
  $(`#filter-${f}`).onclick = () => {
    filter = f;
    document.querySelectorAll("[id^='filter-']").forEach((c) => c.classList.remove("active"));
    $(`#filter-${f}`).classList.add("active");
    renderRequests();
  };
});

["all","buy","trade"].forEach((kind) => {
  $(`#kind-${kind}`).onclick = () => {
    requestKind = kind;
    document.querySelectorAll("[id^='kind-']").forEach((c) => c.classList.remove("active"));
    $(`#kind-${kind}`).classList.add("active");
    renderRequests();
  };
});

$("#refresh-requests").onclick = renderRequests;
window.addEventListener("storage", () => { if (unlocked) renderRequests(); });

function setStatus(id, status){
  const reqs = load();
  const r = reqs.find((x) => x.id === id);
  if (r){ r.status = status; save(reqs); }
  renderRequests();
}

function renderRequests(){
  const box = $("#requests");
  box.innerHTML = "";
  const allReqs = load();
  $("#stat-pending").textContent = allReqs.filter((r) => r.status === "pending").length;
  $("#stat-purchases").textContent = allReqs.filter((r) => r.type === "buy").length;
  $("#stat-trades").textContent = allReqs.filter((r) => r.type === "trade").length;
  const reqs = allReqs.filter((r) =>
      (filter === "all" || r.status === filter) &&
      (requestKind === "all" || r.type === requestKind)
    )
    .sort((a, b) => b.created - a.created);
  if (!reqs.length){ box.append(el("div","empty","Nothing here yet.")); return; }

  for (const r of reqs){
    const card = el("div", `req ${r.status}`);
    const isBuy = r.type === "buy";
    const sticker = STICKERS.find((s) => s.id === r.sticker);
    const image = r.stickerImg || sticker?.img || "";
    const detail = isBuy
      ? `wants to <b>buy</b> &middot; ${PRICE.toLocaleString()} Robux`
      : `wants to <b>trade</b>`;
    card.innerHTML =
      `<div class="req-top">
         <div class="req-sticker">
           <img src="${escape(image)}" alt="">
           <div class="who">${escape(r.buyer)} <span class="dim">&middot; ${escape(r.stickerName)}</span></div>
         </div>
         <span class="badge">${r.status}</span>
       </div>
       <div class="req-meta">${detail}</div>` +
      (r.note ? `<div class="req-note">${escape(r.note)}</div>` : "");

    if (r.status === "pending"){
      const acts = el("div", "req-acts");
      const a = el("button","btn tiny approve","Approve");
      a.onclick = () => setStatus(r.id, "approved");
      const d = el("button","btn tiny decline","Decline");
      d.onclick = () => setStatus(r.id, "declined");
      acts.append(a, d);
      card.append(acts);
    }
    box.append(card);
  }
}

function escape(s){
  return String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}

/* ---------- toast ---------- */
let tt;
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(tt);
  tt = setTimeout(() => (t.hidden = true), 2600);
}

// Keep the landing page on the shop until a visitor selects a sticker.
$("#sheet").hidden = true;
$("#sheet-actions").hidden = true;
$("#sheet-form").hidden = true;

renderShop();
