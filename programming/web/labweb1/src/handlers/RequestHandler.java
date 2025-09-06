package handlers;

import com.fastcgi.FCGIInterface;
import org.json.JSONObject;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class RequestHandler {

    public void handleRequest() throws IOException {
        FCGIInterface.request.inStream.fill();
        int contentLength = FCGIInterface.request.inStream.available();
        byte[] requestBodyRaw = new byte[contentLength];
        FCGIInterface.request.inStream.read(requestBodyRaw);
        String requestBody = new String(requestBodyRaw, StandardCharsets.UTF_8);
        try {
            JSONObject jsonObject = new JSONObject(requestBody);
            double x = jsonObject.getDouble("x");
            double y = jsonObject.getDouble("y");
            int r = jsonObject.getInt("r");
            validateX(x);
            validateY(y);
            validateR(r);
        } catch (Exception e) {}
    }
    private void validateX(double x) {
        if (x < -5 || x > 5) {
            throw new IllegalArgumentException("X вне допустимого диапазона (-5; 5)");
        }
    }
    private void validateY(double y) {
        if (y < -3 || y > 3) {
            throw new IllegalArgumentException("Y вне допустимого диапазона (-3; 3)");
        }
    }
    private void validateR(int r) {
        if (r < 1 || r > 5) {
            throw new IllegalArgumentException("R вне допустимого диапазона (1; 5)");
        }
    }
}
