#include "test_handler.h"

#include <cstdlib>

#include <iostream>

using json = nlohmann::json;

namespace
{
const std::string whitespaceChars = " \n\r\t";
std::string TrimTrailingWhitespace(std::string s)
{
	size_t end = s.find_last_not_of(whitespaceChars);
	return (end == std::string::npos) ? "" : s.substr(0, end + 1);
}
} // namespace

json RunTests(json tests, std::string token, Language lang)
{
	std::string exePath = "/tmp/" + token + ((lang == Language::kC) ? ".c" : ".py");
	std::string lastInput, lastExpected, lastOutput;
	bool success = true;
	std::string err;
	std::string tmp_out = "/tmp/" + token + ".out";

	if (tests.empty()) {
		std::string runCmd;
		runCmd = " \"" + exePath + "\" > \"" + tmp_out + "\" 2>&1";
		if (lang == Language::kPython) {
			runCmd = "python3" + runCmd;
		}
		int ret = std::system(runCmd.c_str());
		lastInput = "";
		lastExpected = "";
		lastOutput = ReadFile(tmp_out);
		if (ret != 0) {
			success = false;
			err = "Runtime Error";
		}
	} else {
		for (auto &t : tests) {
			std::string input = TrimTrailingWhitespace(t.value("input", ""));
			std::string expected = TrimTrailingWhitespace(t.value("expected", ""));
			std::string tmpIn = "/tmp/" + token + ".in";
			WriteFile(tmpIn, input);
			std::string runCmd;

			if (lang == Language::kPython) {
				runCmd = "timeout 5s python3 \"" + exePath + "\" < \"" + tmpIn + "\" > \"" + tmp_out + "\" 2>&1";
			} else {
				runCmd = "timeout 5s \"" + exePath + "\" < \"" + tmpIn + "\" > \"" + tmp_out + "\" 2>&1";
			}
			int ret = std::system(runCmd.c_str());
			std::string output = ReadFile(tmp_out);
			lastInput = input;
			lastExpected = expected;
			lastOutput = output;
			if (ret != 0) {
				success = false;
				err = "Runtime Error";
				break;
			}
			if (output != expected) {
				success = false;
				err = "Output is wrong";
				break;
			}
			if (WEXITSTATUS(ret) == 124) {
				err = "Process timed out!";
			}
		}
	}
	return { { "success", success },
		 { "input", lastInput },
		 { "expected", lastExpected },
		 { "output", lastOutput },
		 { "error", success ? json(nullptr) : json(err) } };
}
