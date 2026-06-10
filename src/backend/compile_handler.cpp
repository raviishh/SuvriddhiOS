#include "compile_handler.h"
#include "helpers/utils.h"
#include "libs/json.hpp"
#include <fstream>
#include <iostream>
#include <cstdlib>
#include "constants.h"

int HandleCPPCompile(struct mg_connection *conn, void *)
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
	std::string token = generate_token(16);
	std::string srcPath = "/tmp/" + token + ".c";
	std::string outPath = "/tmp/" + token;
	write_file(srcPath, code);

	std::string compileCmd = "gcc -std=c11 -O2 " + srcPath + " -o " + outPath + " 2>/tmp/" + token + ".log";
	int ret = std::system(compileCmd.c_str());

	json res;
	res["token"] = (ret == 0) ? json(token) : json(nullptr);

	res["error"] = (ret == 0) ? json(nullptr) : json(read_file("/tmp/" + token + ".log"));
	send_response(conn, res.dump());
	return 200;
}
