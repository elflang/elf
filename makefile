.PHONY: all rebuild clean test

ELF_LUA  ?= luajit
ELF_NODE ?= node
ELF_HOST ?= $(ELF_LUA)

ELF := ELF_HOST="$(ELF_HOST)" bin/elf

MODS := bin/l.x	\
	bin/reader.x	\
	bin/compiler.x	\
	bin/system.x \
	bin/elf-main.x

all: $(MODS:.x=.js) $(MODS:.x=.lua)

rebuild:
	@make clean
	@make -B
	@make -B
	@make -B

clean:
	@git checkout bin/*.js
	@git checkout bin/*.lua
	@rm -f obj/*

obj/%.js : %.elf
	@echo "  $@"
	@$(ELF) -c $< -o $@ -t js

obj/%.lua : %.elf
	@echo "  $@"
	@$(ELF) -c $< -o $@ -t lua

bin/%.js : %.elf
	@echo $@
	@$(ELF) -c $< -o $@ -t js

bin/%.lua : %.elf
	@echo $@
	@$(ELF) -c $< -o $@ -t lua

test: all obj/test.js obj/test.lua
	@echo js:
	@ELF_HOST=$(ELF_NODE) bin/elf obj/test.js -e '(run)'
	@echo lua:
	@ELF_HOST=$(ELF_LUA) bin/elf obj/test.lua -e '(run)'
