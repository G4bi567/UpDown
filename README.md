# Tutoriel pour la Documentation et le Lancement du Jeu "UpDown"

## Description du Jeu
UpDown est un jeu de plateforme 2D captivant, développé en HTML et JavaScript, où le joueur incarne un ninja agile. Le but est d'aider le ninja à rejoindre ses amis dans une taverne située au sommet d'un arbre géant. Le jeu se déroule en deux phases principales : la montée difficile à travers l'arbre, pleine de pièges et d'animaux, et la descente délicate, où le ninja, fatigué et désorienté, doit éviter une chute mortelle.

## Framework Utilisé
Le jeu utilise Matter.js, un moteur de physique robuste, pour gérer les collisions, la gravité, et les mouvements du ninja ainsi que des autres éléments interactifs du jeu.

## Futures étapes du Projet
1. **Ajout de la descente**
2. **Ajout de pièges(vent, pics, animaux)**
3. **Ajout du multijoueur en ligne**


## Comment Jouer à "UpDown"

Pour lancer et jouer à UpDown, suivez ces étapes simples :

1. **Configuration de l'Environnement Local** :
   - Assurez-vous que Node.js est installé sur votre machine.
   - Ouvrez votre interface de ligne de commande (CLI) et naviguez jusqu'au dossier contenant les fichiers du jeu.

2. **Démarrage d'un Serveur Local** :
   - Installez un package de serveur tel que `http-server` en exécutant `npm install http-server -g`.
   - Démarrez le serveur en exécutant `http-server` dans le dossier du jeu.

3. **Accès au Jeu** :
   - Ouvrez un navigateur web et allez à l'adresse `http://localhost:8080`.
   - Naviguez vers le fichier HTML de votre jeu (par exemple, `index.html`).

4. **Jouer à UpDown** :
   - Une fois la page du jeu chargée, vous pouvez commencer à jouer.
   - Utilisez les commandes du jeu : w,a,s,d,g pour le joueur 1; les flèches directionnelles et l pour le joueur 2.

## Configuration et Lancement du Serveur Multijoueur

Le mode multijoueur de "UpDown" nécessite le démarrage d'un serveur backend pour gérer les interactions entre les joueurs en ligne. Voici comment configurer et démarrer ce serveur.

### Prérequis
- Assurez-vous que Node.js est installé sur votre ordinateur. Si ce n'est pas le cas, vous pouvez le télécharger et l'installer depuis [nodejs.org](https://nodejs.org/).

### Installation des Dépendances
1. Ouvrez votre interface de ligne de commande (CLI).
2. Naviguez jusqu'au dossier `server` dans les fichiers du jeu :
    ```bash
    cd chemin/vers/le/dossier/server
    ```
3. Exécutez la commande suivante pour installer les dépendances nécessaires :
    ```bash
    npm install
    ```

### Démarrage du Serveur
1. Lancez le serveur en exécutant :
    ```bash
    node server.js
    ```
   Cela démarrera le serveur sur le port par défaut 3000.

### Connexion au Serveur depuis le Jeu
- Assurez-vous que le jeu est configuré pour se connecter à `http://localhost:3000` pour les interactions multijoueur.
- Si le serveur tourne sur une machine différente ou un port différent, assurez-vous que les configurations dans le jeu sont mises à jour en conséquence.

### Tester le Serveur
- Ouvrez le jeu dans deux fenêtres de navigateur différentes pour tester le mode multijoueur.
- Connectez chaque instance du jeu au serveur pour vérifier que les interactions entre les joueurs fonctionnent comme prévu.

