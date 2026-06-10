#include <string>
#include "libs/json.hpp"
#include "helpers/utils.h"
#include "test_runner.h"

TestReturnObject RunTests(std::string srcPath, std::string token, json req, Language lang)
{
	json tests = req.value("tests", json::array());
	std::string lastInput, lastExpected, lastOutput;
	std::string err;

	if (tests.empty()) {
		std::string tmpOut = "/tmp/" + token + ".out";
		std::string runCmd;
		switch (lang) {
		case Language::kPython:
			runCmd = "python3 " + srcPath + " > " + tmpOut + " 2>&1";
		case Language::kC:
			runCmd = srcPath + " > " + tmpOut + " 2>&1";
		}

		int ret = std::system(runCmd.c_str());
		lastInput = "";
		lastExpected = "";
		lastOutput = read_file(tmpOut);

		if (ret != 0) {
			return { TestReturns::kRuntimeError, lastInput, lastExpected, lastOutput };
		}
	} else {
		for (auto &t : tests) {
			std::string input = t.value("input", "");
			std::string expected = t.value("expected", "");

			std::string tmpIn = "/tmp/" + token + ".in";
			std::string tmpOut = "/tmp/" + token + ".out";
			write_file(tmpIn, input);
			// timeout after 5s.
			std::string runCmd = "timeout 5s " + srcPath + " < " + tmpIn + " > " + tmpOut + " 2>&1";
			int ret = std::system(runCmd.c_str());
			std::string output = read_file(tmpOut);
			lastInput = input;
			lastExpected = expected;
			lastOutput = output;
			if (ret != 0) {
				return { TestReturns::kRuntimeError, lastInput, lastExpected, lastOutput };
			}
			if (output != expected) {
				return { TestReturns::kIncorrect, lastInput, lastExpected, lastOutput };
			}
			if (WEXITSTATUS(ret) == 124) {
				return { TestReturns::kTimeout, lastInput, lastExpected, "" };
			}
		}
	}
	return { TestReturns::kSuccess, lastInput, lastExpected, lastOutput };
}

std::pair<bool, std::string> GetErrorMessageAndSuccess(TestReturns ret)
{
	bool success = ret == TestReturns::kSuccess;
	std::string err;
	switch (ret) {
	case TestReturns::kSuccess:
		err = "";
		break;
	case TestReturns::kRuntimeError:
		err = "Runtime Error!";
		break;
	case TestReturns::kIncorrect:
		err = "Output is wrong!";
		break;
	case TestReturns::kTimeout:
		err = "Process timed out!";
		break;
	}
	return { success, err };
}
