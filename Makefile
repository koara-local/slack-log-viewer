GOSRCDIR=.

.PHONY: all
	all:

all: $(GOSRCDIR)
	go get -d -v $(GOSRCDIR)
	go build -v $(GOSRCDIR)

clean:
	go clean
