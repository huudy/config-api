# REST API Config

This is a simple rest api allowing to fetch config information based on the client and version provided and store it in the mongo db.

The entire application is splitted into two files `app.ts` where the application initiation resides and `server.ts` where the actual server is started up

### ADD CONFIG FILES :<br />

![envv](https://user-images.githubusercontent.com/15052640/99905187-b0bd9900-2ccf-11eb-8e2d-f91a8b058998.png)<br />
content:

- **dev.env:**<br />
  `PORT=3000`<br />
  `MONGODB_URI=mongodb://127.0.0.1:27017/config-api`<br />
- **docker.env:**<br />
  `PORT=3000`<br />
  `MONGODB_URI=mongodb://127.0.0.1:27017/config-api-docker`<br />
- **test.env:**<br />
  `PORT=3000`<br />
  `MONGODB_URI=mongodb://127.0.0.1:27017/config-api-test`<br />
- **log4j.json:**<br />

  {
  "appenders": {
  "access": {
  "type": "dateFile",
  "filename": "log/access.log",
  "pattern": "-yyyy-MM-dd",
  "category": "http"
  },
  "app": {
  "type": "file",
  "filename": "log/app.log",
  "maxLogSize": 10485760,
  "numBackups": 3
  },
  "errorFile": {
  "type": "file",
  "filename": "log/errors.log"
  },
  "errors": {
  "type": "logLevelFilter",
  "level": "ERROR",
  "appender": "errorFile"
  }
  },
  "categories": {
  "default": {
  "appenders": ["app", "errors"],
  "level": "DEBUG"
  },
  "http": {
  "appenders": ["access"],
  "level": "DEBUG"
  }
  }
  }

## Install

    npm install

<!--  -->

## Run the app

    npm run dev

## Run the tests

    npm run test

## Run with docker

    docker-compose up --build

## Build docker image

    docker build -t <TAG_NAME> .

## Run docker image

    docker run -p80:3000 <TAG_NAME>

# REST API

The REST API to the config app is described below.

## Create new config

### Request

`POST /config`

    {
        "version": 155,
        "client":"ios",
        "key":"font_size",
        "value":"26"
    }

### Response

    {
        "_id": "5fb9f9cb064511729243232f",
        "version": 155,
        "client": "ios",
        "key": "font_size",
        "value": "26",
        "createdAt": "2020-11-22T05:40:27.253Z",
        "updatedAt": "2020-11-22T05:40:27.253Z",
        "__v": 0
    }

## Modify existing config

### Request

`PATCH /config`

    {
        "version": 155,
        "client":"ios",
        "key":"font_size",
        "value":"26"
    }

### Response

    {}

## Get configs for client

### Request

`GET /config/:client`

### Response

    [
        {
            "font_size": "26",
            "version": 155
        }
    ]

## Get configs for specific version

### Request

`GET /config/:client/:version`

### Response

    {
        "font_size": "26"
    }

## Update existing config

### Request

`PATCH /config/:client/:version`

    {
        "key":"font_size",
        "value":"30"
    }

### Response

    {
        "_id": "5fb9f59ccbe0ab60b8a96cbb",
        "version": 155,
        "client": "ios",
        "key": "font_size",
        "value": "30",
        "createdAt": "2020-11-22T05:22:36.409Z",
        "updatedAt": "2020-11-22T05:45:20.900Z",
        "__v": 0
    }

## Replace an existing config

### Request

`PUT /config/:client/:version`

    {
        "key":"margin",
        "value":"20"
    }

### Response

    {
        "_id": "5fb9ffd001b9220414775243",
        "client": "ios",
        "version": 1,
        "key": "margin",
        "value": "20",
        "__v": 0,
        "updatedAt": "2020-11-22T06:59:13.350Z",
        "createdAt": "2020-11-22T06:59:13.350Z"
    }

## Delete an existing config

### Request

DELETE /config/:client/:version

    {
        "version": 155,
        "client":"ios",
        "key":"font_size",
        "value":"32"
    }

### Response

    {}
