package validation;

import java.util.logging.Level;
import java.util.logging.Logger;

public class FigureChecker {
    Logger logger = Logger.getLogger(this.getClass().getName());

    public boolean checkSpot(double[] data) {
        logger.setLevel(Level.INFO);
        return checkAxis(data[0], data[1], data[2]);
    }

    private boolean checkAxis(double x, double y, double r) {
        if (x  >= 0 && y  >= 0) {
            boolean result = checkRectangle(x, y, r);
            return result;
        } else if (x  >= 0 && y  <= 0) {
            boolean result = checkTriangle(x, y, r);
            return result;
        } else if (x  <= 0 && y <= 0) {
            boolean result = checkCircle(x, y, r);
            return result;
        } else
            return false;
    }


    private boolean checkTriangle(double x, double y, double r) {
        boolean result = x >= 0 && y <= 0 && x <= 0.5 * y + r;
        return result;
    }

    private boolean checkRectangle(double x, double y, double r) {
        boolean result = x >= 0 && x <= r / 2 && y >= 0 && y <= r;
        return result;
    }

    private boolean checkCircle(double x, double y, double r) {
        return Math.sqrt(x * x + y * y) <= 0.5 * r;
    }
}
