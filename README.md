<a href="https://www.buymeacoffee.com/hidetran"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=hidetran&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

# Introduction
This is sample project for everyone who want to dockerize a NodeJS application and publish its images to public registry(Docker Hub) or Cloud Registry (Azure ACR).

# Prerequisites
- Node 16+
- Docker
- A Docker Hub credential (for publishing to Docker Hub)
- An Azure Registry credential (for publishing to Azure ACR)
- A mongoDB database up and running (you can use both of Mongo Atlas or MongoDB for docker instances)

# Run project locally
You can start running this simple NodeJS application by cloning it to your local machine with Node 16+ installed then install dependencies and start project

```bash
    git clone https://github.com/epiHATR/dockerize-nodejs-app
    cd dockerize-nodejs-app
    npm install
    node index.js
```
You may need to update ```config/config.json``` file reflect to your mongoDB connection string.

Now open your web browser and type ```http://localhost:8000/ping```, you will see it returns ```"PONG"``` response.

# Dockerize application
### 1. build docker image
Make sure you are in the ```dockerize-nodejs-app``` directory, let's type following command to build docker image
```bash
    docker build -f ./src/Dockerfile -t dockerize-nodejs-app:local ./src
```

### 2. run  docker image locally
You can now run this newly built image by
```bash
    docker run -d -p 8000:8000 dockerize-nodejs-app:local
```
Now open your web browser and type ```http://localhost:8000/ping```, you will see it return ```"PONG"``` response.

You can also change the expose port of docker instance by specify another PORT for -p flag like
```bash
    docker run -d -p 9000:8000 dockerize-nodejs-app:local
```

### 3. publish docker image to registry
You can publish your docker images to the DockerHub for public registry or event Azure Container Registry (ACR) as a private registry.

Login to DockerHub
```bash
    docker login --username YOUR_DOCKER_USERNAME --password YOUR_DOCKER_PASSWORD
```

Or login to Azure ACR
```bash
    docker login YOUR_ACR_REGISTRy.azurecr.io --username YOUR_ACR_USERNAME -p YOUR_ACR_PASSWORD
```

Then tag your newly built image by
```bash
    # tagging image to DockerHub
    docker tag dockerize-nodejs-app:local YOUR_DOCKER_USERNAME/dockerize-nodejs-app:latest

    # or tagging image to Azure ACR
    docker tag YOUR_ACR_REGISTRy.azurecr.io/YOUR_REPOSITORY/dockerize-nodejs-app:latest
    
```

Then push by
```bash
    # to DockerHub
    docker push YOUR_DOCKER_USERNAME/dockerize-nodejs-app:latest

    #or to Azure ACR
    docker push YOUR_ACR_REGISTRy.azurecr.io/YOUR_REPOSITORY/dockerize-nodejs-app:latest
```

### 4. pull and run your docker images to another environments
After published to DockerHub or Azure Container Registry, you can start pulling and running it on another environment (VM, other machine, K8S, ...) by

##### run it in docker
before running this docker images, you need to specify your configuration file at a ```config``` folder, then mount it while execute ```docker run``` commands
Make sure you have a custom network which allow your nodejs app connects to mongoDB container by

```bash
    docker network create nodejs_network
    docker network connect nodejs_network [your docker container]
```
then you can run your nodeJS with your config file and attach it to the ```nodejs_network```
```bash
    docker run -d -p 8000:8000 --mount type=bind,source=/path/to/your/config,target=/usr/src/app/config --network nodejs_network --platform linux/amd64 YOUR_DOCKER_USERNAME/dockerize-nodejs-app:latest
```

#### docker-compose multiple apps
You can start muliple (nodejs and mongoDB in the same stage by creating ```docker-compose.yml``` file ) by
```yml
version: '3'
services:
  # your mongoDB container specification
  mongodb:
    container_name: mongo_db
    image: mongo:4.4.4-bionic
    restart: always
    ports:
      - 27027:27017
    networks:
      - nodejs_network

  # your NodeJS app specification
  frontend:
    container_name: nodejs_app
    image: YOUR_DOCKER_USERNAME/dockerize-nodejs-app:latest
    ports:
      - 8000:8000
    volume:
      - /path/to/your/config:/usr/src/app/config
    networks:
      - nodejs_network
    depends_on:
      - mongodb
networks:
  nodejs_network:
    driver: bridge

```