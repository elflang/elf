.PHONY: all clean test

LUMEN_LUA  ?= luajit
LUMEN_NODE ?= node
LUMEN_HOST ?= $(LUMEN_LUA)

LUMEN := LUMEN_HOST="$(LUMEN_HOST)" bin/lumen

OBJS :=	obj/runtime.o	\
	obj/macros.o	\
	obj/main.o

MODS := bin/lumen.x	\
	bin/reader.x	\
	bin/compiler.x	\
	bin/system.x

all: $(MODS:.x=.js) $(MODS:.x=.lua)

clean:
	@git checkout bin/*.js
	@git checkout bin/*.lua
	@rm -f obj/*

bin/lumen.js: $(OBJS:.o=.js)
	@echo $@
	@cat $^ > $@.tmp
	@mv $@.tmp $@

bin/lumen.lua: $(OBJS:.o=.lua)
	@echo $@
	@cat $^ > $@.tmp
	@mv $@.tmp $@

obj/%.js : %.elf
	@echo "  $@"
	@$(LUMEN) -c $< -o $@ -t js

obj/%.lua : %.elf
	@echo "  $@"
	@$(LUMEN) -c $< -o $@ -t lua

bin/%.js : %.elf
	@echo $@
	@$(LUMEN) -c $< -o $@ -t js

bin/%.lua : %.elf
	@echo $@
	@$(LUMEN) -c $< -o $@ -t lua

test: all obj/test.js obj/test.lua
	@echo js:
	@LUMEN_HOST=$(LUMEN_NODE) bin/lumen obj/test.js -e '(run)'
	@echo lua:
	@LUMEN_HOST=$(LUMEN_LUA) bin/lumen obj/test.lua -e '(run)'
