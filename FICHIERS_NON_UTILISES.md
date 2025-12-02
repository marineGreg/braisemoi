# 📋 Rapport des fichiers non utilisés - BRAISE-MOI

**Date:** 2 décembre 2025  
**Note:** Ces fichiers existent dans le projet mais ne sont pas actuellement référencés ou utilisés dans le code. Ils sont conservés pour un usage ultérieur potentiel.

---

## 📄 Fichiers HTML

### `elements.html`
- **Type:** Page de démonstration/référence
- **Description:** Contient des exemples d'éléments HTML (formulaires, tableaux, boutons, listes)
- **Usage potentiel:** Template pour de futures sections ou page de contact

---

## 📜 Fichiers JavaScript

### `assets/js/background.cycle.js`
- **Type:** Bibliothèque JavaScript
- **Description:** Plugin jQuery pour cycler des images de fond avec effet de fondu
- **Note:** Actuellement `background-video.js` est utilisé à la place
- **Usage potentiel:** Alternative pour cycler des images au lieu de vidéos

---

## 🔤 Polices / Webfonts

### `assets/webfonts/road-rage.otf`
- **Type:** Police de caractères
- **Description:** Police "Road Rage" jamais déclarée dans le CSS
- **Usage potentiel:** Future utilisation pour des titres ou éléments spéciaux

**Note:** ✅ FontAwesome a été migré vers CDN et tous les fichiers locaux ont été supprimés (~1 Mo économisé)

---

## 🖼️ Images

### Images AMBER
- **`images/amber/amber-bio-lf.jpg`**
  - Note: Commentée dans le HTML (ligne 137 de index.html)
  - Alternative à la photo principale de bio

- **`images/amber/amber-serpent-a-plumes.jpg`**
  - Photo de festival/performance non utilisée actuellement

### Images CONTENT
- **`images/content/content-louve.jpg`**
  - Photo de performance/événement

- **`images/content/content-serpent-a-plumes.jpg`**
  - Photo de festival Serpent à Plumes

### Images MODESTIE
- **`images/modestie/THEO MODEL BOOK1215.jpg`**
  - Photo book/portrait
  - Alternative pour la galerie photo

- **`images/modestie/modestie-bio2.jpg`**
  - Photo de bio alternative
  - Pourrait remplacer modestie-bio.jpg

- **`images/modestie/modestie-communion.jpeg`**
  - Photo d'événement Communion

- **`images/modestie/modestie-concrete.jpg`**
  - Photo de performance au Concrete

---

## 💡 Recommandations

### Pour une utilisation future :

1. **elements.html** → Peut servir de base pour une page "Contact" ou "À propos"
2. **background.cycle.js** → Utile si vous souhaitez remplacer les vidéos par des images (meilleure performance sur mobile)
3. **Images non utilisées** → Parfaites pour rotation de galeries, posts réseaux sociaux, ou variantes saisonnières

### Pour optimisation (optionnel) :

- Compresser les images non utilisées pour économiser de l'espace
- Créer un dossier `/archive/` pour séparer les assets non utilisés
- Documenter dans quel contexte chaque image a été prise

---

## ✅ Fichiers conservés intentionnellement

Ces fichiers NE SONT PAS supprimés car ils peuvent être utiles pour :
- Rotation de contenu
- Mises à jour futures du site
- Archives de performances/événements
- Alternatives de design

**Important:** Avant toute suppression future, vérifier que ces fichiers ne sont toujours pas utilisés en faisant une recherche globale dans le projet.

