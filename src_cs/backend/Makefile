CXX      := g++
CXXFLAGS := -std=c++17 -Wall -Wextra -O2 -I. -Icode -Ihelpers -ISettings
LDFLAGS  := -lcivetweb
TARGET   := server
BUILD_DIR := build

EXTRA_CXXFLAGS :=
EXTRA_LDFLAGS  :=
CXXFLAGS += $(EXTRA_CXXFLAGS)
LDFLAGS  += $(EXTRA_LDFLAGS)

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
    CXXFLAGS += -I/usr/local/include
    LDFLAGS  += -L/usr/local/lib
endif

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
    CXXFLAGS += -I/usr/local/include
    LDFLAGS  += -L/usr/local/lib
endif

SRCS     := main.cpp \
            $(wildcard code/*.cpp) \
            $(wildcard helpers/*.cpp) \
            $(wildcard settings/*.cpp)
OBJS     := $(patsubst %.cpp, $(BUILD_DIR)/%.o, $(SRCS))

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $(TARGET) $(LDFLAGS)

$(BUILD_DIR)/%.o: %.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

format:
	clang-format -i main.cpp code/* helpers/* settings/*

run: $(TARGET)
	./$(TARGET)

clean:
	rm -rf $(BUILD_DIR) $(TARGET)

.PHONY: all format run clean
