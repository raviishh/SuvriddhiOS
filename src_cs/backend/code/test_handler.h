#pragma once

#include "json.hpp"
#include <string>

using json = nlohmann::json;

enum class Language : uint8_t {
    kPython, kC
};

json RunTests(json tests, std::string token, Language lang);