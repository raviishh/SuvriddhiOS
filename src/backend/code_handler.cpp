#include "libs/civetweb/include/civetweb.h"
#include <fstream>
#include <string>
#include <filesystem>
#include <vector>
#include "helpers/utils.h"
#include "libs/json.hpp"
#include "constants.h"
#include "code_handler.h"

int CodeHandler::HandleSave(struct mg_connection *conn, void *)
{
	std::vector<char> buf(8192);
	int32_t bytes_read = read(conn, buf);

	if (bytes_read < 0) {
		send_response(conn, error_res.dump());
		return 400;
	}

	std::string body(buf.data(), bytes_read);
	json req = json::parse(body);
	std::string filename = req.value("filename", "");
	std::string code = req.value("code", "");
	std::string safe_name = sanitize_filename(filename);
	write_file(kSaveDir + "/" + safe_name + ".c", code);

	json res = { { "filename", safe_name } };
	send_response(conn, res.dump());
	return 200;
}

int CodeHandler::HandleLoad(struct mg_connection *conn, void *)
{
	std::vector<char> buf(8192);
	int32_t bytes_read = read(conn, buf);

	if (bytes_read < 0) {
		send_response(conn, error_res.dump());
		return 400;
	}

	std::string body(buf.data(), bytes_read);
	json req = json::parse(body);
	std::string filename = req.value("filename", "");
	std::string safe_name = sanitize_filename(filename);
	std::ifstream file(std::string(kSaveDir) + "/" + safe_name + ".c");
	std::string code((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
	file.close();

	json res = { { "code", code } };
	send_response(conn, res.dump());
	return 200;
}

int CodeHandler::HandleList(struct mg_connection *conn, void *)
{
	json res;
	res["files"] = json::array();

	for (auto &p : std::filesystem::directory_iterator(kSaveDir)) {
		res["files"].push_back(p.path().stem().string());
	}

	std::string out = res.dump();
	send_response(conn, out);
	return 200;
}
