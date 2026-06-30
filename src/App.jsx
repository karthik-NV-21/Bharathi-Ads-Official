import { useState, useEffect, useRef, useCallback } from "react";

/* ─── CONSTANTS ─────────────────────────────────────────── */
const ADMIN_KEY = "1821";
const SERVICES  = ["Flex Printing","Frame Work","Foam Sheetwork","Hoardings","Demo Tent","Banner Stands","Auto Stickers","Mobile Van","LED Photo Frames","Air Magic Photos","Translit Films","LED Clippon Boards","LED Table Tops","QR Code Table Tops"];
const WA_NUMBER = "919848677237";
const EMAIL     = "bharathiads2010@gmail.com";
const INSTA     = "https://www.instagram.com/bharathiads?igsh=MWZjNWZpdmhibXpuMg==";
const LOGO_URL  = "https://kommodo.ai/i/tHrrkpjrJhHmlAR5IkFp";
const ADDRESS   = "Opp Poornima Enterprises, R.agraharam, Guntur 522003";
const CATS      = ["Pencil","Charcoal","Oil Pastel","Watercolour","Digital","Custom"];

/* ─── LOCAL STORAGE HELPERS ─────────────────────────────── */
const LS_PORTRAITS = "ba_portraits";
const LS_ADMINS    = "ba_admins";
const LS_USER      = "ba_user";

function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const DEMO_PORTRAITS = [
  { id:1, title:"Golden Heritage",     desc:"A timeless pencil portrait capturing ancestral grace — fine-line shading on premium 200gsm cartridge paper.", price:1200, image:null, category:"Pencil"    },
  { id:2, title:"Vibrant Expressions", desc:"Oil pastel burst of vivid emotion. Rich pigments bring energy and life to every brushstroke.",                price:1800, image:null, category:"Oil Pastel" },
  { id:3, title:"Monochrome Elegance", desc:"A charcoal study of depth and shadow — moody, sculptural, unforgettable.",                                    price:950,  image:null, category:"Charcoal"   },
];

/* ─── STYLES ────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;max-width:100vw;overflow-x:hidden;scroll-behavior:smooth}
  :root{
    --gold:#C9A84C;--gold-l:#E8C97A;--gold-d:#8B6914;--gold-glow:rgba(201,168,76,.25);
    --black:#080808;--dark:#111;--card:#181818;--surface:#202020;--border:#282828;
    --text:#F0EDE6;--muted:#777;--red:#e74c3c;--green:#27ae60;
    --nav-h:62px;
    --ease:cubic-bezier(.22,1,.36,1);
  }
  body{font-family:'Inter',sans-serif;background:var(--black);color:var(--text);min-height:100vh}
  #root{width:100%;overflow-x:hidden;display:flex;flex-direction:column;min-height:100vh}
  a{color:var(--gold);text-decoration:none}a:hover{text-decoration:underline}
  img{display:block;max-width:100%}
  button{font-family:inherit;cursor:pointer;border:none;transition:all .2s}
  input,textarea,select{font-family:inherit}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:var(--dark)}
  ::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
  ::-webkit-scrollbar-thumb:hover{background:var(--gold-d)}

  @keyframes fadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
  @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
  @keyframes scaleIn {from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
  @keyframes floatY  {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pulse   {0%,100%{opacity:1}50%{opacity:.45}}
  @keyframes glow    {0%,100%{box-shadow:0 0 0 rgba(201,168,76,0)}50%{box-shadow:0 0 40px rgba(201,168,76,.18)}}
  @keyframes slideUp {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

  .au  {animation:fadeUp   .6s var(--ease) both}
  .au1 {animation:fadeUp   .6s var(--ease) .1s both}
  .au2 {animation:fadeUp   .6s var(--ease) .22s both}
  .au3 {animation:fadeUp   .6s var(--ease) .34s both}
  .au4 {animation:fadeUp   .6s var(--ease) .46s both}
  .asi {animation:scaleIn  .4s var(--ease) both}

  /* NAVBAR */
  .navbar{
    position:sticky;top:0;z-index:900;height:var(--nav-h);width:100%;
    background:rgba(8,8,8,.97);border-bottom:1px solid var(--border);
    backdrop-filter:blur(16px);display:flex;align-items:center;
    justify-content:space-between;padding:0 clamp(1rem,5vw,3rem);
  }
  .nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;transition:opacity .2s}
  .nav-logo:hover{opacity:.8}
  .nav-logo img{height:36px;object-fit:contain}
  .nav-logo-text{font-family:'Playfair Display',serif;font-size:1.05rem;color:var(--gold);font-weight:700}
  .nav-links{display:flex;gap:clamp(.8rem,2.5vw,2rem)}
  .nav-link{
    background:none;border:none;color:var(--muted);cursor:pointer;font-family:inherit;
    padding:6px 0;position:relative;transition:color .2s;
    letter-spacing:.08em;text-transform:uppercase;font-size:.72rem;font-weight:500;
  }
  .nav-link::after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:var(--gold);transition:width .3s var(--ease)}
  .nav-link:hover,.nav-link.active{color:var(--gold)}
  .nav-link.active::after,.nav-link:hover::after{width:100%}
  .nav-actions{display:flex;gap:.5rem;align-items:center}
  .nav-user{color:var(--muted);font-size:.8rem;white-space:nowrap}
  .hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:4px;cursor:pointer}
  .hamburger span{display:block;width:22px;height:1.5px;background:var(--text);transition:all .3s var(--ease);transform-origin:center}
  .hamburger.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
  .hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
  .hamburger.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}

  /* BUTTONS */
  .btn{border:none;cursor:pointer;font-family:inherit;transition:all .2s;border-radius:5px;display:inline-flex;align-items:center;gap:6px;font-weight:500}
  .btn-gold{background:var(--gold);color:#000;padding:9px 20px;font-size:.84rem;font-weight:600}
  .btn-gold:hover{background:var(--gold-l);transform:translateY(-1px);box-shadow:0 4px 16px var(--gold-glow)}
  .btn-outline{background:none;border:1px solid var(--border);color:var(--text);padding:9px 20px;font-size:.84rem}
  .btn-outline:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-1px)}
  .btn-sm{padding:6px 13px!important;font-size:.78rem!important}
  .btn-lg{padding:13px 32px;font-size:.96rem}
  .btn-danger{background:var(--red);color:#fff;padding:6px 11px;font-size:.76rem;border-radius:4px}
  .btn-danger:hover{background:#c0392b;transform:translateY(-1px)}
  .btn-success{background:var(--green);color:#fff;padding:8px 18px;font-size:.84rem;border-radius:5px;font-weight:600}
  .btn-success:hover{background:#219a52}
  .wa-btn{background:#25D366;color:#fff;border:none;cursor:pointer;font-family:inherit;font-size:.88rem;font-weight:600;border-radius:5px;padding:11px 18px;display:flex;align-items:center;justify-content:center;gap:7px;width:100%;transition:all .2s}
  .wa-btn:hover{background:#1ebe5d;transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,211,102,.3)}
  .wa-btn-sm{background:#25D366;color:#fff;border:none;cursor:pointer;font-family:inherit;font-size:.78rem;font-weight:600;border-radius:4px;padding:7px 12px;display:flex;align-items:center;gap:5px;flex:1;justify-content:center;transition:all .2s}
  .wa-btn-sm:hover{background:#1ebe5d}

  /* FORMS */
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  .form-group{display:flex;flex-direction:column;gap:5px}
  .form-group.full{grid-column:1/-1}
  .form-label{font-size:.71rem;color:var(--muted);text-transform:uppercase;letter-spacing:.09em;font-weight:500}
  .form-input,.form-textarea,.form-select{
    background:var(--surface);border:1px solid var(--border);border-radius:6px;
    color:var(--text);font-family:inherit;font-size:.88rem;padding:10px 12px;
    transition:border-color .2s,box-shadow .2s;outline:none;width:100%;
  }
  .form-input:focus,.form-textarea:focus,.form-select:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1)}
  .form-textarea{resize:vertical;min-height:80px;line-height:1.6}
  .form-row{display:flex;flex-direction:column;gap:5px;margin-bottom:.9rem}
  .err-msg{color:var(--red);font-size:.78rem}
  .ok-msg{color:var(--green);font-size:.78rem}

  /* UPLOAD */
  .upload-area{border:2px dashed var(--border);border-radius:8px;padding:2rem 1.5rem;text-align:center;cursor:pointer;transition:all .2s;color:var(--muted);font-size:.86rem;background:var(--surface)}
  .upload-area:hover,.upload-area.drag{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.03)}
  .upload-icon{font-size:2rem;margin-bottom:.5rem}
  .upload-hint{font-size:.72rem;margin-top:.3rem;color:var(--muted)}
  .img-preview-wrap{position:relative;display:inline-block;margin-top:.8rem}
  .img-preview{max-height:200px;max-width:100%;border-radius:6px;object-fit:contain}
  .img-remove{position:absolute;top:-7px;right:-7px;background:var(--red);color:#fff;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:.78rem;display:flex;align-items:center;justify-content:center}

  /* LAYOUT */
  .section{width:100%;max-width:1160px;margin:0 auto;padding:4rem clamp(1rem,4vw,2rem)}
  .gold-line{width:44px;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-l));border-radius:2px;margin-bottom:.7rem}
  .sec-title{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:700;margin-bottom:.3rem;line-height:1.1}
  .sec-sub{color:var(--muted);margin-bottom:2rem;font-size:.88rem;line-height:1.6}
  .sec-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:1.8rem;flex-wrap:wrap;gap:1rem}
  .tag{background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.2);color:var(--gold);padding:5px 13px;border-radius:20px;font-size:.74rem;white-space:nowrap;transition:all .2s}
  .tag:hover{background:rgba(201,168,76,.14)}
  .badge{background:rgba(201,168,76,.1);color:var(--gold);font-size:.65rem;padding:2px 9px;border-radius:20px;border:1px solid rgba(201,168,76,.22);white-space:nowrap}

  /* HERO */
  .hero{width:100%;min-height:calc(100svh - var(--nav-h));display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem clamp(1rem,5vw,3rem);background:radial-gradient(ellipse at 50% 20%,rgba(201,168,76,.09) 0%,transparent 60%);position:relative;overflow:hidden}
  .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse at 50% 40%,black 30%,transparent 70%);pointer-events:none}
  .hero-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;opacity:.3;animation:floatY 6s ease-in-out infinite}
  .hero-orb-1{width:400px;height:400px;background:radial-gradient(circle,rgba(201,168,76,.4),transparent);top:-100px;left:calc(50% - 200px)}
  .hero-orb-2{width:200px;height:200px;background:radial-gradient(circle,rgba(201,168,76,.3),transparent);bottom:80px;right:8%;animation-delay:-3s}
  .hero-eye{font-size:.7rem;letter-spacing:.25em;color:var(--gold);text-transform:uppercase;margin-bottom:1.2rem;position:relative;display:flex;align-items:center;justify-content:center;gap:.7rem}
  .hero-eye::before,.hero-eye::after{content:'';width:30px;height:1px;background:var(--gold);opacity:.5}
  .hero-h1{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,6vw,5.2rem);font-weight:900;line-height:1.04;margin-bottom:1.2rem;position:relative}
  .hero-h1 em{color:var(--gold);font-style:italic}
  .hero-sub{color:var(--muted);max-width:500px;line-height:1.75;margin-bottom:2.2rem;font-size:clamp(.88rem,1.5vw,1rem);position:relative}
  .hero-cta{display:flex;gap:.9rem;flex-wrap:wrap;justify-content:center;position:relative}
  .hero-stats{display:flex;gap:clamp(1.5rem,5vw,3.5rem);margin-top:4rem;flex-wrap:wrap;justify-content:center;position:relative}
  .hero-stat-n{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3vw,2.2rem);font-weight:700;color:var(--gold);line-height:1}
  .hero-stat-l{font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.12em;margin-top:4px}
  .hero-scroll{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--muted);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;animation:pulse 2s ease-in-out infinite}
  .hero-scroll-line{width:1px;height:30px;background:linear-gradient(to bottom,var(--gold),transparent)}

  /* SERVICES BAR */
  .services-bar{width:100%;background:var(--dark);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:2.2rem clamp(1rem,4vw,2rem);text-align:center}
  .services-eye{font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.2em;margin-bottom:1.2rem}
  .tags-wrap{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:900px;margin:0 auto}

  /* FEATURES */
  .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.3rem;width:100%;max-width:1160px;margin:0 auto;padding:3rem clamp(1rem,4vw,2rem)}
  .feat-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1.6rem;transition:all .3s var(--ease);position:relative;overflow:hidden}
  .feat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,.04),transparent);opacity:0;transition:opacity .3s}
  .feat-card:hover{transform:translateY(-4px);border-color:rgba(201,168,76,.3);box-shadow:0 12px 40px rgba(0,0,0,.4)}
  .feat-card:hover::before{opacity:1}
  .feat-icon{font-size:2rem;margin-bottom:.9rem}
  .feat-h{font-size:.95rem;font-weight:600;margin-bottom:.4rem}
  .feat-p{color:var(--muted);font-size:.82rem;line-height:1.68}

  /* SEO */
  .seo-banner{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.15);border-radius:8px;padding:1.1rem 1.4rem;margin-bottom:1.8rem;font-size:.8rem;color:var(--muted);line-height:1.75}
  .seo-banner strong{color:var(--gold)}

  /* PORTRAITS */
  .portrait-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:1.3rem}
  .portrait-card{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;transition:all .3s var(--ease);animation:fadeUp .5s var(--ease) both}
  .portrait-card:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,.5);border-color:rgba(201,168,76,.25)}
  .portrait-img-wrap{overflow:hidden;position:relative}
  .portrait-img{width:100%;aspect-ratio:3/4;object-fit:cover;cursor:pointer;transition:transform .4s var(--ease);display:block}
  .portrait-card:hover .portrait-img{transform:scale(1.04)}
  .portrait-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 50%);opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;padding:1rem;pointer-events:none}
  .portrait-card:hover .portrait-img-overlay{opacity:1}
  .portrait-img-ph{width:100%;aspect-ratio:3/4;background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:3rem;cursor:pointer}
  .portrait-body{padding:.9rem}
  .portrait-title{font-family:'Playfair Display',serif;font-size:.92rem;font-weight:600;margin-bottom:.25rem;cursor:pointer;transition:color .2s}
  .portrait-title:hover{color:var(--gold)}
  .portrait-desc{color:var(--muted);font-size:.76rem;line-height:1.55;margin-bottom:.7rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .portrait-footer{display:flex;align-items:center;justify-content:space-between}
  .portrait-price{font-family:'Playfair Display',serif;font-size:1.05rem;color:var(--gold);font-weight:700}
  .portrait-actions{display:flex;gap:5px;padding:0 .9rem .9rem}

  /* ADD / EDIT FORM */
  .add-form-box{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1.8rem;margin-bottom:1.8rem;animation:fadeUp .4s var(--ease)}
  .add-form-title{font-family:'Playfair Display',serif;font-size:1rem;color:var(--gold);margin-bottom:1.2rem}

  /* MODAL */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:2000;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .2s}
  .modal{background:var(--card);border:1px solid var(--border);border-radius:14px;max-width:500px;width:100%;padding:2.2rem;position:relative;max-height:90svh;overflow-y:auto;animation:scaleIn .3s var(--ease)}
  .modal-close{position:absolute;top:.9rem;right:1rem;background:none;border:none;color:var(--muted);font-size:1.4rem;cursor:pointer;transition:color .2s,transform .2s}
  .modal-close:hover{color:var(--text);transform:rotate(90deg)}
  .modal-title{font-family:'Playfair Display',serif;font-size:1.4rem;margin-bottom:.3rem}
  .modal-sub{color:var(--muted);font-size:.84rem;margin-bottom:1.5rem}
  .auth-switch{text-align:center;margin-top:1.1rem;color:var(--muted);font-size:.8rem}
  .auth-switch button{background:none;border:none;color:var(--gold);cursor:pointer;font-size:.8rem;text-decoration:underline;font-family:inherit}

  /* DETAIL MODAL */
  .detail-modal{max-width:700px;display:flex;padding:0;overflow:hidden}
  .detail-img{width:42%;flex-shrink:0;object-fit:cover}
  .detail-img-ph{width:42%;flex-shrink:0;background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:4rem;min-height:300px}
  .detail-body{padding:1.8rem;flex:1;display:flex;flex-direction:column}
  .detail-price{font-family:'Playfair Display',serif;font-size:1.9rem;color:var(--gold);font-weight:700;margin:.5rem 0 .9rem}
  .detail-desc{color:var(--muted);line-height:1.75;font-size:.88rem;flex:1}
  .detail-actions{margin-top:1.3rem;display:flex;flex-direction:column;gap:.6rem}

  /* ABOUT */
  .about-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:clamp(2rem,5vw,4rem);align-items:start}
  .about-logo-box{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:2.5rem;text-align:center;animation:glow 4s ease-in-out infinite}
  .about-logo-box img{max-width:160px;width:100%;margin:0 auto}
  .about-tagline{color:var(--gold);font-size:.78rem;margin-top:.9rem;letter-spacing:.06em}
  .about-p{color:var(--muted);line-height:1.8;margin-bottom:.9rem;font-size:.88rem}
  .contact-list{display:flex;flex-direction:column;gap:8px;margin-top:1.5rem}
  .contact-row{display:flex;align-items:center;gap:9px;color:var(--muted);font-size:.84rem}
  .cta-banner{margin-top:3rem;background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02));border:1px solid rgba(201,168,76,.2);border-radius:14px;padding:2.2rem;text-align:center}
  .cta-banner h3{font-family:'Playfair Display',serif;font-size:1.2rem;margin-bottom:.4rem}
  .cta-banner p{color:var(--muted);font-size:.86rem;margin-bottom:1.3rem}

  /* SETTINGS */
  .settings-stack{display:flex;flex-direction:column;gap:1.3rem;max-width:580px}
  .s-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:1.5rem;transition:border-color .3s}
  .s-card:hover{border-color:rgba(201,168,76,.2)}
  .s-card-title{font-family:'Playfair Display',serif;font-size:1rem;color:var(--gold);margin-bottom:1.1rem}
  .info-row{display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--border);font-size:.84rem;gap:1rem}
  .info-row:last-child{border-bottom:none}
  .info-row>span:first-child{color:var(--muted);flex-shrink:0}
  .ok-chip{color:var(--green)}
  .auth-req{text-align:center;padding:5rem 2rem}
  .auth-req-icon{font-size:3rem;margin-bottom:1rem}
  .auth-req h2{font-family:'Playfair Display',serif;margin-bottom:.5rem;font-size:1.4rem}
  .auth-req p{color:var(--muted);margin-bottom:2rem;font-size:.9rem}
  
  /* DATA MANAGEMENT (JSON) */
  .json-actions { display:flex; gap:10px; margin-top: 15px; }

  /* ADMIN HINT */
  .admin-hint{font-size:.72rem;color:var(--muted);text-align:center;margin-top:.5rem;padding:.5rem;background:rgba(201,168,76,.05);border-radius:5px;border:1px solid rgba(201,168,76,.1)}
  .admin-hint strong{color:var(--gold)}

  /* FOOTER */
  .footer{width:100%;background:var(--dark);border-top:1px solid var(--border);padding:3rem clamp(1rem,4vw,2rem) 1.5rem;margin-top:auto}
  .footer-inner{max-width:1160px;margin:0 auto}
  .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr;gap:clamp(1.5rem,4vw,3rem);margin-bottom:2.5rem}
  .footer-brand img{height:40px;margin-bottom:.9rem;object-fit:contain}
  .footer-brand p{color:var(--muted);font-size:.8rem;line-height:1.75;max-width:260px}
  .footer-col h4{font-family:'Playfair Display',serif;font-size:.9rem;margin-bottom:.9rem;color:var(--gold)}
  .footer-links{list-style:none;display:flex;flex-direction:column;gap:7px}
  .footer-links li a,.footer-links li button{color:var(--muted);font-size:.8rem;background:none;border:none;cursor:pointer;font-family:inherit;padding:0;text-align:left;transition:color .2s;text-decoration:none}
  .footer-links li a:hover,.footer-links li button:hover{color:var(--gold)}
  .footer-bottom{border-top:1px solid var(--border);padding-top:1.1rem}
  .footer-bottom p{color:var(--muted);font-size:.74rem}

  /* TOAST */
  .toast{position:fixed;bottom:1.5rem;right:1.5rem;background:var(--card);border:1px solid var(--gold);border-radius:9px;padding:.9rem 1.3rem;z-index:3000;font-size:.84rem;max-width:290px;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:slideUp .3s var(--ease);display:flex;align-items:center;gap:.6rem}

  /* EMPTY */
  .empty-state{text-align:center;padding:5rem 2rem;color:var(--muted)}
  .empty-state-icon{font-size:3.5rem;margin-bottom:1rem;animation:floatY 3s ease-in-out infinite}

  /* STORAGE BADGE */
  .storage-note{font-size:.72rem;color:var(--muted);text-align:center;padding:.4rem .8rem;background:rgba(39,174,96,.05);border:1px solid rgba(39,174,96,.15);border-radius:5px;margin-bottom:1.2rem}
  .storage-note strong{color:var(--green)}

  /* RESPONSIVE */
  @media(max-width:900px){
    .footer-top{grid-template-columns:1fr 1fr}
    .about-grid{grid-template-columns:1fr}
    .detail-modal{flex-direction:column}
    .detail-img,.detail-img-ph{width:100%;height:260px;min-height:unset}
    .detail-body{padding:1.5rem}
  }
  @media(max-width:640px){
    .nav-links{display:none;position:fixed;top:var(--nav-h);left:0;right:0;bottom:0;width:100%;background:rgba(8,8,8,.98);backdrop-filter:blur(20px);flex-direction:column;justify-content:center;align-items:center;gap:2.5rem;z-index:800}
    .nav-links.open{display:flex;animation:fadeIn .25s}
    .nav-link{font-size:1rem;letter-spacing:.1em}
    .hamburger{display:flex}
    .navbar{position:fixed;width:100%;left:0;right:0}
    main{padding-top:var(--nav-h)}
    .form-grid{grid-template-columns:1fr}
    .features-grid{grid-template-columns:1fr}
    .footer-top{grid-template-columns:1fr}
    .hero-stats{gap:2rem}
    .sec-header{flex-direction:column;align-items:flex-start}
    .portrait-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr))}
  }
  @media(max-width:380px){.portrait-grid{grid-template-columns:1fr}}
  @media(min-width:641px) and (max-width:1024px){
    .features-grid{grid-template-columns:repeat(2,1fr)}
    .portrait-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
    .footer-top{grid-template-columns:1.5fr 1fr 1fr}
  }
`;

/* ─── IMAGE UPLOAD ── */
function ImageUpload({ value, onChange, label = "Upload Photo", compact = false }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const read = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = e => onChange(e.target.result);
    r.readAsDataURL(file);
  }, [onChange]);
  const drop = (e) => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files[0]); };
  if (value) return (
    <div className="img-preview-wrap">
      <img src={value} alt="Preview" className="img-preview" style={compact ? { maxHeight:120 } : {}} />
      <button className="img-remove" onClick={() => onChange(null)}>×</button>
    </div>
  );
  return (
    <div className={`upload-area${drag ? " drag" : ""}`} style={compact ? { padding:"1rem" } : {}}
      onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={drop} onClick={() => ref.current.click()}>
      <input ref={ref} type="file" accept="image/*" style={{ display:"none" }} onChange={e => read(e.target.files[0])} />
      <div className="upload-icon">{compact ? "📷" : "📁"}</div>
      <div>{label}</div>
      {!compact && <div className="upload-hint">Click or drag & drop · JPG, PNG, WEBP</div>}
    </div>
  );
}

/* ─── APP ROOT ── */
export default function App() {
  const [page,    setPage]    = useState("home");
  const [mobile,  setMobile]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [authOpen,setAuthOpen]= useState(false);
  const [authMode,setAuthMode]= useState("login");
  const [detail,  setDetail]  = useState(null);
  const [editP,   setEditP]   = useState(null);

  /* ── JSON / localStorage state ── */
  const [portraits, setPortraits] = useState(() => lsGet(LS_PORTRAITS, DEMO_PORTRAITS));
  const [admins,    setAdmins]    = useState(() => lsGet(LS_ADMINS,    []));
  const [user,      setUser]      = useState(() => lsGet(LS_USER,      null));

  /* persist to localStorage whenever data changes */
  useEffect(() => { lsSet(LS_PORTRAITS, portraits); }, [portraits]);
  useEffect(() => { lsSet(LS_ADMINS,    admins);    }, [admins]);
  useEffect(() => { lsSet(LS_USER,      user);      }, [user]);
  useEffect(() => { document.title = "Bharathi Ads"; }, []);

  const showToast = (msg, icon = "✓") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const nav = (p) => { setPage(p); setMobile(false); };
  const openAuth = (m = "login") => { setAuthMode(m); setAuthOpen(true); };

  /* ── AUTH ── */
  const signup = (name, email, password, adminKey) => {
    if (adminKey !== ADMIN_KEY)                   return "Invalid admin key. Access denied.";
    if (!name || !email || !password)             return "All fields are required.";
    if (admins.find(a => a.email === email))      return "Account already exists. Please log in.";
    const newAdmin = { id: Date.now(), name, email, password, avatar: null };
    const updated  = [...admins, newAdmin];
    setAdmins(updated);
    setUser(newAdmin);
    setAuthOpen(false);
    showToast(`Welcome, ${name}! 🎉`, "👑");
    return null;
  };

  const login = (email, password, adminKey) => {
    if (adminKey !== ADMIN_KEY)                   return "Invalid admin key. Access denied.";
    if (!email || !password)                      return "Email and password required.";
    const found = admins.find(a => a.email === email && a.password === password);
    if (!found)                                   return "Invalid email or password.";
    setUser(found);
    setAuthOpen(false);
    showToast(`Welcome back, ${found.name}!`, "👑");
    return null;
  };

  const logout = () => {
    setUser(null);
    nav("home");
    showToast("Logged out.", "👋");
  };

  /* ── PORTRAITS CRUD ── */
  const addPortrait = (data) => {
    const newP = { id: Date.now(), ...data };
    setPortraits(prev => [newP, ...prev]);
    showToast("Portrait added!");
  };

  const updatePortrait = (updated) => {
    setPortraits(prev => prev.map(x => x.id === updated.id ? updated : x));
    setEditP(null);
    setDetail(null);
    showToast("Portrait updated!");
  };

  const deletePortrait = (id) => {
    setPortraits(prev => prev.filter(x => x.id !== id));
    setDetail(null);
    setEditP(null);
    showToast("Portrait removed.", "🗑️");
  };

  /* ── PROFILE UPDATE ── */
  const updateUser = (updated) => {
    setUser(updated);
    setAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
    showToast("Profile updated!");
  };

  const navItems = [
    { key:"home",      label:"Home"      },
    { key:"portraits", label:"Portraits" },
    { key:"about",     label:"About Us"  },
    { key:"settings",  label:"Settings"  },
  ];

  return (
    <>
      <style>{STYLES}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => nav("home")}>
          <img src={LOGO_URL} alt="BA" onError={e => { e.target.style.display="none"; }} />
          <span className="nav-logo-text">Bharathi Ads</span>
        </div>
        <div className={`nav-links${mobile ? " open" : ""}`}>
          {navItems.map(({ key, label }) => (
            <button key={key} className={`nav-link${page===key?" active":""}`} onClick={() => nav(key)}>{label}</button>
          ))}
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">👑 {user.name.split(" ")[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-gold btn-sm" onClick={() => openAuth("login")}>Admin Login</button>
          )}
        </div>
        <button className={`hamburger${mobile?" open":""}`} onClick={() => setMobile(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* PAGES */}
      <main style={{ width:"100%", flex:1 }}>
        {page==="home"      && <HomePage nav={nav} />}
        {page==="portraits" && <PortraitsPage portraits={portraits} user={user} onAdd={addPortrait} onDelete={deletePortrait} onOpenDetail={setDetail} onOpenAuth={openAuth} onEdit={setEditP} />}
        {page==="about"     && <AboutPage />}
        {page==="settings"  && 
          <SettingsPage 
            user={user} 
            onUpdateUser={updateUser} 
            onOpenAuth={openAuth} 
            portraits={portraits} 
            admins={admins} 
            setPortraits={setPortraits} 
            setAdmins={setAdmins} 
            showToast={showToast} 
          />}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <img src={LOGO_URL} alt="Bharathi Ads" onError={e => { e.target.style.display="none"; }} />
              <p>Premium advertising and portrait services in Guntur, AP. Flex printing, hoarding, LED displays, and custom artwork — all under one roof.</p>
            </div>
            <div className="footer-col">
              <h4>Navigate</h4>
              <ul className="footer-links">
                {navItems.map(({ key, label }) => <li key={key}><button onClick={() => nav(key)}>{label}</button></li>)}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="footer-links">
                <li><a href="tel:+919848677237">📞 98486 77237</a></li>
                <li><a href="tel:+919550085607">📞 95500 85607</a></li>
                <li><a href={`mailto:${EMAIL}`}>✉️ {EMAIL}</a></li>
                <li><a href={INSTA} target="_blank" rel="noopener noreferrer">📸 Instagram</a></li>
                <li><a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Bharathi Ads, Badari. {ADDRESS}</p>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal mode={authMode}
          onToggle={() => setAuthMode(m => m==="login"?"signup":"login")}
          onLogin={login} onSignup={signup} onClose={() => setAuthOpen(false)} />
      )}

      {/* DETAIL MODAL */}
      {detail && !editP && (
        <DetailModal portrait={detail} user={user}
          onClose={() => setDetail(null)}
          onEdit={() => setEditP(detail)}
          onDelete={() => deletePortrait(detail.id)} />
      )}

      {/* EDIT MODAL */}
      {editP && (
        <EditPortraitModal portrait={editP}
          onSave={updatePortrait} onClose={() => setEditP(null)} />
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span style={{ fontSize:"1.1rem" }}>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}

/* ─── AUTH MODAL ── */
function AuthModal({ mode, onToggle, onLogin, onSignup, onClose }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [err,      setErr]      = useState("");
  const isSignup = mode === "signup";

  function submit() {
    setErr("");
    const e = isSignup
      ? onSignup(name, email, pass, adminKey)
      : onLogin(email, pass, adminKey);
    if (e) setErr(e);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="gold-line" />
        <h2 className="modal-title">{isSignup ? "Create Admin Account" : "Admin Login"}</h2>
        <p className="modal-sub">{isSignup ? "Only admins can manage portraits." : "Enter your credentials + admin key."}</p>

        {isSignup && (
          <div className="form-row">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Badari" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==="Enter"&&submit()} />
          </div>
        )}
        <div className="form-row">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="admin@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter"&&submit()} />
        </div>
        <div className="form-row">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key==="Enter"&&submit()} />
        </div>
        <div className="form-row">
          <label className="form-label">Admin Key 🔑</label>
          <input className="form-input" type="password" placeholder="Secret admin key" value={adminKey} onChange={e => setAdminKey(e.target.value)} onKeyDown={e => e.key==="Enter"&&submit()} />
        </div>

        {err && <p className="err-msg" style={{ marginBottom:".8rem" }}>⚠️ {err}</p>}

        <button className="btn btn-gold" style={{ width:"100%", padding:"12px", fontSize:".92rem", justifyContent:"center" }} onClick={submit}>
          {isSignup ? "Create Admin Account" : "Login as Admin"}
        </button>
        <div className="admin-hint">🔒 This portal is for <strong>admins only</strong>. Admin key required.</div>
        <div className="auth-switch">
          {isSignup
            ? <>Have an account? <button onClick={onToggle}>Log in</button></>
            : <>New admin? <button onClick={onToggle}>Sign up</button></>}
        </div>
      </div>
    </div>
  );
}

/* ─── DETAIL MODAL ── */
function DetailModal({ portrait: p, user, onClose, onEdit, onDelete }) {
  const waMsg = encodeURIComponent(`Hi! I'm interested in: *${p.title}* — ₹${p.price.toLocaleString("en-IN")}. Could you share more details?`);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal detail-modal" onClick={e => e.stopPropagation()}>
        {p.image ? <img src={p.image} alt={p.title} className="detail-img" /> : <div className="detail-img-ph">🖼️</div>}
        <div className="detail-body">
          <button className="modal-close" onClick={onClose}>×</button>
          <span className="badge">{p.category}</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", marginTop:".6rem" }}>{p.title}</h2>
          <div className="detail-price">₹{p.price.toLocaleString("en-IN")}</div>
          <p className="detail-desc">{p.desc || "A beautiful, handcrafted portrait by Bharathi Ads."}</p>
          <div className="detail-actions">
            <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
              <button className="wa-btn">💬 Enquire on WhatsApp</button>
            </a>
            <a href="tel:+919848677237">
              <button className="btn btn-outline" style={{ width:"100%", justifyContent:"center", padding:"10px" }}>📞 Call: 98486 77237</button>
            </a>
            {user && (
              <div style={{ display:"flex", gap:".5rem", marginTop:".3rem" }}>
                <button className="btn btn-outline" style={{ flex:1, justifyContent:"center" }} onClick={onEdit}>✏️ Edit</button>
                <button className="btn btn-danger"  style={{ flex:1, justifyContent:"center", padding:"9px" }} onClick={onDelete}>🗑️ Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── EDIT PORTRAIT MODAL ── */
function EditPortraitModal({ portrait, onSave, onClose }) {
  const [title,    setTitle]    = useState(portrait.title);
  const [price,    setPrice]    = useState(String(portrait.price));
  const [desc,     setDesc]     = useState(portrait.desc || "");
  const [category, setCategory] = useState(portrait.category);
  const [image,    setImage]    = useState(portrait.image);
  const [err,      setErr]      = useState("");

  function save() {
    setErr("");
    if (!title.trim())                      { setErr("Title is required."); return; }
    if (!price || isNaN(parseFloat(price))) { setErr("Valid price required."); return; }
    onSave({ ...portrait, title: title.trim(), price: parseFloat(price), desc: desc.trim(), category, image });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth:520 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="gold-line" />
        <h2 className="modal-title">Edit Portrait</h2>
        <p className="modal-sub">Update the portrait details below.</p>
        <div className="form-grid" style={{ marginBottom:"1rem" }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="form-group full">
            <label className="form-label">Portrait Photo</label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
        </div>
        {err && <p className="err-msg" style={{ marginBottom:".8rem" }}>⚠️ {err}</p>}
        <div style={{ display:"flex", gap:".6rem" }}>
          <button className="btn btn-gold" style={{ flex:1, justifyContent:"center", padding:"11px" }} onClick={save}>Save Changes</button>
          <button className="btn btn-outline" style={{ padding:"11px 18px" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── HOME PAGE ── */
function HomePage({ nav }) {
  const features = [
    { icon:"🖼️", title:"Custom Portraits",  body:"Pencil, charcoal, oil pastel — any medium, any size, any emotion." },
    { icon:"🖨️", title:"Flex & Print",      body:"Large-format flex printing, frame work, foam boards with precision." },
    { icon:"💡", title:"LED Displays",       body:"LED photo frames, clippon boards, table tops, QR code displays."    },
    { icon:"🚐", title:"Mobile Advertising", body:"Take your brand on the road with fully branded mobile vans."         },
  ];
  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <p className="hero-eye au">Bharathi Ads · Guntur, AP</p>
        <h1 className="hero-h1 au1">Portraits that<br /><em>Tell Your Story</em></h1>
        <p className="hero-sub au2">Handcrafted, printed, and delivered with care. From pencil sketches to oil masterpieces — every face deserves to be remembered.</p>
        <div className="hero-cta au3">
          <button className="btn btn-gold btn-lg" onClick={() => nav("portraits")}>Browse Portraits</button>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Bharathi Ads! I'd like to enquire.")}`} target="_blank" rel="noopener noreferrer">
            <button className="btn btn-outline btn-lg">💬 WhatsApp Us</button>
          </a>
        </div>
        <div className="hero-stats au4">
          {[["10+","Years Active"],["500+","Portraits Made"],["∞","Happy Clients"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div className="hero-stat-n">{n}</div>
              <div className="hero-stat-l">{l}</div>
            </div>
          ))}
        </div>
        <div className="hero-scroll"><div className="hero-scroll-line" />scroll</div>
      </section>

      <div className="services-bar">
        <p className="services-eye">Services We Offer</p>
        <div className="tags-wrap">{SERVICES.map(s => <span key={s} className="tag">{s}</span>)}</div>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={f.title} className="feat-card au" style={{ animationDelay:`${i*.1}s` }}>
            <div className="feat-icon">{f.icon}</div>
            <h3 className="feat-h">{f.title}</h3>
            <p className="feat-p">{f.body}</p>
          </div>
        ))}
      </div>

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 clamp(1rem,4vw,2rem) 4rem" }}>
        <div className="seo-banner">
          📍 <strong>Bharathi Ads</strong> — Best advertising agency in Guntur, AP. Serving portrait art, flex printing, LED boards, and outdoor advertising since 2010.<br />
          🔍 "portrait printing Guntur" | "flex printing Guntur" | "LED boards Guntur"
        </div>
      </div>
    </>
  );
}

/* ─── PORTRAITS PAGE ── */
function PortraitsPage({ portraits, user, onAdd, onDelete, onOpenDetail, onOpenAuth, onEdit }) {
  const [showForm, setShowForm] = useState(false);
  const [title,    setTitle]    = useState("");
  const [price,    setPrice]    = useState("");
  const [desc,     setDesc]     = useState("");
  const [category, setCategory] = useState("Custom");
  const [image,    setImage]    = useState(null);
  const [formErr,  setFormErr]  = useState("");

  function handleAdd() {
    setFormErr("");
    if (!title.trim())                      { setFormErr("Title is required."); return; }
    if (!price || isNaN(parseFloat(price))) { setFormErr("Valid price required."); return; }
    onAdd({ title: title.trim(), price: parseFloat(price), desc: desc.trim(), image, category });
    setTitle(""); setPrice(""); setDesc(""); setImage(null); setCategory("Custom");
    setShowForm(false);
  }

  return (
    <div className="section">
      <div className="sec-header">
        <div className="au">
          <div className="gold-line" />
          <h2 className="sec-title">Portrait Gallery</h2>
          <p className="sec-sub">Each piece, a story — handcrafted with precision and passion.</p>
        </div>
        <div className="au1">
          {user
            ? <button className={`btn ${showForm?"btn-outline":"btn-gold"}`} onClick={() => { setShowForm(f => !f); setFormErr(""); }}>
                {showForm ? "✕ Cancel" : "+ Add Portrait"}
              </button>
            : <button className="btn btn-outline" onClick={() => onOpenAuth("login")}>🔒 Admin Login</button>
          }
        </div>
      </div>

      <div className="storage-note">
        💾 Data saved in <strong>browser storage</strong> — portraits and accounts persist across page refreshes on this device.
      </div>

      <div className="seo-banner">
        <strong>Bharathi Ads</strong> — Premium portrait art in Guntur, AP. "portrait printing Guntur" | "custom portrait Guntur"
      </div>

      {showForm && user && (
        <div className="add-form-box">
          <p className="add-form-title">➕ Add New Portrait</p>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="e.g. Golden Heritage" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" type="number" placeholder="e.g. 1500" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Describe the portrait — medium, size, technique…" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="form-group full">
              <label className="form-label">Portrait Photo (from your device)</label>
              <ImageUpload value={image} onChange={setImage} />
            </div>
          </div>
          {formErr && <p className="err-msg" style={{ marginTop:".7rem" }}>⚠️ {formErr}</p>}
          <button className="btn btn-gold" style={{ marginTop:"1.1rem", padding:"10px 26px" }} onClick={handleAdd}>Save Portrait</button>
        </div>
      )}

      {portraits.length === 0
        ? <div className="empty-state"><div className="empty-state-icon">🖼️</div><p>No portraits yet. Log in as admin and add one!</p></div>
        : <div className="portrait-grid">
            {portraits.map((p, i) => (
              <PortraitCard key={p.id} portrait={p} user={user} delay={i*.06}
                onOpen={() => onOpenDetail(p)} onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)} />
            ))}
          </div>
      }
    </div>
  );
}

function PortraitCard({ portrait: p, user, delay, onOpen, onEdit, onDelete }) {
  const waMsg = encodeURIComponent(`Hi! I'm interested in: *${p.title}* — ₹${p.price.toLocaleString("en-IN")}`);
  return (
    <div className="portrait-card" style={{ animationDelay:`${delay}s` }}>
      <div className="portrait-img-wrap">
        {p.image
          ? <img src={p.image} alt={p.title} className="portrait-img" onClick={onOpen} />
          : <div className="portrait-img-ph" onClick={onOpen}>🖼️</div>
        }
        <div className="portrait-img-overlay"><span className="badge">{p.category}</span></div>
      </div>
      <div className="portrait-body">
        <p className="portrait-title" onClick={onOpen}>{p.title}</p>
        <p className="portrait-desc">{p.desc || "Handcrafted portrait by Bharathi Ads."}</p>
        <div className="portrait-footer">
          <span className="portrait-price">₹{p.price.toLocaleString("en-IN")}</span>
          <span className="badge">{p.category}</span>
        </div>
      </div>
      <div className="portrait-actions">
        <a href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" style={{ flex:1, display:"flex" }}>
          <button className="wa-btn-sm" style={{ width:"100%" }}>💬 Enquire</button>
        </a>
        {user && (
          <>
            <button className="btn btn-outline btn-sm" onClick={onEdit} title="Edit">✏️</button>
            <button className="btn btn-danger" onClick={onDelete} title="Delete">🗑️</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── ABOUT PAGE ── */
function AboutPage() {
  return (
    <div className="section">
      <div className="gold-line au" />
      <h2 className="sec-title au">About Us</h2>
      <p className="sec-sub au1">The story behind Bharathi Ads</p>
      <div className="about-grid">
        <div className="about-logo-box asi">
          <img src={LOGO_URL} alt="Bharathi Ads" onError={e => { e.target.style.display="none"; }} />
          <p className="about-tagline">Advertising · Art · Excellence</p>
        </div>
        <div className="au1">
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", marginBottom:".9rem" }}>
            Bharathi Ads — <span style={{ color:"var(--gold)" }}>Badari</span>
          </h3>
          <p className="about-p">We are a full-service advertising and portrait studio based in Guntur, Andhra Pradesh. Since 2010, we have been delivering top-quality print, display, and artwork solutions to businesses and individuals across the region.</p>
          <p className="about-p">From large-format flex printing and hoarding installations to handcrafted portrait art, our work blends craftsmanship with modern advertising technology.</p>
          <p className="about-p">Our studio handles everything from a single auto sticker to a mobile advertising van — backed by over a decade of expertise and a passionate team.</p>
          <div className="tags-wrap" style={{ justifyContent:"flex-start", marginTop:"1rem" }}>
            {SERVICES.map(s => <span key={s} className="tag">{s}</span>)}
          </div>
          <div className="contact-list">
            <div className="contact-row">📞 <a href="tel:+919848677237">98486 77237</a> / <a href="tel:+919550085607">95500 85607</a></div>
            <div className="contact-row">✉️ <a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
            <div className="contact-row">📍 {ADDRESS}</div>
            <div className="contact-row">📸 <a href={INSTA} target="_blank" rel="noopener noreferrer">@bharathiads on Instagram</a></div>
          </div>
        </div>
      </div>
      <div className="cta-banner au2">
        <h3>Ready to order or enquire?</h3>
        <p>Chat with us on WhatsApp — we typically respond within minutes.</p>
        <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Bharathi Ads! I'd like to enquire.")}`} target="_blank" rel="noopener noreferrer">
          <button className="wa-btn" style={{ maxWidth:280, margin:"0 auto" }}>💬 Start WhatsApp Chat</button>
        </a>
      </div>
    </div>
  );
}

/* ─── SETTINGS PAGE ── */
function SettingsPage({ user, onUpdateUser, onOpenAuth, portraits, admins, setPortraits, setAdmins, showToast }) {
  const [editing,  setEditing]  = useState(false);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [oldPass,  setOldPass]  = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [confirmP, setConfirmP] = useState("");
  const [avatar,   setAvatar]   = useState(null);
  const [err,      setErr]      = useState("");
  const [saved,    setSaved]    = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); setAvatar(user.avatar || null); }
  }, [user]);

  if (!user) return (
    <div className="section" style={{ maxWidth:560 }}>
      <div className="auth-req asi">
        <div className="auth-req-icon">🔒</div>
        <h2>Admin Login Required</h2>
        <p>Only admins can access settings.</p>
        <button className="btn btn-gold btn-lg" onClick={() => onOpenAuth("login")}>Admin Login</button>
      </div>
    </div>
  );

  function save() {
    setErr("");
    if (!name.trim() || !email.trim()) { setErr("Name and email cannot be empty."); return; }
    let pwd = user.password;
    if (oldPass || newPass || confirmP) {
      if (oldPass !== user.password)  { setErr("Current password incorrect."); return; }
      if (newPass.length < 6)         { setErr("New password min 6 characters."); return; }
      if (newPass !== confirmP)        { setErr("Passwords do not match."); return; }
      pwd = newPass;
    }
    onUpdateUser({ ...user, name: name.trim(), email: email.trim(), password: pwd, avatar });
    setEditing(false); setOldPass(""); setNewPass(""); setConfirmP("");
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  }

  function cancel() {
    setEditing(false); setName(user.name); setEmail(user.email);
    setAvatar(user.avatar||null); setOldPass(""); setNewPass(""); setConfirmP(""); setErr("");
  }
  
  // JSON EXPORT LOGIC
  const exportJSON = () => {
    const dataObj = { portraits, admins };
    const jsonString = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bharathi_ads_data_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("JSON file exported successfully!", "📤");
  };

  // JSON IMPORT LOGIC
  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dataObj = JSON.parse(event.target.result);
        if (dataObj.portraits && Array.isArray(dataObj.portraits)) {
            setPortraits(dataObj.portraits);
        }
        if (dataObj.admins && Array.isArray(dataObj.admins)) {
            setAdmins(dataObj.admins);
        }
        showToast("Data imported successfully!", "📥");
      } catch (error) {
        showToast("Invalid JSON file. Import failed.", "❌");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset input so the same file can be uploaded again if needed
  };

  return (
    <div className="section">
      <div className="gold-line au" />
      <h2 className="sec-title au">Settings</h2>
      <p className="sec-sub au1">Manage your admin account and preferences</p>

      <div className="settings-stack">
        {/* PROFILE */}
        <div className="s-card au">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.1rem" }}>
            <p className="s-card-title" style={{ margin:0 }}>👤 Profile</p>
            {!editing
              ? <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>
              : <div style={{ display:"flex", gap:".5rem" }}>
                  <button className="btn btn-success btn-sm" onClick={save}>✓ Save</button>
                  <button className="btn btn-outline btn-sm" onClick={cancel}>Cancel</button>
                </div>
            }
          </div>
          {saved && <p className="ok-msg" style={{ marginBottom:".8rem" }}>✓ Profile updated!</p>}
          {err   && <p className="err-msg" style={{ marginBottom:".8rem" }}>⚠️ {err}</p>}

          <div style={{ marginBottom:"1.2rem" }}>
            <p className="form-label" style={{ marginBottom:".5rem" }}>Profile Photo</p>
            {editing
              ? <ImageUpload value={avatar} onChange={setAvatar} label="Upload profile photo" compact />
              : avatar
                ? <img src={avatar} alt="Avatar" style={{ width:64, height:64, borderRadius:"50%", objectFit:"cover", border:"2px solid var(--gold)" }} />
                : <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--surface)", border:"2px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem" }}>👤</div>
            }
          </div>

          <div className="info-row">
            <span>Name</span>
            {editing
              ? <input className="form-input" value={name} onChange={e => setName(e.target.value)} style={{ maxWidth:220, padding:"5px 9px", fontSize:".84rem" }} />
              : <span>{user.name}</span>}
          </div>
          <div className="info-row">
            <span>Email</span>
            {editing
              ? <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ maxWidth:220, padding:"5px 9px", fontSize:".84rem" }} />
              : <span style={{ wordBreak:"break-all" }}>{user.email}</span>}
          </div>
          <div className="info-row"><span>Role</span><span style={{ color:"var(--gold)" }}>👑 Admin</span></div>

          {editing && (
            <div style={{ marginTop:"1.2rem", borderTop:"1px solid var(--border)", paddingTop:"1.2rem", display:"flex", flexDirection:"column", gap:".8rem" }}>
              <p className="form-label">Change Password <span style={{ color:"var(--muted)", fontWeight:400 }}>(leave blank to keep current)</span></p>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" placeholder="Current password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Min 6 characters" value={newPass} onChange={e => setNewPass(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" placeholder="Repeat new password" value={confirmP} onChange={e => setConfirmP(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* PACKAGE */}
        <div className="s-card au1">
          <p className="s-card-title">📦 Website Package — ₹6,000 / year</p>
          {[
            ["Domain",                ".in domain included"],
            ["WhatsApp Integration",  "✓ Active"],
            ["SEO Setup",             "✓ Active"],
            ["QR Code Card",          "✓ Included"],
            ["Logo Design",           "✓ Included"],
            ["Posters & Banners",     "✓ Included"],
            ["Product Packing Design","✓ Included"],
            ["Training Videos",       "✓ Included"],
            ["1-Year Support",        "✓ Active"],
          ].map(([l, v]) => (
            <div className="info-row" key={l}>
              <span>{l}</span>
              <span className={v.startsWith("✓") ? "ok-chip" : ""}>{v}</span>
            </div>
          ))}
        </div>

        {/* DATA MANAGEMENT */}
        <div className="s-card au2">
          <p className="s-card-title">🗄️ JSON Data Management</p>
          <p style={{ color:"var(--muted)", fontSize:".84rem", marginBottom:"1rem", lineHeight:"1.6" }}>
            All portraits and admin accounts are saved locally in your browser. You can export this data as a <strong style={{ color:"var(--gold)" }}>.json file</strong> to back it up, or import a previously saved JSON file to restore your data.
          </p>
          <div className="info-row"><span>Storage Type</span><span>Browser localStorage (JSON)</span></div>
          <div className="info-row"><span>Portraits Saved</span><span style={{ color:"var(--gold)" }} id="portrait-count">{portraits.length}</span></div>
          
          <div className="json-actions">
            <button className="btn btn-gold" style={{ fontSize:".8rem", flex: 1, justifyContent:"center" }} onClick={exportJSON}>
              📤 Export to JSON
            </button>
            <button className="btn btn-outline" style={{ fontSize:".8rem", flex: 1, justifyContent:"center" }} onClick={() => fileInputRef.current.click()}>
              📥 Import from JSON
            </button>
            <input 
              type="file" 
              accept=".json,application/json" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={importJSON} 
            />
          </div>
          
          <div style={{ marginTop:"1.5rem", borderTop:"1px solid var(--border)", paddingTop: "1rem" }}>
            <button className="btn btn-danger" style={{ fontSize:".8rem" }}
              onClick={() => {
                if (window.confirm("This will delete ALL portraits and admin accounts. Are you sure?")) {
                  localStorage.removeItem("ba_portraits");
                  localStorage.removeItem("ba_admins");
                  localStorage.removeItem("ba_user");
                  window.location.reload();
                }
              }}>
              🗑️ Clear Local Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}