dev:
	@docker-compose -p kittea -f docker/docker-compose.yaml up --build

start:
	@docker run --rm -it cr.tale.me/kittea/bot

publish:
	@docker build -t cr.tale.me/kittea/bot -f docker/Dockerfile.prod .
	@docker push cr.tale.me/kittea/bot

build:
	@buildah bud -t tale.io/state/kittea-bot -f docker/Dockerfile.prod .
