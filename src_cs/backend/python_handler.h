#ifndef PYTHON_HANDLER_H
#define PYTHON_HANDLER_H

#include "civetweb.h"

int handle_python(struct mg_connection *conn, void *ignored);

#endif // PYTHON_HANDLER_H
