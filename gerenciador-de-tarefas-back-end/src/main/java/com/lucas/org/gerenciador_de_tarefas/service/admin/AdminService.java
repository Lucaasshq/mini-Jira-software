package com.lucas.org.gerenciador_de_tarefas.service.admin;

import com.lucas.org.gerenciador_de_tarefas.DTO.TaskDTO;
import com.lucas.org.gerenciador_de_tarefas.DTO.UserDto;

import java.util.List;

public interface AdminService {

    List<UserDto> getUsers();

    TaskDTO createTask(TaskDTO taskDTO);

    List<TaskDTO> getAllTask();

    void deleteTask(Long id);

    TaskDTO getTaskById(Long id);

    TaskDTO updateTask(Long id,TaskDTO taskDTO);
 }
