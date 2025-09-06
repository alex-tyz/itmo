package org.example.web3.managedBeansFolder;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

import javax.management.*;
import java.io.Serializable;
import java.util.concurrent.atomic.AtomicInteger;

@Named("pointStats")
@ApplicationScoped
public class PointStats implements PointStatsMBean, NotificationBroadcaster, Serializable {
    private final AtomicInteger totalPoints = new AtomicInteger();
    private final AtomicInteger totalHits   = new AtomicInteger();
    private final NotificationBroadcasterSupport broadcaster = new NotificationBroadcasterSupport();

    @Override
    public int getTotalPoints() {
        return totalPoints.get();
    }

    @Override
    public int getTotalHits() {
        return totalHits.get();
    }

    /**
     * Вызывать из PointCheckerBean после каждой проверки:
     *   statsMBean.record(isInside);
     */
    public void record(boolean hit) {
        int total = totalPoints.incrementAndGet();
        if (hit) {
            totalHits.incrementAndGet();
        }
        // если общее число точек кратно 10 — шлём уведомление
        if (total % 10 == 0) {
            Notification notif = new Notification(
                    "points.multiple10",    // тип уведомления
                    this,                   // источник
                    System.currentTimeMillis(),
                    "Установлено точек: " + total
            );
            broadcaster.sendNotification(notif);
        }
    }

    // ————— NotificationBroadcaster —————

    @Override
    public void addNotificationListener(NotificationListener listener,
                                        NotificationFilter filter,
                                        Object handback) throws IllegalArgumentException {
        broadcaster.addNotificationListener(listener, filter, handback);
    }

    @Override
    public void removeNotificationListener(NotificationListener listener) throws ListenerNotFoundException {
        broadcaster.removeNotificationListener(listener);
    }

    @Override
    public MBeanNotificationInfo[] getNotificationInfo() {
        String[] types = new String[]{ "points.multiple10" };
        return new MBeanNotificationInfo[]{
                new MBeanNotificationInfo(
                        types,
                        Notification.class.getName(),
                        "Уведомление при каждом 10-м установленном пользователем счётчике точек"
                )
        };
    }
}
