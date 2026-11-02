/* Generated from src/. Do not edit main.js directly. */
"use strict";var Le=Object.create;var P=Object.defineProperty;var Ee=Object.getOwnPropertyDescriptor;var Ie=Object.getOwnPropertyNames;var Re=Object.getPrototypeOf,Ue=Object.prototype.hasOwnProperty;var Be=(r,e)=>{for(var t in e)P(r,t,{get:e[t],enumerable:!0})},Z=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Ie(e))!Ue.call(r,n)&&n!==t&&P(r,n,{get:()=>e[n],enumerable:!(s=Ee(e,n))||s.enumerable});return r};var L=(r,e,t)=>(t=r!=null?Le(Re(r)):{},Z(e||!r||!r.__esModule?P(t,"default",{value:r,enumerable:!0}):t,r)),Me=r=>Z(P({},"__esModule",{value:!0}),r);var tt={};Be(tt,{default:()=>V});module.exports=Me(tt);var u=require("obsidian"),Ne=L(require("node:http")),De=L(require("node:os")),$e=L(require("node:path")),Pe=require("node:crypto");var E=require("node:crypto"),z={enabled:!0,retentionDays:30,excludeLocalhost:!0},ee="local_note_share_visitor",He=/^[0-9a-f]{48}$/,re=/^[0-9a-f]{64}$/,Ve=/^\d{4}-\d{2}-\d{2}$/,Oe=new Set([7,30,90,365]);function I(r=Date.now()){return{startedAt:r,visitors:{},daily:{},pages:{}}}function ae(r){let e=A(r)?r:{},t=Number(e.retentionDays);return{enabled:e.enabled!==!1,retentionDays:Oe.has(t)?t:z.retentionDays,excludeLocalhost:e.excludeLocalhost!==!1}}function oe(r,e=Date.now()){let t=A(r)?r:{},s=A(t.pages)?t.pages:{},n={};for(let[i,a]of Object.entries(s))!A(a)||a.kind!=="index"&&a.kind!=="note"||(n[i]={kind:a.kind,path:q(a.path),title:q(a.title)||q(a.path)||"Page",views:pe(a.views),lastAccess:j(a.lastAccess),visitors:ie(a.visitors),daily:ne(a.daily)});return{startedAt:j(t.startedAt)||e,visitors:ie(t.visitors),daily:ne(t.daily),pages:n}}function le(r,e,t){let n=qe(r.headers.cookie)[ee];return(!n||!He.test(n))&&(n=je(),e.setHeader("Set-Cookie",`${ee}=${n}; Max-Age=31536000; Path=/; HttpOnly; SameSite=Strict`)),(0,E.createHash)("sha256").update(`${t}:${n}`).digest("hex")}function ce(r,e,t,s,n=Date.now()){if(!re.test(e))return;ue(r,s,n);let i=W(n);r.visitors[e]=n,r.daily[i]=(r.daily[i]||0)+1;let a=r.pages[t.key]||{kind:t.kind,path:t.path,title:t.title,views:0,lastAccess:0,visitors:{},daily:{}};a.kind=t.kind,a.path=t.path,a.title=t.title,a.views+=1,a.lastAccess=n,a.visitors[e]=n,a.daily[i]=(a.daily[i]||0)+1,r.pages[t.key]=a}function he(r,e,t=Date.now()){ue(r,e,t);let s=Object.entries(r.pages).map(([n,i])=>({key:n,kind:i.kind,path:i.path,title:i.title,views:i.views,uniqueVisitors:Object.keys(i.visitors).length,lastAccess:i.lastAccess})).sort((n,i)=>i.views-n.views||i.lastAccess-n.lastAccess);return{totalViews:s.reduce((n,i)=>n+i.views,0),uniqueVisitors:Object.keys(r.visitors).length,viewsToday:r.daily[W(t)]||0,startedAt:r.startedAt,pages:s}}function de(r){if(!r)return!1;let e=r.replace(/^::ffff:/,"");return e==="::1"||e==="127.0.0.1"}function ue(r,e,t){let s=t-e*864e5,n=W(s);te(r.visitors,s),se(r.daily,n);for(let i of Object.values(r.pages))te(i.visitors,s),se(i.daily,n)}function te(r,e){for(let[t,s]of Object.entries(r))s<e&&delete r[t]}function se(r,e){for(let t of Object.keys(r))t<e&&delete r[t]}function ie(r){if(!A(r))return{};let e={};for(let[t,s]of Object.entries(r)){let n=j(s);re.test(t)&&n&&(e[t]=n)}return e}function ne(r){if(!A(r))return{};let e={};for(let[t,s]of Object.entries(r)){let n=pe(s);Ve.test(t)&&n&&(e[t]=n)}return e}function qe(r){if(!r)return{};let e={};for(let t of r.split(";")){let s=t.indexOf("=");if(s<1)continue;let n=t.slice(0,s).trim(),i=t.slice(s+1).trim();e[n]=i}return e}function je(){return(0,E.randomBytes)(24).toString("hex")}function W(r){return new Date(r).toISOString().slice(0,10)}function pe(r){let e=Number(r);return Number.isSafeInteger(e)&&e>0?e:0}function j(r){let e=Number(r);return Number.isFinite(e)&&e>0?e:0}function q(r){return typeof r=="string"?r.slice(0,500):""}function A(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)}var ze={avif:"image/avif",bmp:"image/bmp",gif:"image/gif",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",webp:"image/webp",pdf:"application/pdf",mp3:"audio/mpeg",wav:"audio/wav",ogg:"audio/ogg",m4a:"audio/mp4",mp4:"video/mp4",webm:"video/webm",mov:"video/quicktime"};function ge(r){let e=typeof r=="string"?r.toLowerCase():"";return ze[e]??"application/octet-stream"}var We={ribbonShareNote:"Share active note",commandManageNote:"Manage local sharing for current note",commandToggleServer:"Start/stop local sharing server",commandShareNote:"Share current note locally",commandUnshareNote:"Stop sharing current note locally",commandCopyUrl:"Copy local sharing URL",serverStopped:"Local sharing stopped",errorTitle:"Error",serverDurationManual:"until manually stopped",serverDurationHours:"for {hours} h",serverProtected:"protected by a token",serverUnprotected:"without a token",serverStarted:`Sharing is available to devices on the local network {duration} ({protection}).
{url}`,serverAutoStopped:"Local sharing stopped automatically",markdownOnly:"Only Markdown notes can be shared",noteShared:"Note shared, URL copied",noteUnshared:"Note removed from local sharing",selectFolder:"Select a vault folder to share",folderShared:"Folder shared ({files}), URL copied",folderUnshared:"Folder removed from local sharing",menuShareFolder:"Share folder locally",menuUnshareFolder:"Remove folder from local sharing",menuCopyFolderLink:"Copy shared folder link",folderLinkCopied:"Folder link copied",statusSharedFolder:"Shared (folder)",statusShared:"Shared",statusPrivate:"Private",statusSharedFolderTitle:"This note is shared through its folder",statusUnshareTitle:"Stop sharing this note",statusShareTitle:"Share this note",linkCopiedFolderManaged:"Link copied; sharing is managed by the parent folder",copySharedLink:"Copy shared link",linkCopied:"Link copied",shareUrlCopied:"Sharing URL copied",protectedTitle:"Protected access",invalidToken:"Missing or invalid token.",home:"Home",notFoundTitle:"Not found",pageNotFound:"Page not found.",noteNotSharedTitle:"Note not shared",noteNotShared:"This note is not shared.",noteNotFoundTitle:"Note not found",fileNotFound:"File not found.",root:"Root",up:"Up",folder:"Folder",folders:"Folders",note:"Note",notes:"Notes",file:"File",files:"Files",folderCount:"folder",foldersCount:"folders",noteCount:"note",notesCount:"notes",fileCount:"file",filesCount:"files",ticket:"ticket",tickets:"tickets",sharedSpace:"Shared space",nothingShared:"No shared files yet.",sharedFiles:"Shared files",sharedNotes:"Shared notes",noteOutline:"Note outline",dashboardUnavailable:"Dashboard unavailable",sprintTodo:"TODO",sprintActive:"IN PROGRESS",sprintDone:"DONE",sprintTotal:"Total",sprintFinished:"Done",sprintRemaining:"Remaining",sprintScale:"Scale: 1 square = 1 d",dayUnit:"d",analyticsResetTitle:"Clear statistics?",analyticsResetBody:"Locally stored views and anonymous visitors will be permanently deleted.",cancel:"Cancel",clear:"Clear",folderShareTitle:"Share this folder?",folderShareBody:"The \u201C{folder}\u201D folder and its {files} will be available to devices on the local network.",folderShareFuture:"New files added to this folder will also be shared.",shareFolder:"Share folder",shareThisFolder:"Share this folder",share:"Share",localSharing:"Local sharing",openMarkdown:"Open a Markdown note to add it to local sharing.",noteSharedByFolder:"This note is shared through its parent folder.",noteSharedNetwork:"This note is shared on the local network.",noteNotSharedYet:"This note is not shared yet.",copyLink:"Copy link",removeFromShare:"Remove from sharing",enableCopyLink:"Enable and copy link",activeServer:"Active: {url}",serverOff:"Server stopped",localServer:"Local server",localServerDesc:"Start or stop sharing on the local network.",stop:"Stop",start:"Start",copyUrl:"Copy URL",port:"Port",portDesc:"HTTP port used on your computer.",startWithObsidian:"Start with Obsidian",startWithObsidianDesc:"Automatically restart sharing when the vault opens.",autoStop:"Automatic stop",autoStopDesc:"Limit how long the server remains available on the local network.",disabled:"Disabled",afterOneHour:"After 1 hour",afterHours:"After {hours} hours",urlToken:"URL token",urlTokenDesc:"Add a secret key to shared links.",regenerate:"Regenerate",anonymousStats:"Anonymous statistics",anonymousStatsDesc:"Local browser/device counting. No IP address or URL token is stored.",enableCounting:"Enable counting",enableCountingDesc:"Count only viewed HTML pages, excluding images and files.",ignoreComputer:"Ignore this computer",ignoreComputerDesc:"Do not count visits from the computer running Obsidian.",uniqueRetention:"Unique visitor retention",uniqueRetentionDesc:"View totals remain cumulative; older anonymous identifiers are forgotten.",days:"{days} days",oneYear:"1 year",sharedAppearance:"Shared page appearance",theme:"Theme",themeDesc:"Color palette used by generated web pages.",light:"Light",system:"System",accentColor:"Accent color",accentColorDesc:"Main color used for links and accents.",contentWidth:"Content width",contentWidthDesc:"Maximum page width in pixels.",showPaths:"Show paths",showPathsDesc:"Show the full path below notes and files in the index.",font:"Font",fontDesc:"CSS font-family value applied to shared pages.",customCss:"Custom CSS",customCssDesc:"CSS added after the theme. Use --page-* variables for simple adjustments.",shareActiveNote:"Share active note",shareActiveNoteDesc:"Add the currently open note to the list.",add:"Add",noActiveNote:"No active note",sharedFolders:"Shared folders",noSharedFolders:"No shared folders.",copy:"Copy",remove:"Remove",individuallySharedNotes:"Individually shared notes",noIndividualNotes:"No individually shared notes.",views:"Views",uniqueVisitors:"Unique visitors",today:"Today",uniqueEstimate:"Estimated unique visitors over {days} days.",clearStatistics:"Clear statistics",statisticsCleared:"Statistics cleared",noRemoteVisit:"No remote visits counted yet.",countingDisabled:"Counting is disabled.",page:"Page",visitors:"Visitors",lastAccess:"Last access",browseVault:"Browse vault",inheritedShare:"Inherited sharing",sharedFeminine:"Shared",emptyFolder:"No folders or Markdown notes here."},_e={ribbonShareNote:"Partager la note active",commandManageNote:"G\xE9rer le partage local de la note active",commandToggleServer:"D\xE9marrer/arr\xEAter le serveur de partage local",commandShareNote:"Partager la note active localement",commandUnshareNote:"Arr\xEAter de partager la note active localement",commandCopyUrl:"Copier l\u2019URL de partage local",serverStopped:"Partage local arr\xEAt\xE9",errorTitle:"Erreur",serverDurationManual:"jusqu\u2019\xE0 son arr\xEAt manuel",serverDurationHours:"pendant {hours} h",serverProtected:"prot\xE9g\xE9 par un token",serverUnprotected:"sans token",serverStarted:`Partage accessible aux appareils du r\xE9seau local {duration} ({protection}).
{url}`,serverAutoStopped:"Partage local arr\xEAt\xE9 automatiquement",markdownOnly:"Seules les notes Markdown peuvent \xEAtre partag\xE9es",noteShared:"Note partag\xE9e, URL copi\xE9e",noteUnshared:"Note retir\xE9e du partage local",selectFolder:"S\xE9lectionne un dossier du coffre \xE0 partager",folderShared:"Dossier partag\xE9 ({files}), URL copi\xE9e",folderUnshared:"Dossier retir\xE9 du partage local",menuShareFolder:"Partager le dossier localement",menuUnshareFolder:"Retirer le dossier du partage local",menuCopyFolderLink:"Copier le lien du dossier partag\xE9",folderLinkCopied:"Lien du dossier copi\xE9",statusSharedFolder:"Partag\xE9e (dossier)",statusShared:"Partag\xE9e",statusPrivate:"Priv\xE9e",statusSharedFolderTitle:"Cette note est partag\xE9e par son dossier",statusUnshareTitle:"Retirer cette note du partage",statusShareTitle:"Partager cette note",linkCopiedFolderManaged:"Lien copi\xE9 ; le partage est g\xE9r\xE9 par le dossier parent",copySharedLink:"Copier le lien partag\xE9",linkCopied:"Lien copi\xE9",shareUrlCopied:"URL de partage copi\xE9e",protectedTitle:"Acc\xE8s prot\xE9g\xE9",invalidToken:"Token manquant ou invalide.",home:"Accueil",notFoundTitle:"Introuvable",pageNotFound:"Page introuvable.",noteNotSharedTitle:"Note non partag\xE9e",noteNotShared:"Cette note n\u2019est pas partag\xE9e.",noteNotFoundTitle:"Note introuvable",fileNotFound:"Fichier introuvable.",root:"Racine",up:"Monter",folder:"Dossier",folders:"Dossiers",note:"Note",notes:"Notes",file:"Fichier",files:"Fichiers",folderCount:"dossier",foldersCount:"dossiers",noteCount:"note",notesCount:"notes",fileCount:"fichier",filesCount:"fichiers",ticket:"ticket",tickets:"tickets",sharedSpace:"Espace partag\xE9",nothingShared:"Aucun fichier partag\xE9 pour le moment.",sharedFiles:"Fichiers partag\xE9s",sharedNotes:"Notes partag\xE9es",noteOutline:"Plan de la note",dashboardUnavailable:"Dashboard indisponible",sprintTodo:"\xC0 FAIRE",sprintActive:"EN COURS",sprintDone:"TERMIN\xC9",sprintTotal:"Total",sprintFinished:"Fini",sprintRemaining:"Reste",sprintScale:"\xC9chelle : 1 carr\xE9 = 1 j.h",dayUnit:"j.h",analyticsResetTitle:"Effacer les statistiques ?",analyticsResetBody:"Les vues et visiteurs anonymes enregistr\xE9s localement seront d\xE9finitivement supprim\xE9s.",cancel:"Annuler",clear:"Effacer",folderShareTitle:"Partager ce dossier ?",folderShareBody:"Le dossier \xAB {folder} \xBB et ses {files} seront accessibles aux appareils du r\xE9seau local.",folderShareFuture:"Les nouveaux fichiers ajout\xE9s dans ce dossier seront \xE9galement partag\xE9s.",shareFolder:"Partager le dossier",shareThisFolder:"Partager ce dossier",share:"Partager",localSharing:"Partage local",openMarkdown:"Ouvre une note Markdown pour l\u2019ajouter au partage local.",noteSharedByFolder:"Cette note est partag\xE9e par son dossier parent.",noteSharedNetwork:"Cette note est partag\xE9e sur le r\xE9seau local.",noteNotSharedYet:"Cette note n\u2019est pas encore partag\xE9e.",copyLink:"Copier le lien",removeFromShare:"Retirer du partage",enableCopyLink:"Activer et copier le lien",activeServer:"Actif : {url}",serverOff:"Serveur arr\xEAt\xE9",localServer:"Serveur local",localServerDesc:"D\xE9marre ou arr\xEAte le partage sur le r\xE9seau local.",stop:"Arr\xEAter",start:"D\xE9marrer",copyUrl:"Copier l\u2019URL",port:"Port",portDesc:"Port HTTP utilis\xE9 sur ta machine.",startWithObsidian:"D\xE9marrer avec Obsidian",startWithObsidianDesc:"Relance automatiquement le partage \xE0 l\u2019ouverture du coffre.",autoStop:"Arr\xEAt automatique",autoStopDesc:"Limite la dur\xE9e pendant laquelle le serveur reste accessible sur le r\xE9seau local.",disabled:"D\xE9sactiv\xE9",afterOneHour:"Apr\xE8s 1 heure",afterHours:"Apr\xE8s {hours} heures",urlToken:"Token dans l\u2019URL",urlTokenDesc:"Ajoute une cl\xE9 secr\xE8te dans les liens partag\xE9s.",regenerate:"R\xE9g\xE9n\xE9rer",anonymousStats:"Statistiques anonymes",anonymousStatsDesc:"Comptage local par navigateur/appareil. Aucune adresse IP ni aucun token d\u2019URL n\u2019est conserv\xE9.",enableCounting:"Activer le comptage",enableCountingDesc:"Compte uniquement les pages HTML consult\xE9es, sans compter les images et fichiers.",ignoreComputer:"Ignorer cet ordinateur",ignoreComputerDesc:"Ne compte pas les visites faites depuis la machine qui h\xE9berge Obsidian.",uniqueRetention:"Dur\xE9e des visiteurs uniques",uniqueRetentionDesc:"Les compteurs de vues restent cumulatifs ; les identifiants anonymes plus anciens sont oubli\xE9s.",days:"{days} jours",oneYear:"1 an",sharedAppearance:"Apparence des pages partag\xE9es",theme:"Th\xE8me",themeDesc:"Palette utilis\xE9e par les pages web g\xE9n\xE9r\xE9es.",light:"Clair",system:"Syst\xE8me",accentColor:"Couleur principale",accentColorDesc:"Couleur des liens et accents principaux.",contentWidth:"Largeur du contenu",contentWidthDesc:"Largeur maximale des pages, en pixels.",showPaths:"Afficher les chemins",showPathsDesc:"Affiche le chemin complet sous les notes et fichiers de l\u2019index.",font:"Police",fontDesc:"Valeur CSS font-family appliqu\xE9e aux pages partag\xE9es.",customCss:"CSS personnalis\xE9",customCssDesc:"CSS ajout\xE9 apr\xE8s le th\xE8me. Utilise les variables --page-* pour des ajustements simples.",shareActiveNote:"Partager la note active",shareActiveNoteDesc:"Ajoute la note actuellement ouverte \xE0 la liste.",add:"Ajouter",noActiveNote:"Aucune note active",sharedFolders:"Dossiers partag\xE9s",noSharedFolders:"Aucun dossier partag\xE9.",copy:"Copier",remove:"Retirer",individuallySharedNotes:"Notes partag\xE9es individuellement",noIndividualNotes:"Aucune note partag\xE9e individuellement.",views:"Vues",uniqueVisitors:"Visiteurs uniques",today:"Aujourd\u2019hui",uniqueEstimate:"Visiteurs uniques estim\xE9s sur {days} jours.",clearStatistics:"Effacer les statistiques",statisticsCleared:"Statistiques effac\xE9es",noRemoteVisit:"Aucune visite distante comptabilis\xE9e pour le moment.",countingDisabled:"Le comptage est d\xE9sactiv\xE9.",page:"Page",visitors:"Visiteurs",lastAccess:"Dernier acc\xE8s",browseVault:"Parcourir le coffre",inheritedShare:"Partage h\xE9rit\xE9",sharedFeminine:"Partag\xE9e",emptyFolder:"Aucun dossier ou note Markdown ici."};function me(r){return r?.toLowerCase().startsWith("fr")?"fr":"en"}function _(r,e,t={}){return(r==="fr"?_e[e]:We[e]).replace(/\{(\w+)\}/g,(n,i)=>String(t[i]??n))}function F(r,e,t,s){return`${e} ${_(r,e===1?t:s)}`}var Ke={"royal-velvet":{colorScheme:"dark",background:"#000000",text:"hsl(60 30% 96%)",surface:"hsl(235 15% 13% / 0.9)",surfaceStrong:"hsl(235 15% 19% / 0.96)",border:"hsl(285 100% 75.1% / 0.24)",muted:"hsl(60 30% 96% / 0.6)",accent:"hsl(35 100% 75.1%)",shadow:"0 20px 60px hsl(235 25% 4% / 0.5)"},light:{colorScheme:"light",background:"#f7f7f5",text:"#252522",surface:"rgb(255 255 255 / 0.92)",surfaceStrong:"#ffffff",border:"rgb(37 37 34 / 0.14)",muted:"rgb(37 37 34 / 0.62)",accent:"#9a5b00",shadow:"0 18px 50px rgb(31 35 40 / 0.12)"},system:{colorScheme:"normal",background:"Canvas",text:"CanvasText",surface:"color-mix(in srgb, Canvas 92%, CanvasText 8%)",surfaceStrong:"color-mix(in srgb, Canvas 86%, CanvasText 14%)",border:"color-mix(in srgb, CanvasText 20%, transparent)",muted:"color-mix(in srgb, CanvasText 62%, transparent)",accent:"LinkText",shadow:"0 18px 50px rgb(0 0 0 / 0.18)"}};function fe(r){let e=Ke[r.preset];return`
    color-scheme: ${e.colorScheme};
    font-family: ${Ge(r.fontFamily)};
    --content-width: ${r.contentWidth}px;
    --page-bg: ${e.background};
    --page-text: ${e.text};
    --page-link: ${r.accentColor};
    --page-surface: ${e.surface};
    --page-surface-strong: ${e.surfaceStrong};
    --page-border: ${e.border};
    --page-muted: ${e.muted};
    --page-accent: ${e.accent};
    --page-shadow: ${e.shadow};
    --heading-pink: ${r.accentColor};
    --heading-orange: hsl(35 100% 65%);
    --heading-yellow: hsl(55 92% 62%);
    --heading-green: hsl(115 58% 58%);
    --heading-blue: hsl(190 75% 58%);
    --heading-purple: hsl(265 78% 72%);
  `.trim()}function ve(r){return r.customCss.trim()?r.customCss.replace(/<\/style/gi,"<\\/style"):""}function Ge(r){return r.replace(/[;{}<>]/g,"").trim()||"system-ui, sans-serif"}function ye(r){return`    :root {
      ${fe(r)}
      /* Legacy fallbacks kept while the page stylesheet is modularized. */
      /* Palette Royal Velvet \u2014 le th\xE8me actif du vault Obsidian. */
    }
    * { box-sizing: border-box; }
    body {
      background: var(--page-bg);
      color: var(--page-text);
      margin: 0;
    }
    main { line-height: 1.65; margin: 0 auto; max-width: var(--content-width); padding: 40px 24px 72px; }
    h1, h2, h3, h4, h5, h6 { line-height: 1.2; margin: 1.4em 0 0.45em; }
    h1, h2, h3, h4, h5, h6 {
      -webkit-text-fill-color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }
    h1 { background-image: linear-gradient(135deg, var(--heading-pink), var(--heading-orange)); }
    h2 { background-image: linear-gradient(135deg, var(--heading-orange), var(--heading-yellow)); }
    h3 { background-image: linear-gradient(135deg, var(--heading-yellow), var(--heading-green)); }
    h4 { background-image: linear-gradient(135deg, var(--heading-green), var(--heading-blue)); }
    h5 { background-image: linear-gradient(135deg, var(--heading-blue), var(--heading-purple)); }
    h6 { background-image: linear-gradient(135deg, var(--heading-purple), var(--heading-pink)); }
    h1 { font-size: clamp(2.2rem, 4vw, 3.4rem); letter-spacing: -0.04em; margin: 0 0 22px; }
    h2 { font-size: 1.65rem; }
    h3 { font-size: 1.35rem; }
    h4 { font-size: 1.15rem; }
    h5, h6 { font-size: 1rem; }
    a { color: var(--page-link); text-decoration-color: hsl(330 100% 75.1% / 0.45); text-underline-offset: 0.16em; }
    a:hover { color: hsl(330 100% 90%); text-decoration-color: currentColor; }
    a.internal-link { color: var(--heading-orange); text-decoration-color: hsl(35 100% 75.1% / 0.5); }
    a.external-link { color: var(--heading-green); text-decoration-color: hsl(115 100% 75.1% / 0.5); }
    a.internal-link:hover { color: hsl(35 100% 90%); }
    a.external-link:hover { color: hsl(115 100% 90%); }
    .back { display: inline-block; font-size: 0.9rem; margin-bottom: 24px; text-decoration: none; }
    p { margin: 0.8em 0; }
    strong { color: hsl(60 30% 100%); }
    em { color: var(--heading-purple); }
    hr { border: 0; border-top: 1px solid var(--page-border); margin: 2em 0; }
    code {
      background: hsl(235 15% 9%);
      border: 1px solid hsl(285 100% 75.1% / 0.18);
      border-radius: 4px;
      color: var(--heading-purple);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      padding: 0.1em 0.3em;
    }
    pre {
      background: hsl(235 15% 9%);
      border: 1px solid hsl(285 100% 75.1% / 0.18);
      border-radius: 8px;
      overflow: auto;
      padding: 14px;
    }
    pre code { background: transparent; border: 0; color: var(--page-text); padding: 0; }
    blockquote {
      background: hsl(235 15% 13%);
      border: 0 solid var(--heading-orange);
      border-left-width: 4px;
      border-radius: 4px;
      color: var(--page-text);
      margin: 1.2em 30px;
      padding: 10px 20px;
    }
    ul, ol { margin: 0.75em 0; padding-left: 1.8em; }
    li { margin: 0.3em 0; padding-left: 0.15em; }
    ul li::marker, ol li::marker { color: var(--heading-pink); }
    ul ul li::marker, ol ol li::marker { color: var(--heading-orange); }
    ul ul ul li::marker, ol ol ol li::marker { color: var(--heading-yellow); }
    ul ul ul ul li::marker, ol ol ol ol li::marker { color: var(--heading-green); }
    ul ul ul ul ul li::marker, ol ol ol ol ol li::marker { color: var(--heading-blue); }
    ul ul ul ul ul ul li::marker, ol ol ol ol ol ol li::marker { color: var(--heading-purple); }
    mark { background: hsl(60 100% 75.1% / 0.25); color: var(--page-text); }
    del { color: var(--page-muted); }
    img { border-radius: 4px; display: block; height: auto; margin: 16px 0; max-width: 100%; }
    .vault-hero {
      background: linear-gradient(180deg, var(--page-surface-strong), var(--page-surface));
      border: 1px solid var(--page-border);
      border-radius: 26px;
      box-shadow: var(--page-shadow);
      margin-bottom: 28px;
      padding: 22px 22px 20px;
    }
    .vault-toolbar {
      align-items: center;
      display: flex;
      gap: 12px;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .vault-breadcrumbs {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0;
    }
    .vault-crumb {
      color: var(--page-muted);
      text-decoration: none;
    }
    .vault-crumb.is-current,
    .vault-crumb:hover {
      color: var(--page-text);
    }
    .vault-crumb-sep {
      color: var(--page-muted);
    }
    .vault-toolbar-actions {
      display: flex;
      gap: 10px;
    }
    .vault-button {
      background: var(--page-surface);
      border: 1px solid var(--page-border);
      border-radius: 999px;
      color: var(--page-text);
      padding: 8px 14px;
      text-decoration: none;
    }
    .vault-button:hover {
      background: var(--page-surface-strong);
    }
    .vault-label {
      color: var(--page-link);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      margin: 0 0 10px;
      text-transform: uppercase;
    }
    .vault-hero-main {
      align-items: end;
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    .vault-path {
      color: var(--page-accent);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 1.1rem;
      margin: 0 0 6px;
    }
    .vault-count {
      color: var(--page-muted);
      margin: 0;
    }
    .vault-section {
      margin-top: 24px;
    }
    .vault-section-head {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .entry-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .entry-row {
      border-top: 1px solid var(--page-border);
    }
    .entry-main {
      color: inherit;
      display: block;
      padding: 16px 2px;
      text-decoration: none;
    }
    .entry-main:hover .entry-title {
      color: var(--page-link);
    }
    .entry-kicker {
      color: var(--page-link);
      display: block;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .entry-title {
      color: var(--page-text);
      display: block;
      font-size: 1.08rem;
      font-weight: 650;
    }
    .entry-meta {
      color: var(--page-muted);
      display: block;
      font-size: 0.92rem;
      margin-top: 4px;
    }
    .markdown-table-wrap {
      margin: 16px 0 22px;
      overflow-x: auto;
    }
    .markdown-table {
      border-collapse: separate;
      border-spacing: 0;
      outline: 2px solid var(--page-surface);
      outline-offset: -2px;
      border-radius: 4px;
      width: 100%;
    }
    .markdown-table th,
    .markdown-table td {
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }
    .markdown-table th {
      background-image: linear-gradient(135deg, var(--heading-purple), var(--heading-pink));
      color: hsl(235 15% 15%);
      font-size: 1em;
      font-weight: 700;
      text-align: center;
    }
    .markdown-table tbody tr:nth-child(odd) { background: hsl(235 15% 13%); }
    .markdown-table tbody tr:nth-child(even) { background: hsl(235 15% 15%); }
    .shared-sprint-dashboard {
      display: grid;
      gap: 16px;
      margin: 12px 0 28px;
    }
    .shared-sprint-totals {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .shared-sprint-totals > div,
    .shared-sprint-grid {
      background: var(--page-surface);
      border: 1px solid var(--page-border);
      border-radius: 16px;
      box-shadow: var(--page-shadow);
    }
    .shared-sprint-totals > div {
      font-size: 0.92rem;
      font-weight: 700;
      padding: 14px 16px;
    }
    .shared-sprint-columns {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .shared-sprint-column h4 {
      font-size: 0.82rem;
      letter-spacing: 0.14em;
      margin: 0 0 8px;
      text-transform: uppercase;
    }
    .shared-sprint-grid {
      margin: 0;
      padding: 16px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .shared-sprint-empty {
      background: var(--page-surface);
      border: 1px solid var(--page-border);
      border-radius: 16px;
      padding: 16px;
    }
    .shared-note-layout { display: grid; gap: 32px; grid-template-columns: minmax(0, 1fr) 240px; margin: 0 auto; max-width: 1440px; padding: 40px 24px 72px; }
    .shared-note-layout main { margin: 0; max-width: none; min-width: 0; padding: 0; }
    .shared-note-layout .note-outline { align-self: start; position: sticky; top: 24px; }
    .note-outline h2 { border-bottom: 1px solid var(--page-border); font-size: 0.95rem; margin: 0; padding: 10px 14px; }
    .note-outline ol { list-style: none; margin: 0; max-height: calc(100vh - 110px); overflow: auto; padding: 10px 12px; }
    .note-outline li { margin: 2px 0; padding: 0; }
    .note-outline a { border-left: 2px solid transparent; color: var(--page-muted); display: block; font-size: 0.88rem; line-height: 1.4; overflow-wrap: anywhere; padding: 4px 8px; text-decoration: none; }
    .note-outline a:hover { border-left-color: var(--heading-pink); color: var(--page-link); }
    .note-outline a[aria-current="location"] { background: var(--page-surface); border-left-color: var(--heading-pink); color: var(--page-link); font-weight: 700; }
    .note-outline-level-2 { margin-left: 0.6rem !important; }
    .note-outline-level-3 { margin-left: 1.2rem !important; }
    .note-outline-level-4 { margin-left: 1.8rem !important; }
    .note-outline-level-5 { margin-left: 2.4rem !important; }
    .note-outline-level-6 { margin-left: 3rem !important; }

    @media (max-width: 720px) {
      .shared-note-layout { display: flex; flex-direction: column; gap: 20px; padding: 24px 16px 56px; }
      .shared-note-layout .note-outline { order: -1; position: static; }
      .note-outline ol { max-height: 35vh; }
      main { padding: 24px 16px 56px; }
      .vault-toolbar,
      .vault-hero-main { align-items: flex-start; flex-direction: column; }
      .vault-toolbar-actions { width: 100%; }
      .shared-sprint-totals,
      .shared-sprint-columns { grid-template-columns: 1fr; }
    }
    ${ve(r)}
`}var Se=L(require("node:path"));function R(r){let e=w(r);return!e||!e.includes("/")?"":e.slice(0,e.lastIndexOf("/"))}function w(r){let e=U(r).replace(/\\/g,"/").replace(/^\/+/,"");if(!e||e.includes("\0"))return"";let t=Se.default.posix.normalize(e);return t==="."||t===".."||t.startsWith("../")?"":t}function K(r){let e=U(r).split("|")[0].trim().replace(/^<|>$/g,"");if(!e)return{path:"",subpath:""};let[t,...s]=e.split("#");return{path:t.trim(),subpath:s.join("#").trim()}}function G(r){return U(r).trim().toLowerCase().replace(/<[^>]+>/g,"").replace(/[`*_~[\]\\]/g,"").replace(/[^\p{L}\p{N}\s-]/gu,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")}function v(r){return U(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function U(r){return typeof r=="string"?r:""}var N=require("obsidian");var B=class{constructor(e){this.vault=e}folderFiles=new Map;cacheKey="";sharedPaths=[];invalidate(){this.folderFiles.clear(),this.cacheKey="",this.sharedPaths=[]}invalidateSelection(){this.cacheKey="",this.sharedPaths=[]}filesInFolder(e){let t=w(e),s=this.folderFiles.get(t);if(s)return s;let n=t?this.vault.getAbstractFileByPath(t):this.vault.getRoot();if(!(n instanceof N.TFolder))return[];let i=[];return this.collectFiles(n,i),this.folderFiles.set(t,i),i}getSharedPaths(e,t){let s=t.map(w).filter(Boolean).sort(),n=e.map(w).filter(Boolean).sort(),i=JSON.stringify([n,s]);if(i===this.cacheKey)return this.sharedPaths;let a=new Set(n);for(let o of s)for(let l of this.filesInFolder(o))a.add(l.path);return this.cacheKey=i,this.sharedPaths=[...a].sort(),this.sharedPaths}collectFiles(e,t){for(let s of e.children)s instanceof N.TFile?t.push(s):s instanceof N.TFolder&&this.collectFiles(s,t)}};var xe=require("node:crypto");var D={preset:"royal-velvet",accentColor:"#ff80bf",contentWidth:980,fontFamily:'"Segoe UI", Inter, ui-sans-serif, system-ui, sans-serif',showFilePaths:!0,customCss:""},be={port:8099,autoStart:!1,autoStopMinutes:0,requireToken:!0,token:"",sharedNotes:[],sharedFolders:[],analytics:z,analyticsData:I(),theme:D},Ye=new Set(["royal-velvet","light","system"]);function Te(r){let e=we(r)?r:{},t=we(e.theme)?e.theme:{},s=Number(e.port),n=Number(t.contentWidth),i=Number(e.autoStopMinutes),a=typeof t.preset=="string"&&Ye.has(t.preset)?t.preset:D.preset;return{port:Number.isInteger(s)&&s>=1&&s<=65535?s:be.port,autoStart:e.autoStart===!0,autoStopMinutes:[0,60,120,240,480].includes(i)?i:be.autoStopMinutes,requireToken:e.requireToken!==!1,token:typeof e.token=="string"?e.token:"",sharedNotes:ke(e.sharedNotes),sharedFolders:ke(e.sharedFolders),analytics:ae(e.analytics),analyticsData:oe(e.analyticsData),theme:{preset:a,accentColor:Qe(t.accentColor)?t.accentColor:D.accentColor,contentWidth:Number.isFinite(n)?Xe(n,560,1600):D.contentWidth,fontFamily:typeof t.fontFamily=="string"&&t.fontFamily.trim()?t.fontFamily.trim().slice(0,240):D.fontFamily,showFilePaths:t.showFilePaths!==!1,customCss:typeof t.customCss=="string"?t.customCss.slice(0,5e4):""}}}function Y(){return(0,xe.randomBytes)(24).toString("hex")}function we(r){return typeof r=="object"&&r!==null&&!Array.isArray(r)}function ke(r){return Array.isArray(r)?[...new Set(r.filter(e=>typeof e=="string"&&e.length>0))].sort():[]}function Qe(r){return typeof r=="string"&&/^#[0-9a-f]{6}$/i.test(r)}function Xe(r,e,t){return Math.min(t,Math.max(e,Math.round(r)))}var h=require("obsidian");function Ce(r,e,t,s){return new Promise(n=>{new X(r,e,t,s,n).open()})}function Je(r,e){return new Promise(t=>{new Q(r,e,t).open()})}var Q=class extends h.Modal{constructor(t,s,n){super(t);this.plugin=s;this.resolveChoice=n}resolved=!1;onOpen(){this.contentEl.empty(),this.contentEl.createEl("h2",{text:this.plugin.t("analyticsResetTitle")}),this.contentEl.createEl("p",{text:this.plugin.t("analyticsResetBody")}),new h.Setting(this.contentEl).addButton(t=>t.setButtonText(this.plugin.t("cancel")).onClick(()=>this.finish(!1))).addButton(t=>t.setButtonText(this.plugin.t("clear")).setWarning().onClick(()=>this.finish(!0)))}onClose(){this.resolved||this.resolveChoice(!1)}finish(t){this.resolved=!0,this.resolveChoice(t),this.close()}},X=class extends h.Modal{constructor(t,s,n,i,a){super(t);this.plugin=s;this.folderPath=n;this.fileCount=i;this.resolveChoice=a}resolved=!1;onOpen(){let{contentEl:t}=this;t.empty(),t.createEl("h2",{text:this.plugin.t("folderShareTitle")}),t.createEl("p",{text:this.plugin.t("folderShareBody",{folder:this.folderPath,files:F(this.plugin.locale,this.fileCount,"fileCount","filesCount")})}),t.createEl("p",{cls:"local-note-share-status",text:this.plugin.t("folderShareFuture")}),new h.Setting(t).addButton(s=>{s.setButtonText(this.plugin.t("cancel")).onClick(()=>this.finish(!1))}).addButton(s=>{s.setButtonText(this.plugin.t("shareFolder")).setWarning().onClick(()=>this.finish(!0))})}onClose(){this.resolved||this.resolveChoice(!1)}finish(t){this.resolved=!0,this.resolveChoice(t),this.close()}},M=class extends h.Modal{plugin;constructor(e,t){super(e),this.plugin=t}onOpen(){let{contentEl:e}=this;e.empty(),e.createEl("h2",{text:this.plugin.t("localSharing")});let t=this.app.workspace.getActiveFile();if(!(t instanceof h.TFile)||t.extension!=="md"){e.createDiv({cls:"local-note-share-status",text:this.plugin.t("openMarkdown")});return}let s=this.plugin.isNoteShared(t),n=this.plugin.isPathInSharedFolder(t.path);if(e.createDiv({cls:"local-note-share-status",text:n?this.plugin.t("noteSharedByFolder"):s?this.plugin.t("noteSharedNetwork"):this.plugin.t("noteNotSharedYet")}),e.createDiv({cls:"local-note-share-note-path",text:t.path}),s){let i=this.plugin.getNoteUrl(t.path);e.createDiv({cls:"local-note-share-url",text:i});let a=new h.Setting(e).addButton(o=>{o.setButtonText(this.plugin.t("copyLink")).setCta().onClick(async()=>{this.plugin.server||await this.plugin.startServer(),await this.plugin.copyText(this.plugin.getNoteUrl(t.path)),new h.Notice(this.plugin.t("linkCopied")),this.close()})});n||a.addButton(o=>{o.setButtonText(this.plugin.t("removeFromShare")).onClick(async()=>{await this.plugin.unshareNote(t.path),this.close()})});return}new h.Setting(e).addButton(i=>{i.setButtonText(this.plugin.t("enableCopyLink")).setCta().onClick(async()=>{await this.plugin.shareNote(t),this.close()})})}},H=class extends h.PluginSettingTab{plugin;currentFolder="";constructor(e,t){super(e,t),this.plugin=t,this.currentFolder=""}display(){let{containerEl:e}=this;e.empty(),new h.Setting(e).setName(this.plugin.t("localSharing")).setHeading(),e.createDiv({cls:"local-note-share-status",text:this.plugin.server?this.plugin.t("activeServer",{url:this.plugin.getShareUrl()}):this.plugin.t("serverOff")}),new h.Setting(e).setName(this.plugin.t("localServer")).setDesc(this.plugin.t("localServerDesc")).addButton(i=>{i.setButtonText(this.plugin.server?this.plugin.t("stop"):this.plugin.t("start")),this.plugin.server||i.setCta(),i.onClick(async()=>{await this.plugin.toggleServer(),this.display()})}).addButton(i=>{i.setButtonText(this.plugin.t("copyUrl")).onClick(()=>this.plugin.copyShareUrl())}),new h.Setting(e).setName(this.plugin.t("port")).setDesc(this.plugin.t("portDesc")).addText(i=>{i.setPlaceholder("8099").setValue(String(this.plugin.config.port)).onChange(async a=>{let o=Number(a);if(!Number.isInteger(o)||o<1||o>65535)return;let l=!!this.plugin.server;l&&await this.plugin.stopServer(),this.plugin.config.port=o,await this.plugin.saveSettings(),l&&await this.plugin.startServer(),this.display()})}),new h.Setting(e).setName(this.plugin.t("startWithObsidian")).setDesc(this.plugin.t("startWithObsidianDesc")).addToggle(i=>{i.setValue(this.plugin.config.autoStart).onChange(async a=>{this.plugin.config.autoStart=a,await this.plugin.saveSettings()})}),new h.Setting(e).setName(this.plugin.t("autoStop")).setDesc(this.plugin.t("autoStopDesc")).addDropdown(i=>{i.addOption("0",this.plugin.t("disabled")).addOption("60",this.plugin.t("afterOneHour")).addOption("120",this.plugin.t("afterHours",{hours:2})).addOption("240",this.plugin.t("afterHours",{hours:4})).addOption("480",this.plugin.t("afterHours",{hours:8})).setValue(String(this.plugin.config.autoStopMinutes)).onChange(async a=>{this.plugin.config.autoStopMinutes=Number(a),await this.plugin.saveSettings(),this.plugin.scheduleAutoStop()})}),new h.Setting(e).setName(this.plugin.t("urlToken")).setDesc(this.plugin.t("urlTokenDesc")).addToggle(i=>{i.setValue(this.plugin.config.requireToken).onChange(async a=>{this.plugin.config.requireToken=a,await this.plugin.saveSettings(),this.display()})}).addButton(i=>{i.setButtonText(this.plugin.t("regenerate")).onClick(async()=>{this.plugin.config.token=this.plugin.generateToken(),await this.plugin.saveSettings(),this.display()})}),new h.Setting(e).setName(this.plugin.t("anonymousStats")).setHeading(),e.createDiv({cls:"local-note-share-status",text:this.plugin.t("anonymousStatsDesc")}),new h.Setting(e).setName(this.plugin.t("enableCounting")).setDesc(this.plugin.t("enableCountingDesc")).addToggle(i=>{i.setValue(this.plugin.config.analytics.enabled).onChange(async a=>{this.plugin.config.analytics.enabled=a,await this.plugin.saveSettings(),this.display()})}),new h.Setting(e).setName(this.plugin.t("ignoreComputer")).setDesc(this.plugin.t("ignoreComputerDesc")).addToggle(i=>{i.setValue(this.plugin.config.analytics.excludeLocalhost).onChange(async a=>{this.plugin.config.analytics.excludeLocalhost=a,await this.plugin.saveSettings()})}),new h.Setting(e).setName(this.plugin.t("uniqueRetention")).setDesc(this.plugin.t("uniqueRetentionDesc")).addDropdown(i=>{i.addOption("7",this.plugin.t("days",{days:7})).addOption("30",this.plugin.t("days",{days:30})).addOption("90",this.plugin.t("days",{days:90})).addOption("365",this.plugin.t("oneYear")).setValue(String(this.plugin.config.analytics.retentionDays)).onChange(async a=>{this.plugin.config.analytics.retentionDays=Number(a),await this.plugin.saveSettings(),this.display()})}),this.renderAnalytics(e),new h.Setting(e).setName(this.plugin.t("sharedAppearance")).setHeading(),new h.Setting(e).setName(this.plugin.t("theme")).setDesc(this.plugin.t("themeDesc")).addDropdown(i=>{i.addOption("royal-velvet","Royal velvet").addOption("light",this.plugin.t("light")).addOption("system",this.plugin.t("system")).setValue(this.plugin.config.theme.preset).onChange(async a=>{this.plugin.config.theme.preset=a,await this.plugin.saveSettings()})}),new h.Setting(e).setName(this.plugin.t("accentColor")).setDesc(this.plugin.t("accentColorDesc")).addColorPicker(i=>{i.setValue(this.plugin.config.theme.accentColor).onChange(async a=>{this.plugin.config.theme.accentColor=a,await this.plugin.saveSettings()})}),new h.Setting(e).setName(this.plugin.t("contentWidth")).setDesc(this.plugin.t("contentWidthDesc")).addSlider(i=>{i.setLimits(560,1600,20).setValue(this.plugin.config.theme.contentWidth).setDynamicTooltip().onChange(async a=>{this.plugin.config.theme.contentWidth=a,await this.plugin.saveSettings()})}),new h.Setting(e).setName(this.plugin.t("showPaths")).setDesc(this.plugin.t("showPathsDesc")).addToggle(i=>{i.setValue(this.plugin.config.theme.showFilePaths).onChange(async a=>{this.plugin.config.theme.showFilePaths=a,await this.plugin.saveSettings()})}),new h.Setting(e).setName(this.plugin.t("font")).setDesc(this.plugin.t("fontDesc")).addText(i=>{i.setValue(this.plugin.config.theme.fontFamily),i.inputEl.addEventListener("change",()=>{$(async()=>{let a=i.getValue().trim();a&&(this.plugin.config.theme.fontFamily=a,await this.plugin.saveSettings())})})}),new h.Setting(e).setName(this.plugin.t("customCss")).setDesc(this.plugin.t("customCssDesc")).addTextArea(i=>{i.setPlaceholder(":root { --page-bg: #111; }").setValue(this.plugin.config.theme.customCss),i.inputEl.rows=8,i.inputEl.addEventListener("change",()=>{$(async()=>{this.plugin.config.theme.customCss=i.getValue(),await this.plugin.saveSettings()})})}).controlEl.addClass("local-note-share-custom-css"),new h.Setting(e).setName(this.plugin.t("shareActiveNote")).setDesc(this.plugin.t("shareActiveNoteDesc")).addButton(i=>{i.setButtonText(this.plugin.t("add")).setCta().onClick(()=>{let a=this.app.workspace.getActiveFile();if(!a){new h.Notice(this.plugin.t("noActiveNote"));return}this.plugin.shareNote(a).then(()=>this.display()).catch(o=>{console.error("NoteLAN share error",o)})})}),this.renderVaultBrowser(e),new h.Setting(e).setName(this.plugin.t("sharedFolders")).setHeading();let s=e.createDiv({cls:"local-note-share-list"});this.plugin.config.sharedFolders.length||s.createDiv({cls:"local-note-share-status",text:this.plugin.t("noSharedFolders")});for(let i of this.plugin.config.sharedFolders){let a=s.createDiv({cls:"local-note-share-note"});a.createDiv({cls:"local-note-share-note-path",text:i});let o=a.createDiv();new h.Setting(o).addButton(l=>{l.setButtonText(this.plugin.t("copy")).onClick(()=>this.plugin.copyText(this.plugin.getFolderUrl(i)))}).addButton(l=>{l.setButtonText(this.plugin.t("remove")).onClick(async()=>{await this.plugin.unshareFolder(i),this.display()})})}new h.Setting(e).setName(this.plugin.t("individuallySharedNotes")).setHeading();let n=e.createDiv({cls:"local-note-share-list"});if(!this.plugin.config.sharedNotes.length){n.createDiv({cls:"local-note-share-status",text:this.plugin.t("noIndividualNotes")});return}for(let i of this.plugin.config.sharedNotes){let a=n.createDiv({cls:"local-note-share-note"});a.createDiv({cls:"local-note-share-note-path",text:i});let o=a.createDiv();new h.Setting(o).addButton(l=>{l.setButtonText(this.plugin.t("copy")).onClick(()=>this.plugin.copyText(this.plugin.getNoteUrl(i)))}).addButton(l=>{l.setButtonText(this.plugin.t("remove")).onClick(async()=>{await this.plugin.unshareNote(i),this.display()})})}}renderAnalytics(e){let t=this.plugin.getAnalyticsSummary(),s=e.createDiv({cls:"local-note-share-analytics-metrics"});if(this.renderMetric(s,this.plugin.t("views"),t.totalViews),this.renderMetric(s,this.plugin.t("uniqueVisitors"),t.uniqueVisitors),this.renderMetric(s,this.plugin.t("today"),t.viewsToday),new h.Setting(e).setDesc(this.plugin.t("uniqueEstimate",{days:this.plugin.config.analytics.retentionDays})).addButton(c=>{c.setButtonText(this.plugin.t("clearStatistics")).setWarning().onClick(async()=>{await Je(this.app,this.plugin)&&(await this.plugin.resetAnalytics(),new h.Notice(this.plugin.t("statisticsCleared")),this.display())})}).settingEl.addClass("local-note-share-analytics-actions"),!t.pages.length){e.createDiv({cls:"local-note-share-status",text:this.plugin.config.analytics.enabled?this.plugin.t("noRemoteVisit"):this.plugin.t("countingDisabled")});return}let a=e.createDiv({cls:"local-note-share-analytics-table-wrapper"}).createEl("table",{cls:"local-note-share-analytics-table"}),o=a.createEl("thead").createEl("tr");for(let c of[this.plugin.t("page"),this.plugin.t("views"),this.plugin.t("visitors"),this.plugin.t("lastAccess")])o.createEl("th",{text:c});let l=a.createEl("tbody");for(let c of t.pages){let p=l.createEl("tr"),S=p.createEl("td");S.createDiv({text:c.title}),S.createDiv({cls:"local-note-share-analytics-path",text:c.kind==="index"?c.path||"/":c.path}),p.createEl("td",{text:String(c.views)}),p.createEl("td",{text:String(c.uniqueVisitors)}),p.createEl("td",{text:c.lastAccess?Ze(c.lastAccess,this.plugin.locale):"-"})}}renderMetric(e,t,s){let n=e.createDiv({cls:"local-note-share-analytics-metric"});n.createDiv({cls:"local-note-share-analytics-value",text:String(s)}),n.createDiv({cls:"local-note-share-analytics-label",text:t})}renderVaultBrowser(e){new h.Setting(e).setName(this.plugin.t("browseVault")).setHeading();let t=this.getCurrentFolder(),s=t.path||"",n=!s,i=e.createDiv({cls:"local-note-share-browser"}),a=i.createDiv({cls:"local-note-share-browser-header"});a.createDiv({cls:"local-note-share-browser-path",text:s||"/"});let o=a.createDiv({cls:"local-note-share-browser-actions"}),l=o.createEl("button",{text:this.plugin.t("root"),cls:"mod-muted"});l.disabled=!s,l.addEventListener("click",()=>{this.currentFolder="",this.display()});let c=o.createEl("button",{text:this.plugin.t("up"),cls:"mod-muted"});if(c.disabled=!s,c.addEventListener("click",()=>{this.currentFolder=R(s),this.display()}),!n){let d=this.plugin.isFolderExplicitlyShared(s);o.createEl("button",{text:d?this.plugin.t("menuUnshareFolder"):this.plugin.t("shareThisFolder"),cls:d?"mod-muted":"mod-cta"}).addEventListener("click",()=>{$(async()=>{d?await this.plugin.unshareFolder(s):await this.plugin.shareFolder(t),this.display()})})}let p=i.createDiv({cls:"local-note-share-browser-list"}),S=[...t.children],y=S.filter(d=>d instanceof h.TFolder).sort((d,f)=>d.name.localeCompare(f.name,this.plugin.locale,{sensitivity:"base"})),b=S.filter(d=>d instanceof h.TFile&&d.extension==="md").sort((d,f)=>d.basename.localeCompare(f.basename,this.plugin.locale,{sensitivity:"base"})),T=n?[]:b;if(i.createDiv({cls:"local-note-share-browser-count",text:`${F(this.plugin.locale,y.length,"folderCount","foldersCount")}, ${F(this.plugin.locale,T.length,"noteCount","notesCount")}`}),!y.length&&!T.length){p.createDiv({cls:"local-note-share-status",text:this.plugin.t("emptyFolder")});return}for(let d of y){let f=p.createDiv({cls:"local-note-share-browser-row is-folder"});f.createEl("button",{text:d.name,cls:"local-note-share-browser-entry mod-muted"}).addEventListener("click",()=>{this.currentFolder=d.path,this.display()});let m=f.createDiv({cls:"local-note-share-browser-actions"}),k=this.plugin.isFolderExplicitlyShared(d.path),x=!k&&this.plugin.isPathInSharedFolder(d.path);m.createEl("button",{text:k?this.plugin.t("remove"):x?this.plugin.t("inheritedShare"):this.plugin.t("shareFolder"),cls:k||x?"mod-muted":"mod-cta"}).addEventListener("click",()=>{$(async()=>{if(k){await this.plugin.unshareFolder(d.path),this.display();return}if(x){await this.plugin.copyText(this.plugin.getFolderUrl(d.path)),new h.Notice(this.plugin.t("folderLinkCopied"));return}await this.plugin.shareFolder(d),this.display()})})}for(let d of T){let f=p.createDiv({cls:"local-note-share-browser-row is-file"});f.createDiv({cls:"local-note-share-browser-entry",text:d.basename});let g=f.createDiv({cls:"local-note-share-browser-actions"}),m=this.plugin.isNoteShared(d);g.createEl("button",{text:m?this.plugin.t("sharedFeminine"):this.plugin.t("share"),cls:m?"mod-muted":"mod-cta"}).addEventListener("click",()=>{$(async()=>{if(m){await this.plugin.copyText(this.plugin.getNoteUrl(d.path)),new h.Notice(this.plugin.t("shareUrlCopied"));return}await this.plugin.shareNote(d),this.display()})})}}getCurrentFolder(){if(!this.currentFolder)return this.app.vault.getRoot();let e=this.app.vault.getAbstractFileByPath(this.currentFolder);return e instanceof h.TFolder?e:(this.currentFolder="",this.app.vault.getRoot())}};function Ze(r,e){return new Intl.DateTimeFormat(e==="fr"?"fr-FR":"en-US",{dateStyle:"short",timeStyle:"short"}).format(new Date(r))}function $(r){r().catch(e=>{console.error("NoteLAN settings action error",e)})}var et=new Set(["avif","bmp","gif","jpeg","jpg","png","svg","webp","pdf","mp3","wav","ogg","m4a","mp4","webm","mov"]),V=class extends u.Plugin{config;locale="en";server=null;shareIndex;notePageCache=new Map;autoStopTimer=null;analyticsSaveTimer=null;statusBarEl;ribbonIconEl;async onload(){this.locale=me(u.moment.locale()),await this.loadSettings(),this.server=null,this.shareIndex=new B(this.app.vault),this.statusBarEl=this.addStatusBarItem(),this.statusBarEl.addClass("local-note-share-statusbar"),this.ribbonIconEl=this.addRibbonIcon("share-2",this.t("ribbonShareNote"),()=>this.openCurrentNoteShareModal()),this.ribbonIconEl.addClass("local-note-share-ribbon-button"),this.updateUiState(),this.registerEvent(this.app.workspace.on("active-leaf-change",()=>void this.updateUiState())),this.registerEvent(this.app.vault.on("modify",e=>this.handleVaultModify(e))),this.registerEvent(this.app.vault.on("rename",(e,t)=>this.handleVaultRename(e,t))),this.registerEvent(this.app.vault.on("delete",e=>this.handleVaultDelete(e))),this.registerEvent(this.app.vault.on("create",()=>this.shareIndex.invalidate())),this.registerEvent(this.app.workspace.on("file-menu",(e,t)=>this.addFileMenuItems(e,t))),this.addCommand({id:"manage-current-note-local-share",name:this.t("commandManageNote"),checkCallback:e=>this.app.workspace.getActiveFile()?(e||this.openCurrentNoteShareModal(),!0):!1}),this.addCommand({id:"toggle-server",name:this.t("commandToggleServer"),callback:()=>void this.toggleServer()}),this.addCommand({id:"share-current-note-locally",name:this.t("commandShareNote"),checkCallback:e=>{let t=this.app.workspace.getActiveFile();return t?(e||this.shareNote(t),!0):!1}}),this.addCommand({id:"unshare-current-note-locally",name:this.t("commandUnshareNote"),checkCallback:e=>{let t=this.app.workspace.getActiveFile();return t?(e||this.unshareNote(t.path),!0):!1}}),this.addCommand({id:"copy-local-share-url",name:this.t("commandCopyUrl"),callback:()=>void this.copyShareUrl()}),this.addSettingTab(new H(this.app,this)),this.config.autoStart&&this.app.workspace.onLayoutReady(()=>void this.startServer())}onunload(){Promise.all([this.stopServer(),this.flushAnalyticsSave()]).catch(e=>{console.error("NoteLAN shutdown error",e)})}async loadSettings(){this.config=Te(await this.loadData()),this.config.token||(this.config.token=Y(),await this.saveSettings())}t(e,t){return _(this.locale,e,t)}async saveSettings(){this.config.sharedNotes=[...new Set(this.config.sharedNotes)].sort(),this.config.sharedFolders=[...new Set(this.config.sharedFolders.map(w).filter(Boolean))].sort(),this.shareIndex?.invalidateSelection(),this.notePageCache.clear(),await this.saveData(this.config)}queueAnalyticsSave(){this.analyticsSaveTimer||(this.analyticsSaveTimer=window.setTimeout(()=>{this.analyticsSaveTimer=null,this.saveData(this.config).catch(e=>{console.error("Local Note Share analytics save error",e)})},1e3))}async flushAnalyticsSave(){this.analyticsSaveTimer&&(window.clearTimeout(this.analyticsSaveTimer),this.analyticsSaveTimer=null,await this.saveData(this.config))}getAnalyticsSummary(){return he(this.config.analyticsData,this.config.analytics.retentionDays)}async resetAnalytics(){this.config.analyticsData=I(),await this.saveSettings()}async toggleServer(){if(this.server){await this.stopServer(),new u.Notice(this.t("serverStopped"));return}await this.startServer()}async startServer(){if(this.server)return;let e=Ne.default.createServer((n,i)=>{this.handleRequest(n,i).catch(a=>{console.error("Local Note Share error",a);let o=a instanceof Error?a.message:String(a);this.sendHtml(i,500,this.renderPage(this.t("errorTitle"),`<p>${v(o)}</p>`))})});this.server=e,await new Promise((n,i)=>{e.once("error",i),e.listen(Number(this.config.port),"0.0.0.0",()=>{e.off("error",i),n()})}),this.scheduleAutoStop();let t=this.config.autoStopMinutes?this.t("serverDurationHours",{hours:this.config.autoStopMinutes/60}):this.t("serverDurationManual"),s=this.config.requireToken?this.t("serverProtected"):this.t("serverUnprotected");new u.Notice(this.t("serverStarted",{duration:t,protection:s,url:this.getShareUrl()}),9e3)}async stopServer(){if(this.clearAutoStopTimer(),!this.server)return;let e=this.server;this.server=null,await new Promise(t=>e.close(t))}scheduleAutoStop(){this.clearAutoStopTimer(),!(!this.server||this.config.autoStopMinutes<=0)&&(this.autoStopTimer=window.setTimeout(()=>{this.stopServer().then(async()=>{await this.updateUiState(),new u.Notice(this.t("serverAutoStopped"))})},this.config.autoStopMinutes*6e4))}clearAutoStopTimer(){this.autoStopTimer&&(window.clearTimeout(this.autoStopTimer),this.autoStopTimer=null)}async shareNote(e){if(!(e instanceof u.TFile)||e.extension!=="md"){new u.Notice(this.t("markdownOnly"));return}this.config.sharedNotes.includes(e.path)||(this.config.sharedNotes.push(e.path),await this.saveSettings()),this.server||await this.startServer(),await this.copyText(this.getNoteUrl(e.path)),await this.updateUiState(),new u.Notice(this.t("noteShared"))}async unshareNote(e){this.config.sharedNotes=this.config.sharedNotes.filter(t=>t!==e),await this.saveSettings(),await this.updateUiState(),new u.Notice(this.t("noteUnshared"))}async shareFolder(e){if(!(e instanceof u.TFolder)||!e.path){new u.Notice(this.t("selectFolder"));return}if(!this.config.sharedFolders.includes(e.path)){let s=this.getFilesInFolder(e.path);if(!await Ce(this.app,this,e.path,s.length))return;this.config.sharedFolders.push(e.path),await this.saveSettings()}this.server||await this.startServer(),await this.copyText(this.getFolderUrl(e.path)),await this.updateUiState();let t=this.getFilesInFolder(e.path).length;new u.Notice(this.t("folderShared",{files:F(this.locale,t,"fileCount","filesCount")}))}async unshareFolder(e){let t=w(e);this.config.sharedFolders=this.config.sharedFolders.filter(s=>s!==t),await this.saveSettings(),await this.updateUiState(),new u.Notice(this.t("folderUnshared"))}isFolderExplicitlyShared(e){return this.config.sharedFolders.includes(w(e))}isPathInSharedFolder(e){let t=w(e);return this.config.sharedFolders.some(s=>t.startsWith(`${s}/`))}getFilesInFolder(e){return this.shareIndex.filesInFolder(e)}getSharedFilePaths(){return this.shareIndex.getSharedPaths(this.config.sharedNotes,this.config.sharedFolders)}getSharedNotePaths(){return this.getSharedFilePaths().filter(e=>{let t=this.app.vault.getAbstractFileByPath(e);return t instanceof u.TFile&&t.extension==="md"})}isNotePathShared(e){return this.config.sharedNotes.includes(e)||this.isPathInSharedFolder(e)}isNoteExplicitlyShared(e){return this.config.sharedNotes.includes(e)}addFileMenuItems(e,t){if(!(t instanceof u.TFolder)||!t.path)return;let s=this.isFolderExplicitlyShared(t.path);e.addItem(n=>{n.setTitle(s?this.t("menuUnshareFolder"):this.t("menuShareFolder")).setIcon(s?"circle-off":"share-2").onClick(()=>s?this.unshareFolder(t.path):this.shareFolder(t))}),(s||this.isPathInSharedFolder(t.path))&&e.addItem(n=>{n.setTitle(this.t("menuCopyFolderLink")).setIcon("link").onClick(async()=>{this.server||await this.startServer(),await this.copyText(this.getFolderUrl(t.path)),new u.Notice(this.t("folderLinkCopied"))})})}openCurrentNoteShareModal(){new M(this.app,this).open()}isNoteShared(e){return e instanceof u.TFile&&this.isNotePathShared(e.path)}async updateUiState(){this.updateRibbonState(),await this.updateStatusBar()}updateRibbonState(){if(!this.ribbonIconEl)return;let e=this.app.workspace.getActiveFile();this.ribbonIconEl.toggleClass("is-shared",this.isNoteShared(e))}async updateStatusBar(){if(!this.statusBarEl)return;let e=this.app.workspace.getActiveFile();if(this.statusBarEl.empty(),!(e instanceof u.TFile)||e.extension!=="md")return;let t=this.isNoteShared(e),s=this.isPathInSharedFolder(e.path),n=this.statusBarEl.createSpan({cls:`local-note-share-status-pill${t?" is-shared":""}`,text:s?this.t("statusSharedFolder"):t?this.t("statusShared"):this.t("statusPrivate")});if(n.title=s?this.t("statusSharedFolderTitle"):t?this.t("statusUnshareTitle"):this.t("statusShareTitle"),n.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),Ae(async()=>{s?(this.server||await this.startServer(),await this.copyText(this.getNoteUrl(e.path)),new u.Notice(this.t("linkCopiedFolderManaged"))):t?await this.unshareNote(e.path):await this.shareNote(e)})}),!t)return;let i=this.statusBarEl.createSpan({cls:"local-note-share-status-link"});(0,u.setIcon)(i,"link"),i.title=this.t("copySharedLink"),i.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),Ae(async()=>{this.server||await this.startServer(),await this.copyText(this.getNoteUrl(e.path)),new u.Notice(this.t("linkCopied"))})})}async handleVaultModify(e){e instanceof u.TFile&&this.notePageCache.delete(e.path);let t=this.app.workspace.getActiveFile();!(e instanceof u.TFile)||!t||e.path!==t.path||await this.updateStatusBar()}async handleVaultRename(e,t){this.shareIndex.invalidate(),this.notePageCache.delete(t);let s=!1,n=i=>i===t?(s=!0,e.path):e instanceof u.TFolder&&i.startsWith(`${t}/`)?(s=!0,`${e.path}${i.slice(t.length)}`):i;this.config.sharedNotes=this.config.sharedNotes.map(n),this.config.sharedFolders=this.config.sharedFolders.map(n),s&&await this.saveSettings(),await this.updateUiState()}async handleVaultDelete(e){this.shareIndex.invalidate(),this.notePageCache.delete(e.path);let t=e.path,s=a=>a!==t&&!a.startsWith(`${t}/`),n=this.config.sharedNotes.filter(s),i=this.config.sharedFolders.filter(s);n.length===this.config.sharedNotes.length&&i.length===this.config.sharedFolders.length||(this.config.sharedNotes=n,this.config.sharedFolders=i,await this.saveSettings(),await this.updateUiState())}async copyShareUrl(){this.server||await this.startServer(),await this.copyText(this.getShareUrl()),new u.Notice(this.t("shareUrlCopied"))}async copyText(e){await navigator.clipboard.writeText(e)}async handleRequest(e,t){if(!this.isAllowedRemoteAddress(e.socket.remoteAddress)){this.sendText(t,403,"Forbidden");return}let s=new URL(e.url||"/",`http://${e.headers.host||"localhost"}`);if(!this.isAuthorized(s)){this.sendHtml(t,401,this.renderPage(this.t("protectedTitle"),`<p>${this.t("invalidToken")}</p>`));return}if(s.pathname==="/"||s.pathname==="/index.html"){let n=w(s.searchParams.get("folder")||"");this.trackPageVisit(e,t,{key:`index:${n||"/"}`,kind:"index",path:n,title:n||this.t("home")}),this.sendHtml(t,200,this.renderIndex(n));return}if(s.pathname.startsWith("/note/")){let n=w(decodeURIComponent(s.pathname.slice(6)));await this.sendNote(e,t,n);return}if(s.pathname==="/asset"){let n=w(s.searchParams.get("path")||"");await this.sendAsset(t,n);return}this.sendHtml(t,404,this.renderPage(this.t("notFoundTitle"),`<p>${this.t("pageNotFound")}</p>`))}isAuthorized(e){return!this.config.requireToken||e.searchParams.get("token")===this.config.token}isAllowedRemoteAddress(e){if(!e)return!1;let t=e.replace(/^::ffff:/,"");if(t==="::1"||t==="127.0.0.1"||t.startsWith("10.")||t.startsWith("192.168."))return!0;let s=t.match(/^172\.(\d+)\./);if(s){let n=Number(s[1]);return n>=16&&n<=31}return t.startsWith("fe80:")}trackPageVisit(e,t,s){if(!this.config.analytics.enabled||e.method!=="GET"||this.config.analytics.excludeLocalhost&&de(e.socket.remoteAddress))return;let n=le(e,t,this.config.token);ce(this.config.analyticsData,n,s,this.config.analytics.retentionDays),this.queueAnalyticsSave()}async sendNote(e,t,s){if(!this.isNotePathShared(s)){this.sendHtml(t,404,this.renderPage(this.t("noteNotSharedTitle"),`<p>${this.t("noteNotShared")}</p>`));return}let n=this.app.vault.getAbstractFileByPath(s);if(!(n instanceof u.TFile)){this.sendHtml(t,404,this.renderPage(this.t("noteNotFoundTitle"),`<p>${this.t("fileNotFound")}</p>`));return}this.trackPageVisit(e,t,{key:`note:${n.path}`,kind:"note",path:n.path,title:n.basename});let i=this.notePageCache.get(n.path);if(i?.mtime===n.stat.mtime){this.sendHtml(t,200,i.html);return}let a=await this.app.vault.read(n),o=this.renderMarkdown(a,n.path),l=this.renderPage(n.basename,o,n.path);this.notePageCache.set(n.path,{mtime:n.stat.mtime,html:l}),this.sendHtml(t,200,l)}async sendAsset(e,t){if(!this.isAllowedAsset(t)){this.sendText(e,404,"Not found");return}let s=this.app.vault.getAbstractFileByPath(t);if(!(s instanceof u.TFile)){this.sendText(e,404,"Not found");return}let n=await this.app.vault.adapter.readBinary(s.path);e.writeHead(200,{"Content-Type":ge(s.extension),"Cache-Control":"no-store"}),e.end(Buffer.from(n))}isAllowedAsset(e){let t=this.app.vault.getAbstractFileByPath(e);if(!(t instanceof u.TFile))return!1;if(this.isPathInSharedFolder(e))return!0;if(!et.has(t.extension.toLowerCase()))return!1;for(let s of this.getSharedNotePaths()){let n=this.app.vault.getAbstractFileByPath(s);if(!(n instanceof u.TFile))continue;if((this.app.metadataCache.getFileCache(n)?.embeds||[]).some(o=>this.resolveLinkTarget(o.link,n.path)?.path===e))return!0}return!1}renderIndex(e=""){let t=w(e),s=t?`${t}/`:"",n=new Set,i=[],a=[];for(let g of this.getSharedFilePaths()){if(t&&!g.startsWith(s))continue;let m=t?g.slice(s.length):g;if(!m||m.startsWith("../"))continue;let k=m.split("/");if(k.length>1){n.add(k[0]);continue}let x=this.app.vault.getAbstractFileByPath(g);x instanceof u.TFile&&(x.extension==="md"?i.push({notePath:g,title:x.basename}):a.push({filePath:g,title:x.name}))}let o=[...n].sort((g,m)=>g.localeCompare(m,this.locale,{sensitivity:"base"}));i.sort((g,m)=>g.title.localeCompare(m.title,this.locale,{sensitivity:"base"})),a.sort((g,m)=>g.title.localeCompare(m.title,this.locale,{sensitivity:"base"}));let l=[F(this.locale,o.length,"folderCount","foldersCount"),F(this.locale,i.length,"noteCount","notesCount"),F(this.locale,a.length,"fileCount","filesCount")].join(" \xB7 "),c=t?t.split("/"):[],S=`<div class="vault-toolbar">
      <div class="vault-breadcrumbs">${[`<a href="${this.indexHref()}" class="vault-crumb ${c.length?"":"is-current"}">${this.t("root")}</a>`,...c.map((g,m)=>{let k=c.slice(0,m+1).join("/"),x=m===c.length-1;return`<span class="vault-crumb-sep">/</span><a href="${this.indexHref(k)}" class="vault-crumb ${x?"is-current":""}">${v(g)}</a>`})].join("")}</div>
      <div class="vault-toolbar-actions">
        ${t?`<a class="vault-button" href="${this.indexHref(R(t))}">${this.t("up")}</a>`:""}
      </div>
    </div>`,y=o.map(g=>{let m=t?`${t}/${g}`:g;return`<li class="entry-row is-folder">
          <a href="${this.indexHref(m)}" class="entry-main">
            <span class="entry-kicker">${this.t("folder")}</span>
            <span class="entry-title">${v(g)}</span>
          </a>
        </li>`}).join(""),b=i.map(({notePath:g,title:m})=>`<li class="entry-row is-note">
        <a href="${this.noteHref(g)}" class="entry-main">
          <span class="entry-kicker">${this.t("note")}</span>
          <span class="entry-title">${v(m)}</span>
          ${this.config.theme.showFilePaths?`<span class="entry-meta">${v(g)}</span>`:""}
        </a>
      </li>`).join(""),T=a.map(({filePath:g,title:m})=>`<li class="entry-row is-file">
        <a href="${this.assetHref(g)}" class="entry-main">
          <span class="entry-kicker">${this.t("file")}</span>
          <span class="entry-title">${v(m)}</span>
          ${this.config.theme.showFilePaths?`<span class="entry-meta">${v(g)}</span>`:""}
        </a>
      </li>`).join(""),d=[];y&&d.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("folders")}</h2></div><ul class="entry-list">${y}</ul></section>`),b&&d.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("notes")}</h2></div><ul class="entry-list">${b}</ul></section>`),T&&d.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("files")}</h2></div><ul class="entry-list">${T}</ul></section>`);let f=d.length?`<section class="vault-hero">
          ${S}
          <p class="vault-label">${this.t("sharedSpace")}</p>
          <div class="vault-hero-main">
            <div>
              <p class="vault-path">${v(t||"/")}</p>
              <p class="vault-count">${l}</p>
            </div>
          </div>
        </section>${d.join("")}`:`<section class="vault-hero">
          ${S}
          <p class="vault-label">${this.t("sharedSpace")}</p>
          <div class="vault-hero-main">
            <div>
              <p class="vault-path">${v(t||"/")}</p>
              <p class="vault-count">${l}</p>
            </div>
          </div>
        </section><p>${this.t("nothingShared")}</p>`;return this.renderPage(this.t("sharedFiles"),f)}stripFrontmatter(e){return String(e||"").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/,"")}parseSharedSprintTicketTable(e){let t=String(e||"").match(/^##\s+Tickets du sprint\b.*$/im);if(!t)return[];let s=e.slice(t.index).split(/\r?\n/).slice(1),n=[];for(let p of s){if(!p.trim()){if(n.length)break;continue}if(!p.trim().startsWith("|")){if(n.length)break;continue}n.push(p)}if(n.length<3)return[];let i=n[0].split("|").slice(1,-1).map(p=>Fe(p)),a=(p,S)=>{let y=i.findIndex(b=>b.includes(p));return y>=0?y:S},o=a("statut",1),l=a("estimate",i.length-1),c=[];for(let p=2;p<n.length;p+=1){let S=n[p].split("|").slice(1,-1).map(f=>f.trim());if(!S.length)continue;let y=S[o]||"",T=(S[l]||"").match(/([0-9]+(?:[.,][0-9]+)?)\s*j\.h/i),d=T?Number(String(T[1]).replace(",",".")):0;c.push({status:y,estimateDays:d})}return c}classifySharedSprintStatus(e){let t=Fe(e);return t==="to do"||t==="todo"?"todo":["done","complete","completed"].includes(t)?"done":"active"}buildShareSquareGrid(e,t=4,s="\u25A0"){if(!e)return"\xB7";let n=Array.from({length:e},()=>s),i=[];for(let a=0;a<n.length;a+=t)i.push(n.slice(a,a+t).join(" "));return i.join(`
`)}renderSharedSprintDashboard(e){let t=this.parseSharedSprintTicketTable(e);if(!t.length)return`<div class="shared-sprint-empty">${this.t("dashboardUnavailable")}</div>`;let s={todo:{title:this.t("sprintTodo"),symbol:"\u25A1",tickets:0,estimateDays:0},active:{title:this.t("sprintActive"),symbol:"\u25A7",tickets:0,estimateDays:0},done:{title:this.t("sprintDone"),symbol:"\u25A0",tickets:0,estimateDays:0}};for(let l of t){let c=this.classifySharedSprintStatus(l.status);s[c].tickets+=1,s[c].estimateDays+=Number(l.estimateDays||0)}let n=Object.values(s).reduce((l,c)=>l+c.estimateDays,0),i=s.done.estimateDays,a=s.todo.estimateDays+s.active.estimateDays,o=["todo","active","done"].map(l=>{let c=s[l],p=Math.max(0,Math.round(c.estimateDays));return`
          <section class="shared-sprint-column">
            <h4>${v(c.title)}</h4>
            <pre class="shared-sprint-grid">${v(`${F(this.locale,c.tickets,"ticket","tickets")}
${c.estimateDays.toFixed(1)} ${this.t("dayUnit")}

${this.buildShareSquareGrid(p,4,c.symbol)}`)}</pre>
          </section>
        `}).join("");return`
      <div class="shared-sprint-dashboard">
        <div class="shared-sprint-totals">
          <div>${this.t("sprintTotal")}: ${n.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintFinished")}: ${i.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintRemaining")}: ${a.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintScale")}</div>
        </div>
        <div class="shared-sprint-columns">${o}</div>
      </div>
    `}renderTable(e,t){if(e.length<2)return"";let s=e.map(a=>a.trim().split("|").slice(1,-1).map(o=>o.trim())),n=s[0],i=s.slice(2);return`
      <div class="markdown-table-wrap">
        <table class="markdown-table">
          <thead>
            <tr>${n.map(a=>`<th>${this.renderInline(a,t)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${i.map(a=>`<tr>${a.map(o=>`<td>${this.renderInline(o,t)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `}renderMarkdown(e,t){let s=this.stripFrontmatter(e),n=s.replace(/\r\n/g,`
`).split(`
`),i=[],a=[],o=[],l=null,c=!1,p=[],S="",y=()=>{o.length&&(i.push(`<p>${this.renderInline(o.join(" "),t)}</p>`),o=[])},b=()=>{l&&(i.push(`<${l.type}>${l.items.map(d=>`<li>${this.renderInline(d,t)}</li>`).join("")}</${l.type}>`),l=null)};for(let d=0;d<n.length;d+=1){let f=n[d];if(f.trim().startsWith("```")){c?(S==="gitlab-sprint-dashboard"?i.push(this.renderSharedSprintDashboard(s)):i.push(`<pre><code>${v(p.join(`
`))}</code></pre>`),c=!1,p=[],S=""):(y(),b(),c=!0,S=f.trim().slice(3).trim());continue}if(c){p.push(f);continue}if(!f.trim()){y(),b();continue}if(f.trim().startsWith("|")){y(),b();let C=[f];for(;d+1<n.length&&n[d+1].trim().startsWith("|");)d+=1,C.push(n[d]);i.push(this.renderTable(C,t));continue}let g=f.match(/^(#{1,6})\s+(.+)$/);if(g){y(),b();let C=g[1].length,O=g[2].trim(),J=this.headingIdFor(O);a.push({level:C,text:O,id:J}),i.push(`<h${C} id="${J}">${this.renderInline(O,t)}</h${C}>`);continue}if(/^---+$/.test(f.trim())){y(),b(),i.push("<hr>");continue}let m=f.match(/^\s*[-*]\s+(.+)$/),k=f.match(/^\s*\d+\.\s+(.+)$/);if(m||k){y();let C=m?"ul":"ol";(!l||l.type!==C)&&b(),l||(l={type:C,items:[]}),l.items.push((m??k)?.[1]??"");continue}let x=f.match(/^>\s?(.*)$/);if(x){y(),b(),i.push(`<blockquote>${this.renderInline(x[1],t)}</blockquote>`);continue}o.push(f.trim())}y(),b();let T=i.join(`
`);return a.length?`${this.renderNoteOutline(a)}
${T}`:T}renderNoteOutline(e){let t=e.map(({level:n,text:i,id:a})=>{let o=i.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(l,c,p)=>p||c.split("#")[0].split("/").pop()||c).replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[*_~`]/g,"");return`<li class="note-outline-level-${n}"><a href="#${encodeURIComponent(a)}">${v(o)}</a></li>`}).join(""),s=v(this.t("noteOutline"));return`<aside class="note-outline" aria-label="${s}"><h2>${s}</h2><nav><ol>${t}</ol></nav></aside>`}renderInline(e,t){let s=v(e);return s=s.replace(/!\[\[([^\]]+)]]/g,(n,i)=>{let a=this.resolveLinkTarget(i,t);return!a?.path||!this.isAllowedAsset(a.path)?"":`<img src="${this.assetHref(a.path)}" alt="">`}),s=s.replace(/\[\[([^\]]+)]]/g,(n,i)=>{let[a,o]=i.split("|"),l=K(a),c=o||l.path||l.subpath;if(!l.path&&l.subpath)return`<a class="internal-link" href="#${this.headingIdFor(l.subpath)}">${v(c)}</a>`;let p=this.resolveLinkTarget(a,t);return p?.path&&this.isNotePathShared(p.path)?`<a class="internal-link" href="${this.noteHref(p.path,p.subpath)}">${v(c)}</a>`:v(c)}),s=s.replace(/!\[([^\]]*)]\(([^)]+)\)/g,(n,i,a)=>{let o=this.resolveLinkTarget(a,t);return!o?.path||!this.isAllowedAsset(o.path)?"":`<img src="${this.assetHref(o.path)}" alt="${v(i)}">`}),s=s.replace(/\[([^\]]+)]\(([^)]+)\)/g,(n,i,a)=>{let o=String(a||"").trim();if(/^https?:\/\//i.test(o))return`<a class="external-link" href="${v(o)}" rel="noopener noreferrer">${v(i)}</a>`;if(o.startsWith("#")){let c=o.slice(1).trim();return`<a class="internal-link" href="#${this.headingIdFor(c)}">${v(i)}</a>`}let l=this.resolveLinkTarget(o,t);return l?.path&&this.isNotePathShared(l.path)?`<a class="internal-link" href="${this.noteHref(l.path,l.subpath)}">${v(i)}</a>`:v(i)}),s=s.replace(/`([^`]+)`/g,"<code>$1</code>"),s=s.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),s=s.replace(/\*([^*]+)\*/g,"<em>$1</em>"),s}resolveLinkTarget(e,t){let s=K(e);if(!s.path)return null;let n=this.app.metadataCache.getFirstLinkpathDest(s.path,t);if(n)return{path:n.path,subpath:s.subpath};let i=t.includes("/")?t.slice(0,t.lastIndexOf("/")):"",a=w($e.default.posix.join(i,s.path));return a?{path:a,subpath:s.subpath}:null}headingIdFor(e){return G(e)}renderPage(e,t,s=""){let n=s?`<a class="back" href="${this.indexHref()}">${this.t("sharedNotes")}</a>`:"",i=s?t.match(/<aside class="note-outline"[\s\S]*?<\/aside>/):null,a=i?t.replace(i[0],""):t,o=i?(0,Pe.randomBytes)(16).toString("base64"):"",l=i?`<script nonce="${o}">
(() => {
  const links = Array.from(document.querySelectorAll(".note-outline a"));
  const targets = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  const setCurrentHeading = () => {
    let currentIndex = 0;
    targets.forEach((target, index) => {
      if (target && target.getBoundingClientRect().top <= 120) currentIndex = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      currentIndex = links.length - 1;
    }
    links.forEach((link, index) => {
      if (index === currentIndex) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  let framePending = false;
  const updateCurrentHeading = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(() => {
      framePending = false;
      setCurrentHeading();
    });
  };
  window.addEventListener("scroll", updateCurrentHeading, { passive: true });
  window.addEventListener("resize", updateCurrentHeading);
  setCurrentHeading();
})();
</script>`:"";return`<!doctype html>
<html lang="${this.locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${v(e)}</title>
  <style>${ye(this.config.theme)}</style>
</head>
<body>
${i?'<div class="shared-note-layout">':""}
<main>
    ${n}
    <h1>${v(e)}</h1>
    ${a}
</main>
${i?i[0]:""}
${l}
${i?"</div>":""}
</body>
</html>`}noteHref(e,t=""){let s=t?`#${encodeURIComponent(G(t))}`:"";return`/note/${encodeURIComponent(e)}${this.tokenQuery()}${s}`}assetHref(e){return`/asset?path=${encodeURIComponent(e)}${this.tokenAssetQuery()}`}indexHref(e=""){let t=w(e||"");if(!t)return`/${this.tokenQuery()}`;let s=new URLSearchParams;return s.set("folder",t),this.config.requireToken&&s.set("token",this.config.token),`/?${s.toString()}`}tokenQuery(){return this.config.requireToken?`?token=${encodeURIComponent(this.config.token)}`:""}tokenAssetQuery(){return this.config.requireToken?`&token=${encodeURIComponent(this.config.token)}`:""}getShareUrl(){return`http://${this.getLocalIpAddress()}:${this.config.port}${this.tokenQuery()}`}getFolderUrl(e){return`http://${this.getLocalIpAddress()}:${this.config.port}${this.indexHref(e)}`}getNoteUrl(e){return`http://${this.getLocalIpAddress()}:${this.config.port}${this.noteHref(e)}`}getLocalIpAddress(){let e=De.default.networkInterfaces();for(let t of Object.values(e))for(let s of t||[])if(s.family==="IPv4"&&!s.internal)return s.address;return"127.0.0.1"}sendHtml(e,t,s){let n=s.match(/<script nonce="([A-Za-z0-9+/=]+)">/)?.[1],i=n?`script-src 'nonce-${n}'; `:"";e.writeHead(t,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","Content-Security-Policy":`${i}default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; font-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,"Referrer-Policy":"no-referrer","X-Content-Type-Options":"nosniff"}),e.end(s)}sendText(e,t,s){e.writeHead(t,{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}),e.end(s)}generateToken(){return Y()}};function Fe(r){return r.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Ae(r){r().catch(e=>{console.error("NoteLAN action error",e)})}
