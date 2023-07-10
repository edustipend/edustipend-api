# edustipend-api

##### Things to note about Edustipend-api:

- when branching out to a new branch, we make use of a `feature/name of the feature being worked on` naming convection

```
$ git checkout feature/admin_dashboard

```

- Always migrate model and data to db before starting the app

- To migrate `only the model` to the db

```
$ npm run migrate

```

## After cloning repo

checkout of the `main branch` to the `development branch`.

```
 $ git checkout development
```

when in `develop branch` , install the node moduls

```
$ npm install
```

Then create a branch with the `name of the feature` you are working on

```
$ git checkout -b feature/push_notification

```

## Before push

Always run

- install prettier globally from [https://prettier.io/docs/en/install.html]

```
$ npm run format
```

## Migrating model and data into the db

To migrate modes and schema to db

```
 $ npm run migrate
```

next you start the app

```
$ npm start
```

Repository powering the backend services for Edustipend
