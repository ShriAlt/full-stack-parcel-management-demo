package com.tcs.parcelX.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

@RestController
public class HomeController {
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> home() {
        String html = """
            <!doctype html>
            <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Parcel Management System</title>
              <style>
                body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; }
                .card { max-width: 720px; margin: 0 auto; background: rgba(255,255,255,.08); padding: 28px; border-radius: 20px; }
                h1 { margin-top: 0; }
                code { background: rgba(148,163,184,.18); padding: 2px 6px; border-radius: 6px; }
                a { color: #38bdf8; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Parcel Management System API</h1>
                <p>The backend is running correctly.</p>
                <p>Open the frontend here: <a href="http://localhost:4200">http://localhost:4200</a></p>
                <p>Demo login accounts:</p>
                <ul>
                  <li><code>admin / admin123</code></li>
                  <li><code>user33 / user123</code></li>
                </ul>
              </div>
            </body>
            </html>
            """;
        return ResponseEntity.ok(html);
    }
}


