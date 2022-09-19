# Using Docker

Prerequisites: 
- [Docker](https://docs.docker.com/engine/install/)
- [Git](https://git-scm.com/)
- Bash Shell: available in macOS by default and the vast majority of Linux distros

***Note**: If you are using a Windows environment, you can use [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/) or a Bash emulator like "Git BASH" (which its included in [Git for Windows](https://gitforwindows.org/)). If you use WSL take into account that you should [configure Docker to use the WSL 2 backend](https://docs.docker.com/desktop/windows/wsl/).*


> Start: run the script that sets the stack up and that's it (takes some minutes to finish):

```bash
./docker/setup.sh start
```

> Re-deploy your contracts (container must be up and running):

```bash
./docker/setup.sh deploy
```

> Running the front-end on a different port (eg. 8080):

```bash
DOCKER_IMAGE=$(docker ps --filter name=SCAFFOLD_ETH -q)
[ -z "$DOCKER_IMAGE" ] || docker rm -f SCAFFOLD_ETH

docker run \
  --name SCAFFOLD_ETH \
  -v `pwd`:/opt/scaffold-eth \
  -w /opt/scaffold-eth \
  -e PORT=8080 \
  -p 8080:8080 \
  -p 8545:8545 \
  -dt node:16

./docker/setup.sh start
```

> Running the container in interactive mode (must run each tool manually):

```bash
DOCKER_IMAGE=$(docker ps --filter name=SCAFFOLD_ETH -q)
[ -z "$DOCKER_IMAGE" ] || docker rm -f SCAFFOLD_ETH

docker run \
  --name SCAFFOLD_ETH \
  -v `pwd`:/opt/scaffold-eth \
  -w /opt/scaffold-eth \
  -p 3000:3000 \
  -p 8545:8545 \
  --entrypoint /bin/bash \
  -ti node:16
```

