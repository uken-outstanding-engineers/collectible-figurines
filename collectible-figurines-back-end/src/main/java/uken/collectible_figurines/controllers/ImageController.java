package uken.collectible_figurines.controllers;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/images")
public class ImageController {
  @GetMapping("/{folderName}/{filename}")
  public ResponseEntity<Resource> getImage(@PathVariable String folderName, @PathVariable String filename) {
    try {
      Path filePath = Paths.get("uploads", folderName).resolve(filename).normalize();

      Resource resource = new FileSystemResource(filePath);
      if (resource.exists()) {
        String contentType = Files.probeContentType(filePath);
        return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_TYPE, contentType)
          .body(resource);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.status(500).build();
    }
  }
}
