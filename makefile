.PHONY: all rebuild clean test release

ELF_LUA  ?= luajit
ELF_NODE ?= node
ELF_HOST ?= $(ELF_LUA)

ELF := ELF_HOST="$(ELF_HOST)" bin/elf

all: *.js *.lua

rebuild:
	@make clean
	@echo ""
	@make -B
	@echo ""
	@make -B
	@echo ""
	@make -B test

clean:
	@sh -c 'for x in *.js *.lua; do git checkout $$x; done || exit 0'

%.js : %.e
	@echo $@
	@$(ELF) -c $< -o $@ -t js

%.lua : %.e
	@echo $@
	@$(ELF) -c $< -o $@ -t lua

test: all test.js test.lua
	@echo js:
	@ELF_HOST=$(ELF_NODE) bin/elf test.js -e 'nil'
	@echo lua:
	@ELF_HOST=$(ELF_LUA) bin/elf test.lua -e 'nil'

release:
	@rm -f elf-0.tar.gz elf-0.zip
	@mkdir -p elf/bin
	@cp bin/elf-update elf/bin/
	@tar cvzf elf-0.tar.gz elf/
	@zip elf elf
	@mv elf.zip elf-0.zip
	@shasum -a 256 elf-0.tar.gz
	@rm elf/bin/elf-update
	@rmdir elf/bin
	@rmdir elf
	@ls -1 elf-0.*
