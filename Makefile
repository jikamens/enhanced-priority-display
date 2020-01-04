all: EnhancedPriorityDisplay.xpi

CMD=find . \( \( -name '.??*' -o -name src -o -name send-later \) -prune \) -o \
    \! -name '*~' \! -name .gitmodules \! -name .ignore-ids \
    \! -name '.\#*' \! -name '*,v' \! -name Makefile \! -name '*.xpi' \
    \! -name '\#*' \! -name '*.pl' -type f -print
FILES=$(shell $(CMD))

EnhancedPriorityDisplay.xpi: $(FILES) check-locales.pl
	./send-later/utils/make-kickstarter.sh
	./check-locales.pl
	./fix-addon-ids.pl --check
	rm -f $@.tmp
	zip -r $@.tmp $(FILES)
	mv $@.tmp $@

translatable: EnhancedPriorityDisplay-translatable.xpi
.PHONY: translatable

EnhancedPriorityDisplay-translatable.xpi: $(FILES)
	./fix-addon-ids.pl --check
	rm -f $@.tmp
	zip -r $@.tmp $(FILES)
	mv $@.tmp $@

clean: ; -rm -f *.xpi
