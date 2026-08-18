<p align="center">
  <img src="assets/notelan-logo.svg" alt="NoteLAN — partagez vos notes, restez en local" width="100%">
</p>

<p align="center"><strong>Partagez certaines notes Obsidian sur votre réseau local — sans cloud, sans compte et en lecture seule.</strong></p>

<p align="center"><a href="README.md">Read in English</a></p>

## Pourquoi NoteLAN ?

NoteLAN transforme les notes et dossiers sélectionnés en pages web accessibles aux téléphones, tablettes et ordinateurs connectés au même réseau privé. Le serveur fonctionne dans l’application Obsidian pour ordinateur. Aucun contenu n’est envoyé vers un service externe.

## Fonctionnalités

- Partage d’une note ou d’un dossier complet.
- Index responsive permettant de parcourir les dossiers partagés.
- Rendu des titres, listes, tableaux, blocs de code, liens et médias.
- Protection optionnelle par token secret, activée par défaut pour une nouvelle installation.
- Statistiques anonymes locales, globales et par page, sans stockage des adresses IP.
- Thèmes, couleur principale, largeur, police, chemins et CSS personnalisé.
- Interface française automatique lorsque la langue d’Obsidian commence par `fr` ; anglais sinon.
- Démarrage automatique et arrêt programmé optionnels.

## Démarrage rapide

1. Activez NoteLAN dans **Réglages → Modules complémentaires**.
2. Ouvrez une note Markdown.
3. Cliquez sur l’icône NoteLAN ou lancez la commande de partage de la note active.
4. Envoyez l’URL copiée à un appareil connecté au même réseau local.
5. Arrêtez le serveur depuis les réglages NoteLAN lorsque le partage est terminé.

## Confidentialité et sécurité

NoteLAN est conçu pour un réseau local de confiance. Le contenu est servi en lecture seule, seules les notes et ressources explicitement partagées sont accessibles, les IP ne sont jamais enregistrées et les tokens d’URL ne sont pas ajoutés aux statistiques.

Le trafic HTTP local n’est pas chiffré. N’utilisez pas NoteLAN sur un réseau public ou non fiable et ne partagez que du contenu que les autres appareils du réseau peuvent consulter.

## Installation manuelle

1. Téléchargez `main.js`, `manifest.json` et `styles.css` depuis la [dernière release](https://github.com/OlivierLB/NoteLAN/releases/latest).
2. Créez `<coffre>/.obsidian/plugins/local-note-share/`.
3. Copiez les trois fichiers dans ce dossier.
4. Rechargez Obsidian et activez **NoteLAN**.

## Développement

```bash
npm ci
npm run validate
```

Le projet est distribué sous [licence MIT](LICENSE) et développé par [OlivierLB](https://github.com/OlivierLB).
