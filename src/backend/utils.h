#pragma once
#include <string>

std::string generate_token(int len);
bool file_exists(const std::string &path);
std::string read_file(const std::string &path);
void write_file(const std::string &path, const std::string &data);
std::string sanitize_filename(const std::string &name);
void send_response(struct mg_connection *conn, const std::string &out);