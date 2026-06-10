#include "run_handler.h"
#include "helpers/utils.h"
#include "libs/json.hpp"
#include <fstream>
#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include "constants.h"
#include "test_runner.h"

int HandleRun(struct mg_connection *conn, void *)
{
	std::vector<char> buf(8192);
	int32_t bytes_read = read(conn, buf);

	if (bytes_read < 0) {
		send_response(conn, error_res.dump());
		return 400;
	}

	std::string body(buf.data(), bytes_read);
	json req = json::parse(body);
	std::string token = req["token"];
	std::string exePath = "/tmp/" + token;
	if (!file_exists(exePath)) {
		json res = { { "success", false },
			     { "input", nullptr },
			     { "expected", nullptr },
			     { "output", nullptr },
			     { "error", "Code is not compiled" } };
		std::string out = res.dump();
		send_response(conn, out);
		return 200;
	}

	TestReturnObject ret_obj = RunTests(exePath, token, req, Language::kC);
	std::pair<bool, std::string> error = GetErrorMessageAndSuccess(ret_obj.ret);
	json res = { { "success", error.first },
		     { "input", ret_obj.lastInput },
		     { "expected", ret_obj.lastExpected },
		     { "output", ret_obj.lastOutput },
		     { "error", error.first ? json(nullptr) : json(error.second) } };
	send_response(conn, res.dump());
	return 200;
}
