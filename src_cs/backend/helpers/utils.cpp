#include "utils.h"
#include <fstream>
#include <random>
#include <sstream>
#include <sys/stat.h>

#include <vector>

using json = nlohmann::json;

std::string GenerateToken(int len)
{
	static const char chars[] = "abcdefghijklmnopqrstuvwxyz0123456789";
	std::random_device rd;
	std::mt19937 gen(rd());
	std::uniform_int_distribution<> dis(0, sizeof(chars) - 2);
	std::string token;
	for (int i = 0; i < len; ++i)
		token += chars[dis(gen)];
	return token;
}

bool FileExists(const std::string &path)
{
	struct stat buffer;
	return (stat(path.c_str(), &buffer) == 0);
}

std::string ReadFile(const std::string &path)
{
	std::ifstream in(path);
	if (!in.is_open())
		return "";
	std::ostringstream ss;
	ss << in.rdbuf();
	return ss.str();
}

void WriteFile(const std::string &path, const std::string &data)
{
	std::ofstream out(path);
	out << data;
	out.close();
}

std::string SanitizeFilename(const std::string &name)
{
	std::string clean;
	for (char c : name) {
		if (isalnum(c) || c == '.' || c == '_' || c == '-')
			clean += c;
	}
	if (!clean.empty())
		return clean;
	int num_of_files = std::distance(std::filesystem::directory_iterator(kSaveDir), std::filesystem::directory_iterator{});
	std::string filename = "untitled" + std::to_string(num_of_files) + ".c";
	return filename;
}

void SendResponse(struct mg_connection *conn, const std::string &out)
{
	mg_printf(conn,
		  "HTTP/1.1 200 OK\r\n"
		  "Content-Type: application/json\r\n"
		  "Access-Control-Allow-Origin: *\r\n"
		  "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
		  "Access-Control-Allow-Headers: Content-Type\r\n"
		  "Content-Length: %zu\r\n\r\n%s",
		  out.size(), out.c_str());
}

json GetJsonReq(struct mg_connection *conn)
{
	std::vector<char> buf(8192);
	int req_bytes;
	while ((buf.back() == '\0') && buf.size() <= kMaxProgramSize) {
		req_bytes = mg_read(conn, buf.data(), buf.size());
		buf.resize(std::min(buf.size() * 2, kMaxProgramSize));
	}
	std::string body(buf.data(), req_bytes);
	return json::parse(body);
}
