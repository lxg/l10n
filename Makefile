BIN = ./node_modules/.bin

install:
	@npm install

release-patch:
	@$(call release,patch)

release-minor:
	@$(call release,minor)

release-major:
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish --access public

define release
	npm version $(1) -m 'release v%s'
endef
