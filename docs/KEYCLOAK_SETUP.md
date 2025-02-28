# Configuration de Keycloak pour Elk

Ce document explique comment configurer Keycloak pour l'authentification dans Elk.

## Prérequis

- Un serveur Keycloak fonctionnel
- Accès administrateur à Keycloak

## Étapes de configuration

### 1. Créer un nouveau client dans Keycloak

1. Connectez-vous à la console d'administration Keycloak
2. Sélectionnez votre realm (ou créez-en un nouveau)
3. Allez dans "Clients" et cliquez sur "Créer"
4. Remplissez les informations suivantes :
   - Client ID : `elk` (ou un autre nom de votre choix)
   - Client Protocol : `openid-connect`
   - Root URL : URL de votre application Elk (ex: `https://votre-app-elk.com`)

### 2. Configurer le client

1. Dans les paramètres du client, configurez :
   - Access Type : `confidential`
   - Valid Redirect URIs : `https://votre-app-elk.com/api/keycloak/oauth/*`
   - Web Origins : `+` (pour permettre toutes les origines, ou spécifiez votre domaine)

2. Sauvegardez les modifications

3. Allez dans l'onglet "Credentials" et notez le "Secret" généré

### 3. Configurer les variables d'environnement dans Elk

Créez ou modifiez votre fichier `.env` à la racine du projet Elk avec les informations suivantes :

```
USE_KEYCLOAK=true
KEYCLOAK_SERVER=votre-serveur-keycloak.com
KEYCLOAK_REALM=votre-realm
KEYCLOAK_CLIENT_ID=elk
KEYCLOAK_CLIENT_SECRET=votre-client-secret
```

### 4. Redémarrer l'application Elk

Redémarrez votre application Elk pour prendre en compte les nouvelles configurations.

## Fonctionnement

Avec cette configuration, l'application Elk :

1. Affichera un bouton de connexion Keycloak au lieu du champ de saisie de serveur Mastodon
2. Redirigera l'utilisateur vers Keycloak pour l'authentification
3. Récupérera le token après authentification réussie
4. Utilisera ce token pour les requêtes API

## Dépannage

Si vous rencontrez des problèmes :

1. Vérifiez les logs de l'application Elk
2. Vérifiez les logs de Keycloak
3. Assurez-vous que les URLs de redirection sont correctement configurées
4. Vérifiez que le client secret est correct 