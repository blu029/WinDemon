package com.windemon.care;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class StreakWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, widgetId);
        }
    }

    static void updateWidget(Context context, AppWidgetManager manager, int widgetId) {
        SharedPreferences prefs = context.getSharedPreferences("WinDemonWidget", Context.MODE_PRIVATE);
        int current = prefs.getInt("streak_current", 0);
        String lastDate = prefs.getString("streak_lastDate", "--");

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.streak_widget);
        views.setTextViewText(R.id.widget_streak_number, String.valueOf(current));
        views.setTextViewText(R.id.widget_streak_label, "Day Streak");
        views.setTextViewText(R.id.widget_last_active, "Last: " + lastDate);

        // Tap opens the app
        Intent launchIntent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);

        manager.updateAppWidget(widgetId, views);
    }

    @Override
    public void onEnabled(Context context) {}

    @Override
    public void onDisabled(Context context) {}
}
