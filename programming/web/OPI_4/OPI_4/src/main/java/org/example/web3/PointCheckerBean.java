package org.example.web3;

import jakarta.enterprise.context.Destroyed;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.context.SessionScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import org.example.web3.baze.Test;
import org.example.web3.managedBeansFolder.AttemptStats;
import org.example.web3.managedBeansFolder.HitRatio;
import org.example.web3.managedBeansFolder.PointStats;
import org.example.web3.MBeanRegistry;
import org.primefaces.PrimeFaces;

import java.io.Serializable;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Named("bean")
@SessionScoped
public class PointCheckerBean implements Serializable {

    private double x;
    private double y;
    private double r = 1.0;
    private String result;
    private List<PointResult> results = new ArrayList<>();

    // Геттеры и сеттеры для x, y, r и result
    public double getX() {
        return Math.round(x * 100.0) / 100.0;
    }

    public void setX(double x) {
        this.x = Math.round(x * 100.0) / 100.0;
    }

    public double getY() {
        return Math.round(y * 100.0) / 100.0;
    }

    public void setY(double y) {
        this.y = Math.round(y * 100.0) / 100.0;
    }

    public double getR() {
        return Math.round(r * 100.0) / 100.0;
    }

    public void setR(double r) {
        this.r = Math.round(r * 100.0) / 100.0;
    }

    public String getResult() {
        return result;
    }

    public List<PointResult> getResults() {
        return results;
    }

    // Инъекции MBean-ов
    @Inject
    private AttemptStats statsMBean;

    @Inject
    private HitRatio hitRatioMBean;

    @Inject
    private PointStats pointStatsMBean;

    // Регистрация MBean-ов при старте сессии
    public void init(@Observes @Initialized(SessionScoped.class) Object unused) {
        MBeanRegistry.registerBean(statsMBean,     "attemptStats");
        MBeanRegistry.registerBean(hitRatioMBean,   "hitRatio");
        MBeanRegistry.registerBean(pointStatsMBean, "pointStats");
    }

    // Снятие регистрации при завершении сессии
    public void destroy(@Observes @Destroyed(SessionScoped.class) Object unused) {
        MBeanRegistry.unregisterBean(statsMBean,     "attemptStats");
        MBeanRegistry.unregisterBean(hitRatioMBean,   "hitRatio");
        MBeanRegistry.unregisterBean(pointStatsMBean, "pointStats");
    }

    // Основной метод проверки точки
    public void checkPoint() {
        boolean inside = isPointInside();

        // 1) Обновляем общее число попыток и попаданий
        statsMBean.updateAttempt(inside);
        hitRatioMBean.updateStats(inside);

        // 2) Считаем в PointStats и отправляем уведомление на каждый 10-й
        pointStatsMBean.record(inside);

        // 3) Подготовка результата для UI и базы данных
        result = inside ? "YES" : "NO";
        PrimeFaces.current()
                .executeScript("updatePointColors(" + x + "," + y + "," + r + ", '" + result + "')");

        results.add(new PointResult(x, y, r, result));
        addData();
    }

    private boolean isPointInside() {
        return (x <= 0 && y <= 0 && x * x + y * y <= r * r) ||
                (x >= 0 && y >= 0 && y <= -x + r / 2)  ||
                (x >= 0 && y <= 0 && y >= -r     && x <= r / 2);
    }

    private void addData() {
        try {
            Test.test();
            Test.statmt.execute(
                    "INSERT INTO point_results(x, y, r, result) VALUES ('"
                            + x + "', '" + y + "', '" + r + "', '" + result + "');"
            );
            PrimeFaces.current().executeScript("message('Данные успешно добавлены.')");
        } catch (SQLException e) {
            PrimeFaces.current()
                    .executeScript("message('Ошибка при добавлении данных: " + e.getMessage() + "')");
        }
    }
}
