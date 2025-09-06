package org.example.services;

import org.example.entities.Point;
import org.example.entities.User;
import org.example.repositories.PointRepository;
import org.example.repositories.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;


@ApplicationScoped
public class PointService {

    @Inject
    private PointRepository pointRepository;

    @Inject
    private UserRepository userRepository;

    public Point checkAndSavePoint(Point point, String username) {
        boolean hit = checkHit(point.getX(), point.getY(), point.getR());
        point.setHit(hit);
        point.setTime(System.currentTimeMillis());

        // Получаем пользователя по имени
        User user = userRepository.findByUsername(username);
        point.setUser(user);
        // Сохраняем точку в базе данных
        pointRepository.createPoint(point);
        return point;
    }

    private boolean checkHit(double x, double y, double r) {
        // Логика для области, состоящей из четверти окружности (3-я четверть),
        // треугольника (2-я четверть) и прямоугольника (1-я четверть)

        if (x > 0 && y > 0) { // 1-я четверть - прямоугольник
            return x <= r && y <= r;
        } else if (x < 0 && y > 0) { // 1-я четверть - треугольник
            return y <= (x + r/2);
        } else if (x <= 0 && y <= 0) { // 3-я четверть - сектор
            return ((x*x + y*y) <= (r/2)*(r/2));
        }
        return false; // В остальных случаях - не попадает
    }

    public List<Point> getPointsByUser(String username) {
        // Получаем пользователя по имени
        User user = userRepository.findByUsername(username);
        return pointRepository.findPointsByUser(user);
    }
}
