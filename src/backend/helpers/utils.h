#pragma once

#ifndef HELPERS_UTILS_H
#define HELPERS_UTILS_H

#include <string>
#include <vector>

constexpr inline size_t kMaxRequestBytes = 16 * 1024 * 1024; // 16 MiB
std::string generate_token(int len);
bool file_exists(const std::string &path);
std::string read_file(const std::string &path);
void write_file(const std::string &path, const std::string &data);
std::string sanitize_filename(const std::string &name);
void send_response(struct mg_connection *conn, const std::string &out);
int32_t read(struct mg_connection *conn, std::vector<char> &buf);

#endif // HELPERS_UTILS_H
