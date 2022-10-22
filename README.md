# pruta

A simple web interface for Docker to expose Docker status.

## Usage

Mount Docker socket into container
```
docker run --volume /var/run/docker.sock:/var/run/docker.sock -p "8080:8080" -d bendik.dev/pruta:0.0.1
```

Connect to Docker TCP socket
```
docker run --env DOCKER_SOCKET=http://localhost:2375 -p "8080:8080" -d bendik.dev/pruta:0.0.1
```

## Development

### Backend

The backend connects to Docker through `/var/run/docker.sock` by default. If this is not available, you need to tell it where it is by setting the env var `DOCKER_SOCKET`. Supports both UNIX sockets and TCP sockets.

`./gradlew run`

### Frontend

`npm run dev`

Open browser at http://localhost:5173

## Create TCP socket

```
socat TCP-LISTEN:2375,reuseaddr,fork,bind=127.0.0.1 UNIX-CLIENT:/var/run/docker.sock
```

```
$ DOCKER_SOCKET=tcp://localhost:2374 ./gradlew run
```