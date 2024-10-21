package com.Go_Work.Go_Work.Controller.Secured.ADMIN;

import com.Go_Work.Go_Work.Entity.Department;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Error.DoctorNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.AddDoctorModel;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.DepartmentPutModel;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.GetDoctorModel;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.UpdateDoctorModel;
import com.Go_Work.Go_Work.Model.Secured.User.UserObject;
import com.Go_Work.Go_Work.Service.Secured.ADMIN.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/fetchLockedUsers")
    public ResponseEntity<List<UserObject>> fetchUnlockedUsers(){

        List<UserObject> fetchedUserObjects = adminService.fetchLockedUsers();

        return ResponseEntity.ok(fetchedUserObjects);

    }

    @GetMapping("/acceptUserRequest/{userId}")
    public ResponseEntity<String> acceptUserById(
            @PathVariable("userId") Long userId
    ){

        String acceptedMessage = adminService.acceptUserById(userId);

        return ResponseEntity.ok(acceptedMessage);

    }

    @GetMapping("/deleteUserRequest/{userId}")
    public ResponseEntity<String> deleteUserById(
            @PathVariable("userId") Long userId
    ){

        String deletedMessage = adminService.deleteUserById(userId);

        return ResponseEntity.ok(deletedMessage);

    }

    // Doctor Control
    @GetMapping("/getDoctors")
    public ResponseEntity<List<GetDoctorModel>> getDoctors(){

        List<GetDoctorModel> fetchedDepartments = adminService.getDoctors();

        return ResponseEntity.ok(fetchedDepartments);

    }

    @PostMapping("/addDoctor")
    public ResponseEntity<String> addDoctor(
            @Valid @RequestBody AddDoctorModel doctor
    ){

        String doctorAdded = adminService.addDoctor(doctor);

        return ResponseEntity.ok(doctorAdded);

    }

    @DeleteMapping("/deleteDoctor/{doctorId}")
    public ResponseEntity<String> deleteDoctor(
            @PathVariable("doctorId") Long doctorId
    ){

        String doctorAdded = adminService.deleteDoctor(doctorId);

        return ResponseEntity.ok(doctorAdded);

    }

    @GetMapping("/getDoctor/{doctorId}")
    public ResponseEntity<Doctor> getDoctorById(
            @PathVariable("doctorId") Long doctorId
    ) throws DoctorNotFoundException {

        Doctor fetchedDoctor = adminService.getDoctorById(doctorId);

        return ResponseEntity.ok(fetchedDoctor);

    }

    @PutMapping("/updateDoctor/{doctorId}/updateDepartment/{departmentId}")
    public ResponseEntity<String> updateDoctorById(
            @PathVariable("doctorId") Long doctorId,
            @PathVariable("departmentId") Long departmentId,
            @Valid @RequestBody UpdateDoctorModel updateDoctorModel
    ) throws DoctorNotFoundException, DepartmentNotFoundException {

        String message = adminService.updateDoctorById(doctorId, departmentId, updateDoctorModel);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/getDepartments")
    public ResponseEntity<List<Department>> getDepartments(){

        List<Department> fetchedDepartments = adminService.getDepartments();

        return ResponseEntity.ok(fetchedDepartments);

    }

    @PostMapping("/addDepartment")
    public ResponseEntity<String> addDepartment(
            @RequestParam("departmentName") String departmentName
    ){

        String message = adminService.addDepartment(departmentName);

        return ResponseEntity.ok(message);

    }

    @DeleteMapping("/deleteDepartmentById/{departmentId}")
    public ResponseEntity<String> deleteDepartmentById(
            @PathVariable("departmentId") Long departmentId
    ){

        String message = adminService.deleteDepartmentById(departmentId);

        return ResponseEntity.ok(message);

    }

    @GetMapping("/fetchDepartmentDataById/{departmentId}")
    public ResponseEntity<Department> fetchDepartmentDataById(
            @PathVariable("departmentId") Long departmentId
    ) throws DepartmentNotFoundException {

        Department message = adminService.fetchDepartmentDataById(departmentId);

        return ResponseEntity.ok(message);

    }

    @PutMapping("/editDepartmentById/{departmentId}")
    public ResponseEntity<String> editDepartmentById(
            @PathVariable("departmentId") Long departmentId,
            @Valid @RequestBody DepartmentPutModel request
    ) throws DepartmentNotFoundException {

        String message = adminService.editDepartmentById(departmentId, request);

        return ResponseEntity.ok(message);

    }

}
