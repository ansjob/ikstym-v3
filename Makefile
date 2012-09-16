
all: main.js

main.js : app.js
	tamejs app.js > main.js

run: main.js
	@node main
