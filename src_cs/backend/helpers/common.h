#ifndef HELPERS_COMMON_H_
#define HELPERS_COMMON_H_

// Also hold some common imports
#include "../libs/json.hpp"
#include "civetweb.h"
#include <string>
#include "utils.h"

constexpr char kSaveDir[] = "/root/codes";
constexpr size_t kMaxProgramSize = 1024 * 1024; // 1 MiB

#endif // HELPERS_COMMON_H_