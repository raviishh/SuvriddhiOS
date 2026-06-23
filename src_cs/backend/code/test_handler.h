#ifndef CODE_TEST_HANDLER_H
#define CODE_TEST_HANDLER_H

#include "../helpers/common.h"

using json = nlohmann::json;

enum class Language : uint8_t { kPython, kC };

json RunTests(json tests, std::string token, Language lang);

#endif // CODE_TEST_HANDLER_H
