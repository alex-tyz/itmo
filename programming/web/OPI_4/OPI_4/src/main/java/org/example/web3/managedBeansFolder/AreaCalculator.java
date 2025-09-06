package org.example.web3.managedBeansFolder;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

import java.io.Serializable;

@Named("areaCalculator")
@ApplicationScoped
public class AreaCalculator implements AreaCalculatorMBean, Serializable {
    private volatile double r;

    @Override
    public void setR(double r) {
        this.r = r;
    }

    @Override
    public double getArea() {
        // Считаем сумму площадей:
        //  • ¼ круга: π·r²/4
        //  • треугольник: r²/8
        //  • прямоугольник: r²/2
        return r*r * (Math.PI/4 + 1.0/8 + 1.0/2);
    }
}
