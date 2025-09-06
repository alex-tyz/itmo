package handlers;

import com.fastcgi.FCGIInterface;
import parser.JSONParser;
import validation.FigureChecker;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ResponseHandler {

    Logger logger = Logger.getLogger(this.getClass().getName());
    private final RequestHandler requestHandler;
    private final FigureChecker figureChecker;
    long startTime;

    public ResponseHandler(RequestHandler requestHandler, FigureChecker figureChecker, long time) {
        this.requestHandler = requestHandler;
        this.figureChecker = figureChecker;
        this.startTime = time;
    }

    public void sendResponse() {
        try {
            var fcgiInterface = new FCGIInterface();
            logger.info("Waiting for requests...");
            while (fcgiInterface.FCGIaccept() >= 0) {
                var data = requestHandler.handleRequest();
                var values = JSONParser.parse(data);
                if (values == null || values.length < 3) {
                    logger.log(Level.SEVERE, "Wrong JSON format or missing R value");
                    continue;
                }
                double x = values[0];
                double y = values[1];
                double r = values[2];
                logger.info("Request received! X: %s, Y: %s, R: %s".formatted(x, y, r));
                var status = figureChecker.checkSpot(new double[]{x, y, r});
                long currentTime = System.currentTimeMillis();
                double elapsedTime = (double) (currentTime - startTime) / 1000;
                String content = """
                        {
                        "status": %s,
                        "time": %s
                        }
                        """.formatted(status, String.format(Locale.US, "%.4f", elapsedTime));

                var httpResponse = """
                        HTTP/1.1 200 OK
                        Content-Type: application/json
                        Content-Length: %d

                        %s
                        """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);

                System.out.print(httpResponse);
                System.out.flush();

                logger.info("Response sent for R: %s".formatted(r));
            }
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error: %s".formatted(e.getMessage()));
        }
    }
}

