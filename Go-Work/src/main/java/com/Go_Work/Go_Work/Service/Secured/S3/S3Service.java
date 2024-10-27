package com.Go_Work.Go_Work.Service.Secured.S3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${cloud.aws.bucket-name}")
    private String bucketName;

    private final S3Client s3;

    public String uploadFile(MultipartFile file) throws IOException {

        String originalFileName = file.getOriginalFilename();

        if ( originalFileName != null ){

            originalFileName = originalFileName.replace(" ", "_");

        }

        String fileName = System.currentTimeMillis() + "_" + originalFileName;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return "File Upload Successfully" + fileName;

    }

    public byte[] downloadFile(String fileName) {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        // Get the object from S3
        try (ResponseInputStream<GetObjectResponse> objectInputStream = s3.getObject(objectRequest);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024]; // Buffer for reading the stream
            int bytesRead;

            // Read the input stream and write to output stream
            while ((bytesRead = objectInputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            // Convert output stream to byte array
            return outputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            return null; // Handle the exception as needed
        }
    }

    public String uploadProfilePic(
            MultipartFile file,
            Long userId
    ) throws IOException {

        String originalFileName = file.getOriginalFilename();

        if ( originalFileName != null ){

            originalFileName = originalFileName.replace(" ", "_");

        }

        String fileName = System.currentTimeMillis() + "_" + originalFileName;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3.putObject(objectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return "Uploaded";

    }

    private void deleteS3Object(String fileName){

        DeleteObjectRequest objectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        DeleteObjectResponse objectResponse = s3.deleteObject(objectRequest);

    }

}
