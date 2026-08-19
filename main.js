/* Generated from src/. Do not edit main.js directly. */
"use strict";var De=Object.create;var P=Object.defineProperty;var Pe=Object.getOwnPropertyDescriptor;var $e=Object.getOwnPropertyNames;var Le=Object.getPrototypeOf,Ee=Object.prototype.hasOwnProperty;var Re=(n,e)=>{for(var t in e)P(n,t,{get:e[t],enumerable:!0})},X=(n,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of $e(e))!Ee.call(n,i)&&i!==t&&P(n,i,{get:()=>e[i],enumerable:!(s=Pe(e,i))||s.enumerable});return n};var $=(n,e,t)=>(t=n!=null?De(Le(n)):{},X(e||!n||!n.__esModule?P(t,"default",{value:n,enumerable:!0}):t,n)),Ie=n=>X(P({},"__esModule",{value:!0}),n);var Je={};Re(Je,{default:()=>V});module.exports=Ie(Je);var u=require("obsidian"),Fe=$(require("node:http")),Ae=$(require("node:os")),Ne=$(require("node:path"));var L=require("node:crypto"),q={enabled:!0,retentionDays:30,excludeLocalhost:!0},J="local_note_share_visitor",Ue=/^[0-9a-f]{48}$/,ie=/^[0-9a-f]{64}$/,Be=/^\d{4}-\d{2}-\d{2}$/,Me=new Set([7,30,90,365]);function E(n=Date.now()){return{startedAt:n,visitors:{},daily:{},pages:{}}}function ne(n){let e=F(n)?n:{},t=Number(e.retentionDays);return{enabled:e.enabled!==!1,retentionDays:Me.has(t)?t:q.retentionDays,excludeLocalhost:e.excludeLocalhost!==!1}}function re(n,e=Date.now()){let t=F(n)?n:{},s=F(t.pages)?t.pages:{},i={};for(let[a,r]of Object.entries(s))!F(r)||r.kind!=="index"&&r.kind!=="note"||(i[a]={kind:r.kind,path:H(r.path),title:H(r.title)||H(r.path)||"Page",views:de(r.views),lastAccess:O(r.lastAccess),visitors:te(r.visitors),daily:se(r.daily)});return{startedAt:O(t.startedAt)||e,visitors:te(t.visitors),daily:se(t.daily),pages:i}}function ae(n,e,t){let i=Ve(n.headers.cookie)[J];return(!i||!Ue.test(i))&&(i=He(),e.setHeader("Set-Cookie",`${J}=${i}; Max-Age=31536000; Path=/; HttpOnly; SameSite=Strict`)),(0,L.createHash)("sha256").update(`${t}:${i}`).digest("hex")}function oe(n,e,t,s,i=Date.now()){if(!ie.test(e))return;he(n,s,i);let a=j(i);n.visitors[e]=i,n.daily[a]=(n.daily[a]||0)+1;let r=n.pages[t.key]||{kind:t.kind,path:t.path,title:t.title,views:0,lastAccess:0,visitors:{},daily:{}};r.kind=t.kind,r.path=t.path,r.title=t.title,r.views+=1,r.lastAccess=i,r.visitors[e]=i,r.daily[a]=(r.daily[a]||0)+1,n.pages[t.key]=r}function le(n,e,t=Date.now()){he(n,e,t);let s=Object.entries(n.pages).map(([i,a])=>({key:i,kind:a.kind,path:a.path,title:a.title,views:a.views,uniqueVisitors:Object.keys(a.visitors).length,lastAccess:a.lastAccess})).sort((i,a)=>a.views-i.views||a.lastAccess-i.lastAccess);return{totalViews:s.reduce((i,a)=>i+a.views,0),uniqueVisitors:Object.keys(n.visitors).length,viewsToday:n.daily[j(t)]||0,startedAt:n.startedAt,pages:s}}function ce(n){if(!n)return!1;let e=n.replace(/^::ffff:/,"");return e==="::1"||e==="127.0.0.1"}function he(n,e,t){let s=t-e*864e5,i=j(s);Z(n.visitors,s),ee(n.daily,i);for(let a of Object.values(n.pages))Z(a.visitors,s),ee(a.daily,i)}function Z(n,e){for(let[t,s]of Object.entries(n))s<e&&delete n[t]}function ee(n,e){for(let t of Object.keys(n))t<e&&delete n[t]}function te(n){if(!F(n))return{};let e={};for(let[t,s]of Object.entries(n)){let i=O(s);ie.test(t)&&i&&(e[t]=i)}return e}function se(n){if(!F(n))return{};let e={};for(let[t,s]of Object.entries(n)){let i=de(s);Be.test(t)&&i&&(e[t]=i)}return e}function Ve(n){if(!n)return{};let e={};for(let t of n.split(";")){let s=t.indexOf("=");if(s<1)continue;let i=t.slice(0,s).trim(),a=t.slice(s+1).trim();e[i]=a}return e}function He(){return(0,L.randomBytes)(24).toString("hex")}function j(n){return new Date(n).toISOString().slice(0,10)}function de(n){let e=Number(n);return Number.isSafeInteger(e)&&e>0?e:0}function O(n){let e=Number(n);return Number.isFinite(e)&&e>0?e:0}function H(n){return typeof n=="string"?n.slice(0,500):""}function F(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}var Oe={avif:"image/avif",bmp:"image/bmp",gif:"image/gif",jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",svg:"image/svg+xml",webp:"image/webp",pdf:"application/pdf",mp3:"audio/mpeg",wav:"audio/wav",ogg:"audio/ogg",m4a:"audio/mp4",mp4:"video/mp4",webm:"video/webm",mov:"video/quicktime"};function ue(n){let e=typeof n=="string"?n.toLowerCase():"";return Oe[e]??"application/octet-stream"}var qe={ribbonShareNote:"Share active note",commandManageNote:"Manage local sharing for current note",commandToggleServer:"Start/stop local sharing server",commandShareNote:"Share current note locally",commandUnshareNote:"Stop sharing current note locally",commandCopyUrl:"Copy local sharing URL",serverStopped:"Local sharing stopped",errorTitle:"Error",serverDurationManual:"until manually stopped",serverDurationHours:"for {hours} h",serverProtected:"protected by a token",serverUnprotected:"without a token",serverStarted:`Sharing is available to devices on the local network {duration} ({protection}).
{url}`,serverAutoStopped:"Local sharing stopped automatically",markdownOnly:"Only Markdown notes can be shared",noteShared:"Note shared, URL copied",noteUnshared:"Note removed from local sharing",selectFolder:"Select a vault folder to share",folderShared:"Folder shared ({files}), URL copied",folderUnshared:"Folder removed from local sharing",menuShareFolder:"Share folder locally",menuUnshareFolder:"Remove folder from local sharing",menuCopyFolderLink:"Copy shared folder link",folderLinkCopied:"Folder link copied",statusSharedFolder:"Shared (folder)",statusShared:"Shared",statusPrivate:"Private",statusSharedFolderTitle:"This note is shared through its folder",statusUnshareTitle:"Stop sharing this note",statusShareTitle:"Share this note",linkCopiedFolderManaged:"Link copied; sharing is managed by the parent folder",copySharedLink:"Copy shared link",linkCopied:"Link copied",shareUrlCopied:"Sharing URL copied",protectedTitle:"Protected access",invalidToken:"Missing or invalid token.",home:"Home",notFoundTitle:"Not found",pageNotFound:"Page not found.",noteNotSharedTitle:"Note not shared",noteNotShared:"This note is not shared.",noteNotFoundTitle:"Note not found",fileNotFound:"File not found.",root:"Root",up:"Up",folder:"Folder",folders:"Folders",note:"Note",notes:"Notes",file:"File",files:"Files",folderCount:"folder",foldersCount:"folders",noteCount:"note",notesCount:"notes",fileCount:"file",filesCount:"files",ticket:"ticket",tickets:"tickets",sharedSpace:"Shared space",nothingShared:"No shared files yet.",sharedFiles:"Shared files",sharedNotes:"Shared notes",dashboardUnavailable:"Dashboard unavailable",sprintTodo:"TODO",sprintActive:"IN PROGRESS",sprintDone:"DONE",sprintTotal:"Total",sprintFinished:"Done",sprintRemaining:"Remaining",sprintScale:"Scale: 1 square = 1 d",dayUnit:"d",analyticsResetTitle:"Clear statistics?",analyticsResetBody:"Locally stored views and anonymous visitors will be permanently deleted.",cancel:"Cancel",clear:"Clear",folderShareTitle:"Share this folder?",folderShareBody:"The \u201C{folder}\u201D folder and its {files} will be available to devices on the local network.",folderShareFuture:"New files added to this folder will also be shared.",shareFolder:"Share folder",shareThisFolder:"Share this folder",share:"Share",localSharing:"Local sharing",openMarkdown:"Open a Markdown note to add it to local sharing.",noteSharedByFolder:"This note is shared through its parent folder.",noteSharedNetwork:"This note is shared on the local network.",noteNotSharedYet:"This note is not shared yet.",copyLink:"Copy link",removeFromShare:"Remove from sharing",enableCopyLink:"Enable and copy link",activeServer:"Active: {url}",serverOff:"Server stopped",localServer:"Local server",localServerDesc:"Start or stop sharing on the local network.",stop:"Stop",start:"Start",copyUrl:"Copy URL",port:"Port",portDesc:"HTTP port used on your computer.",startWithObsidian:"Start with Obsidian",startWithObsidianDesc:"Automatically restart sharing when the vault opens.",autoStop:"Automatic stop",autoStopDesc:"Limit how long the server remains available on the local network.",disabled:"Disabled",afterOneHour:"After 1 hour",afterHours:"After {hours} hours",urlToken:"URL token",urlTokenDesc:"Add a secret key to shared links.",regenerate:"Regenerate",anonymousStats:"Anonymous statistics",anonymousStatsDesc:"Local browser/device counting. No IP address or URL token is stored.",enableCounting:"Enable counting",enableCountingDesc:"Count only viewed HTML pages, excluding images and files.",ignoreComputer:"Ignore this computer",ignoreComputerDesc:"Do not count visits from the computer running Obsidian.",uniqueRetention:"Unique visitor retention",uniqueRetentionDesc:"View totals remain cumulative; older anonymous identifiers are forgotten.",days:"{days} days",oneYear:"1 year",sharedAppearance:"Shared page appearance",theme:"Theme",themeDesc:"Color palette used by generated web pages.",light:"Light",system:"System",accentColor:"Accent color",accentColorDesc:"Main color used for links and accents.",contentWidth:"Content width",contentWidthDesc:"Maximum page width in pixels.",showPaths:"Show paths",showPathsDesc:"Show the full path below notes and files in the index.",font:"Font",fontDesc:"CSS font-family value applied to shared pages.",customCss:"Custom CSS",customCssDesc:"CSS added after the theme. Use --page-* variables for simple adjustments.",shareActiveNote:"Share active note",shareActiveNoteDesc:"Add the currently open note to the list.",add:"Add",noActiveNote:"No active note",sharedFolders:"Shared folders",noSharedFolders:"No shared folders.",copy:"Copy",remove:"Remove",individuallySharedNotes:"Individually shared notes",noIndividualNotes:"No individually shared notes.",views:"Views",uniqueVisitors:"Unique visitors",today:"Today",uniqueEstimate:"Estimated unique visitors over {days} days.",clearStatistics:"Clear statistics",statisticsCleared:"Statistics cleared",noRemoteVisit:"No remote visits counted yet.",countingDisabled:"Counting is disabled.",page:"Page",visitors:"Visitors",lastAccess:"Last access",browseVault:"Browse vault",inheritedShare:"Inherited sharing",sharedFeminine:"Shared",emptyFolder:"No folders or Markdown notes here."},je={ribbonShareNote:"Partager la note active",commandManageNote:"G\xE9rer le partage local de la note active",commandToggleServer:"D\xE9marrer/arr\xEAter le serveur de partage local",commandShareNote:"Partager la note active localement",commandUnshareNote:"Arr\xEAter de partager la note active localement",commandCopyUrl:"Copier l\u2019URL de partage local",serverStopped:"Partage local arr\xEAt\xE9",errorTitle:"Erreur",serverDurationManual:"jusqu\u2019\xE0 son arr\xEAt manuel",serverDurationHours:"pendant {hours} h",serverProtected:"prot\xE9g\xE9 par un token",serverUnprotected:"sans token",serverStarted:`Partage accessible aux appareils du r\xE9seau local {duration} ({protection}).
{url}`,serverAutoStopped:"Partage local arr\xEAt\xE9 automatiquement",markdownOnly:"Seules les notes Markdown peuvent \xEAtre partag\xE9es",noteShared:"Note partag\xE9e, URL copi\xE9e",noteUnshared:"Note retir\xE9e du partage local",selectFolder:"S\xE9lectionne un dossier du coffre \xE0 partager",folderShared:"Dossier partag\xE9 ({files}), URL copi\xE9e",folderUnshared:"Dossier retir\xE9 du partage local",menuShareFolder:"Partager le dossier localement",menuUnshareFolder:"Retirer le dossier du partage local",menuCopyFolderLink:"Copier le lien du dossier partag\xE9",folderLinkCopied:"Lien du dossier copi\xE9",statusSharedFolder:"Partag\xE9e (dossier)",statusShared:"Partag\xE9e",statusPrivate:"Priv\xE9e",statusSharedFolderTitle:"Cette note est partag\xE9e par son dossier",statusUnshareTitle:"Retirer cette note du partage",statusShareTitle:"Partager cette note",linkCopiedFolderManaged:"Lien copi\xE9 ; le partage est g\xE9r\xE9 par le dossier parent",copySharedLink:"Copier le lien partag\xE9",linkCopied:"Lien copi\xE9",shareUrlCopied:"URL de partage copi\xE9e",protectedTitle:"Acc\xE8s prot\xE9g\xE9",invalidToken:"Token manquant ou invalide.",home:"Accueil",notFoundTitle:"Introuvable",pageNotFound:"Page introuvable.",noteNotSharedTitle:"Note non partag\xE9e",noteNotShared:"Cette note n\u2019est pas partag\xE9e.",noteNotFoundTitle:"Note introuvable",fileNotFound:"Fichier introuvable.",root:"Racine",up:"Monter",folder:"Dossier",folders:"Dossiers",note:"Note",notes:"Notes",file:"Fichier",files:"Fichiers",folderCount:"dossier",foldersCount:"dossiers",noteCount:"note",notesCount:"notes",fileCount:"fichier",filesCount:"fichiers",ticket:"ticket",tickets:"tickets",sharedSpace:"Espace partag\xE9",nothingShared:"Aucun fichier partag\xE9 pour le moment.",sharedFiles:"Fichiers partag\xE9s",sharedNotes:"Notes partag\xE9es",dashboardUnavailable:"Dashboard indisponible",sprintTodo:"\xC0 FAIRE",sprintActive:"EN COURS",sprintDone:"TERMIN\xC9",sprintTotal:"Total",sprintFinished:"Fini",sprintRemaining:"Reste",sprintScale:"\xC9chelle : 1 carr\xE9 = 1 j.h",dayUnit:"j.h",analyticsResetTitle:"Effacer les statistiques ?",analyticsResetBody:"Les vues et visiteurs anonymes enregistr\xE9s localement seront d\xE9finitivement supprim\xE9s.",cancel:"Annuler",clear:"Effacer",folderShareTitle:"Partager ce dossier ?",folderShareBody:"Le dossier \xAB {folder} \xBB et ses {files} seront accessibles aux appareils du r\xE9seau local.",folderShareFuture:"Les nouveaux fichiers ajout\xE9s dans ce dossier seront \xE9galement partag\xE9s.",shareFolder:"Partager le dossier",shareThisFolder:"Partager ce dossier",share:"Partager",localSharing:"Partage local",openMarkdown:"Ouvre une note Markdown pour l\u2019ajouter au partage local.",noteSharedByFolder:"Cette note est partag\xE9e par son dossier parent.",noteSharedNetwork:"Cette note est partag\xE9e sur le r\xE9seau local.",noteNotSharedYet:"Cette note n\u2019est pas encore partag\xE9e.",copyLink:"Copier le lien",removeFromShare:"Retirer du partage",enableCopyLink:"Activer et copier le lien",activeServer:"Actif : {url}",serverOff:"Serveur arr\xEAt\xE9",localServer:"Serveur local",localServerDesc:"D\xE9marre ou arr\xEAte le partage sur le r\xE9seau local.",stop:"Arr\xEAter",start:"D\xE9marrer",copyUrl:"Copier l\u2019URL",port:"Port",portDesc:"Port HTTP utilis\xE9 sur ta machine.",startWithObsidian:"D\xE9marrer avec Obsidian",startWithObsidianDesc:"Relance automatiquement le partage \xE0 l\u2019ouverture du coffre.",autoStop:"Arr\xEAt automatique",autoStopDesc:"Limite la dur\xE9e pendant laquelle le serveur reste accessible sur le r\xE9seau local.",disabled:"D\xE9sactiv\xE9",afterOneHour:"Apr\xE8s 1 heure",afterHours:"Apr\xE8s {hours} heures",urlToken:"Token dans l\u2019URL",urlTokenDesc:"Ajoute une cl\xE9 secr\xE8te dans les liens partag\xE9s.",regenerate:"R\xE9g\xE9n\xE9rer",anonymousStats:"Statistiques anonymes",anonymousStatsDesc:"Comptage local par navigateur/appareil. Aucune adresse IP ni aucun token d\u2019URL n\u2019est conserv\xE9.",enableCounting:"Activer le comptage",enableCountingDesc:"Compte uniquement les pages HTML consult\xE9es, sans compter les images et fichiers.",ignoreComputer:"Ignorer cet ordinateur",ignoreComputerDesc:"Ne compte pas les visites faites depuis la machine qui h\xE9berge Obsidian.",uniqueRetention:"Dur\xE9e des visiteurs uniques",uniqueRetentionDesc:"Les compteurs de vues restent cumulatifs ; les identifiants anonymes plus anciens sont oubli\xE9s.",days:"{days} jours",oneYear:"1 an",sharedAppearance:"Apparence des pages partag\xE9es",theme:"Th\xE8me",themeDesc:"Palette utilis\xE9e par les pages web g\xE9n\xE9r\xE9es.",light:"Clair",system:"Syst\xE8me",accentColor:"Couleur principale",accentColorDesc:"Couleur des liens et accents principaux.",contentWidth:"Largeur du contenu",contentWidthDesc:"Largeur maximale des pages, en pixels.",showPaths:"Afficher les chemins",showPathsDesc:"Affiche le chemin complet sous les notes et fichiers de l\u2019index.",font:"Police",fontDesc:"Valeur CSS font-family appliqu\xE9e aux pages partag\xE9es.",customCss:"CSS personnalis\xE9",customCssDesc:"CSS ajout\xE9 apr\xE8s le th\xE8me. Utilise les variables --page-* pour des ajustements simples.",shareActiveNote:"Partager la note active",shareActiveNoteDesc:"Ajoute la note actuellement ouverte \xE0 la liste.",add:"Ajouter",noActiveNote:"Aucune note active",sharedFolders:"Dossiers partag\xE9s",noSharedFolders:"Aucun dossier partag\xE9.",copy:"Copier",remove:"Retirer",individuallySharedNotes:"Notes partag\xE9es individuellement",noIndividualNotes:"Aucune note partag\xE9e individuellement.",views:"Vues",uniqueVisitors:"Visiteurs uniques",today:"Aujourd\u2019hui",uniqueEstimate:"Visiteurs uniques estim\xE9s sur {days} jours.",clearStatistics:"Effacer les statistiques",statisticsCleared:"Statistiques effac\xE9es",noRemoteVisit:"Aucune visite distante comptabilis\xE9e pour le moment.",countingDisabled:"Le comptage est d\xE9sactiv\xE9.",page:"Page",visitors:"Visiteurs",lastAccess:"Dernier acc\xE8s",browseVault:"Parcourir le coffre",inheritedShare:"Partage h\xE9rit\xE9",sharedFeminine:"Partag\xE9e",emptyFolder:"Aucun dossier ou note Markdown ici."};function pe(n){return n?.toLowerCase().startsWith("fr")?"fr":"en"}function z(n,e,t={}){return(n==="fr"?je[e]:qe[e]).replace(/\{(\w+)\}/g,(i,a)=>String(t[a]??i))}function C(n,e,t,s){return`${e} ${z(n,e===1?t:s)}`}var ze={"royal-velvet":{colorScheme:"dark",background:"#000000",text:"hsl(60 30% 96%)",surface:"hsl(235 15% 13% / 0.9)",surfaceStrong:"hsl(235 15% 19% / 0.96)",border:"hsl(285 100% 75.1% / 0.24)",muted:"hsl(60 30% 96% / 0.6)",accent:"hsl(35 100% 75.1%)",shadow:"0 20px 60px hsl(235 25% 4% / 0.5)"},light:{colorScheme:"light",background:"#f7f7f5",text:"#252522",surface:"rgb(255 255 255 / 0.92)",surfaceStrong:"#ffffff",border:"rgb(37 37 34 / 0.14)",muted:"rgb(37 37 34 / 0.62)",accent:"#9a5b00",shadow:"0 18px 50px rgb(31 35 40 / 0.12)"},system:{colorScheme:"normal",background:"Canvas",text:"CanvasText",surface:"color-mix(in srgb, Canvas 92%, CanvasText 8%)",surfaceStrong:"color-mix(in srgb, Canvas 86%, CanvasText 14%)",border:"color-mix(in srgb, CanvasText 20%, transparent)",muted:"color-mix(in srgb, CanvasText 62%, transparent)",accent:"LinkText",shadow:"0 18px 50px rgb(0 0 0 / 0.18)"}};function ge(n){let e=ze[n.preset];return`
    color-scheme: ${e.colorScheme};
    font-family: ${We(n.fontFamily)};
    --content-width: ${n.contentWidth}px;
    --page-bg: ${e.background};
    --page-text: ${e.text};
    --page-link: ${n.accentColor};
    --page-surface: ${e.surface};
    --page-surface-strong: ${e.surfaceStrong};
    --page-border: ${e.border};
    --page-muted: ${e.muted};
    --page-accent: ${e.accent};
    --page-shadow: ${e.shadow};
    --heading-pink: ${n.accentColor};
    --heading-orange: hsl(35 100% 65%);
    --heading-yellow: hsl(55 92% 62%);
    --heading-green: hsl(115 58% 58%);
    --heading-blue: hsl(190 75% 58%);
    --heading-purple: hsl(265 78% 72%);
  `.trim()}function me(n){return n.customCss.trim()?n.customCss.replace(/<\/style/gi,"<\\/style"):""}function We(n){return n.replace(/[;{}<>]/g,"").trim()||"system-ui, sans-serif"}function fe(n){return`    :root {
      ${ge(n)}
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
    @media (max-width: 720px) {
      main { padding: 24px 16px 56px; }
      .vault-toolbar,
      .vault-hero-main { align-items: flex-start; flex-direction: column; }
      .vault-toolbar-actions { width: 100%; }
      .shared-sprint-totals,
      .shared-sprint-columns { grid-template-columns: 1fr; }
    }
    ${me(n)}
`}var ve=$(require("node:path"));function R(n){let e=x(n);return!e||!e.includes("/")?"":e.slice(0,e.lastIndexOf("/"))}function x(n){let e=I(n).replace(/\\/g,"/").replace(/^\/+/,"");if(!e||e.includes("\0"))return"";let t=ve.default.posix.normalize(e);return t==="."||t===".."||t.startsWith("../")?"":t}function W(n){let e=I(n).split("|")[0].trim().replace(/^<|>$/g,"");if(!e)return{path:"",subpath:""};let[t,...s]=e.split("#");return{path:t.trim(),subpath:s.join("#").trim()}}function _(n){return I(n).trim().toLowerCase().replace(/<[^>]+>/g,"").replace(/[`*_~[\]\\]/g,"").replace(/[^\p{L}\p{N}\s-]/gu,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")}function f(n){return I(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function I(n){return typeof n=="string"?n:""}var A=require("obsidian");var U=class{constructor(e){this.vault=e}folderFiles=new Map;cacheKey="";sharedPaths=[];invalidate(){this.folderFiles.clear(),this.cacheKey="",this.sharedPaths=[]}invalidateSelection(){this.cacheKey="",this.sharedPaths=[]}filesInFolder(e){let t=x(e),s=this.folderFiles.get(t);if(s)return s;let i=t?this.vault.getAbstractFileByPath(t):this.vault.getRoot();if(!(i instanceof A.TFolder))return[];let a=[];return this.collectFiles(i,a),this.folderFiles.set(t,a),a}getSharedPaths(e,t){let s=t.map(x).filter(Boolean).sort(),i=e.map(x).filter(Boolean).sort(),a=JSON.stringify([i,s]);if(a===this.cacheKey)return this.sharedPaths;let r=new Set(i);for(let o of s)for(let c of this.filesInFolder(o))r.add(c.path);return this.cacheKey=a,this.sharedPaths=[...r].sort(),this.sharedPaths}collectFiles(e,t){for(let s of e.children)s instanceof A.TFile?t.push(s):s instanceof A.TFolder&&this.collectFiles(s,t)}};var we=require("node:crypto");var N={preset:"royal-velvet",accentColor:"#ff80bf",contentWidth:980,fontFamily:'"Segoe UI", Inter, ui-sans-serif, system-ui, sans-serif',showFilePaths:!0,customCss:""},ye={port:8099,autoStart:!1,autoStopMinutes:0,requireToken:!0,token:"",sharedNotes:[],sharedFolders:[],analytics:q,analyticsData:E(),theme:N},_e=new Set(["royal-velvet","light","system"]);function ke(n){let e=Se(n)?n:{},t=Se(e.theme)?e.theme:{},s=Number(e.port),i=Number(t.contentWidth),a=Number(e.autoStopMinutes),r=typeof t.preset=="string"&&_e.has(t.preset)?t.preset:N.preset;return{port:Number.isInteger(s)&&s>=1&&s<=65535?s:ye.port,autoStart:e.autoStart===!0,autoStopMinutes:[0,60,120,240,480].includes(a)?a:ye.autoStopMinutes,requireToken:e.requireToken!==!1,token:typeof e.token=="string"?e.token:"",sharedNotes:be(e.sharedNotes),sharedFolders:be(e.sharedFolders),analytics:ne(e.analytics),analyticsData:re(e.analyticsData),theme:{preset:r,accentColor:Ke(t.accentColor)?t.accentColor:N.accentColor,contentWidth:Number.isFinite(i)?Ge(i,560,1600):N.contentWidth,fontFamily:typeof t.fontFamily=="string"&&t.fontFamily.trim()?t.fontFamily.trim().slice(0,240):N.fontFamily,showFilePaths:t.showFilePaths!==!1,customCss:typeof t.customCss=="string"?t.customCss.slice(0,5e4):""}}}function K(){return(0,we.randomBytes)(24).toString("hex")}function Se(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}function be(n){return Array.isArray(n)?[...new Set(n.filter(e=>typeof e=="string"&&e.length>0))].sort():[]}function Ke(n){return typeof n=="string"&&/^#[0-9a-f]{6}$/i.test(n)}function Ge(n,e,t){return Math.min(t,Math.max(e,Math.round(n)))}var h=require("obsidian");function xe(n,e,t,s){return new Promise(i=>{new Y(n,e,t,s,i).open()})}function Ye(n,e){return new Promise(t=>{new G(n,e,t).open()})}var G=class extends h.Modal{constructor(t,s,i){super(t);this.plugin=s;this.resolveChoice=i}resolved=!1;onOpen(){this.contentEl.empty(),this.contentEl.createEl("h2",{text:this.plugin.t("analyticsResetTitle")}),this.contentEl.createEl("p",{text:this.plugin.t("analyticsResetBody")}),new h.Setting(this.contentEl).addButton(t=>t.setButtonText(this.plugin.t("cancel")).onClick(()=>this.finish(!1))).addButton(t=>t.setButtonText(this.plugin.t("clear")).setDestructive().onClick(()=>this.finish(!0)))}onClose(){this.resolved||this.resolveChoice(!1)}finish(t){this.resolved=!0,this.resolveChoice(t),this.close()}},Y=class extends h.Modal{constructor(t,s,i,a,r){super(t);this.plugin=s;this.folderPath=i;this.fileCount=a;this.resolveChoice=r}resolved=!1;onOpen(){let{contentEl:t}=this;t.empty(),t.createEl("h2",{text:this.plugin.t("folderShareTitle")}),t.createEl("p",{text:this.plugin.t("folderShareBody",{folder:this.folderPath,files:C(this.plugin.locale,this.fileCount,"fileCount","filesCount")})}),t.createEl("p",{cls:"local-note-share-status",text:this.plugin.t("folderShareFuture")}),new h.Setting(t).addButton(s=>{s.setButtonText(this.plugin.t("cancel")).onClick(()=>this.finish(!1))}).addButton(s=>{s.setButtonText(this.plugin.t("shareFolder")).setDestructive().onClick(()=>this.finish(!0))})}onClose(){this.resolved||this.resolveChoice(!1)}finish(t){this.resolved=!0,this.resolveChoice(t),this.close()}},B=class extends h.Modal{plugin;constructor(e,t){super(e),this.plugin=t}onOpen(){let{contentEl:e}=this;e.empty(),e.createEl("h2",{text:this.plugin.t("localSharing")});let t=this.app.workspace.getActiveFile();if(!(t instanceof h.TFile)||t.extension!=="md"){e.createDiv({cls:"local-note-share-status",text:this.plugin.t("openMarkdown")});return}let s=this.plugin.isNoteShared(t),i=this.plugin.isPathInSharedFolder(t.path);if(e.createDiv({cls:"local-note-share-status",text:i?this.plugin.t("noteSharedByFolder"):s?this.plugin.t("noteSharedNetwork"):this.plugin.t("noteNotSharedYet")}),e.createDiv({cls:"local-note-share-note-path",text:t.path}),s){let a=this.plugin.getNoteUrl(t.path);e.createDiv({cls:"local-note-share-url",text:a});let r=new h.Setting(e).addButton(o=>{o.setButtonText(this.plugin.t("copyLink")).setCta().onClick(async()=>{this.plugin.server||await this.plugin.startServer(),await this.plugin.copyText(this.plugin.getNoteUrl(t.path)),new h.Notice(this.plugin.t("linkCopied")),this.close()})});i||r.addButton(o=>{o.setButtonText(this.plugin.t("removeFromShare")).onClick(async()=>{await this.plugin.unshareNote(t.path),this.close()})});return}new h.Setting(e).addButton(a=>{a.setButtonText(this.plugin.t("enableCopyLink")).setCta().onClick(async()=>{await this.plugin.shareNote(t),this.close()})})}},M=class extends h.PluginSettingTab{plugin;currentFolder="";constructor(e,t){super(e,t),this.plugin=t,this.currentFolder=""}getSettingDefinitions(){return[{name:this.plugin.t("localSharing"),aliases:[this.plugin.t("localServer"),this.plugin.t("port"),this.plugin.t("autoStop"),this.plugin.t("urlToken"),this.plugin.t("anonymousStats"),this.plugin.t("theme"),this.plugin.t("customCss"),this.plugin.t("browseVault"),this.plugin.t("sharedFolders"),this.plugin.t("individuallySharedNotes")],render:e=>{let t=e.settingEl;t.empty(),new h.Setting(t).setName(this.plugin.t("localSharing")).setHeading(),t.createDiv({cls:"local-note-share-status",text:this.plugin.server?this.plugin.t("activeServer",{url:this.plugin.getShareUrl()}):this.plugin.t("serverOff")}),new h.Setting(t).setName(this.plugin.t("localServer")).setDesc(this.plugin.t("localServerDesc")).addButton(r=>{r.setButtonText(this.plugin.server?this.plugin.t("stop"):this.plugin.t("start")),this.plugin.server||r.setCta(),r.onClick(async()=>{await this.plugin.toggleServer(),this.update()})}).addButton(r=>{r.setButtonText(this.plugin.t("copyUrl")).onClick(()=>this.plugin.copyShareUrl())}),new h.Setting(t).setName(this.plugin.t("port")).setDesc(this.plugin.t("portDesc")).addText(r=>{r.setPlaceholder("8099").setValue(String(this.plugin.config.port)).onChange(async o=>{let c=Number(o);if(!Number.isInteger(c)||c<1||c>65535)return;let l=!!this.plugin.server;l&&await this.plugin.stopServer(),this.plugin.config.port=c,await this.plugin.saveSettings(),l&&await this.plugin.startServer(),this.update()})}),new h.Setting(t).setName(this.plugin.t("startWithObsidian")).setDesc(this.plugin.t("startWithObsidianDesc")).addToggle(r=>{r.setValue(this.plugin.config.autoStart).onChange(async o=>{this.plugin.config.autoStart=o,await this.plugin.saveSettings()})}),new h.Setting(t).setName(this.plugin.t("autoStop")).setDesc(this.plugin.t("autoStopDesc")).addDropdown(r=>{r.addOption("0",this.plugin.t("disabled")).addOption("60",this.plugin.t("afterOneHour")).addOption("120",this.plugin.t("afterHours",{hours:2})).addOption("240",this.plugin.t("afterHours",{hours:4})).addOption("480",this.plugin.t("afterHours",{hours:8})).setValue(String(this.plugin.config.autoStopMinutes)).onChange(async o=>{this.plugin.config.autoStopMinutes=Number(o),await this.plugin.saveSettings(),this.plugin.scheduleAutoStop()})}),new h.Setting(t).setName(this.plugin.t("urlToken")).setDesc(this.plugin.t("urlTokenDesc")).addToggle(r=>{r.setValue(this.plugin.config.requireToken).onChange(async o=>{this.plugin.config.requireToken=o,await this.plugin.saveSettings(),this.update()})}).addButton(r=>{r.setButtonText(this.plugin.t("regenerate")).onClick(async()=>{this.plugin.config.token=this.plugin.generateToken(),await this.plugin.saveSettings(),this.update()})}),new h.Setting(t).setName(this.plugin.t("anonymousStats")).setHeading(),t.createDiv({cls:"local-note-share-status",text:this.plugin.t("anonymousStatsDesc")}),new h.Setting(t).setName(this.plugin.t("enableCounting")).setDesc(this.plugin.t("enableCountingDesc")).addToggle(r=>{r.setValue(this.plugin.config.analytics.enabled).onChange(async o=>{this.plugin.config.analytics.enabled=o,await this.plugin.saveSettings(),this.update()})}),new h.Setting(t).setName(this.plugin.t("ignoreComputer")).setDesc(this.plugin.t("ignoreComputerDesc")).addToggle(r=>{r.setValue(this.plugin.config.analytics.excludeLocalhost).onChange(async o=>{this.plugin.config.analytics.excludeLocalhost=o,await this.plugin.saveSettings()})}),new h.Setting(t).setName(this.plugin.t("uniqueRetention")).setDesc(this.plugin.t("uniqueRetentionDesc")).addDropdown(r=>{r.addOption("7",this.plugin.t("days",{days:7})).addOption("30",this.plugin.t("days",{days:30})).addOption("90",this.plugin.t("days",{days:90})).addOption("365",this.plugin.t("oneYear")).setValue(String(this.plugin.config.analytics.retentionDays)).onChange(async o=>{this.plugin.config.analytics.retentionDays=Number(o),await this.plugin.saveSettings(),this.update()})}),this.renderAnalytics(t),new h.Setting(t).setName(this.plugin.t("sharedAppearance")).setHeading(),new h.Setting(t).setName(this.plugin.t("theme")).setDesc(this.plugin.t("themeDesc")).addDropdown(r=>{r.addOption("royal-velvet","Royal velvet").addOption("light",this.plugin.t("light")).addOption("system",this.plugin.t("system")).setValue(this.plugin.config.theme.preset).onChange(async o=>{this.plugin.config.theme.preset=o,await this.plugin.saveSettings()})}),new h.Setting(t).setName(this.plugin.t("accentColor")).setDesc(this.plugin.t("accentColorDesc")).addColorPicker(r=>{r.setValue(this.plugin.config.theme.accentColor).onChange(async o=>{this.plugin.config.theme.accentColor=o,await this.plugin.saveSettings()})}),new h.Setting(t).setName(this.plugin.t("contentWidth")).setDesc(this.plugin.t("contentWidthDesc")).addSlider(r=>{r.setLimits(560,1600,20).setValue(this.plugin.config.theme.contentWidth).onChange(async o=>{this.plugin.config.theme.contentWidth=o,await this.plugin.saveSettings()})}),new h.Setting(t).setName(this.plugin.t("showPaths")).setDesc(this.plugin.t("showPathsDesc")).addToggle(r=>{r.setValue(this.plugin.config.theme.showFilePaths).onChange(async o=>{this.plugin.config.theme.showFilePaths=o,await this.plugin.saveSettings()})}),new h.Setting(t).setName(this.plugin.t("font")).setDesc(this.plugin.t("fontDesc")).addText(r=>{r.setValue(this.plugin.config.theme.fontFamily),r.inputEl.addEventListener("change",()=>{D(async()=>{let o=r.getValue().trim();o&&(this.plugin.config.theme.fontFamily=o,await this.plugin.saveSettings())})})}),new h.Setting(t).setName(this.plugin.t("customCss")).setDesc(this.plugin.t("customCssDesc")).addTextArea(r=>{r.setPlaceholder(":root { --page-bg: #111; }").setValue(this.plugin.config.theme.customCss),r.inputEl.rows=8,r.inputEl.addEventListener("change",()=>{D(async()=>{this.plugin.config.theme.customCss=r.getValue(),await this.plugin.saveSettings()})})}).controlEl.addClass("local-note-share-custom-css"),new h.Setting(t).setName(this.plugin.t("shareActiveNote")).setDesc(this.plugin.t("shareActiveNoteDesc")).addButton(r=>{r.setButtonText(this.plugin.t("add")).setCta().onClick(()=>{let o=this.app.workspace.getActiveFile();if(!o){new h.Notice(this.plugin.t("noActiveNote"));return}this.plugin.shareNote(o).then(()=>this.update()).catch(c=>{console.error("NoteLAN share error",c)})})}),this.renderVaultBrowser(t),new h.Setting(t).setName(this.plugin.t("sharedFolders")).setHeading();let i=t.createDiv({cls:"local-note-share-list"});this.plugin.config.sharedFolders.length||i.createDiv({cls:"local-note-share-status",text:this.plugin.t("noSharedFolders")});for(let r of this.plugin.config.sharedFolders){let o=i.createDiv({cls:"local-note-share-note"});o.createDiv({cls:"local-note-share-note-path",text:r});let c=o.createDiv();new h.Setting(c).addButton(l=>{l.setButtonText(this.plugin.t("copy")).onClick(()=>this.plugin.copyText(this.plugin.getFolderUrl(r)))}).addButton(l=>{l.setButtonText(this.plugin.t("remove")).onClick(async()=>{await this.plugin.unshareFolder(r),this.update()})})}new h.Setting(t).setName(this.plugin.t("individuallySharedNotes")).setHeading();let a=t.createDiv({cls:"local-note-share-list"});if(!this.plugin.config.sharedNotes.length){a.createDiv({cls:"local-note-share-status",text:this.plugin.t("noIndividualNotes")});return}for(let r of this.plugin.config.sharedNotes){let o=a.createDiv({cls:"local-note-share-note"});o.createDiv({cls:"local-note-share-note-path",text:r});let c=o.createDiv();new h.Setting(c).addButton(l=>{l.setButtonText(this.plugin.t("copy")).onClick(()=>this.plugin.copyText(this.plugin.getNoteUrl(r)))}).addButton(l=>{l.setButtonText(this.plugin.t("remove")).onClick(async()=>{await this.plugin.unshareNote(r),this.update()})})}}}]}renderAnalytics(e){let t=this.plugin.getAnalyticsSummary(),s=e.createDiv({cls:"local-note-share-analytics-metrics"});if(this.renderMetric(s,this.plugin.t("views"),t.totalViews),this.renderMetric(s,this.plugin.t("uniqueVisitors"),t.uniqueVisitors),this.renderMetric(s,this.plugin.t("today"),t.viewsToday),new h.Setting(e).setDesc(this.plugin.t("uniqueEstimate",{days:this.plugin.config.analytics.retentionDays})).addButton(l=>{l.setButtonText(this.plugin.t("clearStatistics")).setDestructive().onClick(async()=>{await Ye(this.app,this.plugin)&&(await this.plugin.resetAnalytics(),new h.Notice(this.plugin.t("statisticsCleared")),this.update())})}).settingEl.addClass("local-note-share-analytics-actions"),!t.pages.length){e.createDiv({cls:"local-note-share-status",text:this.plugin.config.analytics.enabled?this.plugin.t("noRemoteVisit"):this.plugin.t("countingDisabled")});return}let r=e.createDiv({cls:"local-note-share-analytics-table-wrapper"}).createEl("table",{cls:"local-note-share-analytics-table"}),o=r.createEl("thead").createEl("tr");for(let l of[this.plugin.t("page"),this.plugin.t("views"),this.plugin.t("visitors"),this.plugin.t("lastAccess")])o.createEl("th",{text:l});let c=r.createEl("tbody");for(let l of t.pages){let p=c.createEl("tr"),v=p.createEl("td");v.createDiv({text:l.title}),v.createDiv({cls:"local-note-share-analytics-path",text:l.kind==="index"?l.path||"/":l.path}),p.createEl("td",{text:String(l.views)}),p.createEl("td",{text:String(l.uniqueVisitors)}),p.createEl("td",{text:l.lastAccess?Qe(l.lastAccess,this.plugin.locale):"-"})}}renderMetric(e,t,s){let i=e.createDiv({cls:"local-note-share-analytics-metric"});i.createDiv({cls:"local-note-share-analytics-value",text:String(s)}),i.createDiv({cls:"local-note-share-analytics-label",text:t})}renderVaultBrowser(e){new h.Setting(e).setName(this.plugin.t("browseVault")).setHeading();let t=this.getCurrentFolder(),s=t.path||"",i=!s,a=e.createDiv({cls:"local-note-share-browser"}),r=a.createDiv({cls:"local-note-share-browser-header"});r.createDiv({cls:"local-note-share-browser-path",text:s||"/"});let o=r.createDiv({cls:"local-note-share-browser-actions"}),c=o.createEl("button",{text:this.plugin.t("root"),cls:"mod-muted"});c.disabled=!s,c.addEventListener("click",()=>{this.currentFolder="",this.update()});let l=o.createEl("button",{text:this.plugin.t("up"),cls:"mod-muted"});if(l.disabled=!s,l.addEventListener("click",()=>{this.currentFolder=R(s),this.update()}),!i){let d=this.plugin.isFolderExplicitlyShared(s);o.createEl("button",{text:d?this.plugin.t("menuUnshareFolder"):this.plugin.t("shareThisFolder"),cls:d?"mod-muted":"mod-cta"}).addEventListener("click",()=>{D(async()=>{d?await this.plugin.unshareFolder(s):await this.plugin.shareFolder(t),this.update()})})}let p=a.createDiv({cls:"local-note-share-browser-list"}),v=[...t.children],S=v.filter(d=>d instanceof h.TFolder).sort((d,w)=>d.name.localeCompare(w.name,this.plugin.locale,{sensitivity:"base"})),k=v.filter(d=>d instanceof h.TFile&&d.extension==="md").sort((d,w)=>d.basename.localeCompare(w.basename,this.plugin.locale,{sensitivity:"base"})),y=i?[]:k;if(a.createDiv({cls:"local-note-share-browser-count",text:`${C(this.plugin.locale,S.length,"folderCount","foldersCount")}, ${C(this.plugin.locale,y.length,"noteCount","notesCount")}`}),!S.length&&!y.length){p.createDiv({cls:"local-note-share-status",text:this.plugin.t("emptyFolder")});return}for(let d of S){let w=p.createDiv({cls:"local-note-share-browser-row is-folder"});w.createEl("button",{text:d.name,cls:"local-note-share-browser-entry mod-muted"}).addEventListener("click",()=>{this.currentFolder=d.path,this.update()});let m=w.createDiv({cls:"local-note-share-browser-actions"}),b=this.plugin.isFolderExplicitlyShared(d.path),T=!b&&this.plugin.isPathInSharedFolder(d.path);m.createEl("button",{text:b?this.plugin.t("remove"):T?this.plugin.t("inheritedShare"):this.plugin.t("shareFolder"),cls:b||T?"mod-muted":"mod-cta"}).addEventListener("click",()=>{D(async()=>{if(b){await this.plugin.unshareFolder(d.path),this.update();return}if(T){await this.plugin.copyText(this.plugin.getFolderUrl(d.path)),new h.Notice(this.plugin.t("folderLinkCopied"));return}await this.plugin.shareFolder(d),this.update()})})}for(let d of y){let w=p.createDiv({cls:"local-note-share-browser-row is-file"});w.createDiv({cls:"local-note-share-browser-entry",text:d.basename});let g=w.createDiv({cls:"local-note-share-browser-actions"}),m=this.plugin.isNoteShared(d);g.createEl("button",{text:m?this.plugin.t("sharedFeminine"):this.plugin.t("share"),cls:m?"mod-muted":"mod-cta"}).addEventListener("click",()=>{D(async()=>{if(m){await this.plugin.copyText(this.plugin.getNoteUrl(d.path)),new h.Notice(this.plugin.t("shareUrlCopied"));return}await this.plugin.shareNote(d),this.update()})})}}getCurrentFolder(){if(!this.currentFolder)return this.app.vault.getRoot();let e=this.app.vault.getAbstractFileByPath(this.currentFolder);return e instanceof h.TFolder?e:(this.currentFolder="",this.app.vault.getRoot())}};function Qe(n,e){return new Intl.DateTimeFormat(e==="fr"?"fr-FR":"en-US",{dateStyle:"short",timeStyle:"short"}).format(new Date(n))}function D(n){n().catch(e=>{console.error("NoteLAN settings action error",e)})}var Xe=new Set(["avif","bmp","gif","jpeg","jpg","png","svg","webp","pdf","mp3","wav","ogg","m4a","mp4","webm","mov"]),V=class extends u.Plugin{config;locale="en";server=null;shareIndex;notePageCache=new Map;autoStopTimer=null;analyticsSaveTimer=null;statusBarEl;ribbonIconEl;async onload(){this.locale=pe(u.moment.locale()),await this.loadSettings(),this.server=null,this.shareIndex=new U(this.app.vault),this.statusBarEl=this.addStatusBarItem(),this.statusBarEl.addClass("local-note-share-statusbar"),this.ribbonIconEl=this.addRibbonIcon("share-2",this.t("ribbonShareNote"),()=>this.openCurrentNoteShareModal()),this.ribbonIconEl.addClass("local-note-share-ribbon-button"),this.updateUiState(),this.registerEvent(this.app.workspace.on("active-leaf-change",()=>void this.updateUiState())),this.registerEvent(this.app.vault.on("modify",e=>this.handleVaultModify(e))),this.registerEvent(this.app.vault.on("rename",(e,t)=>this.handleVaultRename(e,t))),this.registerEvent(this.app.vault.on("delete",e=>this.handleVaultDelete(e))),this.registerEvent(this.app.vault.on("create",()=>this.shareIndex.invalidate())),this.registerEvent(this.app.workspace.on("file-menu",(e,t)=>this.addFileMenuItems(e,t))),this.addCommand({id:"manage-current-note-local-share",name:this.t("commandManageNote"),checkCallback:e=>this.app.workspace.getActiveFile()?(e||this.openCurrentNoteShareModal(),!0):!1}),this.addCommand({id:"toggle-server",name:this.t("commandToggleServer"),callback:()=>void this.toggleServer()}),this.addCommand({id:"share-current-note-locally",name:this.t("commandShareNote"),checkCallback:e=>{let t=this.app.workspace.getActiveFile();return t?(e||this.shareNote(t),!0):!1}}),this.addCommand({id:"unshare-current-note-locally",name:this.t("commandUnshareNote"),checkCallback:e=>{let t=this.app.workspace.getActiveFile();return t?(e||this.unshareNote(t.path),!0):!1}}),this.addCommand({id:"copy-local-share-url",name:this.t("commandCopyUrl"),callback:()=>void this.copyShareUrl()}),this.addSettingTab(new M(this.app,this)),this.config.autoStart&&this.app.workspace.onLayoutReady(()=>void this.startServer())}onunload(){Promise.all([this.stopServer(),this.flushAnalyticsSave()]).catch(e=>{console.error("NoteLAN shutdown error",e)})}async loadSettings(){this.config=ke(await this.loadData()),this.config.token||(this.config.token=K(),await this.saveSettings())}t(e,t){return z(this.locale,e,t)}async saveSettings(){this.config.sharedNotes=[...new Set(this.config.sharedNotes)].sort(),this.config.sharedFolders=[...new Set(this.config.sharedFolders.map(x).filter(Boolean))].sort(),this.shareIndex?.invalidateSelection(),this.notePageCache.clear(),await this.saveData(this.config)}queueAnalyticsSave(){this.analyticsSaveTimer||(this.analyticsSaveTimer=window.setTimeout(()=>{this.analyticsSaveTimer=null,this.saveData(this.config).catch(e=>{console.error("Local Note Share analytics save error",e)})},1e3))}async flushAnalyticsSave(){this.analyticsSaveTimer&&(window.clearTimeout(this.analyticsSaveTimer),this.analyticsSaveTimer=null,await this.saveData(this.config))}getAnalyticsSummary(){return le(this.config.analyticsData,this.config.analytics.retentionDays)}async resetAnalytics(){this.config.analyticsData=E(),await this.saveSettings()}async toggleServer(){if(this.server){await this.stopServer(),new u.Notice(this.t("serverStopped"));return}await this.startServer()}async startServer(){if(this.server)return;let e=Fe.default.createServer((i,a)=>{this.handleRequest(i,a).catch(r=>{console.error("Local Note Share error",r);let o=r instanceof Error?r.message:String(r);this.sendHtml(a,500,this.renderPage(this.t("errorTitle"),`<p>${f(o)}</p>`))})});this.server=e,await new Promise((i,a)=>{e.once("error",a),e.listen(Number(this.config.port),"0.0.0.0",()=>{e.off("error",a),i()})}),this.scheduleAutoStop();let t=this.config.autoStopMinutes?this.t("serverDurationHours",{hours:this.config.autoStopMinutes/60}):this.t("serverDurationManual"),s=this.config.requireToken?this.t("serverProtected"):this.t("serverUnprotected");new u.Notice(this.t("serverStarted",{duration:t,protection:s,url:this.getShareUrl()}),9e3)}async stopServer(){if(this.clearAutoStopTimer(),!this.server)return;let e=this.server;this.server=null,await new Promise(t=>e.close(t))}scheduleAutoStop(){this.clearAutoStopTimer(),!(!this.server||this.config.autoStopMinutes<=0)&&(this.autoStopTimer=window.setTimeout(()=>{this.stopServer().then(async()=>{await this.updateUiState(),new u.Notice(this.t("serverAutoStopped"))})},this.config.autoStopMinutes*6e4))}clearAutoStopTimer(){this.autoStopTimer&&(window.clearTimeout(this.autoStopTimer),this.autoStopTimer=null)}async shareNote(e){if(!(e instanceof u.TFile)||e.extension!=="md"){new u.Notice(this.t("markdownOnly"));return}this.config.sharedNotes.includes(e.path)||(this.config.sharedNotes.push(e.path),await this.saveSettings()),this.server||await this.startServer(),await this.copyText(this.getNoteUrl(e.path)),await this.updateUiState(),new u.Notice(this.t("noteShared"))}async unshareNote(e){this.config.sharedNotes=this.config.sharedNotes.filter(t=>t!==e),await this.saveSettings(),await this.updateUiState(),new u.Notice(this.t("noteUnshared"))}async shareFolder(e){if(!(e instanceof u.TFolder)||!e.path){new u.Notice(this.t("selectFolder"));return}if(!this.config.sharedFolders.includes(e.path)){let s=this.getFilesInFolder(e.path);if(!await xe(this.app,this,e.path,s.length))return;this.config.sharedFolders.push(e.path),await this.saveSettings()}this.server||await this.startServer(),await this.copyText(this.getFolderUrl(e.path)),await this.updateUiState();let t=this.getFilesInFolder(e.path).length;new u.Notice(this.t("folderShared",{files:C(this.locale,t,"fileCount","filesCount")}))}async unshareFolder(e){let t=x(e);this.config.sharedFolders=this.config.sharedFolders.filter(s=>s!==t),await this.saveSettings(),await this.updateUiState(),new u.Notice(this.t("folderUnshared"))}isFolderExplicitlyShared(e){return this.config.sharedFolders.includes(x(e))}isPathInSharedFolder(e){let t=x(e);return this.config.sharedFolders.some(s=>t.startsWith(`${s}/`))}getFilesInFolder(e){return this.shareIndex.filesInFolder(e)}getSharedFilePaths(){return this.shareIndex.getSharedPaths(this.config.sharedNotes,this.config.sharedFolders)}getSharedNotePaths(){return this.getSharedFilePaths().filter(e=>{let t=this.app.vault.getAbstractFileByPath(e);return t instanceof u.TFile&&t.extension==="md"})}isNotePathShared(e){return this.config.sharedNotes.includes(e)||this.isPathInSharedFolder(e)}isNoteExplicitlyShared(e){return this.config.sharedNotes.includes(e)}addFileMenuItems(e,t){if(!(t instanceof u.TFolder)||!t.path)return;let s=this.isFolderExplicitlyShared(t.path);e.addItem(i=>{i.setTitle(s?this.t("menuUnshareFolder"):this.t("menuShareFolder")).setIcon(s?"circle-off":"share-2").onClick(()=>s?this.unshareFolder(t.path):this.shareFolder(t))}),(s||this.isPathInSharedFolder(t.path))&&e.addItem(i=>{i.setTitle(this.t("menuCopyFolderLink")).setIcon("link").onClick(async()=>{this.server||await this.startServer(),await this.copyText(this.getFolderUrl(t.path)),new u.Notice(this.t("folderLinkCopied"))})})}openCurrentNoteShareModal(){new B(this.app,this).open()}isNoteShared(e){return e instanceof u.TFile&&this.isNotePathShared(e.path)}async updateUiState(){this.updateRibbonState(),await this.updateStatusBar()}updateRibbonState(){if(!this.ribbonIconEl)return;let e=this.app.workspace.getActiveFile();this.ribbonIconEl.toggleClass("is-shared",this.isNoteShared(e))}async updateStatusBar(){if(!this.statusBarEl)return;let e=this.app.workspace.getActiveFile();if(this.statusBarEl.empty(),!(e instanceof u.TFile)||e.extension!=="md")return;let t=this.isNoteShared(e),s=this.isPathInSharedFolder(e.path),i=this.statusBarEl.createSpan({cls:`local-note-share-status-pill${t?" is-shared":""}`,text:s?this.t("statusSharedFolder"):t?this.t("statusShared"):this.t("statusPrivate")});if(i.title=s?this.t("statusSharedFolderTitle"):t?this.t("statusUnshareTitle"):this.t("statusShareTitle"),i.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),Ce(async()=>{s?(this.server||await this.startServer(),await this.copyText(this.getNoteUrl(e.path)),new u.Notice(this.t("linkCopiedFolderManaged"))):t?await this.unshareNote(e.path):await this.shareNote(e)})}),!t)return;let a=this.statusBarEl.createSpan({cls:"local-note-share-status-link"});(0,u.setIcon)(a,"link"),a.title=this.t("copySharedLink"),a.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),Ce(async()=>{this.server||await this.startServer(),await this.copyText(this.getNoteUrl(e.path)),new u.Notice(this.t("linkCopied"))})})}async handleVaultModify(e){e instanceof u.TFile&&this.notePageCache.delete(e.path);let t=this.app.workspace.getActiveFile();!(e instanceof u.TFile)||!t||e.path!==t.path||await this.updateStatusBar()}async handleVaultRename(e,t){this.shareIndex.invalidate(),this.notePageCache.delete(t);let s=!1,i=a=>a===t?(s=!0,e.path):e instanceof u.TFolder&&a.startsWith(`${t}/`)?(s=!0,`${e.path}${a.slice(t.length)}`):a;this.config.sharedNotes=this.config.sharedNotes.map(i),this.config.sharedFolders=this.config.sharedFolders.map(i),s&&await this.saveSettings(),await this.updateUiState()}async handleVaultDelete(e){this.shareIndex.invalidate(),this.notePageCache.delete(e.path);let t=e.path,s=r=>r!==t&&!r.startsWith(`${t}/`),i=this.config.sharedNotes.filter(s),a=this.config.sharedFolders.filter(s);i.length===this.config.sharedNotes.length&&a.length===this.config.sharedFolders.length||(this.config.sharedNotes=i,this.config.sharedFolders=a,await this.saveSettings(),await this.updateUiState())}async copyShareUrl(){this.server||await this.startServer(),await this.copyText(this.getShareUrl()),new u.Notice(this.t("shareUrlCopied"))}async copyText(e){await navigator.clipboard.writeText(e)}async handleRequest(e,t){if(!this.isAllowedRemoteAddress(e.socket.remoteAddress)){this.sendText(t,403,"Forbidden");return}let s=new URL(e.url||"/",`http://${e.headers.host||"localhost"}`);if(!this.isAuthorized(s)){this.sendHtml(t,401,this.renderPage(this.t("protectedTitle"),`<p>${this.t("invalidToken")}</p>`));return}if(s.pathname==="/"||s.pathname==="/index.html"){let i=x(s.searchParams.get("folder")||"");this.trackPageVisit(e,t,{key:`index:${i||"/"}`,kind:"index",path:i,title:i||this.t("home")}),this.sendHtml(t,200,this.renderIndex(i));return}if(s.pathname.startsWith("/note/")){let i=x(decodeURIComponent(s.pathname.slice(6)));await this.sendNote(e,t,i);return}if(s.pathname==="/asset"){let i=x(s.searchParams.get("path")||"");await this.sendAsset(t,i);return}this.sendHtml(t,404,this.renderPage(this.t("notFoundTitle"),`<p>${this.t("pageNotFound")}</p>`))}isAuthorized(e){return!this.config.requireToken||e.searchParams.get("token")===this.config.token}isAllowedRemoteAddress(e){if(!e)return!1;let t=e.replace(/^::ffff:/,"");if(t==="::1"||t==="127.0.0.1"||t.startsWith("10.")||t.startsWith("192.168."))return!0;let s=t.match(/^172\.(\d+)\./);if(s){let i=Number(s[1]);return i>=16&&i<=31}return t.startsWith("fe80:")}trackPageVisit(e,t,s){if(!this.config.analytics.enabled||e.method!=="GET"||this.config.analytics.excludeLocalhost&&ce(e.socket.remoteAddress))return;let i=ae(e,t,this.config.token);oe(this.config.analyticsData,i,s,this.config.analytics.retentionDays),this.queueAnalyticsSave()}async sendNote(e,t,s){if(!this.isNotePathShared(s)){this.sendHtml(t,404,this.renderPage(this.t("noteNotSharedTitle"),`<p>${this.t("noteNotShared")}</p>`));return}let i=this.app.vault.getAbstractFileByPath(s);if(!(i instanceof u.TFile)){this.sendHtml(t,404,this.renderPage(this.t("noteNotFoundTitle"),`<p>${this.t("fileNotFound")}</p>`));return}this.trackPageVisit(e,t,{key:`note:${i.path}`,kind:"note",path:i.path,title:i.basename});let a=this.notePageCache.get(i.path);if(a?.mtime===i.stat.mtime){this.sendHtml(t,200,a.html);return}let r=await this.app.vault.read(i),o=this.renderMarkdown(r,i.path),c=this.renderPage(i.basename,o,i.path);this.notePageCache.set(i.path,{mtime:i.stat.mtime,html:c}),this.sendHtml(t,200,c)}async sendAsset(e,t){if(!this.isAllowedAsset(t)){this.sendText(e,404,"Not found");return}let s=this.app.vault.getAbstractFileByPath(t);if(!(s instanceof u.TFile)){this.sendText(e,404,"Not found");return}let i=await this.app.vault.adapter.readBinary(s.path);e.writeHead(200,{"Content-Type":ue(s.extension),"Cache-Control":"no-store"}),e.end(Buffer.from(i))}isAllowedAsset(e){let t=this.app.vault.getAbstractFileByPath(e);if(!(t instanceof u.TFile))return!1;if(this.isPathInSharedFolder(e))return!0;if(!Xe.has(t.extension.toLowerCase()))return!1;for(let s of this.getSharedNotePaths()){let i=this.app.vault.getAbstractFileByPath(s);if(!(i instanceof u.TFile))continue;if((this.app.metadataCache.getFileCache(i)?.embeds||[]).some(o=>this.resolveLinkTarget(o.link,i.path)?.path===e))return!0}return!1}renderIndex(e=""){let t=x(e),s=t?`${t}/`:"",i=new Set,a=[],r=[];for(let g of this.getSharedFilePaths()){if(t&&!g.startsWith(s))continue;let m=t?g.slice(s.length):g;if(!m||m.startsWith("../"))continue;let b=m.split("/");if(b.length>1){i.add(b[0]);continue}let T=this.app.vault.getAbstractFileByPath(g);T instanceof u.TFile&&(T.extension==="md"?a.push({notePath:g,title:T.basename}):r.push({filePath:g,title:T.name}))}let o=[...i].sort((g,m)=>g.localeCompare(m,this.locale,{sensitivity:"base"}));a.sort((g,m)=>g.title.localeCompare(m.title,this.locale,{sensitivity:"base"})),r.sort((g,m)=>g.title.localeCompare(m.title,this.locale,{sensitivity:"base"}));let c=[C(this.locale,o.length,"folderCount","foldersCount"),C(this.locale,a.length,"noteCount","notesCount"),C(this.locale,r.length,"fileCount","filesCount")].join(" \xB7 "),l=t?t.split("/"):[],v=`<div class="vault-toolbar">
      <div class="vault-breadcrumbs">${[`<a href="${this.indexHref()}" class="vault-crumb ${l.length?"":"is-current"}">${this.t("root")}</a>`,...l.map((g,m)=>{let b=l.slice(0,m+1).join("/"),T=m===l.length-1;return`<span class="vault-crumb-sep">/</span><a href="${this.indexHref(b)}" class="vault-crumb ${T?"is-current":""}">${f(g)}</a>`})].join("")}</div>
      <div class="vault-toolbar-actions">
        ${t?`<a class="vault-button" href="${this.indexHref(R(t))}">${this.t("up")}</a>`:""}
      </div>
    </div>`,S=o.map(g=>{let m=t?`${t}/${g}`:g;return`<li class="entry-row is-folder">
          <a href="${this.indexHref(m)}" class="entry-main">
            <span class="entry-kicker">${this.t("folder")}</span>
            <span class="entry-title">${f(g)}</span>
          </a>
        </li>`}).join(""),k=a.map(({notePath:g,title:m})=>`<li class="entry-row is-note">
        <a href="${this.noteHref(g)}" class="entry-main">
          <span class="entry-kicker">${this.t("note")}</span>
          <span class="entry-title">${f(m)}</span>
          ${this.config.theme.showFilePaths?`<span class="entry-meta">${f(g)}</span>`:""}
        </a>
      </li>`).join(""),y=r.map(({filePath:g,title:m})=>`<li class="entry-row is-file">
        <a href="${this.assetHref(g)}" class="entry-main">
          <span class="entry-kicker">${this.t("file")}</span>
          <span class="entry-title">${f(m)}</span>
          ${this.config.theme.showFilePaths?`<span class="entry-meta">${f(g)}</span>`:""}
        </a>
      </li>`).join(""),d=[];S&&d.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("folders")}</h2></div><ul class="entry-list">${S}</ul></section>`),k&&d.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("notes")}</h2></div><ul class="entry-list">${k}</ul></section>`),y&&d.push(`<section class="vault-section"><div class="vault-section-head"><h2>${this.t("files")}</h2></div><ul class="entry-list">${y}</ul></section>`);let w=d.length?`<section class="vault-hero">
          ${v}
          <p class="vault-label">${this.t("sharedSpace")}</p>
          <div class="vault-hero-main">
            <div>
              <p class="vault-path">${f(t||"/")}</p>
              <p class="vault-count">${c}</p>
            </div>
          </div>
        </section>${d.join("")}`:`<section class="vault-hero">
          ${v}
          <p class="vault-label">${this.t("sharedSpace")}</p>
          <div class="vault-hero-main">
            <div>
              <p class="vault-path">${f(t||"/")}</p>
              <p class="vault-count">${c}</p>
            </div>
          </div>
        </section><p>${this.t("nothingShared")}</p>`;return this.renderPage(this.t("sharedFiles"),w)}stripFrontmatter(e){return String(e||"").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/,"")}parseSharedSprintTicketTable(e){let t=String(e||"").match(/^##\s+Tickets du sprint\b.*$/im);if(!t)return[];let s=e.slice(t.index).split(/\r?\n/).slice(1),i=[];for(let p of s){if(!p.trim()){if(i.length)break;continue}if(!p.trim().startsWith("|")){if(i.length)break;continue}i.push(p)}if(i.length<3)return[];let a=i[0].split("|").slice(1,-1).map(p=>Te(p)),r=(p,v)=>{let S=a.findIndex(k=>k.includes(p));return S>=0?S:v},o=r("statut",1),c=r("estimate",a.length-1),l=[];for(let p=2;p<i.length;p+=1){let v=i[p].split("|").slice(1,-1).map(w=>w.trim());if(!v.length)continue;let S=v[o]||"",y=(v[c]||"").match(/([0-9]+(?:[.,][0-9]+)?)\s*j\.h/i),d=y?Number(String(y[1]).replace(",",".")):0;l.push({status:S,estimateDays:d})}return l}classifySharedSprintStatus(e){let t=Te(e);return t==="to do"||t==="todo"?"todo":["done","complete","completed"].includes(t)?"done":"active"}buildShareSquareGrid(e,t=4,s="\u25A0"){if(!e)return"\xB7";let i=Array.from({length:e},()=>s),a=[];for(let r=0;r<i.length;r+=t)a.push(i.slice(r,r+t).join(" "));return a.join(`
`)}renderSharedSprintDashboard(e){let t=this.parseSharedSprintTicketTable(e);if(!t.length)return`<div class="shared-sprint-empty">${this.t("dashboardUnavailable")}</div>`;let s={todo:{title:this.t("sprintTodo"),symbol:"\u25A1",tickets:0,estimateDays:0},active:{title:this.t("sprintActive"),symbol:"\u25A7",tickets:0,estimateDays:0},done:{title:this.t("sprintDone"),symbol:"\u25A0",tickets:0,estimateDays:0}};for(let c of t){let l=this.classifySharedSprintStatus(c.status);s[l].tickets+=1,s[l].estimateDays+=Number(c.estimateDays||0)}let i=Object.values(s).reduce((c,l)=>c+l.estimateDays,0),a=s.done.estimateDays,r=s.todo.estimateDays+s.active.estimateDays,o=["todo","active","done"].map(c=>{let l=s[c],p=Math.max(0,Math.round(l.estimateDays));return`
          <section class="shared-sprint-column">
            <h4>${f(l.title)}</h4>
            <pre class="shared-sprint-grid">${f(`${C(this.locale,l.tickets,"ticket","tickets")}
${l.estimateDays.toFixed(1)} ${this.t("dayUnit")}

${this.buildShareSquareGrid(p,4,l.symbol)}`)}</pre>
          </section>
        `}).join("");return`
      <div class="shared-sprint-dashboard">
        <div class="shared-sprint-totals">
          <div>${this.t("sprintTotal")}: ${i.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintFinished")}: ${a.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintRemaining")}: ${r.toFixed(1)} ${this.t("dayUnit")}</div>
          <div>${this.t("sprintScale")}</div>
        </div>
        <div class="shared-sprint-columns">${o}</div>
      </div>
    `}renderTable(e,t){if(e.length<2)return"";let s=e.map(r=>r.trim().split("|").slice(1,-1).map(o=>o.trim())),i=s[0],a=s.slice(2);return`
      <div class="markdown-table-wrap">
        <table class="markdown-table">
          <thead>
            <tr>${i.map(r=>`<th>${this.renderInline(r,t)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${a.map(r=>`<tr>${r.map(o=>`<td>${this.renderInline(o,t)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `}renderMarkdown(e,t){let s=this.stripFrontmatter(e),i=s.replace(/\r\n/g,`
`).split(`
`),a=[],r=[],o=null,c=!1,l=[],p="",v=()=>{r.length&&(a.push(`<p>${this.renderInline(r.join(" "),t)}</p>`),r=[])},S=()=>{o&&(a.push(`<${o.type}>${o.items.map(k=>`<li>${this.renderInline(k,t)}</li>`).join("")}</${o.type}>`),o=null)};for(let k=0;k<i.length;k+=1){let y=i[k];if(y.trim().startsWith("```")){c?(p==="gitlab-sprint-dashboard"?a.push(this.renderSharedSprintDashboard(s)):a.push(`<pre><code>${f(l.join(`
`))}</code></pre>`),c=!1,l=[],p=""):(v(),S(),c=!0,p=y.trim().slice(3).trim());continue}if(c){l.push(y);continue}if(!y.trim()){v(),S();continue}if(y.trim().startsWith("|")){v(),S();let b=[y];for(;k+1<i.length&&i[k+1].trim().startsWith("|");)k+=1,b.push(i[k]);a.push(this.renderTable(b,t));continue}let d=y.match(/^(#{1,6})\s+(.+)$/);if(d){v(),S();let b=d[1].length,T=d[2].trim(),Q=this.headingIdFor(T);a.push(`<h${b} id="${Q}">${this.renderInline(T,t)}</h${b}>`);continue}if(/^---+$/.test(y.trim())){v(),S(),a.push("<hr>");continue}let w=y.match(/^\s*[-*]\s+(.+)$/),g=y.match(/^\s*\d+\.\s+(.+)$/);if(w||g){v();let b=w?"ul":"ol";(!o||o.type!==b)&&S(),o||(o={type:b,items:[]}),o.items.push((w??g)?.[1]??"");continue}let m=y.match(/^>\s?(.*)$/);if(m){v(),S(),a.push(`<blockquote>${this.renderInline(m[1],t)}</blockquote>`);continue}r.push(y.trim())}return v(),S(),a.join(`
`)}renderInline(e,t){let s=f(e);return s=s.replace(/!\[\[([^\]]+)]]/g,(i,a)=>{let r=this.resolveLinkTarget(a,t);return!r?.path||!this.isAllowedAsset(r.path)?"":`<img src="${this.assetHref(r.path)}" alt="">`}),s=s.replace(/\[\[([^\]]+)]]/g,(i,a)=>{let[r,o]=a.split("|"),c=W(r),l=o||c.path||c.subpath;if(!c.path&&c.subpath)return`<a class="internal-link" href="#${this.headingIdFor(c.subpath)}">${f(l)}</a>`;let p=this.resolveLinkTarget(r,t);return p?.path&&this.isNotePathShared(p.path)?`<a class="internal-link" href="${this.noteHref(p.path,p.subpath)}">${f(l)}</a>`:f(l)}),s=s.replace(/!\[([^\]]*)]\(([^)]+)\)/g,(i,a,r)=>{let o=this.resolveLinkTarget(r,t);return!o?.path||!this.isAllowedAsset(o.path)?"":`<img src="${this.assetHref(o.path)}" alt="${f(a)}">`}),s=s.replace(/\[([^\]]+)]\(([^)]+)\)/g,(i,a,r)=>{let o=String(r||"").trim();if(/^https?:\/\//i.test(o))return`<a class="external-link" href="${f(o)}" rel="noopener noreferrer">${f(a)}</a>`;if(o.startsWith("#")){let l=o.slice(1).trim();return`<a class="internal-link" href="#${this.headingIdFor(l)}">${f(a)}</a>`}let c=this.resolveLinkTarget(o,t);return c?.path&&this.isNotePathShared(c.path)?`<a class="internal-link" href="${this.noteHref(c.path,c.subpath)}">${f(a)}</a>`:f(a)}),s=s.replace(/`([^`]+)`/g,"<code>$1</code>"),s=s.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),s=s.replace(/\*([^*]+)\*/g,"<em>$1</em>"),s}resolveLinkTarget(e,t){let s=W(e);if(!s.path)return null;let i=this.app.metadataCache.getFirstLinkpathDest(s.path,t);if(i)return{path:i.path,subpath:s.subpath};let a=t.includes("/")?t.slice(0,t.lastIndexOf("/")):"",r=x(Ne.default.posix.join(a,s.path));return r?{path:r,subpath:s.subpath}:null}headingIdFor(e){return _(e)}renderPage(e,t,s=""){let i=s?`<a class="back" href="${this.indexHref()}">${this.t("sharedNotes")}</a>`:"";return`<!doctype html>
<html lang="${this.locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${f(e)}</title>
  <style>${fe(this.config.theme)}</style>
</head>
<body>
  <main>
    ${i}
    <h1>${f(e)}</h1>
    ${t}
  </main>
</body>
</html>`}noteHref(e,t=""){let s=t?`#${encodeURIComponent(_(t))}`:"";return`/note/${encodeURIComponent(e)}${this.tokenQuery()}${s}`}assetHref(e){return`/asset?path=${encodeURIComponent(e)}${this.tokenAssetQuery()}`}indexHref(e=""){let t=x(e||"");if(!t)return`/${this.tokenQuery()}`;let s=new URLSearchParams;return s.set("folder",t),this.config.requireToken&&s.set("token",this.config.token),`/?${s.toString()}`}tokenQuery(){return this.config.requireToken?`?token=${encodeURIComponent(this.config.token)}`:""}tokenAssetQuery(){return this.config.requireToken?`&token=${encodeURIComponent(this.config.token)}`:""}getShareUrl(){return`http://${this.getLocalIpAddress()}:${this.config.port}${this.tokenQuery()}`}getFolderUrl(e){return`http://${this.getLocalIpAddress()}:${this.config.port}${this.indexHref(e)}`}getNoteUrl(e){return`http://${this.getLocalIpAddress()}:${this.config.port}${this.noteHref(e)}`}getLocalIpAddress(){let e=Ae.default.networkInterfaces();for(let t of Object.values(e))for(let s of t||[])if(s.family==="IPv4"&&!s.internal)return s.address;return"127.0.0.1"}sendHtml(e,t,s){e.writeHead(t,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","Content-Security-Policy":"default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; font-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'","Referrer-Policy":"no-referrer","X-Content-Type-Options":"nosniff"}),e.end(s)}sendText(e,t,s){e.writeHead(t,{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}),e.end(s)}generateToken(){return K()}};function Te(n){return n.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Ce(n){n().catch(e=>{console.error("NoteLAN action error",e)})}
