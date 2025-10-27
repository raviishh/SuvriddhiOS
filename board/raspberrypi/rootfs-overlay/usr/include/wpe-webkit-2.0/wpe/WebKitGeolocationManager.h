/*
 * Copyright (C) 2019 Igalia S.L.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
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

#if !defined(__WEBKIT_H_INSIDE__) && !defined(BUILDING_WEBKIT)
#error "Only <wpe/webkit.h> can be included directly."
#endif

#ifndef WebKitGeolocationManager_h
#define WebKitGeolocationManager_h

#include <glib-object.h>
#include <wpe/WebKitDefines.h>

G_BEGIN_DECLS

#define WEBKIT_TYPE_GEOLOCATION_MANAGER            (webkit_geolocation_manager_get_type())

WEBKIT_DECLARE_FINAL_TYPE (WebKitGeolocationManager, webkit_geolocation_manager, WEBKIT, GEOLOCATION_MANAGER, GObject)

#define WEBKIT_TYPE_GEOLOCATION_POSITION           (webkit_geolocation_position_get_type())

typedef struct _WebKitGeolocationPosition WebKitGeolocationPosition;

WEBKIT_API void
webkit_geolocation_manager_update_position           (WebKitGeolocationManager  *manager,
                                                     WebKitGeolocationPosition *position);

WEBKIT_API void
webkit_geolocation_manager_failed                    (WebKitGeolocationManager  *manager,
                                                     const char                *error_message);

WEBKIT_API gboolean
webkit_geolocation_manager_get_enable_high_accuracy (WebKitGeolocationManager  *manager);


WEBKIT_API GType
webkit_geolocation_position_get_type                (void);

WEBKIT_API WebKitGeolocationPosition *
webkit_geolocation_position_new                     (double                     latitude,
                                                     double                     longitude,
                                                     double                     accuracy);

WEBKIT_API WebKitGeolocationPosition *
webkit_geolocation_position_copy                    (WebKitGeolocationPosition *position);

WEBKIT_API void
webkit_geolocation_position_free                    (WebKitGeolocationPosition *position);

WEBKIT_API void
webkit_geolocation_position_set_timestamp           (WebKitGeolocationPosition *position,
                                                     guint64                    timestamp);

WEBKIT_API void
webkit_geolocation_position_set_altitude            (WebKitGeolocationPosition *position,
                                                     double                     altitude);

WEBKIT_API void
webkit_geolocation_position_set_altitude_accuracy   (WebKitGeolocationPosition *position,
                                                     double                     altitude_accuracy);

WEBKIT_API void
webkit_geolocation_position_set_heading             (WebKitGeolocationPosition *position,
                                                     double                     heading);

WEBKIT_API void
webkit_geolocation_position_set_speed               (WebKitGeolocationPosition *position,
                                                     double                     speed);

G_END_DECLS

#endif /* WebKitGeolocationManager_h */
