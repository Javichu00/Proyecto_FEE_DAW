package apieventos.modelo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Base64;
import java.util.Scanner;

@Service
public class ImgBBService {

    @Value("${imgbb.api.key}")
    private String apiKey;

    public String subirImagen(MultipartFile file) throws Exception {

        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String body = "image=" + URLEncoder.encode(base64, "UTF-8");

        URL url = URI.create("https://api.imgbb.com/1/upload?key=" + apiKey).toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes("UTF-8"));
        }

        Scanner scanner = new Scanner(conn.getInputStream(), "UTF-8");
        StringBuilder respuesta = new StringBuilder();
        while (scanner.hasNextLine()) respuesta.append(scanner.nextLine());
        scanner.close();

        String json = respuesta.toString();
        int idx = json.indexOf("\"url\":\"");
        if (idx == -1) throw new Exception("ImgBB no devolvió URL");
        int start = idx + 7;
        int end = json.indexOf("\"", start);
        return json.substring(start, end).replace("\\/", "/");
    }
}