package org.example.web3.managedBeansFolder;

public interface AreaCalculatorMBean {
    /** Установить текущий R для расчёта */
    void setR(double r);
    /** Получить площадь фигуры при текущем R */
    double getArea();
}
