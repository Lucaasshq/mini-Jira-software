package com.lucas.org.gerenciador_de_tarefas.controller.admin;


import com.lucas.org.gerenciador_de_tarefas.DTO.TaskDTO;
import com.lucas.org.gerenciador_de_tarefas.service.admin.AdminService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<?>getUsers(){
       return ResponseEntity.ok(adminService.getUsers());
    }

    @PostMapping("/task")
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO){
       TaskDTO createTask = adminService.createTask(taskDTO);
       if (createTask == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
       return ResponseEntity.status(HttpStatus.CREATED).body(createTask);
    }

    @GetMapping("/task")
    public ResponseEntity<List<TaskDTO>> getAllTask(){
        return ResponseEntity.ok(adminService.getAllTask());
    }

    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        adminService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id){
        return  ResponseEntity.ok(adminService.getTaskById(id));
    }

    @PatchMapping("/task/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO){
        TaskDTO updatedTask = adminService.updateTask(id, taskDTO);
        if (updatedTask == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return  ResponseEntity.ok(updatedTask);
    }


}
