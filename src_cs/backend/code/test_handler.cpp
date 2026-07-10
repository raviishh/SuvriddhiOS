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

    std::string lastInput;
    std::string lastExpected;
    std::string lastOutput;

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

            if (lang == Language::kPython)
            {
                runCmd =
                    "timeout 5s python3 \"" + exePath +
                    "\" < \"" + tmpIn +
                    "\" > \"" + tmp_out + "\" 2>&1";
            }
            else
            {
                runCmd =
                    "timeout 5s \"" + exePath +
                    "\" < \"" + tmpIn +
                    "\" > \"" + tmp_out + "\" 2>&1";
            }

            int ret = std::system(runCmd.c_str());

            if (WEXITSTATUS(ret) == 124)
            {
                success = false;
                err = "Process timed out!";
                break;
            }

            if (ret != 0)
            {
                success = false;
                err = "Runtime Error";
                break;
            }

            std::string output = ReadFile(tmp_out);
			std::string type = tests["type"];
            lastOutput = output;
            if (type == "output_exact")
            {
                while (!output.empty() &&
                       (output.back() == '\n' ||
                        output.back() == '\r'))
                {
                    output.pop_back();
                }

                while (!expected.empty() &&
                       (expected.back() == '\n' ||
                        expected.back() == '\r'))
                {
                    expected.pop_back();
                }

                if (output != expected)
                {
                    success = false;
                    err = "Output is wrong";
                    break;
                }
            }

            //
            // OUTPUT CONTAINS
            //
            else if (type == "output_contains")
            {
                if (output.find(expected) == std::string::npos)
                {
                    success = false;
                    err = "Expected text not found";
                    break;
                }
            }

            //
            // CODE CONTAINS
            //
            else if (type == "code_contains")
            {
                std::string code = ReadFile(exePath);

                if (code.find(expected) == std::string::npos)
                {
                    success = false;
                    err = "Required code was not found";
                    break;
                }
            }

            //
            // CODE NOT CONTAINS
            //
            else if (type == "code_not_contains")
            {
                std::string code = ReadFile(exePath);

                if (code.find(expected) != std::string::npos)
                {
                    success = false;
                    err = "Forbidden code was found";
                    break;
                }
            }

            else
            {
                success = false;
                err = "Unknown test type: " + type;
                break;
            }
        }
    }

    return {
        {"success", success},
        {"input", lastInput},
        {"expected", lastExpected},
        {"output", lastOutput},
        {"error", success ? json(nullptr) : json(err)}
    };
}