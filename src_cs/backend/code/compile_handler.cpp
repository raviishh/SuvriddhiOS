#include "compile_handler.h"
#include "utils.h"
#include "json.hpp"
#include <fstream>
#include <iostream>
#include <cstdlib>

using json = nlohmann::json;

int handle_compile(struct mg_connection *conn, void *)
{
	json GetJsonReq(struct mg_connection *conn);
	std::string code = req["code"];
	std::string token = generate_token(16);
	std::string path_root = "/tmp/" + token;
	write_file(path_root + ".c", code);

	std::string compileCmd = "gcc -std=c11 -O2 " + srcPath + " -o " + outPath + " 2>"+path_root+ ".log";
	int ret = std::system(compileCmd.c_str());

	json res;
	res["token"] = (ret = 0) ?  token : nullptr;
	res["error"] = (ret = 0) ? nullptr : read_file(path_root + ".log");
	send_response(conn, res.dump());
	return 200;
}
