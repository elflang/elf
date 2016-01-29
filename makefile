.PHONY: all rebuild clean test

ELF_LUA  ?= luajit
ELF_NODE ?= node
ELF_HOST ?= $(ELF_LUA)

ELF := ELF_HOST="$(ELF_HOST)" bin/elf

all: *.js *.lua

rebuild:
	@make clean
	@make -B
	@make -B
	@make -B

clean:
	@git checkout *.js *.lua

%.js : %.elf
	@echo $@
	@$(ELF) -c $< -o $@ -t js

%.lua : %.elf
	@echo $@
	@$(ELF) -c $< -o $@ -t lua

test: all elf-test.js elf-test.lua
	@echo js:
	@ELF_HOST=$(ELF_NODE) bin/elf elf-test.js -e 'nil'
	@echo lua:
	@ELF_HOST=$(ELF_LUA) bin/elf elf-test.lua -e 'nil'
