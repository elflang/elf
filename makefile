.PHONY: all rebuild clean test

ELF_LUA  ?= luajit
ELF_NODE ?= node
ELF_HOST ?= $(ELF_LUA)

ELF := ELF_HOST="$(ELF_HOST)" bin/elf

MODS := l.x	\
	reader.x	\
	compiler.x	\
	system.x \
	elf-main.x

all: $(MODS:.x=.js) $(MODS:.x=.lua)

rebuild:
	@make clean
	@make -B
	@make -B
	@make -B

clean:
	# @git checkout *.js
	# @git checkout *.lua
	@rm -f obj/*

%.js : %.elf
	@echo $@
	@$(ELF) -c $< -o $@ -t js

%.lua : %.elf
	@echo $@
	@$(ELF) -c $< -o $@ -t lua

test: all elf-test.js elf-test.lua
	@echo js:
	@ELF_HOST=$(ELF_NODE) bin/elf elf-test.js -e '(run)'
	@echo lua:
	@ELF_HOST=$(ELF_LUA) bin/elf elf-test.lua -e '(run)'
