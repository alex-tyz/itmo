package parser;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class JSONParser {

    public static double[] parse(String data) {
        List<Double> values = new ArrayList<>();
        try {
            JSONObject jsonObject = new JSONObject(data);
            double x = jsonObject.getDouble("x");
            double y = jsonObject.getDouble("y");
            values.add(x);
            values.add(y);
            if (jsonObject.has("r")) {
                double r = jsonObject.getDouble("r");
                values.add(r);
            }
            return values.stream().mapToDouble(Double::doubleValue).toArray();
        } catch (Exception e) {
            System.err.println("Ошибка при парсинге JSON данных: " + e.getMessage());
            return new double[0];
        }
    }
}
