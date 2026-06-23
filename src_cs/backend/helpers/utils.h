#ifndef UTILS_H
#define UTILS_H

#include <string>
#include "json.hpp"

using json = nlohmann::json;

std::string generate_token(int len);
bool file_exists(const std::string &path);
std::string read_file(const std::string &path);
void write_file(const std::string &path, const std::string &data);
std::string sanitize_filename(const std::string &name);
void send_response(struct mg_connection *conn, const std::string &out);
json GetJsonReq(struct mg_connection *conn);

#endif // UTILS_H
