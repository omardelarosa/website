.PHONY: build serve watch

build:
	cd packages/obs-static-site && npm install && npm run build

serve: build
	cd packages/obs-static-site && npm run serve

watch:
	cd packages/obs-static-site && npm install && npm run watch
