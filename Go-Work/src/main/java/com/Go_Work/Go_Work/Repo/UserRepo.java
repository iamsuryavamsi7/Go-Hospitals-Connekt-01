package com.Go_Work.Go_Work.Repo;

import com.Go_Work.Go_Work.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String username);

    List<User> findByUnLocked(boolean unLocked);

    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String searchObject1, String searchObject2, String searchObject3);

}
