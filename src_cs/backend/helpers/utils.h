#ifndef UTILS_H
#define UTILS_H

#include "common.h"

using json = nlohmann::json;

std::string GenerateToken(int len);
bool FileExists(const std::string &path);
std::string ReadFile(const std::string &path);
void WriteFile(const std::string &path, const std::string &data);
std::string SanitizeFilename(const std::string &name);
void SendResponse(struct mg_connection *conn, const std::string &out);
json GetJsonReq(struct mg_connection *conn);

#endif // UTILS_H
