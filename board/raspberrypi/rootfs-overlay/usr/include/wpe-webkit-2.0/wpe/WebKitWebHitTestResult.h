/*
 * Copyright (C) 2014 Igalia S.L.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public License
 * along with this library; see the file COPYING.LIB.  If not, write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301, USA.
 */

#if !defined(__WEBKIT_WEB_PROCESS_EXTENSION_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit-web-process-extension.h> can be included directly."
#endif

#ifndef WebKitWebHitTestResult_h
#define WebKitWebHitTestResult_h

#include <glib-object.h>
#include <jsc/jsc.h>
#include <wpe/WebKitDefines.h>
#include <wpe/WebKitHitTestResult.h>
#include <wpe/WebKitScriptWorld.h>


G_BEGIN_DECLS

#define WEBKIT_TYPE_WEB_HIT_TEST_RESULT            (webkit_web_hit_test_result_get_type())
WEBKIT_DECLARE_FINAL_TYPE (WebKitWebHitTestResult, webkit_web_hit_test_result, WEBKIT, WEB_HIT_TEST_RESULT, GObject)


WEBKIT_API guint
webkit_web_hit_test_result_get_context          (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API gboolean
webkit_web_hit_test_result_context_is_link      (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API gboolean
webkit_web_hit_test_result_context_is_image     (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API gboolean
webkit_web_hit_test_result_context_is_media     (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API gboolean
webkit_web_hit_test_result_context_is_editable  (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API gboolean
webkit_web_hit_test_result_context_is_selection (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API const gchar *
webkit_web_hit_test_result_get_link_uri         (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API const gchar *
webkit_web_hit_test_result_get_link_title       (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API const gchar *
webkit_web_hit_test_result_get_link_label       (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API const gchar *
webkit_web_hit_test_result_get_image_uri        (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API const gchar *
webkit_web_hit_test_result_get_media_uri        (WebKitWebHitTestResult *web_hit_test_result);

WEBKIT_API gboolean
webkit_web_hit_test_result_context_is_scrollbar (WebKitWebHitTestResult *web_hit_test_result);


WEBKIT_API JSCValue *
webkit_web_hit_test_result_get_js_node          (WebKitWebHitTestResult *web_hit_test_result,
                                                 WebKitScriptWorld      *world);

G_END_DECLS

#endif
