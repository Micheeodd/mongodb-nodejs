Michée ODUDU
M1 AL
ESGI

# **API Potions Magiques**  

Une API RESTful pour gérer des potions magiques, avec authentification utilisateur et documentation Swagger intégrée.  

## **Fonctionnalités**  
✔ **Gestion des potions** (CRUD complet)  
✔ **Authentification** (Register/Login/Logout avec JWT)  
✔ **Endpoints analytiques** (stats, moyennes, ratios)  
✔ **Documentation Swagger** interactive  
✔ **Validation des données** avec Express Validator  
✔ **Sécurité** (sanitization, cookies HTTP-only)  

---

## **Technologies utilisées**  
- **Backend** : Node.js, Express  
- **Base de données** : MongoDB (Mongoose)  
- **Authentification** : JWT (JSON Web Tokens)  
- **Documentation** : Swagger (OpenAPI 3.0)  
- **Sécurité** : Helmet, CORS, Express Sanitizer  

---

## **Installation**  

### **1. Prérequis**  
- Node.js (v18+)  
- MongoDB (local ou Atlas)  
- Git (optionnel)  

### **2. Configuration**  
Clonez le dépôt et installez les dépendances :  

```bash
git clone https://github.com/Micheeodd/mongodb-nodejs.git
cd mongodb-nodejs  
npm install  
```


### **3. Lancer le serveur**  

```bash
npm start  
# ou en mode développement  
npm run dev  
```

Le serveur sera disponible sur :  
👉 **http://localhost:3000**  

---

## **Documentation API avec Swagger**  
Accédez à l'interface Swagger pour tester les endpoints :  
🔗 **http://localhost:3000/api-docs**  

### **Endpoints disponibles**  

### **🔐 Authentification**  
| Méthode | Endpoint | Description |  
|---------|----------|-------------|  
| `POST` | `/auth/register` | Crée un nouvel utilisateur |  
| `POST` | `/auth/login` | Connecte un utilisateur (renvoie un cookie JWT) |  
| `GET` | `/auth/logout` | Déconnecte l'utilisateur |  

### **🧪 Potions**  
| Méthode | Endpoint | Description |  
|---------|----------|-------------|  
| `GET` | `/potions` | Liste toutes les potions |  
| `GET` | `/potions/:id` | Récupère une potion par ID |  
| `POST` | `/potions` | Crée une nouvelle potion (🔒 Auth) |  
| `PUT` | `/potions/:id` | Met à jour une potion (🔒 Auth) |  
| `DELETE` | `/potions/:id` | Supprime une potion (🔒 Auth) |  

### **📊 Analytics**  
| Méthode | Endpoint | Description |  
|---------|----------|-------------|  
| `GET` | `/analytics/distinct-categories` | Nombre de catégories uniques |  
| `GET` | `/analytics/average-score-by-vendor` | Score moyen par vendeur |  
| `GET` | `/analytics/strength-flavor-ratio` | Ratio force/parfum |  

---

## **Tests**  
Pour lancer les tests (avec Jest) :  

```bash
npm test  
```

---

## **Structure du projet**  
```
📁 mongodb-nodejs/
├── 📄 server.js          # Point d'entrée + Swagger
├── 📄 router.js          # Routes des potions
├── 📄 auth.routes.js     # Routes d'authentification
├── 📄 potion.model.js    # Modèle Mongoose (Potion)
├── 📄 user.model.js      # Modèle Mongoose (User)
├── 📄 auth.middleware.js # Middleware JWT

```

---

## **Exemples de requêtes**  

### **Créer une potion (authentification requise)**  
```bash
curl -X POST http://localhost:3000/potions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT" \
  -d '{"name":"Potion de vie", "price":50, "vendor":"1234567890"}'
```

### **Se connecter**  
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser", "password":"test123"}'
```

---


🚀 **Prêt à lancer l'API ?**  
```bash
npm start
```  

Accédez à **http://localhost:3000/api-docs** pour explorer l'API ! 🎉