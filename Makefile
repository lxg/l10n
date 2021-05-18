release-patch:
	@$(call release,patch)

release-minor:
	@$(call release,minor)

release-major:
	@$(call release,major)

define release
	test -z "$(shell git status --short)" && npm run build
	npm version $(1) -m 'release v%s'
	git push --tags origin HEAD:master
	npm publish --access public
endef
