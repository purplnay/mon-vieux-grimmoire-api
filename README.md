# Mon Vieux Grimmoire (API)

API du site de livres **Mon Vieux Grimmoire**.

## Pré-requis

Ce back-end nécessite :

- Une version _récente_ de **Node.js**
- Une base de données **MongoDB**

## Installer les dépendences

```
npm install
```

## Démarrer le serveur

```
npm start
```

## Configuration

Les variables d'environnement sont configurable dans le fichier `.env` qui peut être basé sur le fichier `.env.example`.

Copier-coller ces valeurs dans le fichier `.env.` afin d'avoir une configuration prête à l'utilisation :

```
MONGO_URI="mongodb+srv://purplnay:0wl5u1HnUhtVW4f@cluster0.4fyy61g.mongodb.net/mon-vieux-grimmoire?retryWrites=true&w=majority&appName=Cluster0"
SECRET="some secret key"
```
