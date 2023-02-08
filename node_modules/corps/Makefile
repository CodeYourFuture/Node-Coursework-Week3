LSC_OPTS = -b --const

%.js: %.ls
	node_modules/.bin/lsc $(LSC_OPTS) -c "$<"

all: index.js

test: all test.ls
	node_modules/.bin/mocha -r LiveScript -u exports test.ls

.PHONY: test
