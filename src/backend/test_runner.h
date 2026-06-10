#ifndef TEST_RUNNER_H
#define TEST_RUNNER_H

#include <string>
#include "libs/json.hpp"
#include "constants.h"

enum class TestReturns : uint8_t { kSuccess, kRuntimeError, kTimeout, kIncorrect };
enum class Language : uint8_t { kC, kPython };

struct TestReturnObject {
	TestReturns ret;
	std::string lastInput;
	std::string lastExpected;
	std::string lastOutput;
};

TestReturnObject RunTests(std::string srcPath, std::string token, json req, Language lang);
std::pair<bool, std::string> GetErrorMessageAndSuccess(TestReturns ret);

#endif // TEST_RUNNER_H