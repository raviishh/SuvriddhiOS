CXX := g++
CC := gcc

UNAME := $(shell uname)

CXXFLAGS := -std=c++17 -Wall -Wextra -Werror
TARGET := server

JOBS := 8
BUILD := build

SRCS := \
	main.cpp \
	constants.cpp \
	compile_handler.cpp \
	run_handler.cpp \
	helpers/utils.cpp \
	code_handler.cpp \
	python_handler.cpp \
	test_runner.cpp

ifeq ($(UNAME), Darwin)
	OPENSSL_PREFIX := $(shell brew --prefix openssl)
	CIVETWEB_CFLAGS := -Ilibs/civetweb/include -DOPENSSL_API_1_1 -I$(OPENSSL_PREFIX)/include
	CIVETWEB_LIBS := -L$(OPENSSL_PREFIX)/lib -lssl -lcrypto
	OBJS := $(addprefix $(BUILD)/, $(SRCS:.cpp=.o) civetweb.o)
else
	OBJS := $(addprefix $(BUILD)/, $(SRCS:.cpp=.o))
	CIVETWEB_LIBS := -lcivetweb
endif

.PHONY: all run clean format update

all:
	mkdir -p $(BUILD)/helpers
	$(MAKE) -j$(JOBS) $(BUILD)/$(TARGET)

update:
ifeq ($(UNAME), Darwin)
	@echo "Mac: using bundled civetweb source"
else
	sudo apt-get install -y libcivetweb-dev
endif

$(BUILD)/$(TARGET): $(OBJS)
	$(CXX) $(OBJS) $(CIVETWEB_LIBS) -o $@

$(BUILD)/%.o: %.cpp | $(BUILD)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(BUILD)/helpers/%.o: helpers/%.cpp | $(BUILD)/helpers
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(BUILD)/helpers: | $(BUILD)
	mkdir -p $(BUILD)/helpers

$(BUILD)/civetweb.o: libs/civetweb/src/civetweb.c | $(BUILD)
	$(CC) $(CIVETWEB_CFLAGS) -c $< -o $@

$(BUILD):
	mkdir -p $(BUILD)

run: $(BUILD)/$(TARGET)
	./$(BUILD)/$(TARGET)

format:
	find . \( -name "*.cpp" -o -name "*.h" \) ! -path "./libs/civetweb/*" | xargs clang-format -i
	find . \( -name "*.cpp" -o -name "*.h" \) | xargs python3 -c \
		"import sys; [open(f,'a').write('\n') if open(f,'rb').read()[-1:] != b'\n' else None for f in sys.stdin.read().split()]"

clean:
	rm -rf $(BUILD)
