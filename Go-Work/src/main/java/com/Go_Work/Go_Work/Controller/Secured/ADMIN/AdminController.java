package com.Go_Work.Go_Work.Controller.Secured.ADMIN;

import com.Go_Work.Go_Work.Entity.Department;
import com.Go_Work.Go_Work.Entity.Doctor;
import com.Go_Work.Go_Work.Entity.Enum.Role;
import com.Go_Work.Go_Work.Entity.MobileNumbers;
import com.Go_Work.Go_Work.Error.DepartmentNotFoundException;
import com.Go_Work.Go_Work.Error.DoctorNotFoundException;
import com.Go_Work.Go_Work.Error.MobileNumberNotFoundException;
import com.Go_Work.Go_Work.Model.Secured.ADMIN.*;
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

    @GetMapping("/fetchNumbers")
    public ResponseEntity<List<MobileNumbers>> fetchNumbers(){

        List<MobileNumbers> fetchedMobileNumbers = adminService.fetchNumbers();

        return ResponseEntity.ok(fetchedMobileNumbers);

    }

    @PostMapping("/addMobileNumber")
    public ResponseEntity<Boolean> addMobileNumber(
            @RequestParam("name") String name,
            @RequestParam("mobileNumber") String mobileNumber
    ){

        Boolean fetchedBooleanValue = adminService.addMobileNumber(name, mobileNumber);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @DeleteMapping("/deleteMobileNumberById/{mobileNumberID}")
    public ResponseEntity<Boolean> deleteMobileNumberById(
            @PathVariable("mobileNumberID") Long mobileNumberID
    ){

        Boolean fetchedBooleanValue = adminService.deleteMobileNumberById(mobileNumberID);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @PutMapping("/editMobileNumberById/{mobileNumberID}")
    public ResponseEntity<Boolean> editMobileNumberById(
            @PathVariable("mobileNumberID") Long mobileNumberID,
            @RequestParam("name") String name,
            @RequestParam("mobileNumber") String mobileNumber
    ) throws MobileNumberNotFoundException {

        Boolean fetchedBooleanValue = adminService.editMobileNumberById(mobileNumberID,  name, mobileNumber);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @GetMapping("/fetchMobileNumberById/{mobileNumberID}")
    public ResponseEntity<MobileNumbers> fetchMobileNumberById(
            @PathVariable("mobileNumberID") Long mobileNumberID
    ) throws MobileNumberNotFoundException {

        MobileNumbers fetchedMobileNumberData = adminService.fetchMobileNumberById(mobileNumberID);

        return ResponseEntity.ok(fetchedMobileNumberData);

    }

    @GetMapping("/fetchUsersData")
    public ResponseEntity<List<UsersDataAdminModel>> fetchUsersData(){

        List<UsersDataAdminModel> fetchedUsersData = adminService.fetchUsersData();

        return ResponseEntity.ok(fetchedUsersData);

    }

    @DeleteMapping("/deleteUserByIdPermanent/{userId}")
    public ResponseEntity<Boolean> deleteUserByIdPermanent(
            @PathVariable("userId") Long userId
    ){

        Boolean fetchedBooleanValue = adminService.deleteUserByIdPermanent(userId);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @PostMapping("/addUserName")
    public ResponseEntity<Boolean> addUserName(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("role") Role role
            ) throws MobileNumberNotFoundException {

        Boolean fetchedBooleanValue = adminService.addUserName(username, password, role);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @GetMapping("/fetchUserDataById/{userId}")
    public ResponseEntity<UsersDataAdminModel> fetchUserDataById(
            @PathVariable("userId") Long userId
    ){

        UsersDataAdminModel fetchedUsersData = adminService.fetchUserDataById(userId);

        return ResponseEntity.ok(fetchedUsersData);

    }

    @PutMapping("/editUserDataById/{userId}")
    public ResponseEntity<Boolean> editUserDataById(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "role", required = false) Role role
    ) throws MobileNumberNotFoundException {

        Boolean fetchedBooleanValue = adminService.editUserDataById(userId,  username, password, role);

        return ResponseEntity.ok(fetchedBooleanValue);

    }

    @GetMapping("/fetchMainAnalytics")
    public ResponseEntity<MainAnalyticsAdminModel> fetchMainAnalytics(){

        MainAnalyticsAdminModel fetchedAnalyticsData = adminService.fetchMainAnalytics();

        return ResponseEntity.ok(fetchedAnalyticsData);

    }

}
