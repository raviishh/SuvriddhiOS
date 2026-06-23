#include "compile_handler.h"

#include <cstdlib>

using json = nlohmann::json;

int HandleCompile(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string code = req["code"];
	std::string token = GenerateToken(16);
	std::string path_root = "/tmp/" + token;
	WriteFile(path_root + ".c", code);

	std::string compileCmd = "gcc -std=c11 -O2 " + path_root + ".c -o " + path_root + " 2>"+path_root+ ".log";
	int ret = std::system(compileCmd.c_str());

	json res;
	res["token"] = (ret = 0) ?  token : nullptr;
	res["error"] = (ret = 0) ? nullptr : ReadFile(path_root + ".log");
	SendResponse(conn, res.dump());
	return 200;
}
