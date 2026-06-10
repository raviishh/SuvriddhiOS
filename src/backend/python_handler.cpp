#include "python_handler.h"
#include "helpers/utils.h"
#include "libs/json.hpp"
#include <fstream>
#include <iostream>
#include <cstdlib>
#include "constants.h"
#include "test_runner.h"

int HandlePython(struct mg_connection *conn, void *)
{
	std::vector<char> buf(8192);
	int32_t bytes_read = read(conn, buf);

	if (bytes_read < 0) {
		send_response(conn, error_res.dump());
		return 400;
	}

	std::string body(buf.data(), bytes_read);
	json req = json::parse(body);
	std::string code = req["code"];
	json tests = req.value("tests", json::array());
	std::string token = generate_token(16);
	std::string srcPath = "/tmp/" + token + ".py";
	write_file(srcPath, code);

	TestReturnObject ret_obj = RunTests(srcPath, token, req, Language::kPython);
	std::pair<bool, std::string> error = GetErrorMessageAndSuccess(ret_obj.ret);
	json res = { { "success", error.first },
		     { "input", ret_obj.lastInput },
		     { "expected", ret_obj.lastExpected },
		     { "output", ret_obj.lastOutput },
		     { "error", error.first ? json(nullptr) : json(error.second) } };

	send_response(conn, res.dump());
	return 200;
}
